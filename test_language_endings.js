// Test script for language-specific question endings in a1Simplifier.js
import { simplifyToA1 } from './src/lib/a1Simplifier.js';

console.log('Testing language-specific question endings...\n');

// Test cases: language code -> expected question patterns
const testCases = [
    { lang: 'es', expectedPattern: /¿[^?]+\?/ }, // Spanish questions with ¿?
    { lang: 'en', expectedPattern: /[A-Za-z]+\?/ }, // English questions
    { lang: 'fr', expectedPattern: /[A-Za-zÀ-ÿ]+\?/ }, // French questions
    { lang: 'ja', expectedPattern: /[^?]+\？/ }, // Japanese questions with fullwidth ？
    { lang: 'ar', expectedPattern: /[^?]+\?/ }, // Arabic questions
    { lang: 'hi', expectedPattern: /[^?]+\?/ }, // Hindi questions
];

let allPassed = true;

for (const test of testCases) {
    console.log(`Testing ${test.lang}:`);

    // Call simplifyToA1 with empty text to see the appended question
    // The function adds a random question from the language's set
    const result = simplifyToA1('', [], test.lang);

    // Extract the question part (after simplification, which is empty)
    // Result should be just the question since input text is empty
    const question = result.trim();

    console.log(`  Generated: "${question}"`);

    if (question && test.expectedPattern.test(question)) {
        console.log(`  ✓ Pattern matches\n`);
    } else {
        console.log(`  ✗ Pattern mismatch or empty question\n`);
        allPassed = false;
    }
}

// Test that different languages produce different questions
console.log('Testing language differentiation:');
const results = {};
for (const test of testCases.slice(0, 3)) {
    // Run multiple times to get different random questions
    const questions = new Set();
    for (let i = 0; i < 5; i++) {
        const result = simplifyToA1('Test', [], test.lang);
        // Extract question (last word before ?)
        const match = result.match(/([^?]+\?)/);
        if (match) questions.add(match[1].trim());
    }
    results[test.lang] = Array.from(questions);
    console.log(`  ${test.lang}: ${questions.size} unique questions`);
}

// Test fallback to Spanish for unknown language
console.log('\nTesting fallback for unknown language:');
const unknownResult = simplifyToA1('', [], 'xx');
console.log(`  Unknown language 'xx' result: "${unknownResult}"`);
if (unknownResult.includes('¿')) {
    console.log('  ✓ Falls back to Spanish questions\n');
} else {
    console.log('  ✗ Does not fall back to Spanish\n');
    allPassed = false;
}

if (allPassed) {
    console.log('✅ All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}