// Debug the prompt building
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

console.log('=== Testing prompt building ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

console.log('Prompt length:', prompt.length);
console.log('First 200 chars:', prompt.substring(0, 200));
console.log('Last 200 chars:', prompt.substring(prompt.length - 200));

// Check for the CONVERSATIONAL FLOW RULES section
const flowRulesIndex = prompt.indexOf('CONVERSATIONAL FLOW RULES');
console.log('\nCONVERSATIONAL FLOW RULES index:', flowRulesIndex);
if (flowRulesIndex !== -1) {
    const afterFlowRules = prompt.substring(flowRulesIndex, Math.min(flowRulesIndex + 500, prompt.length));
    console.log('CONVERSATIONAL FLOW RULES section (first 500 chars):');
    console.log(afterFlowRules);
}

// Check what comes after
const afterIndex = prompt.indexOf('switch to a different topic or ask an open-ended question.');
if (afterIndex !== -1) {
    console.log('\nAfter that phrase (next 100 chars):');
    console.log(prompt.substring(afterIndex + 70, Math.min(afterIndex + 170, prompt.length)));
}

// Check if there are any null characters or weird line endings
console.log('\nChecking for special characters:');
for (let i = 0; i < Math.min(100, prompt.length); i++) {
    const char = prompt[i];
    if (char.charCodeAt(0) < 32 && char !== '\n' && char !== '\r' && char !== '\t') {
        console.log(`Found control character at ${i}: ${char.charCodeAt(0)}`);
    }
}