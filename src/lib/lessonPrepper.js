/**
 * Micro-lesson data extractor for pre-scenario preparation.
 * Client-side, offline-capable utility for scenario warmup.
 * @module lessonPrepper
 */

import { SCENARIOS } from '../data/scenarios.js';

/**
 * Get micro-lesson data for a specific scenario.
 * @param {string} scenarioId - ID of the scenario
 * @returns {Object|null} Micro-lesson object with vocab, grammar, tip, and warmupPrompt
 */
export function getMicroLesson(scenarioId) {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);

    if (!scenario) {
        console.warn(`Scenario ${scenarioId} not found`);
        return null;
    }

    const { microLesson, title, cefr, promptTemplate } = scenario;

    // Extract warmup prompt from the scenario's prompt template
    const warmupPrompt = promptTemplate
        .replace(/\{target_language\}/g, 'the target language')
        .replace(/\{native_language\}/g, 'your native language')
        .split('\n')[0]; // Use first line as concise warmup

    return {
        ...microLesson,
        scenarioTitle: title,
        cefr,
        warmupPrompt: warmupPrompt.trim(),
        scenarioId
    };
}

/**
 * Format vocabulary array for TTS (Text-to-Speech) warmup.
 * @param {Array<string>} vocabArray - Array of vocabulary words/phrases
 * @returns {string} Formatted text for speech synthesis
 */
export function formatWarmupAudioText(vocabArray) {
    if (!vocabArray || vocabArray.length === 0) {
        return 'Practice these words.';
    }

    if (vocabArray.length === 1) {
        return `Practice: ${vocabArray[0]}.`;
    }

    const lastWord = vocabArray[vocabArray.length - 1];
    const otherWords = vocabArray.slice(0, -1);

    if (otherWords.length === 1) {
        return `Practice: ${otherWords[0]} and ${lastWord}.`;
    }

    return `Practice: ${otherWords.join(', ')}, and ${lastWord}.`;
}

/**
 * Speak text using Web Speech API with fallback.
 * @param {string} text - Text to speak
 * @param {string} language - Language code (e.g., 'en-US', 'es-ES')
 * @returns {boolean} True if speech was initiated, false if not supported
 */
export function speakText(text, language = 'en-US') {
    if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported');
        return false;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
}

/**
 * Stop any ongoing speech synthesis.
 */
export function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Get language code for speech synthesis based on language name.
 * @param {string} languageName - Common language name (e.g., 'English', 'Spanish')
 * @returns {string} Language code for SpeechSynthesis
 */
export function getLanguageCode(languageName) {
    const languageMap = {
        'english': 'en-US',
        'spanish': 'es-ES',
        'french': 'fr-FR',
        'german': 'de-DE',
        'italian': 'it-IT',
        'portuguese': 'pt-PT',
        'japanese': 'ja-JP',
        'korean': 'ko-KR',
        'chinese': 'zh-CN',
        'hindi': 'hi-IN',
        'arabic': 'ar-SA',
        'russian': 'ru-RU',
        'dutch': 'nl-NL',
        'turkish': 'tr-TR',
        'swedish': 'sv-SE',
        'greek': 'el-GR'
    };

    const normalized = languageName.toLowerCase().trim();
    return languageMap[normalized] || 'en-US';
}