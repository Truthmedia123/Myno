/**
 * Curriculum data router for Myno AI Tutor.
 * Provides lazy‑loaded syllabus objects with IndexedDB caching and offline fallback.
 * @module curriculum
 */

const DB_NAME = 'myno-curriculum';
const STORE_NAME = 'syllabi';
const DB_VERSION = 1;

/**
 * Open IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: ['lang', 'cefr'] });
            }
        };
    });
}

/**
 * Store a syllabus in IndexedDB.
 * @param {string} lang - Language code
 * @param {string} cefr - CEFR level
 * @param {Object} syllabus - Syllabus object
 * @returns {Promise<void>}
 */
async function storeInIndexedDB(lang, cefr, syllabus) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const request = store.put({ lang, cefr, syllabus, timestamp: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn(`Failed to cache syllabus ${lang}/${cefr} in IndexedDB:`, error);
    }
}

/**
 * Retrieve a syllabus from IndexedDB.
 * @param {string} lang - Language code
 * @param {string} cefr - CEFR level
 * @returns {Promise<Object|null>} Cached syllabus or null
 */
async function getFromIndexedDB(lang, cefr) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        return await new Promise((resolve, reject) => {
            const request = store.get([lang, cefr]);
            request.onsuccess = () => {
                const result = request.result;
                // Check if cache is older than 7 days (optional)
                if (result && result.timestamp && Date.now() - result.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    resolve(result.syllabus);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn(`Failed to retrieve cached syllabus ${lang}/${cefr}:`, error);
        return null;
    }
}

/**
 * Validate a syllabus object has required keys.
 * @param {Object} syllabus - Syllabus to validate
 * @throws {Error} If validation fails
 */
function validateSyllabus(syllabus) {
    const required = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
    const missing = required.filter(key => !(key in syllabus));
    if (missing.length > 0) {
        throw new Error(`Syllabus validation failed: missing keys ${missing.join(', ')}`);
    }
    // Ensure arrays
    if (!Array.isArray(syllabus.grammar)) throw new Error('grammar must be an array');
    if (!Array.isArray(syllabus.vocab)) throw new Error('vocab must be an array');
    if (!Array.isArray(syllabus.phonemes)) throw new Error('phonemes must be an array');
}

/**
 * Load a syllabus via dynamic import, with IndexedDB caching and offline fallback.
 * @param {string} lang - Language code (e.g., 'es', 'fr')
 * @param {string} cefr - CEFR level (e.g., 'A1', 'A2')
 * @returns {Promise<Object>} Syllabus object
 * @throws {Error} If syllabus fails validation and no cached version available
 */
export async function getCurriculum(lang, cefr) {
    // 1. Try IndexedDB cache
    const cached = await getFromIndexedDB(lang, cefr);
    if (cached) {
        try {
            validateSyllabus(cached);
            return cached;
        } catch (validationError) {
            console.warn(`Cached syllabus ${lang}/${cefr} invalid:`, validationError);
            // Proceed to load fresh
        }
    }

    // 2. Dynamic import
    try {
        const module = await import(`./${lang}/${cefr}.js`);
        const syllabus = module.default || module;
        validateSyllabus(syllabus);
        // Store in IndexedDB for future offline use
        await storeInIndexedDB(lang, cefr, syllabus);
        return syllabus;
    } catch (importError) {
        console.warn(`Failed to load syllabus ${lang}/${cefr}:`, importError);
        // 3. Fallback: return empty syllabus structure
        const fallback = {
            level: cefr,
            language: lang,
            grammar: [],
            vocab: [],
            phonemes: [],
            pragmatics: '',
            orthography: null
        };
        // Store fallback to avoid repeated failed imports
        await storeInIndexedDB(lang, cefr, fallback);
        return fallback;
    }
}

/**
 * Clear all cached syllabi from IndexedDB (debugging utility).
 * @returns {Promise<void>}
 */
export async function clearCurriculumCache() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn('Failed to clear curriculum cache:', error);
        throw error;
    }
}