// src/lib/translationCache.js
import { callMistral } from './mistralClient';

const cache = new Map();
const pendingRequests = new Map(); // deduplicate concurrent requests

export async function getTranslation(word, targetLang, nativeLang = 'en') {
    const key = `${word}-${targetLang}-${nativeLang}`;

    // Check cache first
    if (cache.has(key)) {
        return cache.get(key);
    }

    // Deduplicate concurrent requests
    if (pendingRequests.has(key)) {
        console.log(`[translationCache] Waiting for pending translation of "${word}"`);
        return pendingRequests.get(key);
    }

    // Create new promise for this request
    const translationPromise = translateWithMistral(word, targetLang, nativeLang);
    pendingRequests.set(key, translationPromise);

    try {
        const translation = await translationPromise;
        cache.set(key, translation);
        return translation;
    } finally {
        pendingRequests.delete(key);
    }
}

async function translateWithMistral(word, targetLang, nativeLang) {
    const systemPrompt = `You are a translator. Translate the word "${word}" from ${targetLang} to ${nativeLang}. Return ONLY the translation, no explanations, no punctuation.`;

    try {
        const translation = await callMistral([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Translate "${word}"` }
        ], {
            temperature: 0.1,
            maxTokens: 50,
            model: 'mistral-small-latest'
        });

        // Clean up any extra whitespace or punctuation
        const cleanTranslation = translation.trim().replace(/[.,;!?]$/, '');
        console.log(`[translationCache] Translated "${word}" (${targetLang}→${nativeLang}): ${cleanTranslation}`);
        return cleanTranslation;
    } catch (error) {
        console.error(`[translationCache] Failed to translate "${word}":`, error);
        return null;
    }
}

export function clearTranslationCache() {
    cache.clear();
    pendingRequests.clear();
}