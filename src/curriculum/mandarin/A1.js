/**
 * Mandarin A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/mandarin/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const MANDARIN_A1 = {
    level: 'A1',
    language: 'zh',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['svo_word_order', 'measure_words', 'negation_bu'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'svo_word_order',
            name: 'SVO (Subject‑Verb‑Object) word order',
            tip: 'Mandarin follows strict Subject‑Verb‑Object order. No verb conjugation for person or tense.'
        },
        {
            id: 'measure_words',
            name: 'Measure words (classifiers)',
            tip: 'Use a measure word between a number/demonstrative and a noun. For example, "一个人" (yí gè rén) – one person, where "个" is the general measure word.'
        },
        {
            id: 'negation_bu',
            name: 'Negation with 不 (bù)',
            tip: 'Place 不 before the verb to negate present/future actions. For past negation, use 没 (méi). 不 is also used to negate adjectives.'
        }
    ],
    vocab: [
        {
            word: '你好',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: '谢谢',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: '是',
            translation: 'yes / to be',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: '不',
            translation: 'no / not',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: '请',
            translation: 'please',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: '再见',
            translation: 'goodbye',
            freq: 'high',
            theme: 'greetings'
        },
        {
            word: '家',
            translation: 'home / house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: '食物',
            translation: 'food',
            freq: 'high',
            theme: 'food'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'home', 'food'],
    phonemes: ['tones', 'retroflex_finals'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'tones',
            name: 'Tones (4 tones + neutral)',
            tip: '1st: high level (mā). 2nd: rising (má). 3rd: dipping (mǎ). 4th: falling (mà). Neutral: light.',
            practice: 'Practice "mā (mother) vs má (hemp) vs mǎ (horse) vs mà (scold)".'
        },
        {
            char: 'retroflex_finals',
            name: 'Retroflex finals (-r)',
            tip: 'Curl tongue tip back slightly during final vowel, adding "r"‑like coloration (erhua).',
            practice: 'Practice "huār" (flower) vs "huā" (flower).'
        }
    ],
    pragmatics: 'Use titles + surname (e.g., 王先生) for formal address. Direct questions about age or salary are common but can be avoided with strangers. A slight nod is polite.',
    orthography: null
};

export default MANDARIN_A1;