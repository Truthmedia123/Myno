/**
 * Streak manager with grace period and freeze functionality.
 * Implements 48-hour grace window and streak freeze for $0 budget.
 * @module streakManager
 */

import { doc, getDoc, updateDoc } from "firebase/firestore";

/** Grace period in milliseconds (48 hours) */
const GRACE_PERIOD_MS = 48 * 60 * 60 * 1000;
/** Streak freeze granted after this many consecutive days */
const FREEZE_GRANT_STREAK = 10;
/** LocalStorage key for streak freeze */
const FREEZE_STORAGE_KEY = "myno_streak_freeze";

/**
 * Get streak status with grace and freeze logic.
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @returns {Promise<{streak: number, status: 'active'|'grace'|'broken', freezeAvailable: boolean}>}
 */
export async function getStreakStatus(db, userId) {
    try {
        const profileRef = doc(db, "userProfiles", userId);
        const snap = await getDoc(profileRef);

        if (!snap.exists()) {
            return { streak: 0, status: 'broken', freezeAvailable: false };
        }

        const data = snap.data();
        const currentStreak = data.daily_streak || 0;
        const lastSession = data.last_session_date ? new Date(data.last_session_date) : null;
        const now = new Date();

        // Check if user has a streak freeze available
        const freezeAvailable = await hasFreezeAvailable(userId, currentStreak);

        // No last session means broken streak
        if (!lastSession) {
            return {
                streak: currentStreak,
                status: 'broken',
                freezeAvailable
            };
        }

        const timeSinceLastSession = now.getTime() - lastSession.getTime();
        const daysSinceLastSession = Math.floor(timeSinceLastSession / (24 * 60 * 60 * 1000));

        // Active: last session was today or yesterday
        if (daysSinceLastSession <= 1) {
            return {
                streak: currentStreak,
                status: 'active',
                freezeAvailable
            };
        }

        // Grace: within 48 hours (2 days) but more than 1 day
        if (daysSinceLastSession === 2 && timeSinceLastSession <= GRACE_PERIOD_MS) {
            return {
                streak: currentStreak,
                status: 'grace',
                freezeAvailable
            };
        }

        // Broken: beyond grace period
        return {
            streak: 0,
            status: 'broken',
            freezeAvailable
        };
    } catch (error) {
        console.error("Error getting streak status:", error);
        return { streak: 0, status: 'broken', freezeAvailable: false };
    }
}

/**
 * Update daily streak with grace and freeze handling.
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @param {boolean} useFreeze - Whether to use a streak freeze if available
 * @returns {Promise<{streak: number, status: 'active'|'grace'|'broken', freezeAvailable: boolean, freezeUsed: boolean}>}
 */
export async function updateDailyStreak(db, userId, useFreeze = false) {
    try {
        const profileRef = doc(db, "userProfiles", userId);
        const snap = await getDoc(profileRef);

        if (!snap.exists()) {
            return { streak: 0, status: 'broken', freezeAvailable: false, freezeUsed: false };
        }

        const data = snap.data();
        const currentStreak = data.daily_streak || 0;
        const lastSession = data.last_session_date ? new Date(data.last_session_date) : null;
        const now = new Date();
        const todayStr = now.toDateString();

        // Check current status
        const statusResult = await getStreakStatus(db, userId);
        let newStreak = currentStreak;
        let freezeUsed = false;

        // If already active today, return current status
        if (lastSession && new Date(lastSession).toDateString() === todayStr) {
            return {
                ...statusResult,
                freezeUsed: false
            };
        }

        // Handle broken streak
        if (statusResult.status === 'broken') {
            // Check if we can use a freeze
            if (useFreeze && statusResult.freezeAvailable) {
                await useStreakFreeze(userId);
                freezeUsed = true;
                // Keep the streak intact
                newStreak = currentStreak;
            } else {
                // Reset streak
                newStreak = 1;
            }
        }
        // Handle grace period
        else if (statusResult.status === 'grace') {
            // Continue streak without penalty during grace
            newStreak = currentStreak + 1;
        }
        // Handle active streak (yesterday)
        else {
            newStreak = currentStreak + 1;
        }

        // Update Firestore
        await updateDoc(profileRef, {
            daily_streak: newStreak,
            last_session_date: now.toISOString(),
            days_practiced: (data.days_practiced || 0) + 1,
        });

        // Grant freeze if streak reaches threshold
        if (newStreak >= FREEZE_GRANT_STREAK) {
            await grantStreakFreeze(userId);
        }

        // Get updated status
        const updatedStatus = await getStreakStatus(db, userId);

        return {
            ...updatedStatus,
            freezeUsed,
        };
    } catch (error) {
        console.error("Error updating streak:", error);
        return { streak: 0, status: 'broken', freezeAvailable: false, freezeUsed: false };
    }
}

