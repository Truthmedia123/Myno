/**
 * Portuguese A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/portuguese/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const PORTUGUESE_A1 = {
    level: 'A1',
    language: 'pt',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['ser_estar', 'present_tense', 'noun_gender'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'ser_estar',
            name: 'Ser vs Estar (To Be)',
            tip: 'Use "ser" for permanent characteristics (identity, origin, profession). Use "estar" for temporary states (location, mood, condition). Conjugation: ser - sou, és, é, somos, sois, são; estar - estou, estás, está, estamos, estais, estão.'
        },
        {
            id: 'present_tense',
            name: 'Present Tense Regular Verbs',
            tip: 'Remove -ar, -er, -ir endings and add: -ar: -o, -as, -a, -amos, -ais, -am; -er: -o, -es, -e, -emos, -eis, -em; -ir: -o, -es, -e, -imos, -is, -em.'
        },
        {
            id: 'noun_gender',
            name: 'Noun Gender (o/a)',
            tip: 'Portuguese nouns are masculine (o) or feminine (a). Most nouns ending in -o are masculine, -a are feminine. Plural: -os for masculine, -as for feminine.'
        }
    ],
    vocab: [
        {
            word: 'olá',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'obrigado',
            translation: 'thank you (masc)',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'sim',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'não',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'água',
            translation: 'water',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'pão',
            translation: 'bread',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'casa',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'amigo',
            translation: 'friend',
            freq: 'high',
            theme: 'people'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food_drink', 'home', 'people'],
    phonemes: ["Nasal vowels (ão/õe)", "'lh' sound", "'r' sound (gutural)"],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'ão/õe',
            name: 'Nasal vowels',
            tip: 'Air flows through nose and mouth simultaneously. "ão" as in "pão" (bread), "õe" as in "põe" (puts).',
            practice: 'Say "pão, mão, não" while pinching nose to feel nasal resonance.'
        },
        {
            char: 'lh',
            name: 'Palatal lateral',
            tip: 'Similar to "lli" in "million". Place tongue against hard palate, let air flow around sides.',
            practice: 'Practice "filho" (son), "mulher" (woman), "trabalho" (work).'
        },
        {
            char: 'r',
            name: 'Gutural r',
            tip: 'Pronounced in back of throat (uvular or guttural). Stronger at word beginning, softer between vowels.',
            practice: 'Say "rato" (mouse), "carro" (car), "porta" (door).'
        }
    ],
    pragmatics: 'Use "você" for informal address, "o senhor/a senhora" for formal. Greet with "bom dia" (good morning), "boa tarde" (good afternoon), "boa noite" (good evening/night).',
    orthography: null
};

export default PORTUGUESE_A1;