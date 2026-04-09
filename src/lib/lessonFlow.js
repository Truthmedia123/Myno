/**
 * Curriculum-driven lesson flow manager.
 * Creates a state machine for turn-by-turn lesson progression.
 * @module lib/lessonFlow
 */

import { getKnownVocab } from './knownVocab.js';

/**
 * @typedef {Object} LessonStep
 * @property {'vocab'|'grammar'|'phoneme'} type
 * @property {string} target - The target word, grammar rule, or phoneme
 * @property {boolean} known - Whether the user has demonstrated knowledge
 * @property {Object} [metadata] - Additional step-specific data
 */

/**
 * @typedef {Object} LessonFlow
 * @property {number} currentStep - Index of current step (0-based)
 * @property {LessonStep[]} steps - Array of lesson steps
 * @property {Function} nextStep - Advance to next step
 * @property {Function} markKnown - Mark a word as known
 * @property {Function} getFocus - Get current focus for prompt builder
 * @property {Function} getProgress - Get completion percentage
 */

/**
 * Creates a lesson flow from syllabus and learning goal.
 * @param {Object} syllabus - Curriculum syllabus object
 * @param {string} learningGoalId - ID of learning goal to focus on
 * @returns {LessonFlow}
 */
export function createLessonFlow(syllabus, learningGoalId) {
    // Guard against undefined or invalid syllabus
    if (!syllabus || !syllabus.vocab) {
        console.warn('[lessonFlow] Invalid syllabus, returning minimal flow');
        return {
            steps: [],
            currentStep: null,
            nextStep: () => null,
            getFocus: () => null,
            getProgress: () => 0,
            markKnown: () => { },
            advance: () => { }
        };
    }

    // Extract vocabulary, grammar, and phonemes from syllabus
    const vocab = syllabus.vocab || [];
    const grammar = syllabus.grammarDetails || [];
    const phonemes = syllabus.phonemeDetails || [];

    // Get user's known vocabulary
    const knownWords = getKnownVocab(syllabus.language) || [];

    // Build steps array: mix of vocab, grammar, and phonemes
    const steps = [];

    // Add vocabulary steps (prioritize unknown words)
    vocab.forEach(item => {
        if (!knownWords.includes(item.word)) {
            steps.push({
                type: 'vocab',
                target: item.word,
                known: false,
                metadata: {
                    translation: item.translation,
                    theme: item.theme,
                    frequency: item.freq
                }
            });
        }
    });

    // Add grammar steps
    grammar.forEach(item => {
        steps.push({
            type: 'grammar',
            target: item.id,
            known: false,
            metadata: {
                name: item.name,
                tip: item.tip
            }
        });
    });

    // Add phoneme steps
    phonemes.forEach(item => {
        steps.push({
            type: 'phoneme',
            target: item.char,
            known: false,
            metadata: {
                name: item.name,
                tip: item.tip,
                practice: item.practice
            }
        });
    });

    // Shuffle steps for variety but ensure some structure
    const shuffledSteps = shuffleWithPriority(steps);

    let currentStepIndex = 0;

    return {
        get currentStep() {
            return currentStepIndex;
        },

        get steps() {
            return shuffledSteps;
        },

        /**
         * Advance to the next step in the lesson.
         * @returns {boolean} True if there is a next step, false if lesson complete
         */
        nextStep() {
            if (currentStepIndex < shuffledSteps.length - 1) {
                currentStepIndex++;
                return true;
            }
            return false;
        },

        /**
         * Mark a word as known by the user.
         * @param {string} word - The word to mark as known
         */
        markKnown(word) {
            const step = shuffledSteps[currentStepIndex];
            if (step && step.type === 'vocab' && step.target === word) {
                step.known = true;
            }
            // Also update the known vocab storage
            if (!knownWords.includes(word)) {
                knownWords.push(word);
                // Note: In a real implementation, this would call a setter
                // For now, we rely on getKnownVocab to be updated elsewhere
            }
        },

        /**
         * Get current focus information for prompt builder.
         * @returns {Object} Focus object with step details
         */
        getFocus() {
            if (currentStepIndex >= shuffledSteps.length) {
                return { type: 'review', target: null };
            }

            const step = shuffledSteps[currentStepIndex];
            const knownVocabList = getKnownVocab(syllabus.language) || [];

            return {
                type: step.type,
                target: step.target,
                metadata: step.metadata,
                knownWords: knownVocabList,
                phonemeTip: step.type === 'phoneme' ? step.metadata.tip : null,
                grammarTip: step.type === 'grammar' ? step.metadata.tip : null
            };
        },

        /**
         * Get lesson completion percentage.
         * @returns {number} Percentage (0-100)
         */
        getProgress() {
            if (shuffledSteps.length === 0) return 100;
            const completed = shuffledSteps.filter(s => s.known).length;
            return Math.round((completed / shuffledSteps.length) * 100);
        }
    };
}

