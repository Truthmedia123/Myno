/**
 * Test prompt structure to see exact content
 */

import { buildCurriculumPrompt } from './src/lib/promptBuilder.js';

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

const prompt = buildCurriculumPrompt(mockScenario, mockUserProfile, mockSyllabus, memory, 'en', null);

// Find the position of SCENARIO LOCK
const scenarioLockIndex = prompt.indexOf('SCENARIO LOCK');
console.log('Position of SCENARIO LOCK:', scenarioLockIndex);

if (scenarioLockIndex !== -1) {
    // Extract 200 characters before and 400 characters after SCENARIO LOCK
    const start = Math.max(0, scenarioLockIndex - 200);
    const end = Math.min(prompt.length, scenarioLockIndex + 400);
    const excerpt = prompt.substring(start, end);

    console.log('\n=== Excerpt around SCENARIO LOCK ===');
    console.log(excerpt);

    // Check for CONVERSATIONAL FLOW RULES after SCENARIO LOCK
    const afterScenarioLock = prompt.substring(scenarioLockIndex);
    const hasConversationalFlow = afterScenarioLock.includes('CONVERSATIONAL FLOW (ENGLISH A1)');
    console.log('\nContains CONVERSATIONAL FLOW after SCENARIO LOCK?', hasConversationalFlow);

    if (hasConversationalFlow) {
        const flowIndex = afterScenarioLock.indexOf('CONVERSATIONAL FLOW (ENGLISH A1)');
        console.log('Position relative to SCENARIO LOCK:', flowIndex);
        console.log('Excerpt of CONVERSATIONAL FLOW:');
        console.log(afterScenarioLock.substring(flowIndex, flowIndex + 300));
    }
} else {
    console.log('SCENARIO LOCK not found in prompt');
}

// Also check the raw template by looking at the function source
console.log('\n=== Checking function source for template ===');
console.log('The CONVERSATIONAL FLOW section should be between SCENARIO LOCK and VOCAB:');

// Let's also check if adaptiveInstructions is being generated
console.log('\n=== Checking adaptiveInstructions logic ===');
console.log('Target language:', mockUserProfile.target_language);
console.log('CEFR level:', mockUserProfile.cefrLevel);
console.log('Memory context length:', memory.length);

// Manually run the detection logic
const target_language = 'English';
const cefrLevel = 'A1';
let adaptiveInstructions = '';
if (memory && target_language.toLowerCase() === 'english' && cefrLevel === 'A1') {
    console.log('Conditions met for English A1 detection');

    const lines = memory.split('\n').filter(line => line.trim());
    const userMessages = lines.filter(line =>
        line.toLowerCase().includes('user:') ||
        line.toLowerCase().includes('student:') ||
        (line.includes(':') && !line.toLowerCase().includes('ai:'))
    ).slice(-5);

    console.log('User messages found:', userMessages);

    // Detect repetitive short answers
    let consecutiveShort = 0;
    for (const msg of userMessages) {
        const content = msg.split(':').slice(1).join(':').trim();
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        console.log(`Message: "${content}", word count: ${wordCount}`);
        if (wordCount <= 2 && content.length > 0) {
            consecutiveShort++;
        } else {
            consecutiveShort = 0;
        }
    }

    console.log('Consecutive short answers:', consecutiveShort);

    if (consecutiveShort >= 3) {
        adaptiveInstructions += 'USER STATE: Giving repetitive short answers. Switch to open-ended question or change topic.\n';
    }

    console.log('Adaptive instructions:', adaptiveInstructions || '(empty)');
} else {
    console.log('Conditions NOT met for English A1 detection');
}