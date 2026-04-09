/**
 * Known vocabulary storage interface.
 * In a real implementation, this would fetch from Firebase or local storage.
 * For now, returns empty array as placeholder.
 * @module lib/knownVocab
 */

/**
 * Get known vocabulary for a given language.
 * @param {string} language - Language code (e.g., 'hindi', 'french')
 * @returns {Array<string>} Array of known words
 */
export function getKnownVocab(language) {
    // TODO: Integrate with actual user vocabulary storage
    // For now, return empty array
    return [];
}

/**
 * Mark a word as known for a language.
 * @param {string} language - Language code
 * @param {string} word - Word to mark as known
 */
export function markKnown(language, word) {
    // TODO: Implement actual storage
    console.log(`Marking ${word} as known for ${language}`);
}