/**
 * English A2 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for elementary level.
 * @module curriculum/english/A2
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ENGLISH_A2 = {
    "level": "A2",
    "language": "en",
    "languageCode": "en",
    "grammarDetails": [
        {
            "concept": "past_tense",
            "description": "Simple past tense for completed actions",
            "examples": [
                "I worked yesterday.",
                "She visited her friend.",
                "They played soccer."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Using present tense for past events",
                "Irregular verb confusion"
            ]
        },
        {
            "concept": "future_tense",
            "description": "Will and going to for future intentions",
            "examples": [
                "I will call you later.",
                "She is going to travel next week.",
                "They will arrive tomorrow."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Confusing will vs going to",
                "Using present continuous incorrectly"
            ]
        },
        {
            "concept": "comparatives",
            "description": "Comparing people, things, and places",
            "examples": [
                "This book is more interesting than that one.",
                "He is taller than his brother.",
                "My car is faster."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Double comparatives (more better)",
                "Incorrect irregular forms (gooder)"
            ]
        },
        {
            "concept": "modal_verbs",
            "description": "Can, could, should, must for ability, permission, obligation",
            "examples": [
                "You should study more.",
                "I can speak English.",
                "We must finish this today."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Using to after modals",
                "Confusing should vs must"
            ]
        }
    ],
    "vocab": [
        {
            "category": "daily_routines",
            "words": [
                "wake up",
                "brush teeth",
                "have breakfast",
                "go to work",
                "come home",
                "watch TV",
                "go to bed"
            ],
            "difficulty": "easy"
        },
        {
            "category": "weather",
            "words": [
                "sunny",
                "rainy",
                "cloudy",
                "windy",
                "storm",
                "temperature",
                "forecast"
            ],
            "difficulty": "easy"
        },
        {
            "category": "transportation",
            "words": [
                "bus",
                "train",
                "subway",
                "taxi",
                "bicycle",
                "airport",
                "station"
            ],
            "difficulty": "easy"
        },
        {
            "category": "shopping",
            "words": [
                "supermarket",
                "price",
                "expensive",
                "cheap",
                "size",
                "color",
                "receipt"
            ],
            "difficulty": "medium"
        },
        {
            "category": "health",
            "words": [
                "doctor",
                "hospital",
                "medicine",
                "headache",
                "fever",
                "appointment",
                "pharmacy"
            ],
            "difficulty": "medium"
        },
        {
            "category": "travel",
            "words": [
                "passport",
                "hotel",
                "reservation",
                "sightseeing",
                "map",
                "direction",
                "luggage"
            ],
            "difficulty": "medium"
        },
        {
            "category": "work",
            "words": [
                "meeting",
                "colleague",
                "boss",
                "deadline",
                "project",
                "office",
                "salary"
            ],
            "difficulty": "medium"
        },
        {
            "category": "hobbies",
            "words": [
                "photography",
                "cooking",
                "reading",
                "gardening",
                "painting",
                "fishing",
                "hiking"
            ],
            "difficulty": "easy"
        }
    ],
    "phonemeDetails": [
        {
            "phonemeKey": "'th' sounds (think/that)",
            "difficulty": "medium",
            "examples": [
                "think vs sink",
                "that vs dat",
                "three vs tree",
                "bath vs bass"
            ]
        },
        {
            "phonemeKey": "'v' vs 'w' (very/wary)",
            "difficulty": "medium",
            "examples": [
                "very vs wary",
                "vine vs wine",
                "vest vs west",
                "vet vs wet"
            ]
        },
        {
            "phonemeKey": "r vs l",
            "difficulty": "medium",
            "examples": [
                "right vs light",
                "red vs led",
                "fry vs fly",
                "grass vs glass"
            ]
        }
    ],
    "pragmatics": "Polite requests, giving opinions, making suggestions.",
    "meta": {
        "estimatedHours": 80,
        "typicalLearner": "Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. very basic personal and family information, shopping, local geography, employment).",
        "assessmentFocus": "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters."
    },
    "cefr": "A2",
    "grammar": [
        "past_tense",
        "future_tense",
        "comparatives",
        "modal_verbs"
    ],
    "vocabThemes": [
        "daily_routines",
        "weather",
        "transportation",
        "shopping",
        "health",
        "travel",
        "work",
        "hobbies"
    ],
    "phonemes": [
        "'th' sounds (think/that)",
        "'v' vs 'w' (very/wary)",
        "r vs l"
    ],
    "orthography": null,
    "version": "2.0"
};

export default ENGLISH_A2;