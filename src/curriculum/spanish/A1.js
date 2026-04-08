/**
 * Spanish A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/spanish/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const SPANISH_A1 = {
    level: 'A1',
    language: 'es',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['present_indicative_regular', 'definite_articles', 'ser_vs_estar'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'present_indicative_regular',
            name: 'Present Indicative (Regular Verbs)',
            tip: 'Conjugate -ar, -er, -ir verbs by removing the infinitive ending and adding appropriate endings: yo -o, tú -as, él/ella -a, nosotros -amos, vosotros -áis, ellos -an.'
        },
        {
            id: 'definite_articles',
            name: 'Definite Articles (el, la, los, las)',
            tip: 'Use "el" for masculine singular, "la" for feminine singular, "los" for masculine plural, "las" for feminine plural. Match gender and number with the noun.'
        },
        {
            id: 'ser_vs_estar',
            name: 'Ser vs Estar (To Be)',
            tip: 'Use "ser" for permanent characteristics (identity, origin, profession). Use "estar" for temporary states (location, mood, condition).'
        }
    ],
    vocab: [
        {
            word: 'hola',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'gracias',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'por favor',
            translation: 'please',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'adiós',
            translation: 'goodbye',
            freq: 'high',
            theme: 'greetings'
        },
        {
            word: 'sí',
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
            word: 'casa',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'comida',
            translation: 'food',
            freq: 'high',
            theme: 'food'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'home', 'food'],
    phonemes: ['r', 'ñ', 'j'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'r',
            name: 'Alveolar trill',
            tip: 'Roll your tongue against the alveolar ridge. Practice with words like "perro" (dog) and "arroz" (rice).',
            practice: 'Repeat "erre" quickly: "rrrr".'
        },
        {
            char: 'ñ',
            name: 'Palatal nasal',
            tip: 'Similar to "ny" in "canyon". Place tongue against hard palate and let air through nose.',
            practice: 'Say "niño" (child) and "año" (year).'
        },
        {
            char: 'j',
            name: 'Voiceless velar fricative',
            tip: 'Like the "ch" in Scottish "loch". Harsh throat sound, not like English "j".',
            practice: 'Practice with "juego" (game) and "jirafa" (giraffe).'
        }
    ],
    pragmatics: 'Use "usted" for formal situations (older people, strangers, professionals). Use "tú" for friends, family, and peers. Always greet with "buenos días" (good morning) before noon.',
    orthography: null
};

export default SPANISH_A1;