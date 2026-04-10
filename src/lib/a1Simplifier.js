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

    // Development debug flag - can be enabled via localStorage or environment
    const DEBUG = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem('debug_gentleSimplify') === 'true'
        : process.env.NODE_ENV === 'development';

    // Dev-only logging for Hindi debugging
    if (import.meta.env?.DEV && userLang === 'hi') {
        console.log('[a1Simplifier] Hindi mode: preFilter bypassed, phoneme keys:', phonemeKeys);
    }

    // Determine if syllabusVocab is a syllabus object with .vocab property
    let vocabArray = syllabusVocab;
    let syllabusPhonemes = [];
    if (syllabusVocab && typeof syllabusVocab === 'object' && !Array.isArray(syllabusVocab)) {
        // It's a syllabus object, extract the vocab array
        if (syllabusVocab.vocab) {
            vocabArray = syllabusVocab.vocab;
        }
        // Extract phonemes if available
        if (Array.isArray(syllabusVocab.phonemes)) {
            syllabusPhonemes = syllabusVocab.phonemes;
        }
    }

    // Strict array validation
    if (!Array.isArray(vocabArray)) {
        console.warn('[gentleSimplify] Invalid syllabus.vocab, returning raw reply');
        return text;
    }

    // Convert descriptive phoneme strings to simple matching keys
    const parsePhonemeKeys = (phonemes) => {
        if (!Array.isArray(phonemes)) return [];
        return phonemes.map(p => {
            const lower = p.toLowerCase();
            if (lower.includes('th')) return 'th';
            if (lower.includes('r vs l') || lower.includes('r/l')) return ['r', 'l'];
            if (lower.includes('retroflex')) return 'retroflex';
            if (lower.includes('aspirated')) return 'aspirated';
            if (lower.includes('nasal')) return 'nasal';
            if (lower.includes('vowel')) return 'vowel';
            // Fallback: extract first alphabetic token
            const match = lower.match(/[a-z]+/);
            return match ? match[0] : null;
        }).flat().filter(Boolean);
    };

    // Parse phonemes into simple keys for matching
    const phonemeKeys = parsePhonemeKeys(syllabusPhonemes);

    // Extract string from vocab object safely (handles {word:'x'} or 'x')
    const safeWord = (w) => typeof w === 'string' ? w : (w.word || '');

    // If text is in English, return as‑is (it's a translation/help)
    if (userLang === 'en' && isEnglish(text)) {
        if (DEBUG) console.log('[gentleSimplify] English text detected, returning as-is:', text.substring(0, 50));
        return text;
    }

    // Combine allowed vocab
    const allowedWords = new Set([
        ...EXPANDED_A1_VOCAB,
        ...vocabArray.map(w => safeWord(w).toLowerCase()).filter(Boolean)
    ]);

    if (DEBUG) {
        console.log('[gentleSimplify] Input:', text);
        console.log('[gentleSimplify] Syllabus phonemes:', syllabusPhonemes);
        console.log('[gentleSimplify] Parsed phoneme keys:', phonemeKeys);
        console.log('[gentleSimplify] Allowed words count:', allowedWords.size);
    }

    // STRICT key-based phoneme check - returns matching key or null
    const getMatchingPhonemeKey = (word, keys) => {
        const w = word.toLowerCase();
        for (const key of keys) {
            // Hindi/Devanagari specific rules
            if (key === 'retroflex' && /[टठडढण]/.test(word)) return 'retroflex';
            if (key === 'aspirated' && /[खघछझठढफभ]/.test(word)) return 'aspirated';
            if (key === 'nasal' && /[ङञणनम]/.test(word) && /ं$/.test(word)) return 'nasal'; // anusvara at end
            // Latin script rules
            if (key === 'th' && /th/.test(w)) return 'th';
            if (key === 'r' && /r/.test(w) && !/tr|dr|cr/.test(w)) return 'r'; // standalone r
            if (key === 'l' && /l/.test(w) && !/cl|pl|bl/.test(w)) return 'l'; // standalone l
            if (key === 'vowel' && /[aeiou]+/.test(w)) return 'vowel';
            // Fallback: only match if key appears as substring in Romanized form
            if (/[a-z]/.test(key) && w.includes(key)) return key;
        }
        return null;
    };

    // Split into sentences using multilingual punctuation
    const sentences = text.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0);
    const processedSentences = sentences.map((sentence, sentenceIdx) => {
        const words = sentence.trim().split(/\s+/);

        // Identify complex words that are new AND contain target phonemes
        const hintIndices = [];
        const hintKeys = []; // Store which key matched for each hint
        words.forEach((word, idx) => {
            const clean = stripPunctuation(word.toLowerCase());
            if (clean.length > 0 && !allowedWords.has(clean)) {
                // Word is new (not in allowed vocab)
                // Only add hint if: (a) phonemeKeys.length > 0, (b) word contains target phoneme, (c) hint count < 2 per sentence
                if (phonemeKeys.length > 0) {
                    const matchingKey = getMatchingPhonemeKey(clean, phonemeKeys);
                    if (matchingKey) {
                        // Word contains target phoneme - add hint with the key
                        if (DEBUG) console.log(`[gentleSimplify] Sentence ${sentenceIdx}, word "${word}": New word contains target phoneme "${matchingKey}", adding hint`);
                        hintIndices.push(idx);
                        hintKeys[idx] = matchingKey;
                    } else {
                        // No phoneme match - SKIP hint
                        if (DEBUG) {
                            console.log(`[gentleSimplify] Sentence ${sentenceIdx}, word "${word}": New word but NO target phoneme match, skipping hint`);
                        }
                    }
                } else {
                    // No phonemes defined - SKIP hint (fallback removed)
                    if (DEBUG) {
                        console.log(`[gentleSimplify] Sentence ${sentenceIdx}, word "${word}": New word but no phonemes defined, skipping hint (fallback removed)`);
                    }
                }
            } else if (DEBUG && clean.length > 0) {
                console.log(`[gentleSimplify] Sentence ${sentenceIdx}, word "${word}": Already in allowed vocab, skipping`);
            }
        });

        // Limit hints per sentence: max 1 for Hindi, max 2 for other languages
        const maxHints = userLang === 'hi' ? 1 : 2;
        const hintIndicesLimited = hintIndices.slice(0, maxHints);
        if (DEBUG && hintIndices.length > maxHints) {
            console.log(`[gentleSimplify] Sentence ${sentenceIdx}: Limited hints from ${hintIndices.length} to ${maxHints} (${userLang} mode)`);
        }

        const newWords = words.map((word, idx) => {
            if (!hintIndicesLimited.includes(idx)) return word;
            const matchingKey = hintKeys[idx];
            // Keep original word and add phoneme key hint in parentheses
            const result = `${word} (${matchingKey})`;
            if (DEBUG) console.log(`[gentleSimplify] Sentence ${sentenceIdx}, word "${word}": Adding hint with key "${matchingKey}" -> "${result}"`);
            return result;
        });

        return newWords.join(' ');
    });

    let result = processedSentences.join('. ');
    if (result.length > 0 && !endsWithSentencePunctuation(result)) {
        result += '.';
    }

    if (DEBUG) {
        console.log('[gentleSimplify] Result:', result);
        console.log('[gentleSimplify] Processing complete');
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
    let finalReply = reply;

    // Apply English‑specific grammar and word‑pacing enforcement
    const lang = syllabus.language || 'en';
    if (lang === 'en') {
        finalReply = enforceQuestionGrammar(finalReply, lang);
        finalReply = enforceWordPacing(finalReply, syllabus, lang);
    }

    return finalReply;
}

