/**
 * Hook for detecting offline status and managing offline actions.
 * Provides real-time online/offline state and queue management.
 * @module useOffline
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for offline detection and action queuing.
 * @returns {Object} Offline utilities and state
 */
export function useOffline() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [queuedActions, setQueuedActions] = useState(0)

    // Update online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Check for queued actions
        const updateQueueCount = () => {
            if (window.mynoOfflineDB) {
                const transaction = window.mynoOfflineDB.transaction(['actions'], 'readonly')
                const store = transaction.objectStore('actions')
                const countRequest = store.count()

                countRequest.onsuccess = () => {
                    setQueuedActions(countRequest.result)
                }
            }
        }

        // Initial queue count
        updateQueueCount()

        // Poll for queue updates (every 10 seconds when offline)
        const interval = setInterval(() => {
            if (!navigator.onLine) {
                updateQueueCount()
            }
        }, 10000)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            clearInterval(interval)
        }
    }, [])

    /**
     * Queue an action for offline processing.
     * @param {string} type - Action type (store_mistake, save_word, update_streak)
     * @param {Object} data - Action data
     * @returns {Promise<boolean>} Success status
     */
    const queueAction = useCallback(async (type, data) => {
        if (!window.queueOfflineAction) {
            console.error('Offline queue not initialized')
            return false
        }

        try {
            window.queueOfflineAction({
                type,
                ...data,
                timestamp: new Date().toISOString()
            })

            // Update queue count
            setQueuedActions(prev => prev + 1)
            return true
        } catch (error) {
            console.error('Failed to queue action:', error)
            return false
        }
    }, [])

    /**
     * Check if specific feature is available offline.
     * @param {string} feature - Feature name
     * @returns {boolean} Availability
     */
    const isFeatureAvailableOffline = useCallback((feature) => {
        const offlineFeatures = {
            'vocabulary_review': true,
            'saved_words': true,
            'mistake_history': true,
            'streak_tracking': true,
            'ai_chat': false,
            'pronunciation_drill': true,
            'lesson_content': true
        }

        return offlineFeatures[feature] || false
    }, [])

    /**
     * Get offline storage statistics.
     * @returns {Promise<{totalActions: number, lastSync: string, storageUsed: string}>}
     */
    const getOfflineStats = useCallback(async () => {
        if (!window.mynoOfflineDB) {
            return {
                totalActions: 0,
                lastSync: 'Never',
                storageUsed: '0 KB'
            }
        }

        return new Promise((resolve) => {
            const transaction = window.mynoOfflineDB.transaction(['actions'], 'readonly')
            const store = transaction.objectStore('actions')
            const countRequest = store.count()
            const getAllRequest = store.getAll()

            countRequest.onsuccess = () => {
                getAllRequest.onsuccess = () => {
                    const actions = getAllRequest.result
                    const lastAction = actions.length > 0
                        ? new Date(actions[actions.length - 1].timestamp).toLocaleString()
                        : 'Never'

                    // Estimate storage (rough approximation)
                    const storageBytes = JSON.stringify(actions).length
                    const storageUsed = storageBytes < 1024
                        ? `${storageBytes} B`
                        : storageBytes < 1024 * 1024
                            ? `${(storageBytes / 1024).toFixed(1)} KB`
                            : `${(storageBytes / (1024 * 1024)).toFixed(2)} MB`

                    resolve({
                        totalActions: countRequest.result,
                        lastSync: lastAction,
                        storageUsed
                    })
                }
            }

            countRequest.onerror = () => {
                resolve({
                    totalActions: 0,
                    lastSync: 'Unknown',
                    storageUsed: '0 KB'
                })
            }
        })
    }, [])

    /**
     * Manually trigger sync of queued actions.
     * @returns {Promise<{success: boolean, synced: number, failed: number}>}
     */
    const triggerSync = useCallback(async () => {
        if (!navigator.onLine) {
            return {
                success: false,
                synced: 0,
                failed: 0,
                error: 'Device is offline'
            }
        }

        if (!window.mynoOfflineDB) {
            return {
                success: false,
                synced: 0,
                failed: 0,
                error: 'Offline queue not initialized'
            }
        }

        return new Promise((resolve) => {
            const transaction = window.mynoOfflineDB.transaction(['actions'], 'readwrite')
            const store = transaction.objectStore('actions')
            const request = store.getAll()

            request.onsuccess = async () => {
                const actions = request.result
                let synced = 0
                let failed = 0

                for (const action of actions) {
                    try {
                        // Import required modules dynamically
                        switch (action.type) {
                            case 'store_mistake':
                                const { storeMistake } = await import('@/lib/memoryManager')
                                await storeMistake(
                                    action.userId,
                                    action.mistake,
                                    action.correction,
                                    action.explanation,
                                    action.language
                                )
                                break
                            case 'save_word':
                                const { addDoc, collection } = await import('firebase/firestore')
                                const { db } = await import('@/lib/firebase')
                                await addDoc(collection(db, 'savedWords'), action.data)
                                break
                            case 'update_streak':
                                const { updateDailyStreak } = await import('@/lib/streakManager')
                                await updateDailyStreak(action.db, action.userId)
                                break
                            default:
                                console.warn('Unknown action type during sync:', action.type)
                        }

                        store.delete(action.id)
                        synced++
                    } catch (error) {
                        console.error('Failed to sync action:', error)
                        failed++

                        // Increment retry count
                        action.retries = (action.retries || 0) + 1
                        if (action.retries < 3) {
                            store.put(action)
                        } else {
                            console.warn('Action failed after 3 retries, removing:', action.type)
                            store.delete(action.id)
                        }
                    }
                }

                setQueuedActions(actions.length - synced)

                resolve({
                    success: synced > 0 || failed === 0,
                    synced,
                    failed,
                    total: actions.length
                })
            }

            request.onerror = () => {
                resolve({
                    success: false,
                    synced: 0,
                    failed: 0,
                    error: 'Failed to read actions from queue'
                })
            }
        })
    }, [])

    return {
        isOnline,
        isOffline: !isOnline,
        queuedActions,
        queueAction,
        isFeatureAvailableOffline,
        getOfflineStats,
        triggerSync
    }
}

/**
 * Higher-order component to provide offline capabilities.
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with offline props
 */
export function withOffline(Component) {
    return function WrappedComponent(props) {
        const offline = useOffline()
        return <Component {...props} offline={offline} />
    }
}