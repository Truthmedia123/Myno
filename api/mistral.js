// Vercel serverless function to proxy Mistral API requests
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, options } = req.body;
    const apiKey = process.env.MISTRAL_API_KEY; // Server-side only

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: options.model || 'mistral-small-latest',
                messages,
                temperature: options.temperature || 0.3,
                max_tokens: options.maxTokens || 512,
            }),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Mistral proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}