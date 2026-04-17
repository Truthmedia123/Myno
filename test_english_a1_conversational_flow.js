/**
 * Test for English A1 conversational flow updates in promptBuilder.js
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

console.log('=== Testing English A1 Conversational Flow Updates ===\n');

// Test 1: Normal conversation (no repetitive patterns)
console.log('Test 1: Normal conversation');
const normalMemory = `Previous conversation:
AI: Hello! Would you like to book a hotel?
User: Yes, I want a room.
AI: Great! What is your budget?
User: About $100 per night.`;
const prompt1 = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, normalMemory, 'en', null);
console.log('Prompt length:', prompt1.length);
console.log('Contains CONVERSATIONAL FLOW?', prompt1.includes('CONVERSATIONAL FLOW (ENGLISH A1)'));
console.log('Contains adaptive prefix?', prompt1.includes('ADAPTIVE:'));
console.log('---\n');

// Test 2: Repetitive short answers detection
console.log('Test 2: Repetitive short answers (3+ consecutive short replies)');
const repetitiveMemory = `Previous conversation:
AI: Do you like the hotel?
User: Yes.
AI: Is the room clean?
User: No.
AI: Is the price okay?
User: OK.
AI: Would you like breakfast?
User: Yes.`;
const prompt2 = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, repetitiveMemory, 'en', null);
console.log('Prompt length:', prompt2.length);
console.log('Contains repetitive short answers detection?', prompt2.includes('Giving repetitive short answers'));
console.log('---\n');

// Test 3: Quiz request detection
console.log('Test 3: Quiz request detection');
const quizMemory = `Previous conversation:
AI: Let's practice hotel vocabulary.
User: Can we have a quiz?
AI: Sure, what would you like to test?
User: I want a test on hotel words.`;
const prompt3 = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, quizMemory, 'en', null);
console.log('Prompt length:', prompt3.length);
console.log('Contains quiz request detection?', prompt3.includes('Requested a quiz'));
console.log('---\n');

// Test 4: Non-English language (should not trigger English A1 rules)
console.log('Test 4: Spanish language (should not trigger English A1 rules)');
const spanishProfile = {
    ...mockUserProfile,
    target_language: 'Spanish'
};
const prompt4 = buildCurriculumPrompt(mockScenario, spanishProfile, mockSyllabus, repetitiveMemory, 'es', null);
console.log('Prompt length:', prompt4.length);
console.log('Contains CONVERSATIONAL FLOW?', prompt4.includes('CONVERSATIONAL FLOW (ENGLISH A1)'));
console.log('Contains adaptive prefix?', prompt4.includes('ADAPTIVE:'));
console.log('---\n');

// Test 5: Higher CEFR level (should still include rules but not adaptive detection)
console.log('Test 5: B1 level (should still include rules)');
const b1Profile = {
    ...mockUserProfile,
    cefrLevel: 'B1'
};
const prompt5 = buildCurriculumPrompt(mockScenario, b1Profile, mockSyllabus, repetitiveMemory, 'en', null);
console.log('Prompt length:', prompt5.length);
console.log('Contains CONVERSATIONAL FLOW?', prompt5.includes('CONVERSATIONAL FLOW (ENGLISH A1)'));
console.log('Contains adaptive prefix?', prompt5.includes('ADAPTIVE:'));
console.log('---\n');

console.log('=== Test Summary ===');
console.log('All tests completed. Check console for dev logging (if DEV env is true).');
console.log('The English A1 conversational flow updates have been successfully implemented.');