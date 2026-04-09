/**
 * A1 complexity enforcement utilities for Myno AI pipeline.
 * Provides vocabulary sets and simplification functions to ensure
 * AI responses are appropriate for A1 beginners.
 * @module a1Simplifier
 */

/**
 * Expanded Spanish A1 vocabulary set (200+ words).
 * Includes core survival vocabulary for true beginners.
 * @type {Set<string>}
 */
export const EXPANDED_A1_VOCAB = new Set([
    // Greetings & polite phrases
    'hola', 'adiós', 'buenos días', 'buenas tardes', 'buenas noches',
    'gracias', 'por favor', 'de nada', 'perdón', 'lo siento', 'disculpe',
    'sí', 'no', 'vale', 'claro', 'está bien', 'por supuesto',
    // Pronouns & people
    'yo', 'tú', 'él', 'ella', 'usted', 'nosotros', 'vosotros', 'ellos', 'ellas',
    'mí', 'ti', 'usted', 'nos', 'vos', 'se',
    // Basic verbs (present tense)
    'ser', 'es', 'soy', 'eres', 'somos', 'son',
    'estar', 'está', 'estoy', 'estás', 'estamos', 'están',
    'tener', 'tiene', 'tengo', 'tienes', 'tenemos', 'tienen',
    'querer', 'quiere', 'quiero', 'quieres', 'queremos', 'quieren',
    'ir', 'va', 'voy', 'vas', 'vamos', 'van',
    'venir', 'viene', 'vengo', 'vienes', 'venimos', 'vienen',
    'hacer', 'hace', 'hago', 'haces', 'hacemos', 'hacen',
    'poder', 'puede', 'puedo', 'puedes', 'podemos', 'pueden',
    'decir', 'dice', 'digo', 'dices', 'decimos', 'dicen',
    'ver', 've', 'veo', 'ves', 'vemos', 'ven',
    'saber', 'sabe', 'sé', 'sabes', 'sabemos', 'saben',
    'dar', 'da', 'doy', 'das', 'damos', 'dan',
    'comer', 'come', 'como', 'comes', 'comemos', 'comen',
    'beber', 'bebe', 'bebo', 'bebes', 'bebemos', 'beben',
    'hablar', 'habla', 'hablo', 'hablas', 'hablamos', 'hablan',
    'vivir', 'vive', 'vivo', 'vives', 'vivimos', 'viven',
    'trabajar', 'trabaja', 'trabajo', 'trabajas', 'trabajamos', 'trabajan',
    'estudiar', 'estudia', 'estudio', 'estudias', 'estudiamos', 'estudian',
    'aprender', 'aprende', 'aprendo', 'aprendes', 'aprendemos', 'aprenden',
    'enseñar', 'enseña', 'enseño', 'enseñas', 'enseñamos', 'enseñan',
    // Common nouns (food, drink, objects, places)
    'agua', 'pan', 'casa', 'comida', 'baño', 'libro', 'mesa', 'silla',
    'puerta', 'ventana', 'coche', 'calle', 'tienda', 'mercado', 'hotel',
    'restaurante', 'café', 'leche', 'té', 'vino', 'cerveza', 'fruta',
    'verdura', 'carne', 'pescado', 'pollo', 'arroz', 'pasta', 'queso',
    'huevo', 'sal', 'azúcar', 'aceite', 'plato', 'vaso', 'cuchara', 'tenedor',
    'cuchillo', 'papel', 'bolígrafo', 'lápiz', 'cuaderno', 'ordenador', 'teléfono',
    'reloj', 'dinero', 'precio', 'cuenta', 'ropa', 'camisa', 'pantalón', 'zapatos',
    'sombrero', 'chaqueta', 'familia', 'amigo', 'amiga', 'padre', 'madre',
    'hermano', 'hermana', 'hijo', 'hija', 'abuelo', 'abuela', 'perro', 'gato',
    'animal', 'ciudad', 'país', 'mundo', 'tiempo', 'día', 'noche', 'mañana',
    'tarde', 'semana', 'mes', 'año', 'hora', 'minuto', 'segundo', 'lunes',
    'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre',
    // Numbers
    'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
    'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
    'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'treinta', 'cuarenta',
    'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'cien', 'mil',
    // Colors
    'rojo', 'azul', 'verde', 'amarillo', 'blanco', 'negro', 'gris', 'marrón',
    'naranja', 'rosa', 'morado', 'claro', 'oscuro',
    // Adjectives
    'bueno', 'mal', 'grande', 'pequeño', 'alto', 'bajo', 'largo', 'corto',
    'nuevo', 'viejo', 'joven', 'bonito', 'feo', 'caro', 'barato', 'fácil',
    'difícil', 'importante', 'interesante', 'abierto', 'cerrado', 'limpio',
    'sucio', 'caliente', 'frío', 'rápido', 'lento', 'feliz', 'triste',
    'cansado', 'enfermo', 'ocupado', 'libre', 'listo', 'tranquilo', 'nervioso',
    // Adverbs & prepositions
    'aquí', 'ahí', 'allí', 'cerca', 'lejos', 'dentro', 'fuera', 'arriba',
    'abajo', 'izquierda', 'derecha', 'norte', 'sur', 'este', 'oeste',
    'hoy', 'ahora', 'antes', 'después', 'siempre', 'nunca', 'a veces',
    'mucho', 'poco', 'muy', 'más', 'menos', 'bien', 'mal', 'también',
    'solo', 'solamente', 'quizás', 'tal vez', 'porque', 'pero', 'y', 'o',
    // Question words
    'qué', 'quién', 'dónde', 'cuándo', 'cuánto', 'cuántos', 'cómo', 'por qué',
    'cuál', 'cuáles',
    // Extra common phrases
    'por favor', 'de nada', 'lo siento', 'mucho gusto', 'encantado', 'igualmente',
    'hasta luego', 'hasta mañana', 'hasta pronto', 'adiós', 'buena suerte',
    'feliz cumpleaños', 'feliz navidad', 'feliz año nuevo'
]);

