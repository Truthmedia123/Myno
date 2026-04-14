import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(messages, options) {
    return JSON.stringify({ messages, options });
}

export async function callMistral(messages, options = {}) {
    const { temperature = 0.3, maxTokens = 512, model = 'mistral-small-latest' } = options;
    const cacheKey = getCacheKey(messages, { temperature, maxTokens, model });

    if (cache.has(cacheKey)) {
        const entry = cache.get(cacheKey);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
            console.log('[Mistral] Cache hit');
            return entry.response;
        }
    }

    try {
        console.log('[Mistral] Calling model:', model);
        const chatResponse = await client.chat.complete({
            model,
            messages,
            temperature,
            maxTokens,
        });
        const response = chatResponse.choices?.[0]?.message?.content?.trim();
        if (!response) throw new Error('Empty response from Mistral');
        cache.set(cacheKey, { response, timestamp: Date.now() });
        return response;
    } catch (error) {
        console.error('[Mistral] Error:', error);
        return "I'm having trouble connecting. Please try again in a moment.";
    }
}

export async function mistralChatCompletion(messages, systemPrompt = '', options = {}) {
    const formatted = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
    return callMistral(formatted, options);
}