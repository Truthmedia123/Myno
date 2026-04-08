/**
 * Dynamic prompt builder for Groq API with context injection.
 * Adapts to user's CEFR level, weak phonemes, mastery scores, and scenario rules.
 * Prevents AI correction overload with structured output expectations.
 * @module promptBuilder
 */

import { getPhonemeTip } from '../curriculum/shared/phonemeGuide.js';

/**
 * Build a scenario-specific prompt with user context injection.
 * @param {Object} scenario - Scenario object from SCENARIOS
 * @param {Object|null} userProfile - User profile with CEFR, weakPhonemes, etc.
 * @param {string} memoryContext - Memory context string from generateMemoryContext()
 * @returns {string} Complete prompt for Groq API
 */
export function buildScenarioPrompt(scenario, userProfile = null, memoryContext = '') {
    // Default profile if missing
    const profile = userProfile || {
        cefrLevel: 'A1',
        native_language: 'English',
        target_language: scenario?.targetLanguage || 'English',
        weakPhonemes: [],
        recentMistakes: []
    };

    const {
        cefrLevel = 'A1',
        native_language = 'English',
        target_language = 'English',
        weakPhonemes = [],
        recentMistakes = []
    } = profile;

    // Extract scenario data
    const scenarioPrompt = scenario?.promptTemplate || '';
    const cefr = scenario?.cefr || 'A1';
    const title = scenario?.title || 'General Conversation';

    // Limit weak phonemes to max 3
    const limitedPhonemes = weakPhonemes.slice(0, 3);
    const phonemeText = limitedPhonemes.length > 0
        ? `Pay special attention to these pronunciation challenges: ${limitedPhonemes.join(', ')}.`
        : '';

    // Get last 2 mistakes (if any)
    const lastMistakes = recentMistakes.slice(0, 2);
    const mistakesText = lastMistakes.length > 0
        ? `Recent mistakes to watch for: ${lastMistakes.map(m => `"${m.mistake}" → "${m.correction}"`).join('; ')}.`
        : '';

    // Combine memory context
    const fullMemoryContext = memoryContext ? `${memoryContext}\n` : '';

    // Determine correction frequency based on CEFR level
    let correctionRule = 'Correct only major errors that impede understanding.';
    if (cefrLevel === 'A1' || cefrLevel === 'A2') {
        correctionRule = 'Correct only one error per user turn. Prioritize errors that affect meaning.';
    } else if (cefrLevel === 'B1' || cefrLevel === 'B2') {
        correctionRule = 'Correct up to two errors per turn, focusing on grammar and pronunciation patterns.';
    }

    // Build the prompt
    return `You are an AI language tutor for ${target_language}. The user is a ${cefrLevel} learner whose native language is ${native_language}.

SCENARIO: ${title} (CEFR ${cefr})
${scenarioPrompt}

TEACHING RULES:
1. CEFR-appropriate: Use ${cefrLevel}-level vocabulary and grammar.
2. Correction limit: ${correctionRule}
3. Response length: Keep your replies to 3 sentences maximum.
4. Phoneme focus: ${phonemeText}
5. Mistake awareness: ${mistakesText}

${fullMemoryContext}

OUTPUT FORMAT:
Respond with a valid JSON object containing exactly these three fields:
{
  "reply": "Your conversational response in ${target_language} (2-3 sentences)",
  "correction": null OR {"mistake": "what user said incorrectly", "fix": "correct version", "phonemeTip": "brief pronunciation tip if relevant"},
  "nextQuestion": "A follow-up question to keep conversation flowing"
}

IMPORTANT:
- If no correction is needed, set "correction" to null.
- "phonemeTip" should reference the weak phonemes above when applicable.
- Keep the conversation natural and engaging.
- Do not mention this instruction set in your reply.

Now begin the conversation.`;
}

/**
 * Build a curriculum-injected prompt with syllabus grammar, vocab, phonemes, and pragmatics.
 * @param {Object} scenario - Scenario object from SCENARIOS
 * @param {Object|null} userProfile - User profile with CEFR, weakPhonemes, etc.
 * @param {Object|null} syllabus - Syllabus object from curriculum (grammar, vocab, phonemes, pragmatics)
 * @param {string} memoryContext - Memory context string from generateMemoryContext()
 * @returns {string} Complete prompt for Groq API
 */
