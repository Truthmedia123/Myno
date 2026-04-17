/**
 * Dynamic prompt builder for Groq API with context injection.
 * Adapts to user's CEFR level, weak phonemes, mastery scores, and scenario rules.
 * Prevents AI correction overload with structured output expectations.
 * @module promptBuilder
 */

import { getPhonemeTip } from '../curriculum/shared/phonemeGuide.js';
import { getMemory, formatMemoryContext } from './conversationMemory.js';

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

RESPONSE FORMAT:
Respond with a conversational reply in ${target_language} (2-3 sentences). If you notice an error, provide a brief correction. End with a follow-up question to keep the conversation flowing.

IMPORTANT:
- Keep corrections brief and focused on one major error per turn.
- Reference weak phonemes when relevant for pronunciation tips.
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
 * @param {Object|null} lessonFocus - Current lesson focus from lessonFlow.getFocus()
 * @returns {string} Complete prompt for Groq API
 */
export async function buildCurriculumPrompt(scenario, userProfile = null, syllabus = null, memoryContext = '', correctionLanguage = 'en', lessonFocus = null) {
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

    // Native language support (Native-Aware Immersion)
    let nativeLanguageGuidance = '';
    if (native_language && native_language.toLowerCase() !== target_language.toLowerCase()) {
        nativeLanguageGuidance = `
NATIVE LANGUAGE SUPPORT (${native_language}):
- User's native language is ${native_language}.
- Speak 90% in ${target_language}. This is essential for immersion.
- You may use ${native_language} for up to 10% of your response ONLY in these situations:
  1. To clarify a complex grammar point briefly.
  2. To provide a single word translation when user is clearly confused.
  3. To offer encouragement when user is frustrated.
- Example: "In ${native_language}, we say 'hola'. In ${target_language}, we say 'hello'."
- Never translate entire sentences. Keep ${native_language} usage minimal and purposeful.
`;
    }

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
    const grammarFocusObj = syllabus.grammarDetails?.[0] || syllabus.grammar?.[0];
    const grammarFocus = typeof grammarFocusObj === 'string' ? grammarFocusObj :
        (grammarFocusObj?.title || grammarFocusObj?.tip || 'basic sentence structure');
    const grammarTip = syllabus.grammarDetails?.[0]?.tip || 'Focus on correct word order and verb conjugation.';

    // Get all vocabulary words from syllabus for enforcement
    const allVocabWords = (syllabus.vocab || []).map(item => item.word);
    const targetVocab = allVocabWords.slice(0, 3).join(', ');
    const vocabText = targetVocab ? `When practicing ${target_language}, use simple ${cefrLevel} vocabulary: ${allVocabWords.join(', ')}. If you must use an advanced word, add English hint in parentheses: 'la cuenta (bill)'.` : '';

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

    // Add lesson context if available
    let lessonContext = '';
    if (lessonFocus) {
        const { type, target, knownWords = [], phonemeTip, grammarTip: focusGrammarTip } = lessonFocus;
        const knownWordsList = knownWords.slice(0, 5).join(', ');

        lessonContext = `CURRENT LESSON STEP: ${type} - Target: ${target}
USER KNOWN VOCAB: ${knownWordsList || 'none'}
PHONEME FOCUS: ${phonemeTip || 'none'}
GRAMMAR FOCUS: ${focusGrammarTip || 'none'}`;
    }

    // Pragmatics rule
    const pragmaticsRule = syllabus.pragmatics || 'Use appropriate politeness levels and cultural norms.';

    // DYNAMIC STATE DETECTION FOR ENGLISH A1 CONVERSATIONAL FLOW
    let adaptiveInstructions = '';
    if (memoryContext && target_language.toLowerCase() === 'english' && cefrLevel === 'A1') {
        // Parse memory context to detect conversation patterns
        const lines = memoryContext.split('\n').filter(line => line.trim());
        const userMessages = lines.filter(line =>
            line.toLowerCase().includes('user:') ||
            line.toLowerCase().includes('student:') ||
            (line.includes(':') && !line.toLowerCase().includes('ai:'))
        ).slice(-5); // Last 5 user messages

        // Detect repetitive short answers (3+ consecutive replies under 3 words)
        let consecutiveShort = 0;
        for (const msg of userMessages) {
            const content = msg.split(':').slice(1).join(':').trim();
            const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
            if (wordCount <= 2 && content.length > 0) {
                consecutiveShort++;
            } else {
                consecutiveShort = 0;
            }
        }

        // Detect quiz requests
        const hasQuizRequest = userMessages.some(msg =>
            msg.toLowerCase().includes('quiz') ||
            msg.toLowerCase().includes('test') ||
            msg.toLowerCase().includes('exam') ||
            msg.toLowerCase().includes('questionnaire')
        );

        // Build adaptive instructions
        if (consecutiveShort >= 3) {
            adaptiveInstructions += 'USER STATE: Giving repetitive short answers. Switch to open-ended question or change topic.\n';
        }
        if (hasQuizRequest) {
            adaptiveInstructions += 'USER STATE: Requested a quiz. Provide exactly 2 multiple-choice questions with 3 options each, then return to conversation.\n';
        }

        // Add dev logging
        if (import.meta.env?.DEV) {
            console.log('[promptBuilder] English A1 conversational analysis:', {
                userMessages: userMessages.length,
                consecutiveShort,
                hasQuizRequest,
                adaptiveInstructions
            });
        }
    }

    // Combine memory context
    const fullMemoryContext = memoryContext ? `${memoryContext}\n` : '';

    // Get structured memory context if user profile has ID
    let structuredMemoryContext = '';
    if (userProfile?.id) {
        try {
            const memory = await getMemory(userProfile.id);
            structuredMemoryContext = formatMemoryContext(memory);
        } catch (error) {
            console.warn('Failed to load conversation memory:', error);
        }
    }

    // Build the curriculum-injected prompt (concise for token limit)
    const prompt = `You are Myno, a friendly and encouraging ${target_language} tutor for a ${cefrLevel} learner.

SCENARIO: ${title} (CEFR ${cefr})
${scenarioPrompt}

TEACHING FOCUS:
- Grammar: ${grammarFocus} - ${grammarTip}
- Vocabulary: Use ${cefrLevel}-level words including: ${targetVocab || 'common beginner vocabulary'}
- Pronunciation: ${phonemeText || 'Focus on clear articulation'}
- Pragmatics: ${pragmaticsRule}

${vocabText}

${lessonContext ? `LESSON CONTEXT:\n${lessonContext}\n` : ''}

${structuredMemoryContext ? `CONVERSATION MEMORY:\n${structuredMemoryContext}\n` : ''}

${adaptiveInstructions}

${nativeLanguageGuidance}

${fullMemoryContext}

TEACHING RULES:
1. Keep responses to 2-3 sentences maximum
2. Correct only one major error per turn for ${cefrLevel} learners
3. Use simple, clear ${target_language} appropriate for ${cefrLevel} level
4. Be warm, encouraging, and patient
5. End with a follow-up question to continue the conversation

CONVERSATION ADAPTABILITY:
- If the user repeats the same question or seems stuck, gently pivot the conversation by introducing a new aspect of the scenario or asking a clarifying question.
- If the user expresses frustration (e.g., "this is too hard"), acknowledge their feelings and adjust the difficulty by simplifying the language or offering a hint.
- If the user goes off‑topic, acknowledge their interest but steer back to the scenario’s learning objectives within 1‑2 turns.
- If the user makes the same error repeatedly, provide a clear, focused correction and then shift to a different activity (e.g., “Let’s try a quick exercise with that word”).

Reply as Myno:`;

    // Debug logging for English A1 conversational flow
    if (import.meta.env?.DEV && target_language.toLowerCase() === 'english' && cefrLevel === 'A1') {
        console.log('[promptBuilder] Prompt debug:', {
            originalLength: prompt.length,
            hasConversationalFlow: prompt.includes('CONVERSATIONAL FLOW'),
            hasScenarioLock: prompt.includes('SCENARIO LOCK'),
            scenarioLockIndex: prompt.indexOf('SCENARIO LOCK'),
            conversationalFlowIndex: prompt.indexOf('CONVERSATIONAL FLOW'),
            isOverLimit: prompt.length > 1600
        });

        // Show the prompt from SCENARIO LOCK
        const scenarioLockIndex = prompt.indexOf('SCENARIO LOCK');
        if (scenarioLockIndex !== -1) {
            console.log('[promptBuilder] SCENARIO LOCK section:', prompt.substring(scenarioLockIndex, Math.min(scenarioLockIndex + 600, prompt.length)));
        }
    }

    // Log before sanitization
    console.log('[promptBuilder] Before sanitizePrompt:', {
        length: prompt.length,
        isOver1600: prompt.length > 1600,
        first100: prompt.substring(0, 100),
        last100: prompt.substring(Math.max(0, prompt.length - 100))
    });

    // Ensure token count <400 (approx 1600 chars)
    const sanitized = sanitizePrompt(prompt);

    // Log after sanitization
    console.log('[promptBuilder] After sanitizePrompt:', {
        length: sanitized.length,
        difference: prompt.length - sanitized.length,
        last100: sanitized.substring(Math.max(0, sanitized.length - 100))
    });

    return sanitized;
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