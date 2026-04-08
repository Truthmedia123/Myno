/**
 * A1 complexity enforcement utilities for Myno AI pipeline.
 * Provides vocabulary sets and simplification functions to ensure
 * AI responses are appropriate for A1 beginners.
 * @module a1Simplifier
 */

/**
 * Core Spanish A1 vocabulary set (~50 words).
 * @type {Set<string>}
 */
export const A1_VOCAB_SET = new Set([
    'hola', 'gracias', 'por favor', 'adiós', 'sí', 'no', 'agua', 'pan', 'casa',
    'comida', 'baño', 'dónde', 'cuánto', 'yo', 'tú', 'quiero', 'tiene', 'es',
    'está', 'bueno', 'mal', 'hoy', 'ahora', 'aquí', 'ahí', 'mucho', 'poco',
    'grande', 'pequeño', 'amigo', 'familia', 'trabajo', 'estudio', 'libro',
    'mesa', 'silla', 'puerta', 'ventana', 'coche', 'calle', 'tienda', 'mercado',
    'hotel', 'restaurante', 'café', 'leche', 'té', 'vino', 'cerveza', 'fruta',
    'verdura', 'carne', 'pescado', 'pollo', 'arroz', 'pasta', 'queso', 'huevo',
    'sal', 'azúcar', 'aceite'
]);

/**
 * Ultra-simple questions for A1 learners.
 * @type {string[]}
 */
const A1_QUESTIONS = [
    '¿Sí?', '¿No?', '¿Agua?', '¿Pan?', '¿Casa?', '¿Baño?'
];

/**
 * Context emoji mapping for non-A1 vocabulary.
 * @type {Object.<string, string>}
 */
const CONTEXT_EMOJIS = {
    food: '🍴',
    drink: '🍴',
    location: '🏠',
    home: '🏠',
    movement: '🚶',
    object: '📦',
    default: '[...]'
};

/**
 * Simplifies text to A1 level by replacing non-A1 words with context emojis,
 * limiting sentence count, and appending a simple question.
 * @param {string} text - The original text to simplify.
 * @param {string[]} syllabusVocab - Additional vocabulary from current syllabus.
 * @returns {string} Simplified A1-safe text.
 */
export function simplifyToA1(text, syllabusVocab = []) {
    if (!text || typeof text !== 'string') return text;

    // Combine A1 vocabulary with syllabus vocabulary
    const allowedWords = new Set([...A1_VOCAB_SET, ...syllabusVocab.map(w => w.toLowerCase())]);

    // Split into sentences (simple period-based split)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keptSentences = sentences.slice(0, 2); // Keep max 2 sentences

    const processedSentences = keptSentences.map(sentence => {
        const words = sentence.trim().split(/\s+/);
        const processedWords = words.map(word => {
            const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, '');

            // Check if word is in allowed vocabulary
            if (allowedWords.has(lowerWord)) {
                return word;
            }

            // Determine context for replacement
            if (lowerWord.match(/(comida|pan|queso|arroz|pasta|carne|pescado|pollo|fruta|verdura|huevo)/)) {
                return CONTEXT_EMOJIS.food;
            } else if (lowerWord.match(/(agua|vino|cerveza|café|leche|té)/)) {
                return CONTEXT_EMOJIS.drink;
            } else if (lowerWord.match(/(casa|hotel|restaurante|tienda|mercado|baño|puerta|ventana)/)) {
                return CONTEXT_EMOJIS.home;
            } else if (lowerWord.match(/(coche|calle|aquí|ahí|dónde)/)) {
                return CONTEXT_EMOJIS.movement;
            } else if (lowerWord.match(/(mesa|silla|libro|puerta|ventana)/)) {
                return CONTEXT_EMOJIS.object;
            } else {
                return CONTEXT_EMOJIS.default;
            }
        });

        // Remove duplicate consecutive emojis
        const deduplicated = processedWords.filter((w, i) => i === 0 || w !== processedWords[i - 1]);
        return deduplicated.join(' ');
    });

    let result = processedSentences.join('. ');
    if (result.length > 0 && !result.endsWith('.')) {
        result += '.';
    }

    // Append random ultra-simple question
    const randomQuestion = A1_QUESTIONS[Math.floor(Math.random() * A1_QUESTIONS.length)];
    result += ' ' + randomQuestion;

    return result.trim();
}

/**
 * Validates if a reply complies with A1 complexity constraints.
 * If not compliant, returns a simplified version.
 * @param {string} reply - The AI reply to validate.
 * @param {Object} syllabus - Current syllabus with vocab array.
 * @param {string[]} syllabus.vocab - Vocabulary words from syllabus.
 * @returns {string} A1-compliant reply.
 */
export function validateA1Compliance(reply, syllabus = { vocab: [] }) {
    if (!reply || typeof reply !== 'string') return reply;

    const syllabusVocab = syllabus.vocab || [];

    // Check word count (max 10 words)
    const words = reply.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 10) {
        return simplifyToA1(reply, syllabusVocab);
    }

    // Check for complex grammar patterns
    const complexGrammarRegex = /que|si|porque|había|tendré|quiera|subjuntivo|condicional|imperfecto/i;
    if (complexGrammarRegex.test(reply)) {
        return simplifyToA1(reply, syllabusVocab);
    }

    // Check for at least 2 syllabus vocabulary words
    const lowerReply = reply.toLowerCase();
    const syllabusWordCount = syllabusVocab.filter(word =>
        word && lowerReply.includes(word.toLowerCase())
    ).length;
    if (syllabusWordCount < 2 && syllabusVocab.length > 0) {
        return simplifyToA1(reply, syllabusVocab);
    }

    // Check sentence length (max 5 words per sentence)
    const sentences = reply.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
        const sentenceWords = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        if (sentenceWords.length > 5) {
            return simplifyToA1(reply, syllabusVocab);
        }
    }

    // All checks passed
    return reply;
}