/**
 * Enforce A1‑level English question grammar.
 * Fixes common errors like "What are you?" → "How are you?"
 * @param {string} reply - AI reply text
 * @param {string} lang - Language code ('en' for English)
 * @returns {string} Grammar‑corrected reply
 */
export function enforceQuestionGrammar(reply, lang) {
    if (!reply || typeof reply !== 'string') return reply;
    if (lang !== 'en') return reply; // Only for English

    let corrected = reply;

    // Fix common A1 English question errors
    corrected = corrected.replace(/\bWhat are you\??/gi, 'How are you?');
    corrected = corrected.replace(/\bYou are happy\? What are you\??/gi, 'Are you happy? How are you?');
    corrected = corrected.replace(/\bWhat is your name\?/gi, 'What is your name?'); // Already correct, but ensures proper punctuation
    corrected = corrected.replace(/\bWhere you live\?/gi, 'Where do you live?');
    corrected = corrected.replace(/\bYou like pizza\?/gi, 'Do you like pizza?');
    corrected = corrected.replace(/\bYou can speak English\?/gi, 'Can you speak English?');
    corrected = corrected.replace(/\bYou have brother\?/gi, 'Do you have a brother?');
    corrected = corrected.replace(/\bYou go school\?/gi, 'Do you go to school?');

    // Ensure question starters are A1‑appropriate
    const questionStarters = ['How', 'What', 'Where', 'Do you', 'Can you', 'Is there', 'Are there'];
    const lines = corrected.split('\n');
    const correctedLines = lines.map(line => {
        if (line.trim().endsWith('?')) {
            const firstWord = line.trim().split(' ')[0];
            if (!questionStarters.some(starter => firstWord.toLowerCase().startsWith(starter.toLowerCase()))) {
                // If question doesn't start with A1 starter, prepend "Do you" (most common)
                return `Do you ${line.trim().toLowerCase()}`;
            }
        }
        return line;
    });

    return correctedLines.join('\n');
}

