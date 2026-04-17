const DB_NAME = 'myno-memory';
const STORE_NAME = 'conversationMemory';
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
            }
        };
    });
}

export async function getMemory(userId) {
    const db = await openDB();
    return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(userId);
        request.onsuccess = () => {
            const data = request.result;
            resolve(data || {
                userId,
                topics: [],
                lastTopics: [],
                userPreferences: [],
                knownFacts: {},
                turnsOnCurrentTopic: 0,
                consecutiveShortReplies: 0,
                lastUpdated: Date.now()
            });
        };
        request.onerror = () => resolve(null);
    });
}

export async function updateMemory(userId, updates) {
    const db = await openDB();
    const memory = await getMemory(userId);
    const newMemory = { ...memory, ...updates, lastUpdated: Date.now() };
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(newMemory);
        request.onsuccess = () => resolve(newMemory);
        request.onerror = () => reject(request.error);
    });
}

export function formatMemoryContext(memory) {
    if (!memory) return '';
    const parts = [];
    if (memory.topics?.length) parts.push(`Recent topics: ${memory.topics.slice(-3).join(', ')}`);
    if (memory.userPreferences?.length) parts.push(`User likes: ${memory.userPreferences.join(', ')}`);
    if (memory.turnsOnCurrentTopic > 3) parts.push(`Staying on topic: ${memory.lastTopics?.[0]}`);
    if (memory.consecutiveShortReplies >= 3) parts.push(`User giving short answers - switch topic or ask open question.`);
    return parts.join('\n');
}

// Helper functions for topic detection
export function detectTopic(text) {
    const lower = text.toLowerCase();
    if (lower.includes('food') || lower.includes('eat') || lower.includes('restaurant')) return 'food';
    if (lower.includes('travel') || lower.includes('vacation') || lower.includes('hotel')) return 'travel';
    if (lower.includes('work') || lower.includes('job') || lower.includes('business')) return 'work';
    if (lower.includes('family') || lower.includes('friend') || lower.includes('relationship')) return 'relationships';
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('sun')) return 'weather';
    if (lower.includes('hobby') || lower.includes('sport') || lower.includes('game')) return 'hobbies';
    return 'general';
}

export function extractTopics(text) {
    const topics = [];
    const lower = text.toLowerCase();
    const topicKeywords = {
        food: ['food', 'eat', 'restaurant', 'meal', 'cook'],
        travel: ['travel', 'vacation', 'hotel', 'flight', 'trip'],
        work: ['work', 'job', 'business', 'office', 'career'],
        relationships: ['family', 'friend', 'relationship', 'love', 'partner'],
        weather: ['weather', 'rain', 'sun', 'temperature', 'climate'],
        hobbies: ['hobby', 'sport', 'game', 'music', 'movie']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => lower.includes(keyword))) {
            topics.push(topic);
        }
    }

    return topics.length ? topics : ['general'];
}