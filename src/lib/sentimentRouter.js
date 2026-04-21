/**
 * Deterministic sentiment detection for Myno AI Tutor
 * Routes to appropriate system prompts based on user message content
 */

/**
 * Detect user sentiment based on message content
 * @param {string} message - User message
 * @returns {'frustrated'|'confused'|'happy'|'neutral'} Sentiment category
 */
export function detectUserSentiment(message) {
    const lower = message.toLowerCase();

    // Frustration / repeated "no"
    if (lower.includes("no") && (lower.includes("told you") || lower.includes("never") || lower.includes("don't"))) {
        return 'frustrated';
    }

    // Confusion / asking for explanation
    if (lower.includes("what does") || lower.includes("don't understand") || lower.includes("explain")) {
        return 'confused';
    }

    // Happiness / enthusiasm
    if (lower.includes("love") || lower.includes("great") || lower.includes("happy") || lower.includes("yes")) {
        return 'happy';
    }

    return 'neutral';
}

/**
 * Get system prompt based on detected sentiment
 * @param {string} sentiment - Sentiment category
 * @param {string} targetLanguage - Target language (optional)
 * @param {string} cefrLevel - CEFR level (optional)
 * @returns {string} System prompt
 */
export function getSystemPrompt(sentiment, targetLanguage = 'English', cefrLevel = 'A1') {
    const prompts = {
        frustrated: `You are Myno. The user is frustrated. Do NOT repeat the same word. Immediately introduce a completely new word. Example: "That's totally fine! Let's try a different word: 'book'. Do you like to read?"`,
        confused: `You are Myno. The user is confused. Provide a simple explanation with an example. Skip greetings. Example: "A map is a picture of streets and places. For example, a treasure map shows where to find treasure!"`,
        happy: `You are Myno. The user is enthusiastic. Match their energy and praise them. Introduce a new word naturally. Example: "That's wonderful! You're doing great. Let's learn 'sun' - it's the big bright light in the sky. Can you say 'sun'?"`,
        neutral: `You are Myno, a friendly A1 English tutor. Speak in short, clear sentences. Introduce a new word. Example: "Let's learn a new word today: 'map'. A map is a picture of places. Have you seen a map before?"`
    };
    return prompts[sentiment] || prompts.neutral;
}

/**
 * Get system prompt file path based on sentiment
 * @param {string} sentiment - Sentiment category
 * @returns {string} File path to prompt file
 */
export function getSystemPromptPath(sentiment) {
    const paths = {
        frustrated: 'prompts/myno_frustrated.txt',
        confused: 'prompts/myno_confused.txt',
        happy: 'prompts/myno_happy.txt',
        neutral: 'prompts/myno_neutral.txt'
    };
    return paths[sentiment] || paths.neutral;
}