const fs = require('fs');
const path = require('path');

// Language data from user's table
const languageData = [
    {
        name: "English",
        code: "en",
        folder: "english",
        a2Phonemes: ["'th' sounds (think/that)", "'v' vs 'w' (very/wary)", "r vs l"]
    },
    {
        name: "Spanish",
        code: "es",
        folder: "spanish",
        a2Phonemes: ["Rolled 'r' and 'rr'", "'ñ' sound (canyon)"]
    },
    {
        name: "French",
        code: "fr",
        folder: "french",
        a2Phonemes: ["Nasal vowels (on/an/in/un)", "Liaison (linking words)"]
    },
    {
        name: "German",
        code: "de",
        folder: "german",
        a2Phonemes: ["'ch' sound (Bach/ich)"]
    },
    {
        name: "Italian",
        code: "it",
        folder: "italian",
        a2Phonemes: ["Rolling 'r'", "Geminates (doubled consonants)"]
    },
    {
        name: "Portuguese",
        code: "pt",
        folder: "portuguese",
        a2Phonemes: ["Nasal vowels (ão/õe)", "'lh' sound"]
    },
    {
        name: "Dutch",
        code: "nl",
        folder: "dutch",
        a2Phonemes: ["guttural g", "ui/ij diphthongs"]
    },
    {
        name: "Swedish",
        code: "sv",
        folder: "swedish",
        a2Phonemes: ["pitch accent (accent 1/2)", "sj sound (retroflex fricative)"]
    },
    {
        name: "Turkish",
        code: "tr",
        folder: "turkish",
        a2Phonemes: ["vowel harmony (front/back)", "soft ğ (yumuşak ge)"]
    },
    {
        name: "Greek",
        code: "el",
        folder: "greek",
        a2Phonemes: ["Greek consonants (γ/χ/ξ/ψ)", "double consonants"]
    },
    {
        name: "Arabic",
        code: "ar",
        folder: "arabic",
        a2Phonemes: ["Emphatic consonants (ص/ض/ط/ظ)"]
    },
    {
        name: "Hindi",
        code: "hi",
        folder: "hindi",
        a2Phonemes: ["Retroflex consonants (ट/ड/ण)"]
    },
    {
        name: "Japanese",
        code: "ja",
        folder: "japanese",
        a2Phonemes: ["Pitch accent patterns"]
    },
    {
        name: "Korean",
        code: "ko",
        folder: "korean",
        a2Phonemes: ["Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)"]
    },
    {
        name: "Mandarin",
        code: "zh",
        folder: "mandarin",
        a2Phonemes: ["Tones (4 tones + neutral)"]
    },
    {
        name: "Russian",
        code: "ru",
        folder: "russian",
        a2Phonemes: ["Soft consonants (palatalization)", "Vowel reduction"]
    }
];