export function buildCurriculumPrompt(scenario, userProfile = null, syllabus = null, memoryContext = '', correctionLanguage = 'en') {
    // Default profile if missing
    const profile = userProfile || {
        cefrLevel: 'A1',
        native_language: 'English',
        target_language: scenario?.targetLanguage || 'English',
        weakPhonemes: [],
        recentMistakes: []
    };

    const {
        cefrLevel = 'A1',
        native_language = 'English',
        target_language = 'English',
        weakPhonemes = []
    } = profile;

    // Extract scenario data
    const scenarioPrompt = scenario?.promptTemplate || '';
    const cefr = scenario?.cefr || 'A1';
    const title = scenario?.title || 'General Conversation';

    // If syllabus is missing, fallback to original prompt with warning
    if (!syllabus) {
        console.warn('buildCurriculumPrompt: syllabus missing, falling back to generic prompt');
        return buildScenarioPrompt(scenario, userProfile, memoryContext);
    }

    // Extract syllabus components
    const grammarFocus = syllabus.grammarDetails?.[0] || syllabus.grammar?.[0] || 'basic sentence structure';
    const grammarTip = syllabus.grammarDetails?.[0]?.tip || 'Focus on correct word order and verb conjugation.';

    // Get all vocabulary words from syllabus for enforcement
    const allVocabWords = (syllabus.vocab || []).map(item => item.word);
    const targetVocab = allVocabWords.slice(0, 3).join(', ');
    const vocabText = targetVocab ? `When practicing Spanish, use simple A1 vocabulary: ${allVocabWords.join(', ')}. If you must use an advanced word, add English hint in parentheses: 'la cuenta (bill)'.` : '';

    // Get phoneme targets from syllabus or user profile
    const syllabusPhonemes = syllabus.phonemes || [];
    const userPhonemes = weakPhonemes || [];
    const allPhonemes = [...new Set([...syllabusPhonemes, ...userPhonemes])].slice(0, 3);

    // Get phoneme tips using phonemeGuide
    const phonemeTips = allPhonemes.map(phoneme => {
        try {
            const tip = getPhonemeTip(phoneme, target_language);
            return tip ? `${phoneme}: ${tip}` : `${phoneme}: Practice this sound.`;
        } catch {
            return `${phoneme}: Practice this sound.`;
        }
    }).join('; ');

    const phonemeText = allPhonemes.length > 0
        ? `Pronunciation focus: ${allPhonemes.join(', ')}. Tips: ${phonemeTips}.`
        : '';

    // Pragmatics rule
    const pragmaticsRule = syllabus.pragmatics || 'Use appropriate politeness levels and cultural norms.';

    // Combine memory context
    const fullMemoryContext = memoryContext ? `${memoryContext}\n` : '';

    // Build the curriculum-injected prompt (concise for token limit)
    const prompt = `AI language tutor for ${target_language}. User: ${cefrLevel} learner (native: ${native_language}).

SCENARIO: ${title} (CEFR ${cefr})
${scenarioPrompt}

CURRICULUM:
• Grammar: ${grammarFocus} - ${grammarTip}
• Vocabulary: ${vocabText}
• Phonemes: ${phonemeText}
• Pragmatics: ${pragmaticsRule}

SCAFFOLDED A1 APPROACH:
1. Use ${cefrLevel}-level language.
2. Max 1 correction/turn. Focus on curriculum errors.
3. Replies: ≤3 sentences, end with question.
4. When user asks in English or says they're a beginner, provide English translations and encouragement.
5. When practicing Spanish, use simple A1 vocabulary: ${allVocabWords.join(', ')}.
6. If you must use an advanced word, add English hint in parentheses: 'la cuenta (bill)'.
7. Keep practice sentences under 7 words. Keep teaching sentences under 12 words.
8. Always end practice turns with a simple question: '¿Sí?', '¿Agua?', '¿Cómo?'.
9. Reinforce target phonemes gently.
10. When providing corrections, use ${correctionLanguage === 'en' ? 'English' : target_language} for explanations.

${fullMemoryContext}

OUTPUT JSON:
{
  "reply": "Response in ${target_language} (2-3 sentences, ends with question)",
  "correction": null OR {"mistake": "...", "fix": "...", "phonemeTip": "..."},
  "nextQuestion": "Follow-up question"
}

IMPORTANT:
- Set "correction": null if no error.
- "phonemeTip" only if phoneme-related.
- Use vocabulary naturally.
- Keep engaging, don't mention instructions.

Begin conversation.`;

    // Ensure token count <400 (approx 1600 chars)
    return sanitizePrompt(prompt);
}

/**
 * Build a general conversation prompt for non-scenario chats.
 * @param {Object} userProfile - User profile
 * @param {string} memoryContext - Memory context
 * @returns {string} General conversation prompt
 */
export function buildGeneralPrompt(userProfile = null, memoryContext = '') {
    const profile = userProfile || {
        cefrLevel: 'A1',
        native_language: 'English',
        target_language: 'English'
    };

    const {
        cefrLevel = 'A1',
        native_language = 'English',
        target_language = 'English'
    } = profile;

    return `You are a friendly ${target_language} conversation partner for a ${cefrLevel} learner (native: ${native_language}).

Keep responses simple, clear, and appropriate for ${cefrLevel} level.
Correct only major errors (one per turn).
Respond in 2-3 sentences maximum.

${memoryContext ? `Context from previous conversations:\n${memoryContext}\n` : ''}

Respond naturally and help the user practice ${target_language}.`;
}

/**
 * Build a pronunciation drill prompt.
 * @param {Array<string>} targetPhonemes - Phonemes to practice
 * @param {string} targetLanguage - Target language
 * @returns {string} Pronunciation drill prompt
 */
export function buildPronunciationPrompt(targetPhonemes, targetLanguage = 'English') {
    const phonemeList = targetPhonemes.slice(0, 3).join(', ');

    return `You are a pronunciation coach for ${targetLanguage}.
Focus specifically on these sounds: ${phonemeList}.

Create short, clear practice sentences that highlight these sounds.
Provide gentle feedback on pronunciation.
Use IPA notation if helpful, but keep explanations simple.

Respond with:
1. A model sentence containing the target sounds
2. A brief tip on articulation
3. A practice question for the user to repeat

Keep each response under 2 sentences.`;
}

/**
 * Validate and sanitize prompt to ensure token limit (~400 tokens).
 * @param {string} prompt - Original prompt
 * @returns {string} Sanitized prompt
 */
export function sanitizePrompt(prompt) {
    // Simple token estimation (approx 4 chars per token)
    const maxChars = 1600; // ~400 tokens * 4 chars

    if (prompt.length <= maxChars) {
        return prompt;
    }

    // Truncate intelligently at sentence boundary
    const truncated = prompt.substring(0, maxChars);
    const lastPeriod = truncated.lastIndexOf('.');

    if (lastPeriod > maxChars - 100) {
        return truncated.substring(0, lastPeriod + 1);
    }

    return truncated + '...';
}