/**
 * Enforce strict 2‑new‑word‑per‑turn pacing for English A1.
 * If reply introduces >2 new vocabulary words, keep only the first 2 and preserve the rest as-is.
 * @param {string} reply - AI reply text
 * @param {Object} syllabus - Current syllabus with vocab array
 * @param {string} lang - Language code
 * @returns {string} Word‑pacing‑enforced reply
 */
export function enforceWordPacing(reply, syllabus, lang) {
    if (!reply || typeof reply !== 'string') return reply;
    if (lang !== 'en') return reply; // Only for English A1

    const MAX_REPLACEMENTS = 2; // Hard limit for English A1 readability

    const syllabusVocab = syllabus?.vocab || [];
    const safeWord = (w) => typeof w === 'string' ? w : (w.word || '');

    // Known vocab words (lowercase for comparison)
    const knownVocab = new Set(syllabusVocab.map(w => safeWord(w).toLowerCase()).filter(Boolean));

    // Common English function words to ALWAYS ignore (A1 learners know these)
    const FUNCTION_WORDS = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'if', 'when', 'where', 'why', 'how',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
        'my', 'your', 'his', 'her', 'its', 'our', 'their',
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
        'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
        'not', 'no', 'yes', 'ok', 'okay', 'please', 'thank', 'thanks', 'sorry'
    ]);

    // Extract words from reply (preserve original case for replacement)
    const wordMatches = [...reply.matchAll(/\b([a-z']+)\b/gi)];
    const newWordsInReply = [];

    // Identify NEW content words (not in known vocab AND not a function word)
    for (const match of wordMatches) {
        const word = match[1].toLowerCase();
        const original = match[0];

        // Skip if: function word, already counted, or in known vocab
        if (FUNCTION_WORDS.has(word) || knownVocab.has(word) || newWordsInReply.some(w => w.word === word)) {
            continue;
        }

        // Only count words with 3+ letters as "new vocabulary"
        if (word.length >= 3) {
            newWordsInReply.push({
                word: original,      // Keep original case for regex
                lower: word,         // Lowercase for comparison
                index: match.index   // Position in string
            });
        }
    }

    // If we have more than MAX_REPLACEMENTS new words, we need to replace the excess
    if (newWordsInReply.length > MAX_REPLACEMENTS) {
        // Keep first MAX_REPLACEMENTS new words, replace the rest with [...]
        // But cap replacements at MAX_REPLACEMENTS (2) to avoid over-processing
        const wordsToKeep = newWordsInReply.slice(0, MAX_REPLACEMENTS);
        const wordsToReplace = newWordsInReply.slice(MAX_REPLACEMENTS);

        // Cap replacements at MAX_REPLACEMENTS (2) - only replace first MAX_REPLACEMENTS excess words
        const cappedWordsToReplace = wordsToReplace.slice(0, MAX_REPLACEMENTS);

        // Start with the original reply
        let result = reply;

        // Process in reverse order (from end to beginning) to preserve indices
        for (let i = cappedWordsToReplace.length - 1; i >= 0; i--) {
            const wordInfo = cappedWordsToReplace[i];
            const word = wordInfo.word;
            const index = wordInfo.index;

            // Find the exact position and length of the word
            // We need to handle case-insensitive matching but preserve original case
            const before = result.substring(0, index);
            const after = result.substring(index);

            // Check if the word at this index matches (case-insensitive)
            const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
            const match = after.match(wordRegex);

            if (match && match.index === 0) {
                // Replace this specific occurrence with [...]
                result = before + '[...]' + after.substring(match[0].length);
            }
        }

        return result;
    }

    return reply;
}

/**
 * Final cleanup to fix garbled output from the simplification pipeline.
 * Removes duplicate "[...]" markers, fixes punctuation, and cleans up spacing.
 * @param {string} text - Text to clean up
 * @returns {string} Cleaned text
 */
export function finalCleanup(text) {
    if (!text || typeof text !== 'string') return text;

    // Development debug flag - can be enabled via localStorage or environment
    const DEBUG = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem('debug_finalCleanup') === 'true'
        : process.env.NODE_ENV === 'development';

    let cleaned = text;

    if (DEBUG) {
        console.log('[finalCleanup] Input:', text);
    }

    // Safety check: if >50% of text is Devanagari, skip Latin-focused cleanup steps
    const devanagariCount = (cleaned.match(/[\u0900-\u097F]/g) || []).length;
    const totalChars = cleaned.length;
    const isMostlyDevanagari = totalChars > 0 && (devanagariCount / totalChars) > 0.5;

    if (DEBUG && isMostlyDevanagari) {
        console.log('[finalCleanup] Mostly Devanagari text detected, skipping Latin-focused cleanup');
    }

    // Fix orphaned punctuation and spacing issues from preFilterReply replacements
    // Use Unicode-aware patterns that work with any script
    cleaned = cleaned.replace(/^[\p{P}\p{S}\s]+/u, '').trim();
    cleaned = cleaned.replace(/[\p{P}\p{S}\s]+$/u, '').trim();
    // Fix double/triple punctuation from replacements (but preserve ... ellipsis)
    cleaned = cleaned.replace(/([!?])\s*\1+/g, '$1');  // !! → !, ?? → ?
    // Don't handle .. or ... here - let existing logic handle them

    // NEW: Remove empty hint markers left by gentleSimplify
    // Remove empty parentheses and orphaned markers
    cleaned = cleaned.replace(/\(\s*\)/g, ''); // () → ''
    cleaned = cleaned.replace(/\[\s*\]/g, ''); // [] → ''
    cleaned = cleaned.replace(/\(\s*\[\.\.\.\]\s*\)/g, '[...]'); // ([...]) → [...]

    // NEW: Remove phoneme hints that contain spaces or parentheses (e.g., "(th sounds)" → remove entirely)
    // This handles legacy hints or any descriptive phoneme hints that shouldn't appear
    // Match parentheses containing spaces: (th sounds) → remove
    const beforeSpaceRemoval = cleaned;
    cleaned = cleaned.replace(/\s*\([^)]*\s[^)]*\)\s*/g, ' ');
    if (DEBUG && beforeSpaceRemoval !== cleaned) {
        console.log('[finalCleanup] Removed phoneme hints containing spaces');
    }

    // Match parentheses containing parentheses: (th (sounds)) → remove
    const beforeNestedRemoval = cleaned;
    cleaned = cleaned.replace(/\s*\([^)]*\([^)]*\)[^)]*\)\s*/g, ' ');
    if (DEBUG && beforeNestedRemoval !== cleaned) {
        console.log('[finalCleanup] Removed phoneme hints containing nested parentheses');
    }

    // Clean up double spaces left behind
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

    // Devanagari spacing: remove spaces only within clear conjuncts, preserve spaces between words
    // This is a conservative approach - only remove spaces when we see conjunct patterns
    if (/[\u0900-\u097F]{3,}/.test(cleaned)) {
        // Pattern 1: Remove spaces between consonants that are part of a conjunct
        // Match: consonant + optional halant + space + consonant
        cleaned = cleaned.replace(/([क-हक़-य़]्?)\s+(?=[क-हक़-य़])/gu, '$1');

        // Pattern 2: But preserve spaces after clear word endings
        // Restore spaces after vowels, anusvara, visarga
        // This is a simplified fix - in practice, the above should handle most cases
    }

    // Phase 1: Protect special patterns from being modified
    const PLACEHOLDERS = {
        BRACKET_ELLIPSIS: '___BRACKET_ELLIPSIS___',
        TRIPLE_DOT: '___TRIPLE_DOT_ELLIPSIS___'
    };

    // Protect "[...]" markers first
    cleaned = cleaned.replace(/\[\.\.\.\]/g, PLACEHOLDERS.BRACKET_ELLIPSIS);

    // Protect standalone "..." ellipsis (3+ dots not inside brackets)
    cleaned = cleaned.replace(/\.{3,}/g, PLACEHOLDERS.TRIPLE_DOT);

    // Phase 2: Basic punctuation fixes
    // Reduce multiple punctuation marks
    cleaned = cleaned.replace(/([!?])\1+/g, '$1');  // !! → !, ?? → ?
    cleaned = cleaned.replace(/\.{2,}/g, '.');      // .. → .
    cleaned = cleaned.replace(/,{2,}/g, ',');       // ,, → ,

    // Fix spacing around punctuation
    cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1');  // Remove space before punctuation
    cleaned = cleaned.replace(/([.,!?;:])(?![ \t\n\r.,!?;:]|$)/g, '$1 ');  // Add space after if missing

    // Fix multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');

    // Phase 3: Restore protected patterns
    cleaned = cleaned.replace(new RegExp(PLACEHOLDERS.TRIPLE_DOT, 'g'), '...');
    cleaned = cleaned.replace(new RegExp(PLACEHOLDERS.BRACKET_ELLIPSIS, 'g'), '[...]');

    // Phase 4: Post-restoration cleanup for "[...]" markers
    // Remove duplicate "[...]" markers
    cleaned = cleaned.replace(/\[\.\.\.\]\s*\[\.\.\.\]/g, '[...]');

    // Fix spacing around "[...]" - be more careful about punctuation
    // Don't add space if next character is punctuation
    cleaned = cleaned.replace(/(\S)\[\.\.\.\]/g, '$1 [...]');
    cleaned = cleaned.replace(/\[\.\.\.\](?=[a-zA-Z0-9])/g, '[...] ');

    // Clean up any double spaces that may have been created
    cleaned = cleaned.replace(/\s+\[\.\.\.\]/g, ' [...]');
    cleaned = cleaned.replace(/\[\.\.\.\]\s+/g, '[...] ');

    // Remove "[...]" at sentence beginnings
    cleaned = cleaned.replace(/^\[\.\.\.\]\s*/, '');

    // Handle "[...]" followed by punctuation - no space between
    cleaned = cleaned.replace(/\[\.\.\.\]\s*([.,!?;:])/g, '[...]$1');

    // Handle punctuation followed by "[...]" - space before
    cleaned = cleaned.replace(/([.,!?;:])\s*\[\.\.\.\]/g, '$1 [...]');

    // Phase 5: Final spacing and capitalization
    // Remove any leading dot that might be before text
    cleaned = cleaned.replace(/^\.\s*/, '');

    // Simple capitalization: capitalize first character if it's lowercase letter
    if (cleaned.length > 0) {
        const firstChar = cleaned[0];
        if (firstChar && firstChar === firstChar.toLowerCase() && /[a-z]/.test(firstChar)) {
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }
    }

    // Handle capitalization after sentence-ending punctuation
    // We'll use a simple regex that works for most cases
    // First, handle cases where punctuation is directly attached to words
    cleaned = cleaned.replace(/([a-z])([.!?])\s+([a-z])/g,
        (match, before, punct, after) => before + punct + ' ' + after.toUpperCase());

    // Handle cases where there might be [...] or ... before punctuation
    // For simplicity, we'll just capitalize after .!? that aren't part of ellipsis
    // This is a pragmatic approach that works for A1 level text
    let result = '';
    let capitalizeNext = true;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        const nextChar = i + 1 < cleaned.length ? cleaned[i + 1] : '';

        // If we're at a space and next character is a letter
        if (char === ' ' && nextChar.match(/[a-z]/) && capitalizeNext) {
            // Check if this is after sentence-ending punctuation
            // Look back for the last non-space character
            let j = i - 1;
            while (j >= 0 && cleaned[j] === ' ') j--;

            if (j >= 0 && cleaned[j].match(/[.!?]/)) {
                // Check if it's after ellipsis
                let k = j - 1;
                let ellipsisCount = 0;
                while (k >= 0 && cleaned[k] === '.') {
                    ellipsisCount++;
                    k--;
                }

                // If we found 2+ dots before (making ...), don't capitalize
                if (ellipsisCount >= 2) {
                    result += char;
                    continue;
                }

                // Check for [...] pattern
                if (j >= 4 && cleaned.substring(j - 4, j + 1) === '[...]') {
                    result += char;
                    continue;
                }

                // Capitalize the next letter
                result += ' ' + nextChar.toUpperCase();
                i++; // Skip the lowercase letter we just capitalized
                continue;
            }
        }

        result += char;

        // Update capitalizeNext flag
        if (char.match(/[.!?]/)) {
            // Check if this is a true sentence end (not part of abbreviation)
            // Simple heuristic: if there's a space after, it's sentence end
            if (nextChar === ' ') {
                capitalizeNext = true;
            }
        } else if (char.match(/[a-zA-Z]/)) {
            capitalizeNext = false;
        }
    }

    cleaned = result;

    // Final cleanup - fix any double spaces and trim
    cleaned = cleaned.replace(/\s+/g, ' ');
    const finalResult = cleaned.trim();

    // If filtering destroyed sentence structure, fallback to simple prompt
    const words = finalResult.split(/\s+/).filter(w => w.length > 0);
    const blocks = (finalResult.match(/\[\.\.\.\]/g) || []).length;
    if (words.length > 3 && blocks / words.length > 0.3) {
        if (DEBUG) {
            console.log('[finalCleanup] Readability guard triggered:', { words: words.length, blocks, ratio: blocks / words.length });
        }
        return "Let's practice simple words. Try: hello, water, yes, no.";
    }

    if (DEBUG) {
        console.log('[finalCleanup] Result:', finalResult);
    }

    return finalResult;
}

