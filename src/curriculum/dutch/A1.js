/**
 * Dutch A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/dutch/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const DUTCH_A1 = {
    "level": "A1",
    "language": "nl",
    "cefr": "A1",
    "grammar": [
        "noun_gender_de_het",
        "v2_word_order",
        "present_tense"
    ],
    "grammarDetails": [
        {
            "id": "noun_gender_de_het",
            "name": "Noun Gender (de/het)",
            "tip": "Learn each noun with its article: \"de\" for common gender (about 75% of nouns), \"het\" for neuter gender. No simple rule, must memorize."
        },
        {
            "id": "v2_word_order",
            "name": "V2 Word Order",
            "tip": "In main clauses, the finite verb is always in second position. Example: \"Ik eet een appel\" (I eat an apple), \"Vandaag eet ik een appel\" (Today eat I an apple)."
        },
        {
            "id": "present_tense",
            "name": "Present Tense",
            "tip": "Regular verbs: stem + ending. For ik: stem, for jij/hij/zij/het/U: stem + t, for wij/jullie/zij: stem + en. Example: \"werken\" -> ik werk, jij werkt, wij werken\"."
        }
    ],
    "vocab": [
        {
            "word": "hallo",
            "translation": "hello",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "dank",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "ja",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "nee",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "water",
            "translation": "water",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "brood",
            "translation": "bread",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "huis",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "vriend",
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
        "guttural g",
        "ui/ij diphthongs",
        "schwa reduction"
    ],
    "phonemeDetails": [
        {
            "char": "g/ɣ",
            "name": "guttural g",
            "tip": "Dutch G is a voiced velar fricative, produced in the back of the throat. In the north it's harder (like clearing throat), in the south softer.",
            "practice": "Practice \"goed\" (good), \"geen\" (none), \"graag\" (gladly)."
        },
        {
            "char": "ui/ɛy/",
            "name": "ui/ij diphthongs",
            "tip": "Unique Dutch sound. Start with \"a\" as in \"cat\", glide to \"ee\" with rounded lips. Not found in English.",
            "practice": "Say \"huis\" (house), \"muis\" (mouse), \"bruin\" (brown)."
        },
        {
            "char": "ə",
            "name": "schwa reduction",
            "tip": "Unstressed vowels often reduce to schwa (ə), a neutral mid-central vowel. Common in endings like -en, -e.",
            "practice": "Listen to \"de\" (the), \"een\" (a), \"werken\" (to work)."
        }
    ],
    "pragmatics": "Direct communication. Use \"u\" for formal situations (older people, strangers, professionals). Use \"jij\" for friends, family, and peers. Direct eye contact is expected.",
    "orthography": null,
    "version": "2.0"
};

export default DUTCH_A1;