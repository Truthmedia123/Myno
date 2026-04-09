// Test script for language-specific question endings in a1Simplifier.js
import { simplifyToA1 } from './src/lib/a1Simplifier.js';

console.log('Testing language-specific question endings...\n');

// Test cases: language code -> expected question patterns
const testCases = [
    { lang: 'es', name: 'Spanish', expectedPattern: /¿[^?]+\?/ },
    { lang: 'en', name: 'English', expectedPattern: /[A-Za-z]+\?/ },
    { lang: 'fr', name: 'French', expectedPattern: /[A-Za-zÀ-ÿ]+\?/ },
    { lang: 'ja', name: 'Japanese', expectedPattern: /[^?]+\？/ },
    { lang: 'ar', name: 'Arabic', expectedPattern: /[^?]+\?/ },
    { lang: 'hi', name: 'Hindi', expectedPattern: /[^?]+\?/ },
    { lang: 'de', name: 'German', expectedPattern: /[A-Za-zÄÖÜäöüß]+\?/ },
    { lang: 'it', name: 'Italian', expectedPattern: /[A-Za-zÀ-ÿ]+\?/ },
    { lang: 'pt', name: 'Portuguese', expectedPattern: /[A-Za-zÀ-ÿ]+\?/ },
    { lang: 'ko', name: 'Korean', expectedPattern: /[^?]+\?/ },
    { lang: 'zh', name: 'Mandarin', expectedPattern: /[^?]+\？/ },
    { lang: 'ru', name: 'Russian', expectedPattern: /[^?]+\?/ },
    { lang: 'nl', name: 'Dutch', expectedPattern: /[A-Za-z]+\?/ },
    { lang: 'tr', name: 'Turkish', expectedPattern: /[^?]+\?/ },
    { lang: 'sv', name: 'Swedish', expectedPattern: /[A-Za-zÅÄÖåäö]+\?/ },
    { lang: 'el', name: 'Greek', expectedPattern: /[^?]+\?/ },
];

let allPassed = true;

for (const test of testCases) {
    console.log(`Testing ${test.name} (${test.lang}):`);

    // Call simplifyToA1 with simple text
    const result = simplifyToA1('Test', [], test.lang);

    // Extract the question part (after the period)
    const parts = result.split('. ');
    const question = parts.length > 1 ? parts[parts.length - 1] : parts[0];

    console.log(`  Result: "${result}"`);
    console.log(`  Question: "${question}"`);

    if (question && test.expectedPattern.test(question)) {
        console.log(`  ✓ Pattern matches\n`);
    } else {
        console.log(`  ✗ Pattern mismatch or empty question\n`);
        allPassed = false;
    }
}

// Test that different languages produce different questions
console.log('Testing language differentiation (sampling 3 languages):');
const sampleLangs = ['es', 'fr', 'ja'];
const questionSets = {};
for (const lang of sampleLangs) {
    const questions = new Set();
    for (let i = 0; i < 10; i++) {
        const result = simplifyToA1('Test', [], lang);
        const parts = result.split('. ');
        const question = parts.length > 1 ? parts[parts.length - 1] : parts[0];
        if (question) questions.add(question);
    }
    questionSets[lang] = Array.from(questions);
    console.log(`  ${lang}: ${questions.size} unique questions`);
}

// Test fallback to Spanish for unknown language
console.log('\nTesting fallback for unknown language:');
const unknownResult = simplifyToA1('Test', [], 'xx');
const unknownParts = unknownResult.split('. ');
const unknownQuestion = unknownParts.length > 1 ? unknownParts[unknownParts.length - 1] : unknownParts[0];
console.log(`  Unknown language 'xx' result: "${unknownResult}"`);
console.log(`  Question: "${unknownQuestion}"`);
if (unknownQuestion && unknownQuestion.includes('¿')) {
    console.log('  ✓ Falls back to Spanish questions\n');
} else {
    console.log('  ✗ Does not fall back to Spanish\n');
    allPassed = false;
}

// Test validateA1Compliance with language parameter
console.log('Testing validateA1Compliance with syllabus language:');
try {
    // We need to import validateA1Compliance
    const module = await import('./src/lib/a1Simplifier.js');
    const { validateA1Compliance } = module;

    const spanishSyllabus = { vocab: ['hola', 'gracias'], language: 'es' };
    const frenchSyllabus = { vocab: ['bonjour', 'merci'], language: 'fr' };

    const spanishReply = 'Hola cómo estás';
    const frenchReply = 'Bonjour comment allez-vous';

    const spanishResult = validateA1Compliance(spanishReply, spanishSyllabus);
    const frenchResult = validateA1Compliance(frenchReply, frenchSyllabus);

    console.log(`  Spanish reply result: "${spanishResult}"`);
    console.log(`  French reply result: "${frenchResult}"`);

    // Check that results contain appropriate language questions
    if (spanishResult.includes('¿') && frenchResult.includes('?')) {
        console.log('  ✓ Language-specific validation works\n');
    } else {
        console.log('  ✗ Language validation may not be working\n');
        allPassed = false;
    }
} catch (error) {
    console.log(`  Error testing validateA1Compliance: ${error.message}\n`);
    allPassed = false;
}

if (allPassed) {
    console.log('✅ All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}