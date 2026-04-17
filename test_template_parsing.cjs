// Test to see the actual template string
const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src/lib/promptBuilder.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find the template
const templateStart = content.indexOf('const prompt = `');
if (templateStart === -1) {
    console.log('Template not found');
    process.exit(1);
}

// Manually find the closing backtick by looking for the pattern
let templateEnd = -1;
let inTemplate = false;
let backtickCount = 0;

// Look for the closing backtick after templateStart
for (let i = templateStart + 'const prompt = `'.length; i < content.length; i++) {
    if (content[i] === '`') {
        // Check if it's escaped
        let isEscaped = false;
        for (let j = i - 1; j >= 0 && content[j] === '\\'; j--) {
            isEscaped = !isEscaped;
        }

        if (!isEscaped) {
            templateEnd = i;
            break;
        }
    }
}

if (templateEnd === -1) {
    console.log('Could not find closing backtick');
    process.exit(1);
}

const template = content.substring(templateStart + 'const prompt = `'.length, templateEnd);
console.log('Template length:', template.length);
console.log('First 200 chars of template:');
console.log(template.substring(0, 200));
console.log('\nLast 200 chars of template:');
console.log(template.substring(Math.max(0, template.length - 200)));

// Check for CONVERSATIONAL FLOW RULES
const flowRulesIndex = template.indexOf('CONVERSATIONAL FLOW RULES');
if (flowRulesIndex !== -1) {
    console.log('\n=== CONVERSATIONAL FLOW RULES in template ===');
    const after = template.substring(flowRulesIndex, Math.min(flowRulesIndex + 600, template.length));
    console.log(after);

    // Check if all bullet points are there
    const bulletPoints = [
        'Detect repetitive short answers',
        'Handle quiz requests',
        'Avoid pattern repetition',
        'Natural topic rotation',
        'Encourage elaboration',
        'Balance correction and flow'
    ];

    console.log('\n=== Checking bullet points ===');
    for (const bp of bulletPoints) {
        const found = template.includes(bp);
        console.log(`${bp}: ${found ? 'FOUND' : 'NOT FOUND'}`);
    }
} else {
    console.log('CONVERSATIONAL FLOW RULES not found in template');
}

// Write the template to a file for manual inspection
fs.writeFileSync('template_debug.txt', template);
console.log('\nTemplate written to template_debug.txt');

// Now test the actual function
console.log('\n=== Testing actual function ===');
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
fs.writeFileSync('actual_prompt.txt', prompt);
console.log('Actual prompt written to actual_prompt.txt');
console.log('Actual prompt length:', prompt.length);