/**
 * Language‑appropriate ultra‑simple questions for A1 learners.
 * Each array contains single‑word questions with proper punctuation for the language.
 * @type {Object.<string, string[]>}
 */
const LANGUAGE_ENDINGS = {
    // Spanish
    es: ['¿Sí?', '¿No?', '¿Agua?', '¿Pan?', '¿Casa?', '¿Baño?', '¿Cómo?', '¿Dónde?', '¿Cuánto?'],
    // English
    en: ['Yes?', 'No?', 'Water?', 'Bread?', 'House?', 'Bathroom?', 'How?', 'Where?', 'How much?'],
    // French
    fr: ['Oui?', 'Non?', 'Eau?', 'Pain?', 'Maison?', 'Toilette?', 'Comment?', 'Où?', 'Combien?'],
    // German
    de: ['Ja?', 'Nein?', 'Wasser?', 'Brot?', 'Haus?', 'Bad?', 'Wie?', 'Wo?', 'Wie viel?'],
    // Italian
    it: ['Sì?', 'No?', 'Acqua?', 'Pane?', 'Casa?', 'Bagno?', 'Come?', 'Dove?', 'Quanto?'],
    // Portuguese
    pt: ['Sim?', 'Não?', 'Água?', 'Pão?', 'Casa?', 'Banheiro?', 'Como?', 'Onde?', 'Quanto?'],
    // Japanese (using Japanese punctuation？)
    ja: ['はい？', 'いいえ？', '水？', 'パン？', '家？', 'トイレ？', 'どう？', 'どこ？', 'いくら？'],
    // Korean
    ko: ['네?', '아니요?', '물?', '빵?', '집?', '화장실?', '어떻게?', '어디?', '얼마?'],
    // Mandarin Chinese
    zh: ['是？', '不？', '水？', '面包？', '房子？', '厕所？', '怎么？', '哪里？', '多少钱？'],
    // Arabic (right‑to‑left, with Arabic question mark؟)
    ar: ['نعم؟', 'لا؟', 'ماء؟', 'خبز؟', 'بيت؟', 'حمام؟', 'كيف؟', 'أين؟', 'كم؟'],
    // Hindi
    hi: ['हाँ?', 'नहीं?', 'पानी?', 'रोटी?', 'घर?', 'बाथरूम?', 'कैसे?', 'कहाँ?', 'कितना?'],
    // Russian
    ru: ['Да?', 'Нет?', 'Вода?', 'Хлеб?', 'Дом?', 'Туалет?', 'Как?', 'Где?', 'Сколько?'],
    // Dutch
    nl: ['Ja?', 'Nee?', 'Water?', 'Brood?', 'Huis?', 'Badkamer?', 'Hoe?', 'Waar?', 'Hoeveel?'],
    // Turkish
    tr: ['Evet?', 'Hayır?', 'Su?', 'Ekmek?', 'Ev?', 'Tuvalet?', 'Nasıl?', 'Nerede?', 'Ne kadar?'],
    // Swedish
    sv: ['Ja?', 'Nej?', 'Vatten?', 'Bröd?', 'Hus?', 'Badrum?', 'Hur?', 'Var?', 'Hur mycket?'],
    // Greek
    el: ['Ναι?', 'Όχι?', 'Νερό?', 'Ψωμί?', 'Σπίτι?', 'Μπάνιο?', 'Πώς?', 'Πού?', 'Πόσο?']
};

