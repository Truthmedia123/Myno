/**
 * Dictionary service for Myno using Free Dictionary API with caching and fallback.
 */

const CACHE_NAME = 'myno-dictionary';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Language name to Free Dictionary API code mapping
const FREE_DICT_LANG_MAP = {
    // Language names (as they appear in profile.target_language) to ISO 639-1 codes
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'dutch': 'nl',
    'swedish': 'sv',
    'turkish': 'tr',
    'greek': 'el',
    'arabic': 'ar',
    'hindi': 'hi',
    'japanese': 'ja',
    'korean': 'ko',
    'mandarin': 'zh',
    'mandarin chinese': 'zh',
    'chinese': 'zh',
    'russian': 'ru',

    // Also support language codes directly
    'en': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'nl': 'nl',
    'sv': 'sv',
    'tr': 'tr',
    'el': 'el',
    'ar': 'ar',
    'hi': 'hi',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh',
    'ru': 'ru'
};

/**
 * Get cached definition from Cache API
 */
async function getCachedDefinition(word, lang) {
    try {
        if (!('caches' in window)) return null;

        const cache = await caches.open(CACHE_NAME);
        const key = `/${lang}/${word.toLowerCase()}`;
        const response = await cache.match(key);

        if (response) {
            const data = await response.json();
            if (Date.now() - data.timestamp < CACHE_TTL) {
                return data.definition;
            }
        }
    } catch (error) {
        console.warn('Cache read error:', error);
    }
    return null;
}

/**
 * Cache definition using Cache API
 */
async function cacheDefinition(word, lang, definition) {
    try {
        if (!('caches' in window)) return;

        const cache = await caches.open(CACHE_NAME);
        const key = `/${lang}/${word.toLowerCase()}`;
        const data = { definition, timestamp: Date.now() };
        await cache.put(key, new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        }));
    } catch (error) {
        console.warn('Cache write error:', error);
    }
}

/**
 * Fetch definition from Free Dictionary API
 */
async function fetchFromFreeDictionaryAPI(word, langCode) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/${langCode}/${encodeURIComponent(word)}`;
    console.log(`[Dictionary] Fetching from Free Dictionary API: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Word "${word}" not found in dictionary`);
        }
        throw new Error(`Free Dictionary API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Extract definition from Free Dictionary API response
 */
function extractDefinitionFromFreeAPI(data, word) {
    const definitions = [];

    try {
        // Free Dictionary API returns an array of entries
        if (Array.isArray(data) && data.length > 0) {
            for (const entry of data) {
                // Each entry has meanings array
                if (entry.meanings && Array.isArray(entry.meanings)) {
                    for (const meaning of entry.meanings) {
                        const partOfSpeech = meaning.partOfSpeech || 'unknown';

                        if (meaning.definitions && Array.isArray(meaning.definitions)) {
                            for (const def of meaning.definitions) {
                                definitions.push({
                                    partOfSpeech,
                                    definition: def.definition || '',
                                    example: def.example || null,
                                    phonetic: entry.phonetic || null,
                                    audio: entry.phonetics?.find(p => p.audio)?.audio || null
                                });
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Error parsing Free Dictionary API response:', error);
    }

    return definitions.length > 0 ? definitions : null;
}

/**
 * Fallback to Mistral for definitions when Free Dictionary API fails
 */
async function fallbackMistralDefinition(word, lang) {
    try {
        const { callMistral } = await import('./mistralClient.js');
        const langName = getLanguageName(lang);
        const prompt = `Define the word "${word}" in ${langName}. Provide: 1. Part of speech, 2. Clear definition, 3. One example sentence. Keep it concise.`;

        const response = await callMistral([{ role: 'user', content: prompt }], {
            maxTokens: 150,
            temperature: 0.3
        });

        return [{
            partOfSpeech: 'unknown',
            definition: response,
            example: null,
            source: 'mistral'
        }];
    } catch (error) {
        console.warn('Mistral fallback failed:', error);
        return [{
            partOfSpeech: 'unknown',
            definition: `Definition for "${word}" not available.`,
            example: null,
            source: 'error'
        }];
    }
}

/**
 * Get display name for language code
 */
function getLanguageName(langCode) {
    const names = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'tr': 'Turkish',
        'el': 'Greek',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Mandarin Chinese',
        'ru': 'Russian'
    };
    return names[langCode] || langCode;
}

/**
 * Convert language input to Free Dictionary API code
 */
function getFreeDictLangCode(langInput) {
    if (!langInput) return 'en';

    const normalized = langInput.toString().toLowerCase().trim();

    // Direct mapping
    if (FREE_DICT_LANG_MAP[normalized]) {
        return FREE_DICT_LANG_MAP[normalized];
    }

    // Try to extract from language name
    for (const [key, code] of Object.entries(FREE_DICT_LANG_MAP)) {
        if (normalized.includes(key) && key.length > 2) {
            return code;
        }
    }

    // Default to English
    return 'en';
}

/**
 * Main function to lookup a word
 */
export async function lookupWord(word, targetLang = 'en') {
    if (!word || typeof word !== 'string' || word.trim() === '') {
        return [{
            partOfSpeech: 'error',
            definition: 'Please provide a valid word.',
            example: null,
            source: 'error'
        }];
    }

    const normalizedWord = word.trim().toLowerCase();
    const langCode = getFreeDictLangCode(targetLang);

    // Check cache first
    const cached = await getCachedDefinition(normalizedWord, langCode);
    if (cached) {
        console.log(`[Dictionary] Cache hit for "${normalizedWord}" in ${langCode}`);
        return cached;
    }

    // Try Free Dictionary API
    try {
        console.log(`[Dictionary] Fetching from Free Dictionary API: "${normalizedWord}" in ${langCode}`);
        const data = await fetchFromFreeDictionaryAPI(normalizedWord, langCode);
        const definition = extractDefinitionFromFreeAPI(data, normalizedWord);

        if (definition) {
            // Add source metadata
            const definitionWithSource = definition.map(def => ({
                ...def,
                source: 'free-dictionary'
            }));
            await cacheDefinition(normalizedWord, langCode, definitionWithSource);
            return definitionWithSource;
        } else {
            throw new Error('No definition found in Free Dictionary API response');
        }
    } catch (error) {
        console.warn(`[Dictionary] Free Dictionary API lookup failed for "${normalizedWord}":`, error.message);

        // Fallback to Mistral
        const fallbackDefinition = await fallbackMistralDefinition(normalizedWord, targetLang);
        await cacheDefinition(normalizedWord, langCode, fallbackDefinition);
        return fallbackDefinition;
    }
}

/**
 * Clear dictionary cache
 */
export async function clearDictionaryCache() {
    try {
        if ('caches' in window) {
            await caches.delete(CACHE_NAME);
            return true;
        }
    } catch (error) {
        console.error('Error clearing dictionary cache:', error);
    }
    return false;
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
    try {
        if (!('caches' in window)) return { size: 0 };

        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        return { size: keys.length };
    } catch (error) {
        console.warn('Error getting cache stats:', error);
        return { size: 0 };
    }
}