
/**
 * Dictionary service for Myno using Wiktionary REST API with caching and fallback.
 */

const CACHE_NAME = 'myno-dictionary';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Language code mapping for Wiktionary
const WIKTIONARY_LANG_MAP = {
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
    'zh': 'zh', // Mandarin
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
 * Extract definition from Wiktionary REST API response
 */
function extractDefinition(data, word) {
    const definitions = [];

    try {
        // Wiktionary REST API v1 structure
        if (data.definitions && Array.isArray(data.definitions)) {
            for (const langData of data.definitions) {
                if (langData.partsOfSpeech && Array.isArray(langData.partsOfSpeech)) {
                    for (const posData of langData.partsOfSpeech) {
                        const partOfSpeech = posData.partOfSpeech || 'unknown';
                        if (posData.definitions && Array.isArray(posData.definitions)) {
                            for (const def of posData.definitions) {
                                definitions.push({
                                    partOfSpeech,
                                    definition: def.definition || '',
                                    example: def.examples && def.examples[0] ? def.examples[0] : null
                                });
                            }
                        }
                    }
                }
            }
        }

        // Fallback: try to find any definition in the response
        if (definitions.length === 0 && data.definitions) {
            // Simplified parsing
            const firstLang = data.definitions[0];
            if (firstLang && firstLang.definitions && firstLang.definitions[0]) {
                definitions.push({
                    partOfSpeech: 'unknown',
                    definition: firstLang.definitions[0].definition || '',
                    example: null
                });
            }
        }
    } catch (error) {
        console.warn('Error parsing Wiktionary response:', error);
    }

    return definitions.length > 0 ? definitions : null;
}

/**
 * Fallback to Mistral for definitions when Wiktionary fails
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
    const langCode = WIKTIONARY_LANG_MAP[targetLang] || targetLang;

    // Check cache first
    const cached = await getCachedDefinition(normalizedWord, langCode);
    if (cached) {
        console.log(`[Dictionary] Cache hit for "${normalizedWord}" in ${langCode}`);
        return cached;
    }

    // Try Wiktionary API
    try {
        console.log(`[Dictionary] Fetching from Wiktionary: "${normalizedWord}" in ${langCode}`);
        const url = `https://${langCode}.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(normalizedWord)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Wiktionary API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const definition = extractDefinition(data, normalizedWord);

        if (definition) {
            // Add source metadata
            const definitionWithSource = definition.map(def => ({
                ...def,
                source: 'wiktionary'
            }));
            await cacheDefinition(normalizedWord, langCode, definitionWithSource);
            return definitionWithSource;
        } else {
            throw new Error('No definition found in Wiktionary response');
        }
    } catch (error) {
        console.warn(`[Dictionary] Wiktionary lookup failed for "${normalizedWord}":`, error.message);

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

// Test function
async function runTests() {
  console.log('Testing dictionary service...\n');

  // Test 1: Basic English word
  console.log('Test 1: Looking up English word "hello"...');
  try {
    const result1 = await lookupWord('hello', 'English');
    console.log('Result:', result1 ? 'Success' : 'No definition');
    console.log('Definition:', result1?.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Spanish word
  console.log('Test 2: Looking up Spanish word "hola"...');
  try {
    const result2 = await lookupWord('hola', 'Spanish');
    console.log('Result:', result2 ? 'Success' : 'No definition');
    console.log('Definition:', result2?.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Invalid word
  console.log('Test 3: Looking up empty word...');
  try {
    const result3 = await lookupWord('', 'English');
    console.log('Result:', result3 || 'Empty result (expected)');
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n---\n');

  // Test 4: Language mapping
  console.log('Test 4: Testing language code mapping...');
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'];
  for (const lang of languages) {
    try {
      const result = await lookupWord('test', lang);
      console.log(`  ${lang}: ${result ? 'OK' : 'No definition'}`);
    } catch (error) {
      console.log(`  ${lang}: Error - ${error.message}`);
    }
  }

  console.log('\nAll tests completed!');
}

runTests().catch(console.error);