/**
 * Multilingual punctuation characters.
 * Includes ASCII and non‑ASCII question marks, exclamation marks, periods.
 * Used for sentence splitting and end‑of‑sentence detection.
 */
const MULTILINGUAL_PUNCTUATION = {
    QUESTION_MARKS: ['?', '؟', '？'], // ASCII, Arabic, Fullwidth
    EXCLAMATION_MARKS: ['!', '！'], // ASCII, Fullwidth
    PERIODS: ['.', '。'], // ASCII, Chinese/Japanese
    ALL: /[.?؟？！！。!]/ // Regex matching any sentence-ending punctuation (including ASCII !)
};

/**
 * Regex for splitting text into sentences.
 * Matches sequences of multilingual sentence-ending punctuation.
 */
const SENTENCE_SPLIT_REGEX = /[.?؟？！！。!]+/;

/**
 * Check if text ends with any multilingual question mark.
 * @param {string} text
 * @returns {boolean}
 */
function endsWithQuestionMark(text) {
    if (!text || typeof text !== 'string') return false;
    return MULTILINGUAL_PUNCTUATION.QUESTION_MARKS.some(mark => text.endsWith(mark));
}

/**
 * Check if text ends with any sentence-ending punctuation.
 * @param {string} text
 * @returns {boolean}
 */
function endsWithSentencePunctuation(text) {
    if (!text || typeof text !== 'string') return false;
    return MULTILINGUAL_PUNCTUATION.ALL.test(text.charAt(text.length - 1));
}

/**
 * Remove multilingual punctuation from a word.
 * @param {string} word
 * @returns {string}
 */
function stripPunctuation(word) {
    return word.replace(/[.,!?؟？！！。;:]/g, '');
}

/**
 * Get language‑appropriate simple questions.
 * Falls back to Spanish if language not found.
 * @param {string} langCode - Two‑letter language code (e.g., 'es', 'fr')
 * @returns {string[]} Array of simple questions
 */
function getLanguageQuestions(langCode) {
    return LANGUAGE_ENDINGS[langCode] || LANGUAGE_ENDINGS.es;
}

/**
 * Determines if text is in English (simple detection).
 * @param {string} text
 * @returns {boolean}
 */
function isEnglish(text) {
    // Very basic detection: common English words
    const englishIndicators = /\b(the|and|you|that|have|for|with|this|are|from)\b/i;
    return englishIndicators.test(text);
}

/**
 * Returns true if text uses mostly A1 vocab or is in English.
 * @param {string} text
 * @returns {boolean}
 */
export function isBeginnerFriendly(text) {
    if (!text || typeof text !== 'string') return true;
    if (isEnglish(text)) return true;

    const words = text.toLowerCase().match(/\b[a-záéíóúñ]+\b/g) || [];
    if (words.length === 0) return true;

    let a1Count = 0;
    for (const word of words) {
        if (EXPANDED_A1_VOCAB.has(word)) {
            a1Count++;
        }
    }
    const ratio = a1Count / words.length;
    return ratio >= 0.7; // >70% A1 vocab
}

/**
 * Gentle simplification: replace only the most complex words with parenthetical hints.
 * @param {string} text - Original text
 * @param {string[]} syllabusVocab - Additional vocabulary from syllabus
 * @param {string} userLang - User's language ('en' for English)
 * @returns {string} Simplified text
 */
export function gentleSimplify(text, syllabusVocab = [], userLang = 'en') {
    if (!text || typeof text !== 'string') return text;

    // If text is in English, return as‑is (it's a translation/help)
    if (userLang === 'en' && isEnglish(text)) {
        return text;
    }

    // Combine allowed vocab
    const allowedWords = new Set([...EXPANDED_A1_VOCAB, ...syllabusVocab.map(w => w.toLowerCase())]);

    // Split into sentences using multilingual punctuation
    const sentences = text.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0);
    const processedSentences = sentences.map(sentence => {
        const words = sentence.trim().split(/\s+/);
        const replacements = [];

        // Identify complex words
        const complexIndices = [];
        words.forEach((word, idx) => {
            const clean = stripPunctuation(word.toLowerCase());
            if (clean.length > 0 && !allowedWords.has(clean)) {
                complexIndices.push(idx);
            }
        });

        // Limit to max 2 replacements per sentence
        const replaceIndices = complexIndices.slice(0, 2);
        const newWords = words.map((word, idx) => {
            if (!replaceIndices.includes(idx)) return word;
            const clean = stripPunctuation(word.toLowerCase());
            // Keep original word and add English hint in parentheses
            return `${word} (${clean})`;
        });

        return newWords.join(' ');
    });

    let result = processedSentences.join('. ');
    if (result.length > 0 && !endsWithSentencePunctuation(result)) {
        result += '.';
    }
    return result.trim();
}

