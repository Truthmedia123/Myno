/**
 * English B1 syllabus
 * CEFR Level: B1 (Intermediate)
 * @module curriculum/english/B1
 */

const ENGLISH_B1 = {
    level: "B1",
    language: "en",
    cefr: "B1",
    languageCode: "en",

    // String IDs for learningGoals.js compatibility
    grammar: [
    "present_perfect",
    "conditionals",
    "reported_speech",
    "relative_clauses"
],

    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            concept: "present_perfect",
            description: "Present perfect for experiences and unfinished time",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "conditionals",
            description: "First and second conditionals for real and hypothetical situations",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "reported_speech",
            description: "Reporting what someone said",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "relative_clauses",
            description: "Defining and non-defining relative clauses",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        }
    ],

    vocab: [
        {
            category: "education",
            words: ["university", "degree", "course", "lecture", "assignment", "graduation", "scholarship"],
            difficulty: "medium"
        },
        {
            category: "technology",
            words: ["software", "hardware", "application", "database", "network", "security", "algorithm"],
            difficulty: "medium"
        },
        {
            category: "work",
            words: ["colleague", "deadline", "promotion", "salary", "interview", "resume", "benefits"],
            difficulty: "medium"
        },
        {
            category: "travel",
            words: ["accommodation", "itinerary", "destination", "passport", "visa", "currency", "sightseeing"],
            difficulty: "medium"
        },
        {
            category: "health",
            words: ["symptoms", "treatment", "prevention", "nutrition", "exercise", "recovery", "wellness"],
            difficulty: "medium"
        },
        {
            category: "environment",
            words: ["pollution", "conservation", "sustainability", "recycling", "climate", "ecosystem", "biodiversity"],
            difficulty: "medium"
        },
        {
            category: "culture",
            words: ["tradition", "heritage", "custom", "festival", "art", "literature", "cuisine"],
            difficulty: "medium"
        },
        {
            category: "social",
            words: ["relationship", "community", "networking", "etiquette", "communication", "conflict", "cooperation"],
            difficulty: "medium"
        }
    ],

    vocabThemes: [
    "education",
    "technology",
    "work",
    "travel",
    "health",
    "environment",
    "culture",
    "social"
],

    phonemes: [
    "short/long vowels (ship/sheep)",
    "schwa reduction",
    "vowel length"
],

    phonemeDetails: [
        {
            key: "short/long vowels (ship/sheep)",
            description: "Description for short/long vowels (ship/sheep)",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            key: "schwa reduction",
            description: "Description for schwa reduction",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        }
    ],

    pragmatics: "Intermediate conversation skills: expressing opinions, describing experiences, making plans, discussing familiar topics with some fluency.",
    orthography: null,

    meta: {
        version: "1.0",
        lastUpdated: "2026-04-15",
        source: "Myno AI Tutor Curriculum",
        notes: "B1 Intermediate level syllabus"
    }
};

export default ENGLISH_B1;
