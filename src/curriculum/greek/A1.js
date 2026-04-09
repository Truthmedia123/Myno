// src/curriculum/greek/A1.js
/**
 * Greek A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/greek/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const GREEK_A1 = {
    level: 'A1',
    language: 'el',
    // For compatibility with learningGoals.js
    cefr: 'A1',
    // Grammar as array of string IDs for learningGoals.js compatibility
    grammar: ['gender_o_i_to', 'present_tense', 'cases_intro_nom_acc'],
    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            id: 'gender_o_i_to',
            name: 'Gender (ο/η/το)',
            tip: 'Three genders: masculine (ο), feminine (η), neuter (το). Articles and adjectives must agree. Learn noun with its article.'
        },
        {
            id: 'present_tense',
            name: 'Present Tense',
            tip: 'Regular verbs: stem + personal endings. Example: "γράφω" (I write), "γράφεις" (you write), "γράφει" (he/she writes), "γράφουμε" (we write), "γράφετε" (you pl. write), "γράφουν" (they write).'
        },
        {
            id: 'cases_intro_nom_acc',
            name: 'Cases Introduction (Nominative/Accusative)',
            tip: 'Nominative case for subject, accusative for direct object. Articles change: ο -> τον (masculine), η -> την (feminine), το -> το (neuter).'
        }
    ],
    vocab: [
        {
            word: 'γεια',
            translation: 'hello',
            freq: 'very high',
            theme: 'greetings'
        },
        {
            word: 'ευχαριστώ',
            translation: 'thank you',
            freq: 'very high',
            theme: 'politeness'
        },
        {
            word: 'ναι',
            translation: 'yes',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'όχι',
            translation: 'no',
            freq: 'very high',
            theme: 'basics'
        },
        {
            word: 'νερό',
            translation: 'water',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'ψωμί',
            translation: 'bread',
            freq: 'high',
            theme: 'food'
        },
        {
            word: 'σπίτι',
            translation: 'house',
            freq: 'high',
            theme: 'home'
        },
        {
            word: 'φίλος',
            translation: 'friend',
            freq: 'high',
            theme: 'social'
        }
    ],
    // For learningGoals.js compatibility: array of unique vocab theme strings
    vocabThemes: ['greetings', 'politeness', 'basics', 'food', 'home', 'social'],
    phonemes: ['Greek consonants (γ/χ/ξ/ψ)', 'double consonants', 'stress marks'],
    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            char: 'γ/ɣ/ʝ',
            name: 'Greek Gamma',
            tip: 'Gamma (γ) is a voiced velar fricative [ɣ] like Spanish "g" in "lago". Before front vowels (e, i) it palatalizes to [ʝ].',
            practice: 'Say "γάλα" (milk), "γεια" (hello), "γλυκό" (sweet).'
        },
        {
            char: 'χ/x/ç',
            name: 'Greek Chi',
            tip: 'Chi (χ) is a voiceless velar fricative [x] like German "ch" in "Bach". Before front vowels it becomes [ç] like German "ich".',
            practice: 'Practice "χαίρετε" (greetings), "χέρι" (hand), "χρώμα" (color).'
        },
        {
            char: 'ˈ',
            name: 'Stress Marks',
            tip: 'Greek uses acute accent (΄) to mark stressed syllable. Stress can change meaning: "πολύ" (much) vs "πολύ" (very). Must be pronounced correctly.',
            practice: 'Listen to "παπάς" (priest) vs "παππάς" (priest with double p), "νόμος" (law) vs "νομός" (prefecture).'
        }
    ],
    pragmatics: 'Formal "εσείς" vs informal "εσύ". Use "παρακαλώ" for please and you\'re welcome. Hand gestures are common. Maintain eye contact.',
    orthography: 'Greek'
};

export default GREEK_A1;