/**
 * Check if user has a streak freeze available.
 * @param {string} userId - User ID
 * @param {number} currentStreak - Current streak count
 * @returns {Promise<boolean>}
 */
async function hasFreezeAvailable(userId, currentStreak) {
    try {
        // Check localStorage first (client-side cache)
        const stored = localStorage.getItem(`${FREEZE_STORAGE_KEY}_${userId}`);
        if (stored) {
            const data = JSON.parse(stored);
            // Check expiration (freeze lasts forever until used)
            return data.available === true;
        }

        // If no localStorage entry, check if streak qualifies for auto-grant
        return currentStreak >= FREEZE_GRANT_STREAK;
    } catch (error) {
        console.error("Error checking freeze availability:", error);
        return false;
    }
}

/**
 * Grant a streak freeze to user.
 * @param {string} userId - User ID
 */
async function grantStreakFreeze(userId) {
    try {
        const freezeData = {
            available: true,
            grantedAt: new Date().toISOString(),
            grantedForStreak: FREEZE_GRANT_STREAK,
        };

        // Store in localStorage
        localStorage.setItem(
            `${FREEZE_STORAGE_KEY}_${userId}`,
            JSON.stringify(freezeData)
        );

        // Also store in Firestore for cross-device sync
        // Note: This is async but we don't await for performance
        // Firestore update happens in background via syncStreakFreeze
    } catch (error) {
        console.error("Error granting streak freeze:", error);
    }
}

/**
 * Use a streak freeze.
 * @param {string} userId - User ID
 */
async function useStreakFreeze(userId) {
    try {
        // Remove from localStorage
        localStorage.removeItem(`${FREEZE_STORAGE_KEY}_${userId}`);

        // Update Firestore (background)
        // Note: Actual Firestore update happens in syncStreakFreeze
    } catch (error) {
        console.error("Error using streak freeze:", error);
    }
}

/**
 * Sync streak freeze status with Firestore (called on login/session resume).
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 */
export async function syncStreakFreeze(db, userId) {
    try {
        const profileRef = doc(db, "userProfiles", userId);
        const stored = localStorage.getItem(`${FREEZE_STORAGE_KEY}_${userId}`);

        if (stored) {
            const data = JSON.parse(stored);
            await updateDoc(profileRef, {
                streak_freeze_available: data.available,
                streak_freeze_granted_at: data.grantedAt,
            });
        } else {
            // Clear Firestore entry if no freeze in localStorage
            await updateDoc(profileRef, {
                streak_freeze_available: false,
                streak_freeze_granted_at: null,
            });
        }
    } catch (error) {
        console.error("Error syncing streak freeze:", error);
    }
}

/**
 * Get streak statistics for display.
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @returns {Promise<{currentStreak: number, longestStreak: number, totalDays: number, status: string, freezeAvailable: boolean}>}
 */
export async function getStreakStats(db, userId) {
    try {
        const profileRef = doc(db, "userProfiles", userId);
        const snap = await getDoc(profileRef);

        if (!snap.exists()) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                totalDays: 0,
                status: 'broken',
                freezeAvailable: false,
            };
        }

        const data = snap.data();
        const statusResult = await getStreakStatus(db, userId);

        return {
            currentStreak: data.daily_streak || 0,
            longestStreak: data.longest_streak || data.daily_streak || 0,
            totalDays: data.days_practiced || 0,
            status: statusResult.status,
            freezeAvailable: statusResult.freezeAvailable,
        };
    } catch (error) {
        console.error("Error getting streak stats:", error);
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalDays: 0,
            status: 'broken',
            freezeAvailable: false,
        };
    }
}