/**
 * Groq API client with rate limiting, caching, and exponential backoff.
 * Strictly $0 budget: uses localStorage cache, client-side rate limiting.
 * @module groqClient
 */

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// Rate limiter: max ~75 req/min (800ms min interval)
const MIN_INTERVAL_MS = 800;
let lastRequestTime = 0;
const requestQueue = [];

// Cache configuration
const CACHE_PREFIX = 'groq_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a hash key from prompt and parameters.
 * @param {string} prompt - The user prompt
 * @param {Object} params - Additional parameters
 * @returns {string} MD5-like hash (simple implementation)
 */
function generateCacheKey(prompt, params = {}) {
    const str = prompt + JSON.stringify(params);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return CACHE_PREFIX + Math.abs(hash).toString(36);
}

/**
 * Get cached response if valid.
 * @param {string} key - Cache key
 * @returns {string|null} Cached response or null
 */
function getCachedResponse(key) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const { timestamp, response } = JSON.parse(item);
        if (Date.now() - timestamp < CACHE_TTL) {
            return response;
        }
        localStorage.removeItem(key);
        return null;
    } catch (e) {
        console.warn('Cache read failed:', e);
        return null;
    }
}

/**
 * Store response in cache.
 * @param {string} key - Cache key
 * @param {string} response - API response text
 */
function setCachedResponse(key, response) {
    try {
        const item = JSON.stringify({
            timestamp: Date.now(),
            response
        });
        localStorage.setItem(key, item);
    } catch (e) {
        console.warn('Cache write failed:', e);
    }
}

/**
 * Exponential backoff with jitter.
 * @param {number} attempt - Current attempt (0-indexed)
 * @returns {Promise<void>} Promise that resolves after delay
 */
function backoff(attempt) {
    const baseDelay = 1000 * Math.pow(2, attempt);
    const jitter = Math.random() * 500;
    const delay = Math.min(baseDelay + jitter, 10000);
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Rate-limited fetch to Groq API.
 * @param {Array} messages - Chat messages in OpenAI format
 * @param {Object} options - Additional options (temperature, max_tokens)
 * @param {number} options.temperature - Default 0.3
 * @param {number} options.max_tokens - Default 512
 * @returns {Promise<string>} Parsed response text
 */
export async function callGroq(messages, options = {}) {
    const { temperature = 0.3, max_tokens = 512 } = options;

    // Build prompt for caching
    const prompt = messages.map(m => m.content).join('\n');
    const cacheKey = generateCacheKey(prompt, { temperature, max_tokens });
    const cached = getCachedResponse(cacheKey);
    if (cached !== null) {
        console.log('Groq: cache hit');
        return cached;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    if (timeSinceLast < MIN_INTERVAL_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLast));
    }

    // Exponential backoff with retries
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) {
            await backoff(attempt - 1);
        }

        try {
            lastRequestTime = Date.now();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages,
                    temperature,
                    max_tokens
                })
            });

            if (response.status === 429) {
                throw new Error('Rate limit exceeded');
            }
            if (response.status === 403) {
                throw new Error('Quota exhausted');
            }
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const text = data.choices[0]?.message?.content?.trim();
            if (!text) {
                throw new Error('Empty response from Groq');
            }

            // Cache successful response
            setCachedResponse(cacheKey, text);
            return text;
        } catch (error) {
            lastError = error;
            console.warn(`Groq attempt ${attempt + 1} failed:`, error.message);
            if (error.message.includes('Quota exhausted')) {
                break; // No point retrying
            }
        }
    }

    // Graceful fallback: return a placeholder and log
    console.error('Groq API failed after retries:', lastError?.message);
    const fallback = `I'm currently unable to generate a response (${lastError?.message || 'network error'}). Please try again later.`;
    return fallback;
}

/**
 * Simplified chat completion for tutor use.
 * @param {Array} messages - Conversation history
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} AI response
 */
export async function groqChatCompletion(messages, systemPrompt = '') {
    const formatted = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
    return callGroq(formatted, { temperature: 0.3, max_tokens: 512 });
}

/**
 * Clear expired cache entries.
 */
export function clearExpiredCache() {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_PREFIX)) {
            try {
                const item = localStorage.getItem(key);
                const { timestamp } = JSON.parse(item);
                if (now - timestamp > CACHE_TTL) {
                    localStorage.removeItem(key);
                }
            } catch {
                // ignore malformed entries
            }
        }
    }
}

// Clear expired entries on module load
if (typeof window !== 'undefined') {
    setTimeout(clearExpiredCache, 1000);
}