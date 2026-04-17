// Debug the raw string
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

console.log('=== Building prompt ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

console.log('Prompt length:', prompt.length);

// Write the raw string to a file for inspection
const fs = require('fs');
fs.writeFileSync('raw_prompt_debug.txt', prompt);

// Also write hex dump
let hexDump = '';
for (let i = 0; i < Math.min(200, prompt.length); i++) {
    const char = prompt[i];
    const code = char.charCodeAt(0);
    hexDump += `${i}: '${char === '\n' ? '\\n' : char === '\r' ? '\\r' : char}' (${code.toString(16)})\n`;
}
fs.writeFileSync('hex_dump.txt', hexDump);

console.log('Written raw_prompt_debug.txt and hex_dump.txt');

// Check specific section
const flowRulesStart = prompt.indexOf('CONVERSATIONAL FLOW RULES');
if (flowRulesStart !== -1) {
    console.log('\n=== CONVERSATIONAL FLOW RULES section (raw) ===');
    const section = prompt.substring(flowRulesStart, Math.min(flowRulesStart + 300, prompt.length));
    console.log(section);

    // Check each character
    console.log('\n=== Character analysis ===');
    for (let i = 0; i < Math.min(100, section.length); i++) {
        const char = section[i];
        if (char.charCodeAt(0) < 32) {
            console.log(`Control character at ${i}: ${char.charCodeAt(0)}`);
        }
    }
}

// Check what comes before the CONVERSATIONAL FLOW RULES section
console.log('\n=== What comes before CONVERSATIONAL FLOW RULES ===');
const beforeStart = Math.max(0, flowRulesStart - 100);
const beforeSection = prompt.substring(beforeStart, flowRulesStart);
console.log(beforeSection);

// Check the end of the prompt
console.log('\n=== End of prompt ===');
const endSection = prompt.substring(Math.max(0, prompt.length - 100));
console.log(endSection);
console.log('Last 10 char codes:');
for (let i = Math.max(0, prompt.length - 10); i < prompt.length; i++) {
    console.log(`  ${i}: '${prompt[i]}' (${prompt[i].charCodeAt(0)})`);
}