/**
 * Shuffle array with priority: ensure first 3 steps are one of each type if possible.
 * @param {Array} array - Steps array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleWithPriority(array) {
    if (array.length <= 3) return [...array];

    // Separate by type
    const vocabSteps = array.filter(s => s.type === 'vocab');
    const grammarSteps = array.filter(s => s.type === 'grammar');
    const phonemeSteps = array.filter(s => s.type === 'phoneme');

    const result = [];

    // Try to add one of each type at the beginning
    if (vocabSteps.length > 0) result.push(vocabSteps[0]);
    if (grammarSteps.length > 0) result.push(grammarSteps[0]);
    if (phonemeSteps.length > 0) result.push(phonemeSteps[0]);

    // Add remaining steps, shuffling within each type
    const remaining = [
        ...vocabSteps.slice(1),
        ...grammarSteps.slice(1),
        ...phonemeSteps.slice(1)
    ];

    // Fisher-Yates shuffle for remaining steps
    for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }

    result.push(...remaining);
    return result;
}

/**
 * Generate scaffolded reply suggestions based on current lesson focus.
 * @param {Object} focus - Current focus from getFocus()
 * @param {Object} syllabus - Curriculum syllabus
 * @returns {string[]} Array of A1-safe response suggestions
 */
export function generateScaffoldedReplies(focus, syllabus) {
    const suggestions = [];
    const knownWords = focus?.knownWords || [];
    const defaultFallbackReply = "Tell me more.";

    // Null safety: if syllabus is missing vocab, return fallback
    if (!syllabus?.vocab) {
        return [defaultFallbackReply, "Give me an example.", "What should I learn next?"];
    }

    if (focus?.type === 'vocab') {
        const word = focus.target || 'this word';
        const translation = focus.metadata?.translation || 'something';

        suggestions.push(
            `What is ${translation}?`,
            `Use "${word}" in a sentence.`,
            `Give me an example with "${word}".`
        );
    } else if (focus?.type === 'grammar') {
        const ruleName = focus.metadata?.name || 'this grammar';

        suggestions.push(
            `Explain ${ruleName}.`,
            `Give me an example.`,
            `Let me practice ${ruleName}.`
        );
    } else if (focus?.type === 'phoneme') {
        const phonemeName = focus.metadata?.name || 'this sound';

        suggestions.push(
            `How do I pronounce ${phonemeName}?`,
            `Give me a practice word.`,
            `Let me try ${phonemeName}.`
        );
    } else {
        // Default suggestions for review or unknown focus
        const vocab = syllabus.vocab || [];
        if (vocab.length > 0) {
            const randomWord = vocab[Math.floor(Math.random() * vocab.length)].word;
            suggestions.push(
                `Tell me about "${randomWord}".`,
                `What should I learn next?`,
                `Give me a challenge.`
            );
        }
    }

    // Ensure we have at least 2 suggestions
    while (suggestions.length < 2) {
        suggestions.push(defaultFallbackReply, "Give me an example.");
    }

    // Limit to 3 suggestions max
    return suggestions.slice(0, 3);
}