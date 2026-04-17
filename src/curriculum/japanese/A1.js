/**
 * Japanese A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/japanese/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const JAPANESE_A1 = {
    "level": "A1",
    "language": "ja",
    "cefr": "A1",
    "grammar": [
        "particles_wa_ga",
        "desu_masu",
        "negation_nai"
    ],
    "grammarDetails": [
        {
            "id": "particles_wa_ga",
            "name": "Particles は (wa) and が (ga)",
            "tip": "は (wa) marks the topic of the sentence. が (ga) marks the subject. Often は is used for known information, が for new information."
        },
        {
            "id": "desu_masu",
            "name": "Polite forms です (desu) and ます (masu)",
            "tip": "です is used with nouns and adjectives to make them polite. ます is the polite ending for verbs. Both are essential for polite speech."
        },
        {
            "id": "negation_nai",
            "name": "Negation with ない (nai)",
            "tip": "To make a verb negative, replace the ます form with ません, or use the plain negative form ない. Adjectives become くない."
        }
    ],
    "vocab": [
        {
            "word": "こんにちは",
            "translation": "hello / good afternoon",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "ありがとう",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "はい",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "いいえ",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "お願いします",
            "translation": "please",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "さようなら",
            "translation": "goodbye",
            "freq": "high",
            "theme": "greetings"
        },
        {
            "word": "家",
            "translation": "house / home",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "食べ物",
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
        "Pitch accent patterns",
        "'r' sound (between r and l)"
    ],
    "phonemeDetails": [
        {
            "char": "¹/²",
            "name": "Pitch accent patterns",
            "tip": "Raise pitch on accented syllable; other syllables lower. Contrast is relative, not absolute.",
            "practice": "Practice \"はし\" (hashi) meaning \"bridge\" (high‑low) vs \"はし\" (hashi) meaning \"chopsticks\" (low‑high)."
        },
        {
            "char": "らりるれろ",
            "name": "'r' sound (between r and l)",
            "tip": "Light tap of tongue against alveolar ridge. Not rolled like Spanish \"rr\", not lateral like English \"l\".",
            "practice": "Repeat \"らりるれろ\" (ra ri ru re ro) quickly."
        }
    ],
    "pragmatics": "Use polite forms (です・ます) with strangers, elders, and superiors. Casual forms are for close friends and family. Bowing is common but not required in speech.",
    "orthography": null,
    "version": "2.0"
};

export default JAPANESE_A1;