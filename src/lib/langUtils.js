/**
 * Language code normalization utilities for Myno AI Tutor.
 * Centralized handling of language codes, names, and folder mappings.
 * @module lib/langUtils
 */

import { LANGUAGES } from '@/curriculum/languages.js';

/**
 * Map from language names (lowercase) to ISO 639‑1 codes.
 * @type {Record<string, string>}
 */
const NAME_TO_CODE = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    italian: 'it',
    portuguese: 'pt',
    japanese: 'ja',
    korean: 'ko',
    mandarin: 'zh',
    arabic: 'ar',
    hindi: 'hi',
    russian: 'ru',
    dutch: 'nl',
    turkish: 'tr',
    swedish: 'sv',
    greek: 'el'
};

/**
 * Map from language codes to folder names (as used in curriculum/index.js).
 * @type {Record<string, string>}
 */
const CODE_TO_FOLDER = {
    en: 'english',
    es: 'spanish',
    fr: 'french',
    de: 'german',
    it: 'italian',
    pt: 'portuguese',
    ja: 'japanese',
    ko: 'korean',
    zh: 'mandarin',
    ar: 'arabic',
    hi: 'hindi',
    ru: 'russian',
    nl: 'dutch',
    tr: 'turkish',
    sv: 'swedish',
    el: 'greek'
};

/**
 * Normalize a language identifier to a 2‑letter ISO code.
 * @param {string} input - Language identifier (code, name, or mixed case)
 * @returns {string} Normalized 2‑letter code (lowercase), 'en' if unknown
 * @example
 * normalizeLangCode('English') → 'en'
 * normalizeLangCode('ES') → 'es'
 * normalizeLangCode('french') → 'fr'
 */
export function normalizeLangCode(input) {
    if (!input || typeof input !== 'string') {
        return 'en';
    }

    const trimmed = input.trim().toLowerCase();

    // If already a 2‑letter code (maybe uppercase), return lowercase
    if (/^[a-z]{2}$/.test(trimmed)) {
        return trimmed;
    }

    // Look up in name-to-code map
    const code = NAME_TO_CODE[trimmed];
    if (code) {
        return code;
    }

    // Check if it's a code but with different casing (e.g., 'EN')
    if (input.length === 2) {
        const lower = input.toLowerCase();
        if (LANGUAGES.some(lang => lang.code === lower)) {
            return lower;
        }
    }

    // Fallback to English
    return 'en';
}

/**
 * Get the folder name for a given language code.
 * @param {string} code - Normalized 2‑letter language code
 * @returns {string} Folder name (e.g., 'spanish'), 'english' if unknown
 */
export function getFolderForCode(code) {
    const normalized = normalizeLangCode(code);
    return CODE_TO_FOLDER[normalized] || 'english';
}

/**
 * Check if a language code is supported by the curriculum.
 * @param {string} code - 2‑letter language code
 * @returns {boolean} True if the language exists in LANGUAGES registry
 */
export function isSupportedLang(code) {
    if (!code || typeof code !== 'string') return false;
    const normalized = normalizeLangCode(code);
    return LANGUAGES.some(lang => lang.code === normalized);
}

/**
 * Get the mapping from language codes to folder names.
 * @returns {Record<string, string>} CODE_TO_FOLDER object
 */
export function getCodeToFolder() {
    return { ...CODE_TO_FOLDER };
}

/**
 * Get the mapping from language names to codes.
 * @returns {Record<string, string>} NAME_TO_CODE object
 */
export function getNameToCode() {
    return { ...NAME_TO_CODE };
}

/**
 * Get language display name from code.
 * @param {string} code - 2‑letter language code
 * @returns {string} Display name (e.g., 'Spanish'), 'English' if unknown
 */
export function getDisplayName(code) {
    const normalized = normalizeLangCode(code);
    const lang = LANGUAGES.find(l => l.code === normalized);
    return lang ? lang.name : 'English';
}