// src/curriculum/english/A1.js
/**
 * English A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/english/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ENGLISH_A1 = {
    level: 'A1',
    language: 'en',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['to_be', 'articles_a_an_the', 'present_simple'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'to_be',
            name: 'To Be (am, is, are)',
            tip: 'Use "am" with I, "is" with he/she/it, "are" with you/we/they. Forms: I am, you are, he is, she is, it is, we are, they are.'
        },
        {
            id: 'articles_a_an_the',
            name: 'Articles (a, an, the)',
            tip: 'Use "a" before consonant sounds, "an" before vowel sounds. Use "the" for specific or known things. Example: "a cat", "an apple", "the sun".'
        },
        {
            id: 'present_simple',
            name: 'Present Simple Tense',
            tip: 'For habits, facts, and routines. Add -s/-es for he/she/it: I work, you work, he works, she works, it works, we work, they work.'
        }
    ],
    vocab: [
        {
            word: 'hello',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'thank you',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'yes',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'no',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'water',
            translation: 'water',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'bread',
            translation: 'bread',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'house',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'friend',
            translation: 'friend',
            freq: 'high',
            theme: 'social'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food', 'home', 'social'],
    phonemes: ['th sounds (voiceless/voiced)', 'r vs l', 'short/long vowels (ship/sheep)'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'θ/ð',
            name: 'TH sounds (voiceless/voiced)',
            tip: 'Voiceless TH (θ): tongue between teeth, air flows. As in "think", "thank". Voiced TH (ð): same position but with vocal vibration. As in "this", "that".',
            practice: 'Practice "think" vs "sink", "this" vs "dis".'
        },
        {
            char: 'r/l',
            name: 'R vs L distinction',
            tip: 'R: tongue curls back but doesn\'t touch roof. L: tongue tip touches alveolar ridge. Many languages confuse these sounds.',
            practice: 'Repeat "right" vs "light", "red" vs "led".'
        },
        {
            char: 'ɪ/iː',
            name: 'Short vs Long Vowels',
            tip: 'Short I (ɪ) as in "ship", "bit". Long E (iː) as in "sheep", "beat". Hold the long vowel longer.',
            practice: 'Say "ship" vs "sheep", "bit" vs "beat".'
        }
    ],
    pragmatics: 'Direct but polite communication style. Use "please" and "thank you" frequently. Maintain appropriate personal space (about an arm\'s length).',
    orthography: null
};

export default ENGLISH_A1;