const ENGLISH_B1 = {
    level: "B1",
    language: "en",
    cefr: "B1",
    languageCode: "en",

    // String IDs for learningGoals.js compatibility
    grammar: ["present_perfect", "conditionals", "reported_speech", "relative_clauses"],

    // Detailed grammar objects for other parts of the app
    grammarDetails: [
        {
            concept: "present_perfect",
            description: "Present perfect for experiences and unfinished time",
            examples: ["I have visited Paris three times.", "She has lived here since 2020.", "They have already finished their homework."],
            difficulty: "medium",
            commonErrors: ["Confusing with simple past", "Incorrect use of for vs since"]
        },
        {
            concept: "conditionals",
            description: "First and second conditionals for real and hypothetical situations",
            examples: ["If it rains, we will cancel the picnic.", "If I had more time, I would learn Japanese.", "She would travel if she had money."],
            difficulty: "medium",
            commonErrors: ["Mixing conditional types", "Incorrect verb forms in if-clauses"]
        },
        {
            concept: "reported_speech",
            description: "Reporting what someone said",
            examples: ["He said he was tired.", "She told me she would come later.", "They asked if we had seen the movie."],
            difficulty: "medium",
            commonErrors: ["Not backshifting tenses", "Confusing say vs tell"]
        },
        {
            concept: "relative_clauses",
            description: "Defining and non-defining relative clauses",
            examples: ["The book that I'm reading is interesting.", "My sister, who lives in London, is visiting us.", "The man whose car was stolen called the police."],
            difficulty: "medium",
            commonErrors: ["Omitting relative pronouns when required", "Confusing which vs that"]
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
    ],

    // Unique vocab theme strings for learningGoals.js compatibility
    vocabThemes: ["education", "technology", "environment", "business", "health", "travel", "culture", "communication"],

    // String IDs for learningGoals.js compatibility
    phonemes: ["short/long vowels (ship/sheep)", "schwa reduction", "vowel length"],

    // Detailed phoneme objects for other parts of the app
    phonemeDetails: [
        {
            phonemeKey: "short/long vowels (ship/sheep)",
            difficulty: "medium",
            examples: ["ship vs sheep", "bit vs beat", "fit vs feet", "sit vs seat"]
        },
        {
            phonemeKey: "schwa reduction",
            difficulty: "medium",
            examples: ["about", "sofa", "banana", "computer"]
        },
        {
            phonemeKey: "vowel length",
            difficulty: "medium",
            examples: ["beat vs bit", "pool vs pull", "caught vs cot", "fool vs full"]
        }
    ],

    pragmatics: "Expressing opinions, negotiating, giving detailed explanations.",
    orthography: null,

    meta: {
        estimatedHours: 120,
        typicalLearner: "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise whilst travelling in an area where the language is spoken.",
        assessmentFocus: "Can produce simple connected text on topics which are familiar or of personal interest. Can describe experiences and events, dreams, hopes and ambitions and briefly give reasons and explanations for opinions and plans."
    }
};

export default ENGLISH_B1;