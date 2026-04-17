/**
 * Debug test for English A1 conversational flow
 */

import { buildCurriculumPrompt } from './src/lib/promptBuilder.js';

// Mock scenario
const mockScenario = {
    title: 'Travel Booking',
    cefr: 'A1',
    promptTemplate: 'Practice booking a hotel room.',
    targetLanguage: 'English'
};

// Mock syllabus
const mockSyllabus = {
    grammar: ['present simple'],
    grammarDetails: [{ tip: 'Use subject + verb + object.' }],
    vocab: [{ word: 'hotel' }, { word: 'room' }, { word: 'book' }, { word: 'price' }],
    phonemes: ['θ', 'ð'],
    pragmatics: 'Be polite when making requests.'
};

// Mock user profile for English A1
const mockUserProfile = {
    cefrLevel: 'A1',
    native_language: 'Spanish',
    target_language: 'English',
    weakPhonemes: ['θ'],
    recentMistakes: []
};

console.log('=== Debug Test ===\n');

// Test with repetitive short answers
const repetitiveMemory = `AI: Do you like the hotel?
User: Yes.
AI: Is the room clean?
User: No.
AI: Is the price okay?
User: OK.
AI: Would you like breakfast?
User: Yes.`;

console.log('Memory context:');
console.log(repetitiveMemory);
console.log('\n---\n');

const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, repetitiveMemory, 'en', null);

// Check for specific sections
console.log('Prompt contains "CONVERSATIONAL FLOW":', prompt.includes('CONVERSATIONAL FLOW (ENGLISH A1)'));
console.log('Prompt contains "Detect repetitive short answers":', prompt.includes('Detect repetitive short answers'));
console.log('Prompt contains "ADAPTIVE:":', prompt.includes('ADAPTIVE:'));
console.log('Prompt contains "Giving repetitive short answers":', prompt.includes('Giving repetitive short answers'));

// Show relevant sections
const lines = prompt.split('\n');
let inRelevantSection = false;
let relevantLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('CONVERSATIONAL FLOW (ENGLISH A1)') || line.includes('ADAPTIVE:') || line.includes('USER STATE')) {
        inRelevantSection = true;
    }
    if (inRelevantSection) {
        relevantLines.push(line);
        if (line.includes('VOCAB:') && i > 0 && lines[i - 1].includes('CONVERSATIONAL FLOW (ENGLISH A1)')) {
            // Still in section
        } else if (line.includes('VOCAB:') && !lines[i - 1].includes('CONVERSATIONAL FLOW (ENGLISH A1)')) {
            break;
        }
    }
}

console.log('\n=== Relevant Sections ===');
console.log(relevantLines.join('\n'));

// Also check if the prompt includes the scenario lock
console.log('\n=== Checking Scenario Lock ===');
console.log('Contains SCENARIO LOCK:', prompt.includes('SCENARIO LOCK'));

// Check prompt length
console.log('\n=== Prompt Stats ===');
console.log('Total length:', prompt.length);
console.log('First 500 chars:', prompt.substring(0, 500));
console.log('Last 500 chars:', prompt.substring(prompt.length - 500));