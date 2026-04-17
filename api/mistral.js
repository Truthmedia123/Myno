// api/mistral.js
export default async function handler(req, res) {
    // CORS headers for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.error('[api/mistral] Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, options } = req.body;

        // Try both possible environment variable names
        const apiKey = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY;

        if (!apiKey) {
            console.error('[api/mistral] CRITICAL: Missing Mistral API Key. Verify Vercel Environment Variables.');
            return res.status(500).json({
                error: 'Server configuration error: API key not found.'
            });
        }

        const model = options?.model || 'mistral-small';
        const temperature = options?.temperature ?? 0.3;
        const maxTokens = options?.maxTokens ?? 512;

        console.log(`[api/mistral] Forwarding request. Model: ${model}, Messages: ${messages.length}`);

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[api/mistral] Mistral API Error (${response.status}):`, errorText);
            return res.status(response.status).json({
                error: `Mistral API error: ${response.status}`,
                details: errorText
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('[api/mistral] Internal Server Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}