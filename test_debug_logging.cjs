/**
 * Test with debug logging
 */

// Set DEV environment variable
process.env.NODE_ENV = 'development';

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

console.log('=== Testing with debug logging ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

console.log('\n=== Final prompt (first 1000 chars) ===');
console.log(prompt.substring(0, 1000));

console.log('\n=== Checking for CONVERSATIONAL FLOW RULES ===');
if (prompt.includes('CONVERSATIONAL FLOW RULES')) {
    const start = prompt.indexOf('CONVERSATIONAL FLOW RULES');
    console.log('FOUND at position', start);
    console.log('Content:', prompt.substring(start, Math.min(start + 300, prompt.length)));
} else {
    console.log('NOT FOUND in final prompt');

    // Check the raw template
    const fs = require('fs');
    const path = require('path');
    const fileContent = fs.readFileSync(path.join(__dirname, 'src/lib/promptBuilder.js'), 'utf8');

    // Find the buildCurriculumPrompt function
    const funcStart = fileContent.indexOf('export function buildCurriculumPrompt');
    const funcEnd = fileContent.indexOf('export function buildGeneralPrompt', funcStart);
    const funcContent = fileContent.substring(funcStart, funcEnd);

    // Find the template string
    const templateMatch = funcContent.match(/const prompt = `([\s\S]*?)`;/);
    if (templateMatch) {
        const template = templateMatch[1];
        console.log('\n=== Template analysis ===');
        console.log('Template length:', template.length);
        console.log('Template contains CONVERSATIONAL FLOW RULES:', template.includes('CONVERSATIONAL FLOW RULES'));

        // Show the template from SCENARIO LOCK
        const scenarioLockPos = template.indexOf('SCENARIO LOCK');
        if (scenarioLockPos !== -1) {
            console.log('\n=== Template from SCENARIO LOCK (500 chars) ===');
            console.log(template.substring(scenarioLockPos, Math.min(scenarioLockPos + 500, template.length)));
        }
    }
}