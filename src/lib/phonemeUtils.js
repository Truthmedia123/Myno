/**
 * Phoneme utilities for progress tracking and TTS practice
 * @module phonemeUtils
 */

/**
 * Get phoneme status based on accuracy score
 * @param {string} phoneme - Phoneme name
 * @param {number} accuracy - Accuracy score (0-1)
 * @returns {object} Status object with color, icon, and label
 */
export function getPhonemeStatus(phoneme, accuracy) {
    if (accuracy >= 0.85) {
        return {
            status: 'mastered',
            color: 'emerald',
            icon: '✓',
            label: 'Mastered',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            ringColor: 'ring-emerald-500'
        };
    } else if (accuracy >= 0.6) {
        return {
            status: 'improving',
            color: 'amber',
            icon: '↗',
            label: 'Improving',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            ringColor: 'ring-amber-500'
        };
    } else {
        return {
            status: 'weak',
            color: 'rose',
            icon: '⚠',
            label: 'Needs Practice',
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-700',
            ringColor: 'ring-rose-500'
        };
    }
}

/**
 * Generate practice words for a specific phoneme and language
 * @param {string} phoneme - Phoneme name
 * @param {string} targetLanguage - Target language code
 * @returns {object} Practice words and audio prompt
 */
export function generatePhonemeDrill(phoneme, targetLanguage) {
    // Default practice words for common phonemes
    const DRILL_WORDS = {
        // English phonemes
        "'th' sounds (think/that)": {
            words: ["think", "that", "three", "mother", "bath"],
            tip: "Place tongue between teeth, gentle airflow"
        },
        "'v' vs 'w' (very/wary)": {
            words: ["very", "wary", "vine", "wine", "vest", "west"],
            tip: "'v' uses upper teeth on lower lip, 'w' rounds lips"
        },
        "Rolled 'r' and 'rr'": {
            words: ["perro", "carro", "arroz", "ferrocarril"],
            tip: "Tap tongue against alveolar ridge rapidly"
        },
        "Nasal vowels (on/an/in/un)": {
            words: ["bon", "an", "vin", "un", "chanson"],
            tip: "Let air flow through nose while saying vowel"
        },
        "'ch' sound (Bach/ich)": {
            words: ["Bach", "ich", "machen", "sprechen", "Töchter"],
            tip: "Back of throat friction, like clearing throat gently"
        },
        "Pitch accent patterns": {
            words: ["はし (hashi) - bridge", "はし (hashi) - chopsticks", "あめ (ame) - rain", "あめ (ame) - candy"],
            tip: "Listen for high vs low pitch on syllables"
        },
        "Tones (4 tones + neutral)": {
            words: ["mā (mother)", "má (hemp)", "mǎ (horse)", "mà (scold)"],
            tip: "Practice with hand gestures for each tone contour"
        },
        "Guttural sounds (ع/غ/خ/ح)": {
            words: ["عَين (eye)", "غَريب (strange)", "خُبز (bread)", "حَياة (life)"],
            tip: "Create friction deep in throat, not from vocal cords"
        }
    };

    // Try to find exact match
    let drill = DRILL_WORDS[phoneme];

    // Fallback: search for partial match
    if (!drill) {
        const lowerPhoneme = phoneme.toLowerCase();
        for (const [key, value] of Object.entries(DRILL_WORDS)) {
            if (lowerPhoneme.includes(key.toLowerCase().split(' ')[0])) {
                drill = value;
                break;
            }
        }
    }

    // Ultimate fallback
    if (!drill) {
        drill = {
            words: ["practice", "example", "repeat", "listen", "speak"],
            tip: "Focus on mouth position and airflow"
        };
    }

    return {
        phoneme,
        targetLanguage,
        practiceWords: drill.words,
        tip: drill.tip,
        audioPrompt: `Practice saying these words focusing on ${phoneme}. ${drill.tip}`
    };
}

/**
 * Speak a phoneme example word using Web Speech API
 * @param {string} word - Word to speak
 * @param {string} language - Language code (e.g., 'en-US', 'es-ES')
 * @returns {Promise<boolean>} Success status
 */
export function speakPhonemeExample(word, language = 'en-US') {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            resolve(false);
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = language;
        utterance.rate = 0.8; // Slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a suitable voice
        const voices = speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        utterance.onend = () => {
            resolve(true);
        };

        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            resolve(false);
        };

        // Speak
        speechSynthesis.speak(utterance);
    });
}

/**
 * Get all phonemes for a language pair from the phoneme matrix
 * @param {string} targetLanguage - Target language
 * @param {string} nativeLanguage - Native language
 * @returns {string[]} Array of phoneme names
 */
export function getPhonemesForLanguagePair(targetLanguage, nativeLanguage) {
    // This would normally import from memoryManager.js, but to avoid circular dependency
    // we'll return a simplified list based on common patterns
    const COMMON_PHONEMES = {
        English: [
            "'th' sounds (think/that)",
            "'v' vs 'w' (very/wary)",
            "Short vowels (bit vs beat)",
            "Silent letters (know/write)",
            "'r' sound",
            "Word stress patterns"
        ],
        Spanish: [
            "Rolled 'r' and 'rr'",
            "'ñ' sound (canyon)",
            "'j' (jota) sound",
            "Vowel purity (no diphthongs)",
            "Gender agreement"
        ],
        French: [
            "Nasal vowels (on/an/in/un)",
            "Silent letters",
            "Liaison (linking words)",
            "French 'r' (guttural)",
            "'u' and 'eu' vowels"
        ],
        German: [
            "'ch' sound (Bach/ich)",
            "Umlauts (ü/ö/ä)",
            "Final devoicing (d→t)",
            "Long vs short vowels",
            "Word stress (first syllable)"
        ],
        Japanese: [
            "Pitch accent patterns",
            "Long vs short vowels",
            "Moraic rhythm",
            "The 'r/l' hybrid sound"
        ]
    };

    return COMMON_PHONEMES[targetLanguage] || COMMON_PHONEMES.English;
}

/**
 * Calculate progress ring properties for SVG
 * @param {number} accuracy - Accuracy score (0-1)
 * @param {number} size - SVG size in pixels
 * @returns {object} SVG circle properties
 */
export function getProgressRingProps(accuracy, size = 80) {
    const radius = size / 2 - 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - accuracy);

    return {
        radius,
        circumference,
        strokeDashoffset,
        center: size / 2,
        strokeWidth: 6
    };
}