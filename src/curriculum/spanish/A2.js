/**
 * Spanish A2 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for elementary level.
 * @module curriculum/spanish/A2
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const SPANISH_A2 = {
    "level": "A2",
    "language": "es",
    "languageCode": "es",
    "grammarDetails": [
        {
            "concept": "past_tense",
            "description": "Pretérito indefinido for completed past actions",
            "examples": [
                "Ayer trabajé mucho.",
                "Ella visitó a su amiga.",
                "Ellos jugaron al fútbol."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Confusing with imperfecto",
                "Irregular verb forms"
            ]
        },
        {
            "concept": "future_tense",
            "description": "Future simple for future intentions",
            "examples": [
                "Mañana iré al cine.",
                "Ella viajará la próxima semana.",
                "Nosotros comeremos juntos."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Using ir + a + infinitive incorrectly",
                "Irregular future stems"
            ]
        },
        {
            "concept": "comparatives",
            "description": "Comparing people, things, and places",
            "examples": [
                "Este libro es más interesante que ese.",
                "Él es más alto que su hermano.",
                "Mi coche es más rápido."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Más mejor (double comparative)",
                "Incorrect use of que vs de"
            ]
        },
        {
            "concept": "modal_verbs",
            "description": "Poder, deber, querer for ability, obligation, desire",
            "examples": [
                "Debes estudiar más.",
                "Puedo hablar español.",
                "Quiero visitar España."
            ],
            "difficulty": "medium",
            "commonErrors": [
                "Infinitive after modal",
                "Confusing deber vs tener que"
            ]
        }
    ],
    "vocab": [
        {
            "category": "daily_routines",
            "words": [
                "despertarse",
                "cepillarse los dientes",
                "desayunar",
                "ir al trabajo",
                "volver a casa",
                "ver la tele",
                "acostarse"
            ],
            "difficulty": "easy"
        },
        {
            "category": "weather",
            "words": [
                "soleado",
                "lluvioso",
                "nublado",
                "ventoso",
                "tormenta",
                "temperatura",
                "pronóstico"
            ],
            "difficulty": "easy"
        },
        {
            "category": "transportation",
            "words": [
                "autobús",
                "tren",
                "metro",
                "taxi",
                "bicicleta",
                "aeropuerto",
                "estación"
            ],
            "difficulty": "easy"
        },
        {
            "category": "shopping",
            "words": [
                "supermercado",
                "precio",
                "caro",
                "barato",
                "talla",
                "color",
                "recibo"
            ],
            "difficulty": "medium"
        },
        {
            "category": "health",
            "words": [
                "médico",
                "hospital",
                "medicina",
                "dolor de cabeza",
                "fiebre",
                "cita",
                "farmacia"
            ],
            "difficulty": "medium"
        },
        {
            "category": "travel",
            "words": [
                "pasaporte",
                "hotel",
                "reserva",
                "turismo",
                "mapa",
                "dirección",
                "equipaje"
            ],
            "difficulty": "medium"
        },
        {
            "category": "work",
            "words": [
                "reunión",
                "colega",
                "jefe",
                "fecha límite",
                "proyecto",
                "oficina",
                "salario"
            ],
            "difficulty": "medium"
        },
        {
            "category": "hobbies",
            "words": [
                "fotografía",
                "cocina",
                "lectura",
                "jardinería",
                "pintura",
                "pesca",
                "senderismo"
            ],
            "difficulty": "easy"
        }
    ],
    "phonemeDetails": [
        {
            "phonemeKey": "Rolled 'r' and 'rr'",
            "difficulty": "medium",
            "examples": [
                "pero vs perro",
                "caro vs carro",
                "cero vs cerro"
            ]
        },
        {
            "phonemeKey": "'ñ' sound (canyon)",
            "difficulty": "medium",
            "examples": [
                "año vs ano",
                "caña vs cana",
                "uña vs una"
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
        "Rolled 'r' and 'rr'",
        "'ñ' sound (canyon)"
    ],
    "orthography": null,
    "version": "2.0"
};

export default SPANISH_A2;