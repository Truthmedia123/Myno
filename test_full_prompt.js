/**
 * Test to see the full prompt structure
 */

import { buildCurriculumPrompt } from './src/lib/promptBuilder.js';
import { writeFileSync } from 'fs';

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

// Write prompt to file for inspection
writeFileSync('debug_prompt.txt', prompt);
console.log('Prompt written to debug_prompt.txt');

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
console.log(`First 1000 chars:\n${prompt.substring(0, 1000)}`);
console.log(`\nLast 500 chars:\n${prompt.substring(prompt.length - 500)}`);