// Template for A2 files
function generateA2File(lang) {
    const phonemeDetails = lang.a2Phonemes.map(phonemeKey => ({
        phonemeKey,
        difficulty: "medium",
        examples: getExamplesForPhoneme(phonemeKey)
    }));

    // Get examples from phonemeGuide if available
    function getExamplesForPhoneme(phonemeKey) {
        // Default examples based on common minimal pairs
        const defaultExamples = {
            "'th' sounds (think/that)": ["think vs sink", "that vs dat", "three vs tree"],
            "'v' vs 'w' (very/wary)": ["very vs wary", "vine vs wine", "vest vs west"],
            "r vs l": ["right vs light", "red vs led", "fry vs fly"],
            "Rolled 'r' and 'rr'": ["pero vs perro", "caro vs carro", "cero vs cerro"],
            "'ñ' sound (canyon)": ["año vs ano", "caña vs cana", "uña vs una"],
            "Nasal vowels (on/an/in/un)": ["bon vs beau", "vin vs vingt", "un vs une"],
            "Liaison (linking words)": ["les amis", "petit ami", "grand homme"],
            "'ch' sound (Bach/ich)": ["Bach vs back", "ich vs isch", "machen vs mache"],
            "Rolling 'r'": ["caro", "pero", "marito"],
            "Geminates (doubled consonants)": ["casa vs cassa", "pala vs palla", "fato vs fatto"],
            "Nasal vowels (ão/õe)": ["pão", "mão", "cão"],
            "'lh' sound": ["filho", "mulher", "olho"],
            "guttural g": ["goed", "geen", "graag"],
            "ui/ij diphthongs": ["huis", "muis", "bruin"],
            "pitch accent (accent 1/2)": ["anden (duck) vs anden (spirit)", "tomten (plot) vs tomten (Santa)"],
            "sj sound (retroflex fricative)": ["sjuk", "skjorta", "stjärna"],
            "vowel harmony (front/back)": ["ev vs eve", "okul vs okula", "elma vs elmalar"],
            "soft ğ (yumuşak ge)": ["dağ", "ağaç", "yoğurt"],
            "Greek consonants (γ/χ/ξ/ψ)": ["γάλα", "χέρι", "ξένος"],
            "double consonants": ["παπάς vs παππάς", "νόμος vs νομός"],
            "Emphatic consonants (ص/ض/ط/ظ)": ["صاد", "ضاد", "طاء"],
            "Retroflex consonants (ट/ड/ण)": ["टमाटर", "डब्बा", "णमस्ते"],
            "Pitch accent patterns": ["はし (chopsticks) vs はし (bridge)", "あめ (rain) vs あめ (candy)"],
            "Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)": ["파 (red bean) vs 바 (bar)", "타 (ride) vs 다 (all)"],
            "Tones (4 tones + neutral)": ["mā (mother)", "má (hemp)", "mǎ (horse)", "mà (scold)"],
            "Soft consonants (palatalization)": ["мел (chalk) vs мель (shoal)", "угол (corner) vs уголь (coal)"],
            "Vowel reduction": ["молоко", "хорошо", "сегодня"]
        };

        return defaultExamples[phonemeKey] || ["example1", "example2", "example3"];
    }

    // Vocabulary categories (simplified for all languages)
    const vocabCategories = [
        {
            category: "daily_routines",
            words: lang.code === 'en' ? ["wake up", "brush teeth", "have breakfast", "go to work", "come home", "watch TV", "go to bed"] :
                lang.code === 'es' ? ["despertarse", "cepillarse los dientes", "desayunar", "ir al trabajo", "volver a casa", "ver la tele", "acostarse"] :
                    lang.code === 'fr' ? ["se réveiller", "se brosser les dents", "prendre le petit déjeuner", "aller au travail", "rentrer à la maison", "regarder la télé", "se coucher"] :
                        ["routine1", "routine2", "routine3", "routine4", "routine5", "routine6", "routine7"],
            difficulty: "easy"
        },
        {
            category: "weather",
            words: ["sunny", "rainy", "cloudy", "windy", "storm", "temperature", "forecast"],
            difficulty: "easy"
        },
        {
            category: "transportation",
            words: ["bus", "train", "subway", "taxi", "bicycle", "airport", "station"],
            difficulty: "easy"
        },
        {
            category: "shopping",
            words: ["supermarket", "price", "expensive", "cheap", "size", "color", "receipt"],
            difficulty: "medium"
        },
        {
            category: "health",
            words: ["doctor", "hospital", "medicine", "headache", "fever", "appointment", "pharmacy"],
            difficulty: "medium"
        },
        {
            category: "travel",
            words: ["passport", "hotel", "reservation", "sightseeing", "map", "direction", "luggage"],
            difficulty: "medium"
        },
        {
            category: "work",
            words: ["meeting", "colleague", "boss", "deadline", "project", "office", "salary"],
            difficulty: "medium"
        },
        {
            category: "hobbies",
            words: ["photography", "cooking", "reading", "gardening", "painting", "fishing", "hiking"],
            difficulty: "easy"
        }
    ];

    const content = `/**
 * ${lang.name} A2 syllabus
 * CEFR Level: A2 (Elementary)
 * @module curriculum/${lang.folder}/A2
 */

const ${lang.name.toUpperCase().replace(/[^A-Z]/g, '')}_A2 = {
    level: "A2",
    language: "${lang.name}",
    languageCode: "${lang.code}",
    
    grammarDetails: [
        {
            concept: "past_tense",
            description: "Simple past tense for completed actions",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "future_tense",
            description: "Will and going to for future intentions",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "comparatives",
            description: "Comparing people, things, and places",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        },
        {
            concept: "modal_verbs",
            description: "Can, could, should, must for ability, permission, obligation",
            examples: ["Example 1", "Example 2", "Example 3"],
            difficulty: "medium",
            commonErrors: ["Common error 1", "Common error 2"]
        }
    ],

    vocab: ${JSON.stringify(vocabCategories, null, 4)},

    phonemeDetails: ${JSON.stringify(phonemeDetails, null, 4)},

    pragmatics: "Polite requests, giving opinions, making suggestions.",

    meta: {
        estimatedHours: 80,
        typicalLearner: "Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. very basic personal and family information, shopping, local geography, employment).",
        assessmentFocus: "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters."
    }
};

export default ${lang.name.toUpperCase().replace(/[^A-Z]/g, '')}_A2;`;

    return content;
}

// Generate files for all languages
console.log('Generating A2 files...');
for (const lang of languageData) {
    // Skip English and Spanish which we already created
    if (lang.code === 'en' || lang.code === 'es') {
        console.log(`Skipping ${lang.name} (already created)`);
        continue;
    }

    const filePath = path.join(__dirname, 'src', 'curriculum', lang.folder, 'A2.js');
    const content = generateA2File(lang);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
}

console.log('Done!');