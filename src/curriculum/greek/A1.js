/**
 * Greek A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/greek/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const GREEK_A1 = {
    "level": "A1",
    "language": "el",
    "cefr": "A1",
    "grammar": [
        "gender_o_i_to",
        "present_tense",
        "cases_intro_nom_acc"
    ],
    "grammarDetails": [
        {
            "id": "gender_o_i_to",
            "name": "Gender (ο/η/το)",
            "tip": "Three genders: masculine (ο), feminine (η), neuter (το). Articles and adjectives must agree. Learn noun with its article."
        },
        {
            "id": "present_tense",
            "name": "Present Tense",
            "tip": "Regular verbs: stem + personal endings. Example: \"γράφω\" (I write), \"γράφεις\" (you write), \"γράφει\" (he/she writes), \"γράφουμε\" (we write), \"γράφετε\" (you pl. write), \"γράφουν\" (they write)."
        },
        {
            "id": "cases_intro_nom_acc",
            "name": "Cases Introduction (Nominative/Accusative)",
            "tip": "Nominative case for subject, accusative for direct object. Articles change: ο -> τον (masculine), η -> την (feminine), το -> το (neuter)."
        }
    ],
    "vocab": [
        {
            "word": "γεια",
            "translation": "hello",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "ευχαριστώ",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "ναι",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "όχι",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "νερό",
            "translation": "water",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "ψωμί",
            "translation": "bread",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "σπίτι",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "φίλος",
            "translation": "friend",
            "freq": "high",
            "theme": "social"
        }
    ],
    "vocabThemes": [
        "greetings",
        "politeness",
        "basics",
        "food",
        "home",
        "social"
    ],
    "phonemes": [
        "Greek consonants (γ/χ/ξ/ψ)",
        "double consonants",
        "stress marks"
    ],
    "phonemeDetails": [
        {
            "char": "γ/χ/ξ/ψ",
            "name": "Greek consonants (γ/χ/ξ/ψ)",
            "tip": "Gamma (γ) is voiced velar fricative [ɣ]. Chi (χ) is voiceless velar fricative [x]. Xi (ξ) = [ks]. Psi (ψ) = [ps].",
            "practice": "Say \"γάλα\" (milk), \"χέρι\" (hand), \"ξένος\" (foreigner), \"ψωμί\" (bread)."
        },
        {
            "char": "ππ/ττ/κκ etc",
            "name": "double consonants",
            "tip": "Geminate consonants are pronounced longer and with more tension. Distinguish: \"καλά\" (well) vs \"καλλά\" (not a word).",
            "practice": "Practice \"αλλά\" (but) vs \"αλά\" (salt), \"έλληνας\" (Greek) vs \"έληνας\" (not a word)."
        },
        {
            "char": "΄",
            "name": "stress marks",
            "tip": "Greek uses acute accent (΄) to mark stressed syllable. Stress can change meaning: \"πολύ\" (much) vs \"πολύ\" (very). Must be pronounced correctly.",
            "practice": "Listen to \"παπάς\" (priest) vs \"παππάς\" (priest with double p), \"νόμος\" (law) vs \"νομός\" (prefecture)."
        }
    ],
    "pragmatics": "Formal \"εσείς\" vs informal \"εσύ\". Use \"παρακαλώ\" for please and you're welcome. Hand gestures are common. Maintain eye contact.",
    "orthography": "Greek",
    "version": "2.0"
};

export default GREEK_A1;