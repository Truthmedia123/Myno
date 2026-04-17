/**
 * Final test to check if CONVERSATIONAL FLOW RULES is included
 */

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

console.log('=== Testing if CONVERSATIONAL FLOW RULES is included ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

console.log('Prompt length:', prompt.length);
console.log('Contains CONVERSATIONAL FLOW RULES:', prompt.includes('CONVERSATIONAL FLOW RULES'));
console.log('Contains SCENARIO LOCK:', prompt.includes('SCENARIO LOCK'));
console.log('Contains VOCABULARY RULES:', prompt.includes('VOCABULARY RULES'));

if (prompt.includes('CONVERSATIONAL FLOW RULES')) {
    const start = prompt.indexOf('CONVERSATIONAL FLOW RULES');
    console.log('\n=== CONVERSATIONAL FLOW RULES section ===');
    console.log(prompt.substring(start, Math.min(start + 400, prompt.length)));
}

// Also check the SCENARIO LOCK section to see if it's complete
const scenarioLockIndex = prompt.indexOf('SCENARIO LOCK');
if (scenarioLockIndex !== -1) {
    console.log('\n=== SCENARIO LOCK section (first 300 chars) ===');
    console.log(prompt.substring(scenarioLockIndex, Math.min(scenarioLockIndex + 300, prompt.length)));
}

// Check what comes after SCENARIO LOCK
if (scenarioLockIndex !== -1) {
    const afterScenarioLock = prompt.substring(scenarioLockIndex);
    const nextSectionMatch = afterScenarioLock.match(/\n\n([A-Z][A-Z\s]+):/);
    if (nextSectionMatch) {
        console.log('\n=== Section after SCENARIO LOCK ===');
        console.log('Next section:', nextSectionMatch[1]);
    }
}

// Show the end of the prompt to see if it's truncated
console.log('\n=== Last 300 characters of prompt ===');
console.log(prompt.substring(Math.max(0, prompt.length - 300)));