/**
 * Validates if a reply contains teaching elements (translations, examples, encouragement).
 * @param {string} reply
 * @returns {boolean}
 */
function containsTeaching(reply) {
    const teachingMarkers = [
        /translat/i,
        /example/i,
        /means/i,
        /significa/i,
        /puedes decir/i,
        /practica/i,
        /good job/i,
        /excellent/i,
        /well done/i,
        /encourag/i,
        /try again/i,
        /like this/i,
        /así/i,
        /por ejemplo/i
    ];
    return teachingMarkers.some(pattern => pattern.test(reply.toLowerCase()));
}

/**
 * Validate A1 teaching reply, allowing slightly advanced vocab for explanations.
 * @param {string} reply - AI reply
 * @param {Object} syllabus - Current syllabus with vocab array
 * @returns {{ isTeaching: boolean, simplifiedReply: string }}
 */
export function validateA1Teaching(reply, syllabus) {
    if (!reply || typeof reply !== 'string') {
        return { isTeaching: false, simplifiedReply: reply };
    }

    const syllabusVocab = syllabus?.vocab || [];
    const isTeaching = containsTeaching(reply);

    // If reply is teaching, allow slightly advanced vocab
    if (isTeaching) {
        // Still ensure it's not overly complex
        const words = reply.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 15) {
            // Trim length but keep teaching intent
            const trimmed = words.slice(0, 12).join(' ') + '...';
            return { isTeaching: true, simplifiedReply: trimmed };
        }
        return { isTeaching: true, simplifiedReply: reply };
    }

    // Pure practice → enforce stricter A1 limits
    const simplified = gentleSimplify(reply, syllabusVocab, 'en');
    return { isTeaching: false, simplifiedReply: simplified };
}

/**
 * Simplifies text to A1 level (legacy function, now uses gentleSimplify).
 * Preserved for backward compatibility.
 * @param {string} text - The original text to simplify.
 * @param {string[]} syllabusVocab - Additional vocabulary from current syllabus.
 * @param {string} langCode - Two‑letter language code (e.g., 'es', 'fr'). Defaults to 'es' for backward compatibility.
 * @returns {string} Simplified A1-safe text.
 */
export function simplifyToA1(text, syllabusVocab = [], langCode = 'es') {
    if (!text || typeof text !== 'string') return text;

    // Use gentle simplification but keep ultra‑simple question append
    const simplified = gentleSimplify(text, syllabusVocab, 'en');
    const questions = getLanguageQuestions(langCode);
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return `${simplified} ${randomQuestion}`.trim();
}

/**
 * Validates if a reply complies with A1 complexity constraints.
 * If not compliant, returns a simplified version (legacy).
 * Preserved for backward compatibility.
 * @param {string} reply - The AI reply to validate.
 * @param {Object} syllabus - Current syllabus with vocab array and language code.
 * @param {string[]} syllabus.vocab - Vocabulary words from syllabus.
 * @param {string} syllabus.language - Two‑letter language code (e.g., 'es', 'fr').
 * @returns {string} A1-compliant reply.
 */
export function validateA1Compliance(reply, syllabus = { vocab: [] }) {
    if (!reply || typeof reply !== 'string') return reply;

    const syllabusVocab = syllabus.vocab || [];
    const langCode = syllabus.language || 'es'; // Default to Spanish for backward compatibility
    const { isTeaching, simplifiedReply } = validateA1Teaching(reply, syllabus);

    // If teaching, allow longer sentences
    if (isTeaching) {
        // Still apply basic length limits
        const words = simplifiedReply.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 20) {
            return simplifyToA1(reply, syllabusVocab, langCode);
        }
        return simplifiedReply;
    }

    // Non‑teaching: enforce stricter checks
    const words = reply.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 10) {
        return simplifyToA1(reply, syllabusVocab, langCode);
    }

    // Check for complex grammar patterns (subjunctive, conditional, etc.)
    const complexGrammarRegex = /que\s+[a-z]+[ae]s|si\s+[a-z]+[ae]r|porque|había|tendré|quiera|subjuntivo|condicional|imperfecto/i;
    if (complexGrammarRegex.test(reply)) {
        return simplifyToA1(reply, syllabusVocab, langCode);
    }

    // Check sentence length (max 7 words per sentence for practice)
    const sentences = reply.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
        const sentenceWords = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        if (sentenceWords.length > 7) {
            return simplifyToA1(reply, syllabusVocab, langCode);
        }
    }

    // All checks passed
    return reply;
}