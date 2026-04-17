// src/lib/vocabStore.js
const DB_NAME = 'myno-vocab';
const STORE_NAME = 'userVocabulary';
const DB_VERSION = 1;

// Spaced repetition intervals (in hours) - simple FSRS-like progression
const INTERVALS = [4, 8, 24, 72, 168, 336, 720, 2160]; // 4h, 8h, 1d, 3d, 1w, 2w, 1mo, 3mo

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('byLanguage', 'language');
                store.createIndex('byStatus', 'status');
                store.createIndex('byLanguageAndStatus', ['language', 'status']);
                store.createIndex('byNextReview', 'nextReview');
            }
        };
    });
}

export async function addWord({ word, translation, context = '', language = 'en' }) {
    const db = await openDB();
    const now = Date.now();
    const entry = {
        id: `${word}-${language}-${now}`,
        word,
        translation,
        context,
        language,
        status: 'new',
        firstSeen: now,
        lastReviewed: null,
        reviewCount: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReview: now // due immediately
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(entry);
        request.onsuccess = () => resolve(entry);
        request.onerror = () => reject(request.error);
    });
}

export async function getWordsByLanguage(language, status = null) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        let request;
        if (status) {
            const index = store.index('byLanguageAndStatus');
            request = index.getAll([language, status]);
        } else {
            const index = store.index('byLanguage');
            request = index.getAll(language);
        }
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function updateWordStatus(id, newStatus, performance = 'good') {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
            const entry = getRequest.result;
            if (!entry) {
                reject(new Error('Word not found'));
                return;
            }

            const now = Date.now();
            entry.status = newStatus;
            entry.lastReviewed = now;
            entry.reviewCount += 1;

            // Update interval based on performance
            if (performance === 'good') {
                entry.easeFactor = Math.max(1.3, entry.easeFactor + 0.1);
                const nextIntervalIndex = Math.min(entry.reviewCount, INTERVALS.length - 1);
                entry.interval = INTERVALS[nextIntervalIndex];
            } else {
                entry.easeFactor = Math.max(1.3, entry.easeFactor - 0.2);
                entry.interval = INTERVALS[0]; // reset to first interval
            }

            entry.nextReview = now + (entry.interval * 60 * 60 * 1000);

            const putRequest = store.put(entry);
            putRequest.onsuccess = () => resolve(entry);
            putRequest.onerror = () => reject(putRequest.error);
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

export async function deleteWord(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getWordsDueForReview(language) {
    const db = await openDB();
    const now = Date.now();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('byLanguage');
        const request = index.getAll(language);
        request.onsuccess = () => {
            const words = request.result.filter(w => w.nextReview <= now);
            resolve(words);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function wordExists(word, language) {
    const words = await getWordsByLanguage(language);
    return words.some(w => w.word.toLowerCase() === word.toLowerCase());
}