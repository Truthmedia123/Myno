/**
 * Hindi A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/hindi/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const HINDI_A1 = {
    level: 'A1',
    language: 'hi',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['hona_to_be', 'postpositions', 'negation_nahin'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'hona_to_be',
            name: 'होना (to be) – present tense',
            tip: 'Conjugation: मैं हूँ (I am), तू है (you are, intimate), वह है (he/she is), हम हैं (we are), आप हैं (you are, formal), वे हैं (they are).'
        },
        {
            id: 'postpositions',
            name: 'Postpositions (के, में, से)',
            tip: 'Postpositions come after the noun, unlike English prepositions. For example, "घर में" (in the house), "दिल्ली से" (from Delhi).'
        },
        {
            id: 'negation_nahin',
            name: 'Negation with नहीं (nahī̃)',
            tip: 'Place नहीं before the verb. The verb remains in its affirmative form. For example, "मैं नहीं जाता" (I do not go).'
        }
    ],
    vocab: [
        {
            word: 'नमस्ते',
            translation: 'hello / greetings',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'धन्यवाद',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'हाँ',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'नहीं',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'कृपया',
            translation: 'please',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'अलविदा',
            translation: 'goodbye',
            freq: 'high',
            theme: 'greetings'
        },
        {
            word: 'घर',
            translation: 'house / home',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'खाना',
            translation: 'food',
            freq: 'high',
            theme: 'food'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'home', 'food'],
    phonemes: ['retroflex', 'aspirated'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'retroflex',
            name: 'Retroflex consonants (ट/ड/ण)',
            tip: 'Curl tongue tip back to touch roof of mouth (hard palate or alveolar ridge). Contrast with dental त/द/न.',
            practice: 'Practice "टमाटर" (tomato) vs "तमाटर" (incorrect).'
        },
        {
            char: 'aspirated',
            name: 'Aspirated sounds (ख/घ/छ/झ)',
            tip: 'Pronounce consonant followed by strong puff of air. Contrast with unaspirated क/ग/च/ज.',
            practice: 'Hold hand in front of mouth to feel puff for "खाना" (food) vs "कान" (ear).'
        }
    ],
    pragmatics: 'Use "आप" for formal address (strangers, elders). Use "तुम" for informal peers. "तू" is intimate/rude unless with close family. Slight head wobble can mean "yes" or "I understand".',
    orthography: null
};

export default HINDI_A1;