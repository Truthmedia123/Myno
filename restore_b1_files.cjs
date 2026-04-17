const fs = require('fs');
const path = require('path');

// Language data from generate_b1_files.cjs
const languageData = [
    {
        name: "English",
        code: "en",
        folder: "english",
        b1Phonemes: ["short/long vowels (ship/sheep)", "schwa reduction", "vowel length"]
    },
    {
        name: "Spanish",
        code: "es",
        folder: "spanish",
        b1Phonemes: ["'j' (jota) sound", "vowel reduction"]
    },
    {
        name: "French",
        code: "fr",
        folder: "french",
        b1Phonemes: ["Uvular r (French r)", "schwa reduction"]
    },
    {
        name: "German",
        code: "de",
        folder: "german",
        b1Phonemes: ["Umlauts (ü/ö/ä)", "vowel length"]
    },
    {
        name: "Italian",
        code: "it",
        folder: "italian",
        b1Phonemes: ["'gli' sound", "Open/Closed vowels"]
    },
    {
        name: "Portuguese",
        code: "pt",
        folder: "portuguese",
        b1Phonemes: ["'r' sound (gutural)", "vowel reduction"]
    },
    {
        name: "Dutch",
        code: "nl",
        folder: "dutch",
        b1Phonemes: ["schwa reduction", "vowel length"]
    },
    {
        name: "Swedish",
        code: "sv",
        folder: "swedish",
        b1Phonemes: ["sj sound (retroflex fricative)", "vowel length"]
    },
    {
        name: "Turkish",
        code: "tr",
        folder: "turkish",
        b1Phonemes: ["soft ğ (yumuşak ge)", "dotted/dotless i"]
    },
    {
        name: "Greek",
        code: "el",
        folder: "greek",
        b1Phonemes: ["Greek consonants (γ/χ/ξ/ψ)", "double consonants"]
    },
    {
        name: "Russian",
        code: "ru",
        folder: "russian",
        b1Phonemes: ["Palatalization (soft signs)", "vowel reduction"]
    },
    {
        name: "Hindi",
        code: "hi",
        folder: "hindi",
        b1Phonemes: ["Retroflex consonants (ट/ड/ण)", "Aspirated sounds (ख/घ/छ/झ)"]
    },
    {
        name: "Japanese",
        code: "ja",
        folder: "japanese",
        b1Phonemes: ["Pitch accent patterns", "'r' sound (between r and l)"]
    },
    {
        name: "Korean",
        code: "ko",
        folder: "korean",
        b1Phonemes: ["Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)", "Tense consonants (ㅃ/ㄸ/ㄲ/ㅆ/ㅉ)"]
    },
    {
        name: "Mandarin",
        code: "zh",
        folder: "mandarin",
        b1Phonemes: ["Tones (4 tones + neutral)", "Retroflex finals (-r)"]
    },
    {
        name: "Arabic",
        code: "ar",
        folder: "arabic",
        b1Phonemes: ["Emphatic consonants (ص/ض/ط/ظ)", "Guttural sounds (ع/غ/خ/ح)"]
    }
];

// Vocabulary themes for B1 level
const VOCAB_THEMES = [
    "education",
    "technology",
    "work",
    "travel",
    "health",
    "environment",
    "culture",
    "social"
];

// Grammar concepts (same for all languages at B1 level)
const GRAMMAR_CONCEPTS = [
    "present_perfect",
    "conditionals",
    "reported_speech",
    "relative_clauses"
];

function generateB1File(lang) {
    const varName = lang.name.toUpperCase().replace(/ /g, '_') + '_B1';

    return `/**
 * ${lang.name} B1 syllabus
 * CEFR Level: B1 (Intermediate)
 * @module curriculum/${lang.folder}/B1
 */

const ${varName} = {
    level: "B1",
    language: "${lang.code}",
    cefr: "B1",
    languageCode: "${lang.code}",

    // String IDs for learningGoals.js compatibility
    grammar: ${JSON.stringify(GRAMMAR_CONCEPTS, null, 4)},

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

    vocabThemes: ${JSON.stringify(VOCAB_THEMES, null, 4)},

    phonemes: ${JSON.stringify(lang.b1Phonemes, null, 4)},

    phonemeDetails: [
        {
            key: "${lang.b1Phonemes[0] || 'phoneme1'}",
            description: "Description for ${lang.b1Phonemes[0] || 'phoneme1'}",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            key: "${lang.b1Phonemes[1] || 'phoneme2'}",
            description: "Description for ${lang.b1Phonemes[1] || 'phoneme2'}",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        }
    ],

    pragmatics: "Intermediate conversation skills: expressing opinions, describing experiences, making plans, discussing familiar topics with some fluency.",
    orthography: null,

    meta: {
        version: "1.0",
        lastUpdated: "${new Date().toISOString().split('T')[0]}",
        source: "Myno AI Tutor Curriculum",
        notes: "B1 Intermediate level syllabus"
    }
};

export default ${varName};
`;
}

console.log('Restoring B1 files to correct structure...');

let restoredCount = 0;
let errorCount = 0;

for (const lang of languageData) {
    try {
        const filePath = `src/curriculum/${lang.folder}/B1.js`;
        const content = generateB1File(lang);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Restored ${lang.name} B1.js`);
        restoredCount++;
    } catch (error) {
        console.error(`❌ Error restoring ${lang.name}:`, error.message);
        errorCount++;
    }
}

console.log(`\nRestoration complete: ${restoredCount} files restored, ${errorCount} errors.`);
console.log('All B1 files now have correct structure matching A1 format.');