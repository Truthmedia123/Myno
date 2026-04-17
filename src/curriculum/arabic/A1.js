/**
 * Arabic A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/arabic/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ARABIC_A1 = {
    "level": "A1",
    "language": "ar",
    "cefr": "A1",
    "grammar": [
        "root_system_intro",
        "sun_moon_letters",
        "definite_article_al"
    ],
    "grammarDetails": [
        {
            "id": "root_system_intro",
            "name": "Root system introduction",
            "tip": "Most Arabic words derive from a three‑letter root that conveys a core meaning. For example, ك‑ت‑ب (k‑t‑b) relates to writing."
        },
        {
            "id": "sun_moon_letters",
            "name": "Sun and moon letters (assimilation)",
            "tip": "When the definite article \"ال\" (al) is followed by a \"sun letter\", the \"l\" assimilates and the sun letter is doubled. Moon letters keep the \"l\" sound."
        },
        {
            "id": "definite_article_al",
            "name": "Definite article ال (al)",
            "tip": "Prefix \"ال\" makes a noun definite. It is attached directly to the noun, e.g., \"كتاب\" (a book) → \"الكتاب\" (the book)."
        }
    ],
    "vocab": [
        {
            "word": "مرحبا",
            "translation": "hello",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "شكرا",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "نعم",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "لا",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "من فضلك",
            "translation": "please",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "مع السلامة",
            "translation": "goodbye",
            "freq": "high",
            "theme": "greetings"
        },
        {
            "word": "بيت",
            "translation": "house / home",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "طعام",
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
        "Emphatic consonants (ص/ض/ط/ظ)",
        "Guttural sounds (ع/غ/خ/ح)"
    ],
    "phonemeDetails": [
        {
            "char": "ص/ض/ط/ظ",
            "name": "Emphatic consonants (ص/ض/ط/ظ)",
            "tip": "Pronounce consonant while constricting pharynx (back of throat). Creates \"dark\" quality.",
            "practice": "Practice \"صاد\" (truthful) vs \"ساد\" (dominated)."
        },
        {
            "char": "ع/غ/خ/ح",
            "name": "Guttural sounds (ع/غ/خ/ح)",
            "tip": "ع: voiced pharyngeal fricative (deep gargle). غ: voiced uvular fricative (French \"r\"). خ: voiceless uvular (German \"ch\"). ح: voiceless pharyngeal.",
            "practice": "Practice \"عَين\" (eye) vs \"أين\" (where)."
        }
    ],
    "pragmatics": "Use formal Arabic (الفصحى) in writing and formal speech. Dialects vary by region. Greet with \"السلام عليكم\" (peace be upon you) and reply \"وعليكم السلام\". Right hand for eating/giving.",
    "orthography": null,
    "version": "2.0"
};

export default ARABIC_A1;