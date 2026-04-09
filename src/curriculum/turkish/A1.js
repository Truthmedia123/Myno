// src/curriculum/turkish/A1.js
/**
 * Turkish A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/turkish/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const TURKISH_A1 = {
    level: 'A1',
    language: 'tr',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['vowel_harmony', 'agglutination_intro', 'present_continuous_iyor'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'vowel_harmony',
            name: 'Vowel Harmony',
            tip: 'Suffix vowels must match the preceding vowel\'s front/back and rounded/unrounded quality. Front vowels: e, i, ö, ü. Back vowels: a, ı, o, u.'
        },
        {
            id: 'agglutination_intro',
            name: 'Agglutination (Suffixes)',
            tip: 'Turkish adds suffixes to root words instead of using separate words. Example: "ev" (house) + "de" (in) = "evde" (in the house).'
        },
        {
            id: 'present_continuous_iyor',
            name: 'Present Continuous (-iyor)',
            tip: 'Form: verb stem + -iyor + personal suffix. Example: "gelmek" (to come) -> "geliyorum" (I am coming). Note vowel harmony affects suffix.'
        }
    ],
    vocab: [
        {
            word: 'merhaba',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'teşekkür',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'evet',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'hayır',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'su',
            translation: 'water',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'ekmek',
            translation: 'bread',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'ev',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'arkadaş',
            translation: 'friend',
            freq: 'high',
            theme: 'social'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food', 'home', 'social'],
    phonemes: ['vowel harmony (front/back)', 'soft ğ (yumuşak ge)', 'dotted/dotless i'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'a/e/ı/i/o/ö/u/ü',
            name: 'Vowel Harmony (Front/Back)',
            tip: 'Turkish has 8 vowels. Front: e, i, ö, ü. Back: a, ı, o, u. Suffixes change according to vowel harmony rules.',
            practice: 'Practice "ev" (house) -> "eve" (to house) vs "okul" (school) -> "okula" (to school).'
        },
        {
            char: 'ğ',
            name: 'Soft Ğ (Yumuşak Ge)',
            tip: 'Silent letter that lengthens preceding vowel. Between vowels it creates a glide. Example: "ağaç" (tree) sounds like "aaç".',
            practice: 'Say "dağ" (mountain), "eğitim" (education), "yoğurt" (yogurt).'
        },
        {
            char: 'ı/i',
            name: 'Dotted vs Dotless I',
            tip: 'Dotted i (i) is like English "ee". Dotless ı (ı) is a close back unrounded vowel, like the "e" in "roses".',
            practice: 'Contrast "kız" (girl) vs "kiz" (not a word), "ışık" (light) vs "işik" (not a word).'
        }
    ],
    pragmatics: 'Formal "siz" vs informal "sen". Add "-mısınız/-misiniz" for polite questions. Use "lütfen" (please) frequently. Elders are addressed with respect.',
    orthography: 'Latin'
};

export default TURKISH_A1;