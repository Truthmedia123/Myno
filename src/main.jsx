import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('New service worker found:', newWorker)
        })
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

// Offline detection and sync queue
const setupOfflineSync = () => {
  const isOnline = () => navigator.onLine

  // Create offline action queue in IndexedDB
  const initOfflineQueue = () => {
    if (!window.indexedDB) return

    const request = indexedDB.open('myno-offline-queue', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('actions')) {
        db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => {
      console.log('Offline queue database initialized')
      window.mynoOfflineDB = request.result
    }

    request.onerror = (event) => {
      console.error('Failed to open offline queue database:', event.target.error)
    }
  }

  // Queue AI action for offline processing
  window.queueOfflineAction = (action) => {
    if (!window.mynoOfflineDB) return

    const transaction = window.mynoOfflineDB.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    store.add({
      ...action,
      timestamp: new Date().toISOString(),
      retries: 0
    })

    console.log('Action queued for offline processing:', action.type)
  }

  // Process queued actions when online
  const processOfflineQueue = () => {
    if (!window.mynoOfflineDB || !isOnline()) return

    const transaction = window.mynoOfflineDB.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    const request = store.getAll()

    request.onsuccess = async () => {
      const actions = request.result
      for (const action of actions) {
        try {
          // Process different action types
          switch (action.type) {
            case 'store_mistake':
              // Import and call storeMistake function
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
              // Import and call save word function
              const { addDoc, collection } = await import('firebase/firestore')
              const { db } = await import('@/lib/firebase')
              await addDoc(collection(db, 'savedWords'), action.data)
              break
            case 'update_streak':
              // Import and call streak update
              const { updateDailyStreak } = await import('@/lib/streakManager')
              await updateDailyStreak(action.db, action.userId)
              break
            default:
              console.warn('Unknown action type:', action.type)
          }

          // Remove processed action
          store.delete(action.id)
          console.log('Processed offline action:', action.type)
        } catch (error) {
          console.error('Failed to process offline action:', error)
          // Increment retry count
          action.retries += 1
          if (action.retries < 3) {
            store.put(action)
          } else {
            console.warn('Action failed after 3 retries, removing:', action.type)
            store.delete(action.id)
          }
        }
      }
    }
  }

  // Initialize offline queue
  initOfflineQueue()

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('App is online, processing queued actions...')
    document.documentElement.classList.remove('offline')
    processOfflineQueue()
  })

  window.addEventListener('offline', () => {
    console.log('App is offline, queuing actions...')
    document.documentElement.classList.add('offline')
  })

  // Initial online status
  if (!isOnline()) {
    document.documentElement.classList.add('offline')
  }

  // Export for use in components
  window.isOnline = isOnline
}

// Initialize offline sync
setupOfflineSync()

// Cache recent lessons for offline access
const cacheRecentLessons = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('myno-lessons')
      // Cache essential static assets
      const urlsToCache = [
        '/',
        '/index.html',
        '/src/main.jsx',
        '/src/App.jsx',
        '/src/index.css'
      ]
      await cache.addAll(urlsToCache)
      console.log('Essential assets cached for offline use')
    } catch (error) {
      console.error('Failed to cache assets:', error)
    }
  }
}

// Cache on initial load
cacheRecentLessons()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
