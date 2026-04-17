/**
 * Test to see the full prompt structure (CommonJS version)
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

console.log('=== Building prompt ===');
const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

// Also log key sections
console.log('\n=== Checking for key sections ===');

const sections = [
    'SCENARIO LOCK',
    'CONVERSATIONAL FLOW (ENGLISH A1)',
    'VOCAB:',
    'AVOID:',
    'ADAPTIVE:',
    'OUTPUT:'
];

for (const section of sections) {
    const hasSection = prompt.includes(section);
    console.log(`${section}: ${hasSection ? 'FOUND' : 'NOT FOUND'}`);

    if (hasSection) {
        const index = prompt.indexOf(section);
        const excerpt = prompt.substring(index, Math.min(index + 200, prompt.length));
        console.log(`  Excerpt: ${excerpt.substring(0, 100)}...`);
    }
}

// Check the exact text after SCENARIO LOCK
const scenarioLockIndex = prompt.indexOf('SCENARIO LOCK');
if (scenarioLockIndex !== -1) {
    const afterScenarioLock = prompt.substring(scenarioLockIndex);
    // Find the next section
    const nextSectionMatch = afterScenarioLock.match(/\n\n([A-Z][A-Z\s]+):/);
    console.log('\n=== What comes after SCENARIO LOCK? ===');
    if (nextSectionMatch) {
        console.log(`Next section: ${nextSectionMatch[1]}`);
        console.log(`Context: ${afterScenarioLock.substring(0, 300)}`);
    } else {
        console.log('No next section found in standard format');
        // Show next 300 characters
        console.log(`Next 300 chars: ${afterScenarioLock.substring(0, 300)}`);
    }
}

console.log('\n=== Prompt length ===');
console.log(`Total characters: ${prompt.length}`);

// Show the prompt from SCENARIO LOCK onward
if (scenarioLockIndex !== -1) {
    console.log('\n=== Prompt from SCENARIO LOCK to end ===');
    console.log(prompt.substring(scenarioLockIndex));
}

// Also check if there's a mismatch - maybe the template is different
console.log('\n=== Checking template directly ===');
// Read the file to see the template
const fs = require('fs');
const path = require('path');
const fileContent = fs.readFileSync(path.join(__dirname, 'src/lib/promptBuilder.js'), 'utf8');
// Find the template string in buildCurriculumPrompt
const templateMatch = fileContent.match(/const prompt = `([\s\S]*?)`;/);
if (templateMatch) {
    const template = templateMatch[1];
    console.log('Template contains CONVERSATIONAL FLOW RULES:', template.includes('CONVERSATIONAL FLOW RULES'));
    console.log('Template contains VOCABULARY RULES:', template.includes('VOCABULARY RULES'));

    // Show the section between SCENARIO LOCK and VOCABULARY RULES
    const scenarioLockPos = template.indexOf('SCENARIO LOCK');
    const vocabRulesPos = template.indexOf('VOCABULARY RULES');
    if (scenarioLockPos !== -1 && vocabRulesPos !== -1 && vocabRulesPos > scenarioLockPos) {
        const between = template.substring(scenarioLockPos, vocabRulesPos);
        console.log('\n=== Between SCENARIO LOCK and VOCABULARY RULES in template ===');
        console.log(between);
    }
}