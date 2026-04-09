/**
 * Language registry for Myno AI Tutor UI.
 * Provides language metadata (code, name, flag) and lookup utilities.
 * @module curriculum/languages
 */

export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' }
];

/**
 * Get language object by its ISO 639‑1 code.
 * @param {string} code - Two‑letter language code (e.g., 'es', 'fr')
 * @returns {Object|null} Language object or null if not found
 */
export function getLanguageByCode(code) {
    return LANGUAGES.find(lang => lang.code === code) || null;
}

/**
 * Return array of all language codes.
 * @returns {string[]} Array of two‑letter codes
 */
export function getAllLanguageCodes() {
    return LANGUAGES.map(lang => lang.code);
}