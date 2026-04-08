/**
 * Utility functions for resetting scenario-related data in localStorage and IndexedDB.
 * Useful for development, testing, or when users want to start fresh.
 */

/**
 * Clears scenario data from localStorage and IndexedDB.
 * Removes:
 * - localStorage item 'myno:scenarios'
 * - localStorage item 'myno:scenarioProgress'
 * - IndexedDB database 'myno-scenarios'
 * 
 * @returns {Promise<Object>} Result object with success status and details
 */
export async function resetScenarioData() {
    const results = {
        localStorage: {
            scenarios: false,
            scenarioProgress: false
        },
        indexedDB: false,
        error: null
    };

    try {
        // Clear localStorage items
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.removeItem('myno:scenarios');
                results.localStorage.scenarios = true;
            } catch (e) {
                console.warn('Failed to remove myno:scenarios from localStorage:', e);
            }

            try {
                localStorage.removeItem('myno:scenarioProgress');
                results.localStorage.scenarioProgress = true;
            } catch (e) {
                console.warn('Failed to remove myno:scenarioProgress from localStorage:', e);
            }
        }

        // Delete IndexedDB database
        if (typeof window !== 'undefined' && window.indexedDB) {
            try {
                await deleteIndexedDB('myno-scenarios');
                results.indexedDB = true;
            } catch (e) {
                console.warn('Failed to delete myno-scenarios IndexedDB database:', e);
                results.error = e.message;
            }
        }

        return results;
    } catch (error) {
        console.error('Error resetting scenario data:', error);
        results.error = error.message;
        return results;
    }
}

/**
 * Deletes an IndexedDB database by name.
 * @param {string} dbName - Name of the database to delete
 * @returns {Promise<boolean>} True if deletion was successful or database didn't exist
 */
function deleteIndexedDB(dbName) {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            resolve(false); // IndexedDB not supported
            return;
        }

        const request = indexedDB.deleteDatabase(dbName);

        request.onsuccess = () => {
            console.log(`IndexedDB database '${dbName}' deleted successfully`);
            resolve(true);
        };

        request.onerror = (event) => {
            console.error(`Error deleting IndexedDB database '${dbName}':`, event.target.error);
            reject(event.target.error);
        };

        request.onblocked = () => {
            console.warn(`IndexedDB database '${dbName}' deletion blocked (database in use)`);
            // Database is open elsewhere, we can't delete it now
            reject(new Error(`Database '${dbName}' is currently in use`));
        };
    });
}

/**
 * Provides a console-friendly version of the reset function that can be copied and pasted
 * directly into browser console for one-time use.
 * @returns {string} JavaScript code as a string
 */
export function getConsoleResetCode() {
    return `// Run once in browser console on localhost
localStorage.removeItem('myno:scenarios');
localStorage.removeItem('myno:scenarioProgress');
indexedDB.deleteDatabase('myno-scenarios');
console.log('Scenario data reset complete');`;
}

/**
 * Checks if scenario data exists in localStorage or IndexedDB.
 * @returns {Promise<Object>} Object indicating what data exists
 */
export async function checkScenarioData() {
    const exists = {
        localStorage: {
            scenarios: false,
            scenarioProgress: false
        },
        indexedDB: false
    };

    if (typeof window !== 'undefined' && window.localStorage) {
        exists.localStorage.scenarios = localStorage.getItem('myno:scenarios') !== null;
        exists.localStorage.scenarioProgress = localStorage.getItem('myno:scenarioProgress') !== null;
    }

    // Check if IndexedDB database exists (simplified check)
    if (typeof window !== 'undefined' && window.indexedDB) {
        exists.indexedDB = await checkIndexedDBExists('myno-scenarios');
    }

    return exists;
}

/**
 * Checks if an IndexedDB database exists.
 * @param {string} dbName - Database name to check
 * @returns {Promise<boolean>} True if database exists
 */
function checkIndexedDBExists(dbName) {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            resolve(false);
            return;
        }

        // Try to open the database
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            db.close();
            resolve(true);
        };

        request.onerror = () => {
            resolve(false);
        };

        request.onupgradeneeded = (event) => {
            // Database didn't exist, so upgradeneeded was triggered
            const db = event.target.result;
            db.close();
            // Delete the newly created database
            indexedDB.deleteDatabase(dbName);
            resolve(false);
        };
    });
}

/**
 * Resets ALL myno-related data (use with caution!)
 * This includes scenarios, streak freezes, offline queue, etc.
 * @returns {Promise<Object>} Results of all resets
 */
export async function resetAllMynoData() {
    const results = {
        scenarios: await resetScenarioData(),
        localStorage: {},
        indexedDB: {}
    };

    // Clear other known localStorage keys
    if (typeof window !== 'undefined' && window.localStorage) {
        const mynoKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('myno')) {
                mynoKeys.push(key);
            }
        }

        for (const key of mynoKeys) {
            try {
                localStorage.removeItem(key);
                results.localStorage[key] = true;
            } catch (e) {
                results.localStorage[key] = false;
            }
        }
    }

    // Note: We could also delete other IndexedDB databases like 'myno-offline-queue'
    // but that might break functionality, so we'll leave that to the user if needed.

    return results;
}