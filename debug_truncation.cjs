// Debug why the prompt is being truncated
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
console.log('Expected length (should be < 1600):', prompt.length);

// Find where it gets cut off
const cutOffPhrase = 'switch to a different topic or ask an open-ended question.';
const cutOffIndex = prompt.indexOf(cutOffPhrase);
console.log('\nCut off phrase found at index:', cutOffIndex);
if (cutOffIndex !== -1) {
    console.log('Characters after cut off phrase:');
    const afterCutOff = prompt.substring(cutOffIndex + cutOffPhrase.length, Math.min(cutOffIndex + cutOffPhrase.length + 50, prompt.length));
    console.log('After:', JSON.stringify(afterCutOff));

    // Check what character comes next
    if (cutOffIndex + cutOffPhrase.length < prompt.length) {
        const nextChar = prompt[cutOffIndex + cutOffPhrase.length];
        console.log('Next character code:', nextChar?.charCodeAt(0), 'char:', JSON.stringify(nextChar));
    }
}

// Check the sanitizePrompt function directly
console.log('\n=== Testing sanitizePrompt directly ===');
const { sanitizePrompt } = require('./src/lib/promptBuilder.js');

// Create a test string that's exactly like what we expect
const testString = `CONVERSATIONAL FLOW RULES (ENGLISH A1):
- Detect repetitive short answers: If user gives 3+ consecutive replies under 3 words (e.g., "Yes", "No", "OK"), switch to a different topic or ask an open-ended question.
- Handle quiz requests: If user asks for a quiz/test, provide exactly 2 multiple-choice questions with 3 options each, then return to conversation.
- Avoid pattern repetition: Do not use the same question structure more than twice in a row.
- Natural topic rotation: Every 4-5 turns, introduce a subtle shift (e.g., from "hotel" to "transportation" within travel scenario).
- Encourage elaboration: When user gives one-word answers, prompt with "Tell me more about that" or "Why?".
- Balance correction and flow: If correcting, keep the correction brief (max 5 words) and immediately return to conversation.`;

console.log('Test string length:', testString.length);
const sanitized = sanitizePrompt(testString);
console.log('Sanitized length:', sanitized.length);
console.log('Are they equal?', testString === sanitized);

// Check if there's something wrong with the template literal
console.log('\n=== Checking template literal in source ===');
const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, 'src/lib/promptBuilder.js'), 'utf8');

// Find the exact template string
const templateStart = source.indexOf('CONVERSATIONAL FLOW RULES (ENGLISH A1):');
if (templateStart !== -1) {
    const context = source.substring(templateStart, Math.min(templateStart + 800, source.length));
    console.log('Template context (800 chars):');
    console.log(context);

    // Look for the end of this section
    const sectionEnd = context.indexOf('VOCABULARY RULES:');
    if (sectionEnd !== -1) {
        console.log('\nFull CONVERSATIONAL FLOW RULES section from source:');
        console.log(context.substring(0, sectionEnd));
    }
}

// Let's also check if there are any syntax errors by evaluating the template
console.log('\n=== Evaluating the actual template ===');
// We need to extract the actual template string from the function
const funcStart = source.indexOf('export function buildCurriculumPrompt');
const funcEnd = source.indexOf('\nexport function buildGeneralPrompt', funcStart);
const funcBody = source.substring(funcStart, funcEnd);

// Find the template literal
const templateLiteralStart = funcBody.indexOf('const prompt = `');
if (templateLiteralStart !== -1) {
    // Find the closing backtick
    let backtickCount = 0;
    let templateEnd = -1;
    for (let i = templateLiteralStart + 'const prompt = `'.length; i < funcBody.length; i++) {
        if (funcBody[i] === '`') {
            backtickCount++;
            if (funcBody[i + 1] === ';') {
                templateEnd = i;
                break;
            }
        }
    }

    if (templateEnd !== -1) {
        const template = funcBody.substring(templateLiteralStart + 'const prompt = `'.length, templateEnd);
        console.log('Extracted template length:', template.length);

        // Check for the CONVERSATIONAL FLOW RULES section in the extracted template
        const flowRulesInTemplate = template.indexOf('CONVERSATIONAL FLOW RULES (ENGLISH A1):');
        if (flowRulesInTemplate !== -1) {
            const after = template.substring(flowRulesInTemplate, Math.min(flowRulesInTemplate + 600, template.length));
            console.log('\nCONVERSATIONAL FLOW RULES in extracted template (600 chars):');
            console.log(after);
        }
    }
}