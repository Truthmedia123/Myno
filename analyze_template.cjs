// Analyze the template string for syntax errors
const fs = require('fs');
const path = require('path');

// Read the promptBuilder.js file
const promptBuilderPath = path.join(__dirname, 'src/lib/promptBuilder.js');
const content = fs.readFileSync(promptBuilderPath, 'utf8');

// Find the buildCurriculumPrompt function
const funcStart = content.indexOf('export function buildCurriculumPrompt');
const funcEnd = content.indexOf('\nexport function buildGeneralPrompt', funcStart);
const funcCode = content.substring(funcStart, funcEnd);

// Find the template string
const templateStart = funcCode.indexOf('const prompt = `');
if (templateStart === -1) {
    console.log('Template not found!');
    process.exit(1);
}

// Find the closing backtick
let backtickCount = 0;
let templateEnd = -1;
let inString = false;
let escapeNext = false;

// Simple parser to find the matching backtick
for (let i = templateStart + 'const prompt = `'.length; i < funcCode.length; i++) {
    const char = funcCode[i];
    const prevChar = i > 0 ? funcCode[i - 1] : '';

    if (escapeNext) {
        escapeNext = false;
        continue;
    }

    if (char === '\\') {
        escapeNext = true;
        continue;
    }

    if (char === '`') {
        // Check if this is the closing backtick
        templateEnd = i;
        break;
    }
}

if (templateEnd === -1) {
    console.log('Could not find closing backtick!');
    process.exit(1);
}

const template = funcCode.substring(templateStart + 'const prompt = `'.length, templateEnd);
console.log('Template length:', template.length);

// Check for unescaped backticks in the template
console.log('\n=== Checking for unescaped backticks in template ===');
let backtickPositions = [];
for (let i = 0; i < template.length; i++) {
    if (template[i] === '`') {
        backtickPositions.push(i);
    }
}
console.log('Found', backtickPositions.length, 'backticks in template');
if (backtickPositions.length > 0) {
    console.log('Positions:', backtickPositions);

    // Show context around each backtick
    for (const pos of backtickPositions) {
        const start = Math.max(0, pos - 20);
        const end = Math.min(template.length, pos + 20);
        console.log(`\nBacktick at position ${pos}:`);
        console.log('Context:', JSON.stringify(template.substring(start, end)));
    }
}

// Check for the CONVERSATIONAL FLOW RULES section
console.log('\n=== Looking for CONVERSATIONAL FLOW RULES in template ===');
const flowRulesIndex = template.indexOf('CONVERSATIONAL FLOW RULES');
if (flowRulesIndex !== -1) {
    console.log('Found at position:', flowRulesIndex);

    // Show 800 characters from that point
    const section = template.substring(flowRulesIndex, Math.min(flowRulesIndex + 800, template.length));
    console.log('\nSection (800 chars):');
    console.log(section);

    // Check what comes after this section
    const afterIndex = flowRulesIndex + 800;
    if (afterIndex < template.length) {
        console.log('\nNext 100 chars after section:');
        console.log(template.substring(afterIndex, Math.min(afterIndex + 100, template.length)));
    }
} else {
    console.log('CONVERSATIONAL FLOW RULES not found in template!');
}

// Check for syntax errors by trying to evaluate a simplified version
console.log('\n=== Trying to evaluate template ===');
try {
    // Create a simplified version with just the CONVERSATIONAL FLOW RULES section
    const testTemplate = `CONVERSATIONAL FLOW RULES (ENGLISH A1):
- Detect repetitive short answers: If user gives 3+ consecutive replies under 3 words (e.g., "Yes", "No", "OK"), switch to a different topic or ask an open-ended question.
- Handle quiz requests: If user asks for a quiz/test, provide exactly 2 multiple-choice questions with 3 options each, then return to conversation.
- Avoid pattern repetition: Do not use the same question structure more than twice in a row.
- Natural topic rotation: Every 4-5 turns, introduce a subtle shift (e.g., from "hotel" to "transportation" within travel scenario).
- Encourage elaboration: When user gives one-word answers, prompt with "Tell me more about that" or "Why?".
- Balance correction and flow: If correcting, keep the correction brief (max 5 words) and immediately return to conversation.`;

    console.log('Test template length:', testTemplate.length);
    console.log('Test template ends with:', testTemplate.substring(testTemplate.length - 50));
} catch (error) {
    console.log('Error evaluating template:', error.message);
}

// Check the actual generated prompt
console.log('\n=== Checking actual generated prompt ===');
const { buildCurriculumPrompt } = require('./src/lib/promptBuilder.js');

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

// Write to file for manual inspection
fs.writeFileSync('template_analysis_output.txt', prompt);
console.log('Written template_analysis_output.txt');
console.log('Prompt length:', prompt.length);

// Check where it gets cut off
const cutOffMarker = 'switch to a different topic or ask an open-ended question.';
const cutOffIndex = prompt.indexOf(cutOffMarker);
if (cutOffIndex !== -1) {
    console.log('Cut off marker found at:', cutOffIndex);
    console.log('Characters after cut off:', prompt.length - cutOffIndex - cutOffMarker.length);

    // Check the next 10 characters
    const nextStart = cutOffIndex + cutOffMarker.length;
    const nextChars = prompt.substring(nextStart, Math.min(nextStart + 10, prompt.length));
    console.log('Next 10 chars:', JSON.stringify(nextChars));

    // Check if there's a newline or something
    if (nextChars.length > 0) {
        console.log('First char code:', nextChars.charCodeAt(0));
    }
}