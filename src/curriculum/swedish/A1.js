/**
 * Swedish A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/swedish/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const SWEDISH_A1 = {
    "level": "A1",
    "language": "sv",
    "cefr": "A1",
    "grammar": [
        "gender_en_ett",
        "v2_word_order",
        "present_tense",
        "definite_suffix"
    ],
    "grammarDetails": [
        {
            "id": "gender_en_ett",
            "name": "Gender (en/ett)",
            "tip": "Swedish has two genders: common (en) and neuter (ett). Must memorize with each noun. About 75% are \"en\" nouns, 25% \"ett\"."
        },
        {
            "id": "v2_word_order",
            "name": "V2 Word Order",
            "tip": "In main clauses, the finite verb is always in second position. Example: \"Jag äter ett äpple\" (I eat an apple), \"Idag äter jag ett äpple\" (Today eat I an apple)."
        },
        {
            "id": "present_tense",
            "name": "Present Tense",
            "tip": "Regular verbs: stem + -r for all persons. Example: \"tala\" (speak) -> jag talar, du talar, han/hon/den/det talar, vi talar, ni talar, de talar."
        },
        {
            "id": "definite_suffix",
            "name": "Definite Suffix",
            "tip": "Instead of separate definite article, add suffix: -en for en nouns, -et for ett nouns, -na for plural. Example: \"bil\" (car) -> \"bilen\" (the car)."
        }
    ],
    "vocab": [
        {
            "word": "hej",
            "translation": "hello",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "tack",
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
            "word": "nej",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "vatten",
            "translation": "water",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "bröd",
            "translation": "bread",
            "freq": "high",
            "theme": "food"
        },
        {
            "word": "hus",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "vän",
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
        "pitch accent (accent 1/2)",
        "sj sound (retroflex fricative)",
        "vowel length"
    ],
    "phonemeDetails": [
        {
            "char": "¹/²",
            "name": "pitch accent (accent 1/2)",
            "tip": "Accent 1: falling pitch on first syllable. Accent 2: falling‑rising pitch, often with two peaks. Changes meaning: \"anden\" (the duck) vs \"anden\" (the spirit).",
            "practice": "Listen to minimal pairs: \"tomten\" (the plot) vs \"tomten\" (Santa)."
        },
        {
            "char": "ɧ",
            "name": "sj sound (retroflex fricative)",
            "tip": "Unique Swedish sound. Like \"sh\" but with tongue curled back. Varies by dialect. Found in \"sjuk\" (sick), \"skjorta\" (shirt).",
            "practice": "Say \"sju\" (seven), \"skjuta\" (shoot), \"stjärna\" (star)."
        },
        {
            "char": "aː/a",
            "name": "vowel length",
            "tip": "Swedish distinguishes short and long vowels. Long vowels are held longer and often affect consonant length. Example: \"tak\" (roof) vs \"tack\" (thanks).",
            "practice": "Contrast \"vit\" (white) vs \"vitt\" (white neuter), \"mus\" (mouse) vs \"muss\" (mussel)."
        }
    ],
    "pragmatics": "Egalitarian tone. Use first names quickly even in professional settings. \"Ursäkta\" for excuse me. Avoid interrupting; wait for turn in conversation.",
    "orthography": null,
    "version": "2.0"
};

export default SWEDISH_A1;