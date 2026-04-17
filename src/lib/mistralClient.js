// Remove the Mistral SDK import, now using fetch to our own API
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(messages, options) {
    return JSON.stringify({ messages, options });
}

// Sanitize messages to only include role and content fields
function sanitizeMessages(messages) {
    if (!Array.isArray(messages)) return [];

    return messages.map(msg => {
        // Ensure we have a valid message object
        if (!msg || typeof msg !== 'object') return { role: 'user', content: '' };

        // Extract only role and content, ensure content is a string
        const sanitized = {
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: String(msg.content || '')
        };

        // Handle system role separately (should be preserved)
        if (msg.role === 'system') {
            sanitized.role = 'system';
        }

        return sanitized;
    });
}

export async function callMistral(messages, options = {}) {
    const { temperature = 0.3, maxTokens = 512, model = 'mistral-small' } = options;

    // Sanitize messages before creating cache key and sending to API
    const sanitizedMessages = sanitizeMessages(messages);
    const cacheKey = getCacheKey(sanitizedMessages, { temperature, maxTokens, model });

    if (cache.has(cacheKey)) {
        const entry = cache.get(cacheKey);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
            console.log('[Mistral] Cache hit');
            return entry.response;
        }
    }

    try {
        console.log('[Mistral] Calling model via proxy:', model);
        console.log('[Mistral] Sanitized messages count:', sanitizedMessages.length);

        const payload = {
            model,
            messages: sanitizedMessages,
            temperature,
            max_tokens: maxTokens  // Ensure snake_case for API compatibility
        };

        const endpoint = import.meta.env.DEV ? '/api/mistral' : '/api/mistral';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Mistral] API error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('Empty response from Mistral');

        cache.set(cacheKey, { response: text, timestamp: Date.now() });
        return text;
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