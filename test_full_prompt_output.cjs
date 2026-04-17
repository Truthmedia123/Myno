/**
 * Test to write full prompt to file
 */

const { buildCurriculumPrompt } = require('./src/lib/promptBuilder.js');
const fs = require('fs');
const path = require('path');

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

// Write to file
const outputPath = path.join(__dirname, 'prompt_output.txt');
fs.writeFileSync(outputPath, prompt);
console.log(`Prompt written to ${outputPath}`);
console.log(`Prompt length: ${prompt.length} characters`);

// Check for key sections
console.log('\n=== Checking sections ===');
const sections = [
    'SCENARIO LOCK',
    'CONVERSATIONAL FLOW RULES',
    'VOCABULARY RULES',
    'NEVER DO',
    'ADAPTIVE INSTRUCTIONS',
    'OUTPUT JSON'
];

for (const section of sections) {
    const index = prompt.indexOf(section);
    console.log(`${section}: ${index !== -1 ? `FOUND at position ${index}` : 'NOT FOUND'}`);

    if (index !== -1) {
        // Show 50 chars before and 200 chars after
        const start = Math.max(0, index - 50);
        const end = Math.min(prompt.length, index + 200);
        console.log(`  Context: ...${prompt.substring(start, end)}...`);
    }
}

// Specifically check the CONVERSATIONAL FLOW RULES section
const flowIndex = prompt.indexOf('CONVERSATIONAL FLOW RULES');
if (flowIndex !== -1) {
    console.log('\n=== Full CONVERSATIONAL FLOW RULES section ===');
    // Find the end of this section (next section or end of prompt)
    const nextSection = sections.find(s => {
        const idx = prompt.indexOf(s, flowIndex + 1);
        return idx !== -1 && idx > flowIndex;
    });

    const endIndex = nextSection ? prompt.indexOf(nextSection, flowIndex + 1) : prompt.length;
    console.log(prompt.substring(flowIndex, endIndex));
}

// Check if prompt ends abruptly
console.log('\n=== Checking prompt end ===');
const last100 = prompt.substring(Math.max(0, prompt.length - 100));
console.log(`Last 100 chars: ${last100}`);
console.log(`Ends with "conversation."? ${prompt.trim().endsWith('conversation.')}`);