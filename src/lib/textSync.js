/**
 * Text synchronization utilities for display and TTS.
 * Ensures beginners see and hear the same content, with optional truncation
 * and expandable responses.
 * @module textSync
 */

/**
 * Remove emojis and other non‑speech characters from text.
 * @param {string} text - Raw input text
 * @returns {string} Cleaned text suitable for TTS
 */
export function stripEmojis(text) {
    if (!text || typeof text !== 'string') return '';
    // Remove emojis and pictographs (Unicode ranges)
    return text.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
    ).replace(/\s+/g, ' ').trim();
}

/**
 * Truncate text to a maximum number of words, preserving sentence boundaries when possible.
 * @param {string} text - Input text
 * @param {number} maxWords - Maximum words allowed (default 25)
 * @returns {string} Truncated text
 */
export function truncateToWords(text, maxWords = 25) {
    if (!text || typeof text !== 'string') return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;

    // Try to cut at a sentence boundary (., !, ?, 。, ！, ？)
    const truncated = words.slice(0, maxWords).join(' ');
    const sentenceEnd = /[.!?。！？]$/;
    if (sentenceEnd.test(truncated)) {
        return truncated;
    }
    // Otherwise add ellipsis
    return truncated + ' […]';
}

/**
 * Prepare a response for synchronized display and TTS.
 * @param {string} rawReply - Raw AI reply text
 * @param {Object} options - Configuration options
 * @param {number} [options.maxLength=25] - Maximum word count for truncation
 * @param {string} [options.targetLang='en'] - Target language (currently unused, reserved)
 * @param {boolean} [options.showExpand=true] - Whether to allow expansion
 * @returns {Object} Synchronized text objects
 * @property {string} displayText - Text to show in UI (may have "[…]" marker)
 * @property {string} ttsText - Text to send to TTS (cleaned, truncated, no markers)
 * @property {boolean} isTruncated - Whether the text was truncated
 */
export function prepareResponse(rawReply, options = {}) {
    const {
        maxLength = 25,
        targetLang = 'en',
        showExpand = true
    } = options;

    if (!rawReply || typeof rawReply !== 'string') {
        return {
            displayText: '',
            ttsText: '',
            isTruncated: false
        };
    }

    // Step 1: Clean for TTS
    const cleaned = stripEmojis(rawReply);

    // Step 2: Truncate for both display and TTS
    const truncated = truncateToWords(cleaned, maxLength);
    const isTruncated = cleaned.length > truncated.length ||
        (cleaned.split(/\s+/).length > maxLength && truncated.endsWith('[…]'));

    // Step 3: Determine display text
    let displayText = truncated;
    if (isTruncated && showExpand && !truncated.endsWith('[…]')) {
        // If we truncated at word boundary but not at sentence end, add marker
        displayText = truncated + ' […]';
    }

    // Step 4: TTS text should never contain the "[…]" marker
    const ttsText = truncated.endsWith('[…]')
        ? truncated.slice(0, -3).trim()
        : truncated;

    return {
        displayText,
        ttsText,
        isTruncated
    };
}

/**
 * Expand a truncated response to its full cleaned version.
 * @param {string} fullReply - Original full reply (before truncation)
 * @returns {string} Full cleaned text ready for re‑speak
 */
export function expandResponse(fullReply) {
    if (!fullReply || typeof fullReply !== 'string') return '';
    return stripEmojis(fullReply).trim();
}

/**
 * Check if a text needs expansion (i.e., was truncated).
 * @param {string} displayText - The display text shown in UI
 * @returns {boolean} True if text ends with "[…]" marker
 */
export function needsExpansion(displayText) {
    return displayText?.endsWith('[…]') || false;
}