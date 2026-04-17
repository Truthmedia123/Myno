// Test the sanitization function
import { callGroq } from './src/lib/groqClient.js';

// Mock the sanitizeGroqResponse function (it's not exported, so we need to test indirectly)
// Let's create a simple test by checking if the function exists in the module

console.log('Testing sanitization logic...');

// Simulate leaked prompt fragments that should be removed
const testCases = [
    {
        input: 'SCENARIO LOCK: Teach A1 English. {"reply": "Hello", "correction": null}',
        expected: 'Teach A1 English. Hello'
    },
    {
        input: 'Good WORD: hello:: How are you? VOCAB: hotel, room',
        expected: 'How are you?'
    },
    {
        input: 'CONVERSATIONAL FLOW (ENGLISH A1): Vary questions. {"reply": "I like it", "nextQuestion": "What about you?"}',
        expected: 'Vary questions. I like it What about you?'
    },
    {
        input: 'Normal response without any leakage.',
        expected: 'Normal response without any leakage.'
    }
];

// Since sanitizeGroqResponse is not exported, we'll just log the test cases
console.log('Test cases for sanitization:');
testCases.forEach((tc, i) => {
    console.log(`\nTest ${i + 1}:`);
    console.log(`Input: "${tc.input}"`);
    console.log(`Expected: "${tc.expected}"`);
});

console.log('\nNote: The actual sanitization function is in groqClient.js and will be applied to all Groq API responses.');
console.log('To fully test, we would need to mock the Groq API call, but the development server is running.');
console.log('You can test manually by interacting with the chat at http://localhost:5173');

// Check if the file was modified correctly
import fs from 'fs';
const groqContent = fs.readFileSync('./src/lib/groqClient.js', 'utf8');
const hasSanitizeFunction = groqContent.includes('function sanitizeGroqResponse');
const hasCallGroqUpdate = groqContent.includes('sanitizeGroqResponse(rawText)');

console.log('\n=== Code Verification ===');
console.log(`Sanitization function exists: ${hasSanitizeFunction}`);
console.log(`callGroq uses sanitization: ${hasCallGroqUpdate}`);

// Check promptBuilder changes
const promptContent = fs.readFileSync('./src/lib/promptBuilder.js', 'utf8');
const hasResponseFormat = promptContent.includes('RESPONSE FORMAT:');
const hasJsonOutput = promptContent.includes('"reply": "${target_language} response');

console.log(`Prompt has RESPONSE FORMAT: ${hasResponseFormat}`);
console.log(`Prompt still has JSON output: ${hasJsonOutput}`);