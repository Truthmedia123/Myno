/**
 * Italian A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/italian/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ITALIAN_A1 = {
    "level": "A1",
    "language": "it",
    "cefr": "A1",
    "grammar": [
        "noun_gender",
        "present_tense_verbs",
        "essere_avere"
    ],
    "grammarDetails": [
        {
            "id": "noun_gender",
            "name": "Noun Gender (il/la)",
            "tip": "Italian nouns are masculine (il) or feminine (la). Most nouns ending in -o are masculine, -a are feminine. Plural: -i for masculine, -e for feminine."
        },
        {
            "id": "present_tense_verbs",
            "name": "Present Tense (-are/-ere/-ire verbs)",
            "tip": "Remove infinitive ending and add: -are: -o, -i, -a, -iamo, -ate, -ano; -ere: -o, -i, -e, -iamo, -ete, -ono; -ire: -o, -i, -e, -iamo, -ite, -ono."
        },
        {
            "id": "essere_avere",
            "name": "Essere vs Avere (To Be vs To Have)",
            "tip": "Use \"essere\" for identity, origin, characteristics. Use \"avere\" for possession, age, physical sensations. Conjugation: io sono/ho, tu sei/hai, lui/lei è/ha, noi siamo/abbiamo, voi siete/avete, loro sono/hanno."
        }
    ],
    "vocab": [
        {
            "word": "ciao",
            "translation": "hello/goodbye",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "grazie",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "sì",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "no",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "acqua",
            "translation": "water",
            "freq": "high",
            "theme": "food_drink"
        },
        {
            "word": "pane",
            "translation": "bread",
            "freq": "high",
            "theme": "food_drink"
        },
        {
            "word": "casa",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "amico",
            "translation": "friend",
            "freq": "high",
            "theme": "people"
        }
    ],
    "vocabThemes": [
        "greetings",
        "politeness",
        "basics",
        "food_drink",
        "home",
        "people"
    ],
    "phonemes": [
        "Geminates (doubled consonants)",
        "'gli' sound",
        "Open/Closed vowels"
    ],
    "phonemeDetails": [
        {
            "char": "pp/tt/cc etc",
            "name": "Geminates (doubled consonants)",
            "tip": "Doubled consonants are pronounced longer and with more tension. Distinguish: \"casa\" (house) vs \"cassa\" (cash register).",
            "practice": "Practice \"palla\" (ball) vs \"pala\" (shovel), \"notte\" (night) vs \"note\" (notes)."
        },
        {
            "char": "gli",
            "name": "'gli' sound",
            "tip": "Similar to \"lli\" in \"million\". Place tongue against hard palate and let air flow around sides.",
            "practice": "Say \"figlio\" (son), \"aglio\" (garlic), \"meglio\" (better)."
        },
        {
            "char": "e/o",
            "name": "Open/Closed vowels",
            "tip": "Italian distinguishes open and closed e/o. Open è/ò as in \"bello\" (beautiful), \"sole\" (sun). Closed é/ó as in \"perché\" (why), \"voi\" (you).",
            "practice": "Contrast \"pesca\" (peach) vs \"pesca\" (fishing), \"corso\" (course) vs \"corso\" (run)."
        }
    ],
    "pragmatics": "Use \"Lei\" for formal address (capitalized). Informal \"tu\" for friends and peers. Greet with \"buongiorno\" (good morning) before evening, \"buonasera\" after.",
    "orthography": null,
    "version": "2.0"
};

export default ITALIAN_A1;