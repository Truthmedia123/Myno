// Test with debug logging
// Mock import.meta.env.DEV
globalThis.import = { meta: { env: { DEV: true } } };

const { buildCurriculumPrompt } = require('./src/lib/promptBuilder.js');

// Mock data
const mockScenario = {
    title: 'Travel Booking',
    cefr: 'A1',
    promptTemplate: 'Practice booking a hotel room.',
    targetLanguage: 'English'
};

const mockSyllabus = {
    grammar: ['present simple'],
    grammarDetails: [{ tip: 'Use subject + verb + object.' }],
    vocab: [{ word: 'hotel' }, { word: 'room' }, { word: 'book' }, { word: 'price' }],
    phonemes: ['θ', 'ð'],
    pragmatics: 'Be polite when making requests.'
};

const mockUserProfile = {
    cefrLevel: 'A1',
    native_language: 'Spanish',
    target_language: 'English',
    weakPhonemes: ['θ'],
    recentMistakes: []
};

const memory = `AI: Do you like the hotel?
User: Yes.
AI: Is the room clean?
User: No.`;

console.log('=== Building prompt with debug ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

console.log('\n=== Final prompt analysis ===');
console.log('Prompt length:', prompt.length);
console.log('Has CONVERSATIONAL FLOW RULES:', prompt.includes('CONVERSATIONAL FLOW RULES'));

const flowRulesIndex = prompt.indexOf('CONVERSATIONAL FLOW RULES');
if (flowRulesIndex !== -1) {
    const section = prompt.substring(flowRulesIndex, Math.min(flowRulesIndex + 900, prompt.length));
    console.log('\nCONVERSATIONAL FLOW RULES section:');
    console.log(section);

    // Check bullet points
    const checks = [
        { name: 'Detect repetitive short answers', check: 'Detect repetitive short answers' },
        { name: 'Handle quiz requests', check: 'Handle quiz requests' },
        { name: 'Avoid pattern repetition', check: 'Avoid pattern repetition' },
        { name: 'Natural topic rotation', check: 'Natural topic rotation' },
        { name: 'Encourage elaboration', check: 'Encourage elaboration' },
        { name: 'Balance correction and flow', check: 'Balance correction and flow' }
    ];

    console.log('\nBullet point checks:');
    for (const check of checks) {
        console.log(`  ${check.name}: ${section.includes(check.check) ? '✓' : '✗'}`);
    }
}

// Write to file
const fs = require('fs');
fs.writeFileSync('debug_prompt_output.txt', prompt);
console.log('\nPrompt written to debug_prompt_output.txt');