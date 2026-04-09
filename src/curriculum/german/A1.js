/**
 * German A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/german/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const GERMAN_A1 = {
    level: 'A1',
    language: 'de',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['noun_gender', 'verb_conjugation', 'formal_sie'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'noun_gender',
            name: 'Noun Gender (der/die/das)',
            tip: 'German nouns have three genders: masculine (der), feminine (die), neuter (das). Learn each noun with its definite article. Common patterns: -ung, -heit, -keit are feminine; -chen, -lein are neuter.'
        },
        {
            id: 'verb_conjugation',
            name: 'Verb Conjugation (Present Tense)',
            tip: 'Regular verbs: remove -en ending and add -e, -st, -t, -en, -t, -en. Example: lernen (to learn) -> ich lerne, du lernst, er/sie/es lernt, wir lernen, ihr lernt, sie lernen.'
        },
        {
            id: 'formal_sie',
            name: 'Formal "Sie" (You)',
            tip: 'Use "Sie" (capitalized) for formal address (strangers, elders, professionals). Conjugate verbs as 3rd person plural. Informal "du" is for friends, family, and peers.'
        }
    ],
    vocab: [
        {
            word: 'hallo',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'danke',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'ja',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'nein',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'wasser',
            translation: 'water',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'brot',
            translation: 'bread',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'haus',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'freund',
            translation: 'friend',
            freq: 'high',
            theme: 'people'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food_drink', 'home', 'people'],
    phonemes: ['Umlauts (ä/ö/ü)', "'ch' sound (ach/ich)", "'r' sound (uvular)"],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'ä/ö/ü',
            name: 'Umlauts',
            tip: 'Front rounded vowels. Practice: ä as in "Mädchen" (girl), ö as in "schön" (beautiful), ü as in "über" (over).',
            practice: 'Say "Mädchen, schön, über" slowly, focusing on lip rounding.'
        },
        {
            char: 'ch',
            name: 'Velar/Palatal fricative',
            tip: 'Two sounds: "ach" (after a, o, u) is velar like Scottish "loch"; "ich" (after i, e, ä, ö, ü) is palatal like "huge".',
            practice: 'Practice "Bach" (stream) vs "ich" (I).'
        },
        {
            char: 'r',
            name: 'Uvular r',
            tip: 'Produced in back of throat (uvular), not with tongue tip. Similar to French r but less fricative.',
            practice: 'Gargle gently to feel uvula vibration, then say "rot" (red).'
        }
    ],
    pragmatics: 'Use formal "Sie" with strangers, elders, and in professional settings. Informal "du" is for friends and peers. Always greet with "Guten Tag" (good day) during daytime.',
    orthography: null
};

export default GERMAN_A1;