// Pre-filter: block replies with words NOT in syllabus before they reach user
export function preFilterReply(reply, syllabus, lang) {
    if (!reply || typeof reply !== 'string') return reply;
    if (!syllabus || !Array.isArray(syllabus.vocab)) {
        console.warn('[preFilterReply] Invalid syllabus.vocab, skipping filter');
        return reply;
    }

    // For English A1 and complex scripts (Hindi, Japanese, Korean, Chinese, Arabic),
    // return raw reply immediately (rely on prompt constraints + pacing)
    if (lang === 'en' || lang === 'hi' || lang === 'ja' || lang === 'ko' || lang === 'zh' || lang === 'ar') {
        // Dev-only logging for Hindi debugging
        if (import.meta.env?.DEV && lang === 'hi') {
            console.log('[a1Simplifier] Hindi mode: preFilter bypassed');
        }
        return reply;
    }

    // Non-English: conservative filter to preserve readability
    const safeWord = (w) => typeof w === 'string' ? w : (w.word || '');

    // Common English function words to ALWAYS ignore (A1 learners know these)
    const FUNCTION_WORDS = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'if', 'when', 'where', 'why', 'how',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
        'my', 'your', 'his', 'her', 'its', 'our', 'their',
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
        'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
        'not', 'no', 'yes', 'ok', 'okay', 'please', 'thank', 'thanks', 'sorry'
    ]);

    // Core A1 allowlist (beyond travel)
    const A1_ALLOWLIST = new Set([
        // Travel (existing)
        'hello', 'hi', 'name', 'where', 'from', 'water', 'yes', 'no', 'please', 'thank',
        'sorry', 'good', 'bad', 'help', 'friend', 'house', 'food', 'taxi', 'hotel',
        'airport', 'ticket',
        // Core A1 emotions/actions
        'happy', 'sad', 'tired', 'hungry', 'thirsty', 'like', 'want', 'need', 'go', 'come',
        'see', 'eat', 'drink', 'sleep', 'work', 'play', 'love', 'know', 'think', 'say',
        'tell', 'ask', 'answer',
        // Common descriptors
        'big', 'small', 'new', 'old', 'hot', 'cold', 'fast', 'slow', 'easy', 'hard',
        'nice', 'bad', 'right', 'wrong', 'here', 'there', 'today', 'tomorrow', 'now',
        'later', 'again', 'also', 'only', 'very', 'really', 'just', 'then', 'so', 'but',
        'and', 'or', 'because', 'if', 'when'
    ]);

    // Known vocabulary from syllabus
    const knownVocab = new Set(syllabus.vocab.map(w => safeWord(w).toLowerCase()).filter(Boolean));

    // Find words in reply that are candidates for blocking
    const wordMatches = [...reply.matchAll(/\b([a-z']+)\b/gi)];
    const unexpected = [];

    for (const match of wordMatches) {
        const word = match[1].toLowerCase();
        const original = match[0];

        // Condition (a): ≥5 letters (more conservative)
        if (word.length < 5) continue;
        // Condition (b): NOT in syllabus.vocab
        if (knownVocab.has(word)) continue;
        // Condition (c): NOT in FUNCTION_WORDS
        if (FUNCTION_WORDS.has(word)) continue;
        // Condition (d): NOT in A1 allowlist
        if (A1_ALLOWLIST.has(word)) continue;

        // Word meets all blocking criteria
        unexpected.push(original);
    }

    // Only replace if ≥5 unexpected words found (more conservative)
    if (unexpected.length >= 5) {
        // Build regex with word boundaries (case-insensitive)
        const pattern = unexpected.map(w => `\\b${w}\\b`).join('|');
        return reply.replace(new RegExp(pattern, 'gi'), '[...]');
    }

    return reply;
}