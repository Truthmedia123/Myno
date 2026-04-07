/**
 * CEFR-aligned scenario data for Myno AI Tutor.
 * Structured scenarios with prerequisites, skills, and micro-lessons.
 * @module scenarios
 */

/**
 * Array of structured scenarios with CEFR levels, prerequisites, and learning content.
 * @type {Array<Object>}
 */
export const SCENARIOS = [
    {
        id: 'scenario_1',
        cefr: 'A1',
        title: 'Greetings & Introductions',
        difficulty: 1,
        prerequisites: [],
        skills: ['basic greetings', 'self-introduction', 'asking names'],
        promptTemplate: `You are a friendly language partner. Help the user practice basic greetings and introductions in {target_language}. 
Keep responses simple, use short sentences, and provide gentle corrections. 
The user's native language is {native_language} – you can give explanations in that language if needed.`,
        microLesson: {
            vocab: ['hello', 'goodbye', 'thank you', 'my name is', 'what is your name?'],
            grammar: 'Present tense of "to be"',
            tip: 'In {target_language}, greetings often change based on time of day.'
        }
    },
    {
        id: 'scenario_2',
        cefr: 'A1',
        title: 'Ordering Food at a Cafe',
        difficulty: 2,
        prerequisites: ['scenario_1'],
        skills: ['food vocabulary', 'making requests', 'polite phrases'],
        promptTemplate: `You are a barista at a {target_language}-speaking cafe. The user is a customer trying to order.
Use simple menu items (coffee, tea, water, sandwich) and help them practice ordering.
Correct any pronunciation or grammar mistakes gently. Native language: {native_language}.`,
        microLesson: {
            vocab: ['coffee', 'tea', 'water', 'please', 'how much?', 'I would like'],
            grammar: 'Modal verbs for requests (would like, can I)',
            tip: 'In {target_language}, it\'s common to use polite phrases before ordering.'
        }
    },
    {
        id: 'scenario_3',
        cefr: 'A2',
        title: 'Asking for Directions',
        difficulty: 3,
        prerequisites: ['scenario_1', 'scenario_2'],
        skills: ['location vocabulary', 'asking questions', 'understanding directions'],
        promptTemplate: `You are a helpful local in a {target_language}-speaking city. The user is lost and needs directions.
Use common landmarks (bank, park, station) and directional words (left, right, straight).
Speak clearly and repeat important words. Native language: {native_language}.`,
        microLesson: {
            vocab: ['where is', 'left', 'right', 'straight', 'near', 'far', 'bank', 'station'],
            grammar: 'Prepositions of place (next to, across from, between)',
            tip: 'In {target_language}, directions often use landmarks instead of street names.'
        }
    },
    {
        id: 'scenario_4',
        cefr: 'A2',
        title: 'Shopping for Clothes',
        difficulty: 4,
        prerequisites: ['scenario_2', 'scenario_3'],
        skills: ['clothing vocabulary', 'colors & sizes', 'negotiating price'],
        promptTemplate: `You are a shop assistant in a {target_language} clothing store. The user wants to buy clothes.
Help them with sizes, colors, and prices. Practice common shopping phrases.
Correct any vocabulary mistakes. Native language: {native_language}.`,
        microLesson: {
            vocab: ['shirt', 'pants', 'dress', 'small/medium/large', 'color', 'price', 'expensive'],
            grammar: 'Demonstrative pronouns (this, that, these, those)',
            tip: 'In {target_language}, clothing sizes may differ from international standards.'
        }
    },
    {
        id: 'scenario_5',
        cefr: 'B1',
        title: 'Making Travel Plans',
        difficulty: 5,
        prerequisites: ['scenario_3', 'scenario_4'],
        skills: ['future tense', 'transportation vocabulary', 'making reservations'],
        promptTemplate: `You are a travel agent helping plan a trip to a {target_language}-speaking country.
Discuss transportation, accommodation, and activities. Use future tense and conditional phrases.
Provide cultural tips. Native language: {native_language}.`,
        microLesson: {
            vocab: ['airport', 'hotel', 'train', 'ticket', 'reservation', 'tomorrow', 'next week'],
            grammar: 'Future tense constructions',
            tip: 'In {target_language}, booking in advance often gets better prices.'
        }
    },
    {
        id: 'scenario_6',
        cefr: 'B1',
        title: 'Discussing Hobbies & Interests',
        difficulty: 5,
        prerequisites: ['scenario_4', 'scenario_5'],
        skills: ['present perfect tense', 'hobby vocabulary', 'expressing preferences'],
        promptTemplate: `You are a conversation partner discussing hobbies and interests in {target_language}.
Ask about the user's hobbies, share your own, and practice expressing likes/dislikes.
Use conversational connectors. Native language: {native_language}.`,
        microLesson: {
            vocab: ['sports', 'music', 'reading', 'cooking', 'watching movies', 'I enjoy', 'I prefer'],
            grammar: 'Present perfect for experiences',
            tip: 'In {target_language}, hobbies are often discussed with specific verb forms.'
        }
    }
];