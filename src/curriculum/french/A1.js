/**
 * French A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/french/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const FRENCH_A1 = {
    "level": "A1",
    "language": "fr",
    "cefr": "A1",
    "grammar": [
        "etre_avoir",
        "definite_articles",
        "negation_ne_pas"
    ],
    "grammarDetails": [
        {
            "id": "etre_avoir",
            "name": "Être and Avoir (To Be and To Have)",
            "tip": "Être (to be): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Avoir (to have): j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. These are the two most important irregular verbs."
        },
        {
            "id": "definite_articles",
            "name": "Definite Articles (le, la, l’, les)",
            "tip": "Use \"le\" for masculine singular, \"la\" for feminine singular, \"l’\" before vowel sounds, \"les\" for plural. Articles agree in gender and number with the noun."
        },
        {
            "id": "negation_ne_pas",
            "name": "Negation with ne…pas",
            "tip": "Place \"ne\" before the verb and \"pas\" after it. In spoken French, \"ne\" is often dropped: \"Je ne sais pas\" → \"Je sais pas\"."
        }
    ],
    "vocab": [
        {
            "word": "bonjour",
            "translation": "hello / good day",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "merci",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "oui",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "non",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "s'il vous plaît",
            "translation": "please",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "au revoir",
            "translation": "goodbye",
            "freq": "high",
            "theme": "greetings"
        },
        {
            "word": "maison",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "nourriture",
            "translation": "food",
            "freq": "high",
            "theme": "food"
        }
    ],
    "vocabThemes": [
        "greetings",
        "politeness",
        "basics",
        "home",
        "food"
    ],
    "phonemes": [
        "Nasal vowels (on/an/in/un)",
        "Liaison (linking words)",
        "Uvular r (French r)"
    ],
    "phonemeDetails": [
        {
            "char": "nasal_vowels",
            "name": "Nasal vowels (on/an/in/un)",
            "tip": "Pronounce vowel while letting air escape through nose. Lower soft palate to open nasal passage.",
            "practice": "Practice with \"bon\" (good), \"vin\" (wine), \"un\" (one)."
        },
        {
            "char": "liaison",
            "name": "Liaison (linking words)",
            "tip": "Pronounce normally silent final consonant when next word begins with a vowel.",
            "practice": "Practice \"les amis\" (the friends) pronounced \"lez amis\"."
        },
        {
            "char": "uvular_r",
            "name": "Uvular r (French r)",
            "tip": "Produced by vibrating the uvula (back of throat). Not a rolled tongue tip.",
            "practice": "Gargle gently to feel the uvula vibration, then add voice."
        }
    ],
    "pragmatics": "Use \"vous\" for formal situations (strangers, elders, professionals). Use \"tu\" for friends, family, and peers. Always greet with \"bonjour\" before starting a conversation.",
    "orthography": null,
    "version": "2.0"
};

export default FRENCH_A1;