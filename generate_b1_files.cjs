const fs = require('fs');
const path = require('path');

// Language data from user's table - B1 phoneme keys
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
        b1Phonemes: ["vowel length", "palatalization"]
    },
    {
        name: "Turkish",
        code: "tr",
        folder: "turkish",
        b1Phonemes: ["dotted/dotless i", "consonant harmony"]
    },
    {
        name: "Greek",
        code: "el",
        folder: "greek",
        b1Phonemes: ["stress marks", "vowel length"]
    },
    {
        name: "Arabic",
        code: "ar",
        folder: "arabic",
        b1Phonemes: ["Guttural sounds (ع/غ/خ/ح)", "vowel length"]
    },
    {
        name: "Hindi",
        code: "hi",
        folder: "hindi",
        b1Phonemes: ["Aspirated sounds (ख/घ/छ/झ)", "vowel length"]
    },
    {
        name: "Japanese",
        code: "ja",
        folder: "japanese",
        b1Phonemes: ["'r' sound (between r and l)", "gemination"]
    },
    {
        name: "Korean",
        code: "ko",
        folder: "korean",
        b1Phonemes: ["Tense consonants (ㅃ/ㄸㄲ/ㅆ/ㅉ)", "vowel reduction"]
    },
    {
        name: "Mandarin",
        code: "zh",
        folder: "mandarin",
        b1Phonemes: ["Retroflex finals (-r)", "vowel reduction"]
    },
    {
        name: "Russian",
        code: "ru",
        folder: "russian",
        b1Phonemes: ["'r/l' sound", "consonant clusters"]
    }
];

// Template for B1 files
function generateB1File(lang) {
    const phonemeDetails = lang.b1Phonemes.map(phonemeKey => ({
        phonemeKey,
        difficulty: "medium",
        examples: getExamplesForPhoneme(phonemeKey)
    }));

    // Get examples from phonemeGuide if available
    function getExamplesForPhoneme(phonemeKey) {
        // Default examples based on common minimal pairs
        const defaultExamples = {
            "short/long vowels (ship/sheep)": ["ship vs sheep", "bit vs beat", "fit vs feet", "sit vs seat"],
            "schwa reduction": ["about", "sofa", "banana", "computer"],
            "vowel length": ["beat vs bit", "pool vs pull", "caught vs cot", "fool vs full"],
            "'j' (jota) sound": ["juego vs huevo", "jirafa vs gira", "ojo vs oyo"],
            "vowel reduction": ["reduction example 1", "reduction example 2", "reduction example 3"],
            "Uvular r (French r)": ["rouge", "Paris", "rare", "rire"],
            "Umlauts (ü/ö/ä)": ["über", "schön", "Mädchen", "können"],
            "'gli' sound": ["figlio", "moglie", "aglio", "famiglia"],
            "Open/Closed vowels": ["pesca (peach) vs pesca (fishing)", "vento (wind) vs vento (I sell)"],
            "'r' sound (gutural)": ["carro", "porta", "mar", "português"],
            "palatalization": ["kjol (skirt)", "tjena (hi)", "skjorta (shirt)"],
            "dotted/dotless i": ["kız vs kiz", "ışık vs işik", "sıcak vs sicak"],
            "consonant harmony": ["kitap (book) vs kitaplar (books)", "kalem (pencil) vs kalemler (pencils)"],
            "stress marks": ["πολύ (much)", "παπάς (priest)", "νόμος (law)"],
            "Guttural sounds (ع/غ/خ/ح)": ["عرب", "غرب", "خبز", "حليب"],
            "Aspirated sounds (ख/घ/छ/झ)": ["खाना", "घर", "छत", "झंडा"],
            "'r' sound (between r and l)": ["らりるれろ", "ラリルレロ"],
            "gemination": ["きって (stamp) vs きて (come)", "がっこう (school) vs がこう (painting)"],
            "Tense consonants (ㅃ/ㄸㄲ/ㅆ/ㅉ)": ["빨다 (to suck) vs 발다 (to step)", "따다 (to pick) vs 다다 (to reach)"],
            "Retroflex finals (-r)": ["ér (child)", "nǎr (where)", "wánr (play)"],
            "'r/l' sound": ["рыба (fish)", "ложка (spoon)", "река (river)"],
            "consonant clusters": ["встреча (meeting)", "здравствуйте (hello)", "взгляд (glance)"]
        };

        return defaultExamples[phonemeKey] || ["example1", "example2", "example3"];
    }

    // Vocabulary categories for B1 level
    const vocabCategories = [
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
            category: "environment",
            words: ["pollution", "recycling", "sustainability", "climate", "biodiversity", "conservation", "renewable"],
            difficulty: "medium"
        },
        {
            category: "business",
            words: ["entrepreneur", "investment", "marketing", "strategy", "negotiation", "partnership", "innovation"],
            difficulty: "medium"
        },
        {
            category: "health",
            words: ["nutrition", "exercise", "mental health", "wellness", "prevention", "treatment", "recovery"],
            difficulty: "medium"
        },
        {
            category: "travel",
            words: ["itinerary", "accommodation", "destination", "sightseeing", "guidebook", "backpacking", "cruise"],
            difficulty: "medium"
        },
        {
            category: "culture",
            words: ["tradition", "custom", "heritage", "festival", "cuisine", "artwork", "literature"],
            difficulty: "medium"
        },
        {
            category: "communication",
            words: ["persuasion", "negotiation", "presentation", "feedback", "collaboration", "networking", "mediation"],
            difficulty: "medium"
        }
    ];

    const content = `/**
 * ${lang.name} B1 syllabus
 * CEFR Level: B1 (Intermediate)
 * @module curriculum/${lang.folder}/B1
 */

const ${lang.name.toUpperCase().replace(/[^A-Z]/g, '')}_B1 = {
    level: "B1",
    language: "${lang.name}",
    languageCode: "${lang.code}",
    
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

    vocab: ${JSON.stringify(vocabCategories, null, 4)},

    phonemeDetails: ${JSON.stringify(phonemeDetails, null, 4)},

    pragmatics: "Expressing opinions, negotiating, giving detailed explanations.",

    meta: {
        estimatedHours: 120,
        typicalLearner: "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise whilst travelling in an area where the language is spoken.",
        assessmentFocus: "Can produce simple connected text on topics which are familiar or of personal interest. Can describe experiences and events, dreams, hopes and ambitions and briefly give reasons and explanations for opinions and plans."
    }
};

export default ${lang.name.toUpperCase().replace(/[^A-Z]/g, '')}_B1;`;

    return content;
}

// Generate files for all languages
console.log('Generating B1 files...');
for (const lang of languageData) {
    // Skip English which we already created
    if (lang.code === 'en') {
        console.log(`Skipping ${lang.name} (already created)`);
        continue;
    }

    const filePath = path.join(__dirname, 'src', 'curriculum', lang.folder, 'B1.js');
    const content = generateB1File(lang);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
}

console.log('Done!');