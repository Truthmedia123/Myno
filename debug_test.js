// Debug test
import { simplifyToA1 } from './src/lib/a1Simplifier.js';

console.log('Debugging simplifyToA1:');
console.log('Empty text, Spanish:');
const result1 = simplifyToA1('', [], 'es');
console.log(`Result: "${result1}"`);
console.log(`Length: ${result1.length}`);
console.log(`Type: ${typeof result1}`);

console.log('\nNon-empty text, Spanish:');
const result2 = simplifyToA1('Hello', [], 'es');
console.log(`Result: "${result2}"`);

console.log('\nNon-empty text, French:');
const result3 = simplifyToA1('Hello', [], 'fr');
console.log(`Result: "${result3}"`);

console.log('\nNon-empty text, Japanese:');
const result4 = simplifyToA1('Hello', [], 'ja');
console.log(`Result: "${result4}"`);

// Let's also test the getLanguageQuestions function directly
// First, let's see the a1Simplifier.js structure
import { readFileSync } from 'fs';
const content = readFileSync('./src/lib/a1Simplifier.js', 'utf8');
// Find getLanguageQuestions
const match = content.match(/function getLanguageQuestions\([^)]*\)[^{]*{([^}]+)}/);
if (match) {
    console.log('\ngetLanguageQuestions found:', match[1]);
}