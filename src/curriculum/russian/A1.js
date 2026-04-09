/**
 * Russian A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/russian/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const RUSSIAN_A1 = {
    level: 'A1',
    language: 'ru',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['cases_intro', 'verb_conjugation', 'noun_gender'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'cases_intro',
            name: 'Cases Introduction (Nominative/Accusative)',
            tip: 'Nouns change endings based on grammatical function. Nominative case (subject): basic form. Accusative case (direct object): masculine animate adds -a, feminine changes -a to -u.'
        },
        {
            id: 'verb_conjugation',
            name: 'Verb Conjugation (Present Tense)',
            tip: 'Two conjugation patterns: First conjugation (-ать/-ять): -ю, -ешь, -ет, -ем, -ете, -ют. Second conjugation (-ить): -ю, -ишь, -ит, -им, -ите, -ят.'
        },
        {
            id: 'noun_gender',
            name: 'Noun Gender (Masculine/Feminine/Neuter)',
            tip: 'Masculine nouns often end in consonant or -й, feminine in -а/-я, neuter in -о/-е. Gender affects adjective endings and pronoun choice.'
        }
    ],
    vocab: [
        {
            word: 'привет',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'спасибо',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'да',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'нет',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'вода',
            translation: 'water',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'хлеб',
            translation: 'bread',
            freq: 'high',
            theme: 'food_drink'
        },
        {
            word: 'дом',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'друг',
            translation: 'friend',
            freq: 'high',
            theme: 'people'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food_drink', 'home', 'people'],
    phonemes: ["Palatalization (soft signs)", "Rolling 'r'", "Vowel reduction"],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'ь/мя/тя',
            name: 'Palatalization',
            tip: 'Soft sign (ь) indicates preceding consonant is palatalized (tongue raised toward hard palate). Changes sound quality.',
            practice: 'Contrast "мат" (checkmate) vs "мяч" (ball), "ток" (current) vs "тётя" (aunt).'
        },
        {
            char: 'р',
            name: 'Rolled r',
            tip: 'Alveolar trill, tongue tip vibrates against alveolar ridge. Similar to Spanish rolled r.',
            practice: 'Practice "рыба" (fish), "река" (river), "рука" (hand).'
        },
        {
            char: 'о/е',
            name: 'Vowel reduction',
            tip: 'Unstressed vowels are reduced: о becomes а-like, е becomes и-like. "молоко" (milk) pronounced "малако".',
            practice: 'Say "хорошо" (good) as "харашо", "телефон" (telephone) as "тилифон".'
        }
    ],
    pragmatics: 'Use formal "вы" (you plural) with strangers, elders, professionals. Informal "ты" for friends and peers. Greet with "здравствуйте" (formal) or "привет" (informal).',
    orthography: 'Cyrillic alphabet'
};

export default RUSSIAN_A1;