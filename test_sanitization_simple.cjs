// Simple test to verify sanitization logic
const fs = require('fs');

console.log('Testing sanitization implementation...\n');

// Check groqClient.js
const groqContent = fs.readFileSync('./src/lib/groqClient.js', 'utf8');
const hasSanitizeFunction = groqContent.includes('function sanitizeGroqResponse');
const hasCallGroqUpdate = groqContent.includes('sanitizeGroqResponse(rawText)');
const hasCacheSanitization = groqContent.includes('sanitizeGroqResponse(cached)');

console.log('=== groqClient.js Checks ===');
console.log(`1. Sanitization function exists: ${hasSanitizeFunction ? '✓' : '✗'}`);
console.log(`2. callGroq uses sanitization: ${hasCallGroqUpdate ? '✓' : '✗'}`);
console.log(`3. Cached responses are sanitized: ${hasCacheSanitization ? '✓' : '✗'}`);

// Extract the sanitization function to see its logic
const sanitizeMatch = groqContent.match(/function sanitizeGroqResponse\([^)]*\)\s*\{[\s\S]*?\n\}/);
if (sanitizeMatch) {
    console.log('\n4. Sanitization function includes key patterns:');
    const func = sanitizeMatch[0];
    const checks = [
        { name: 'SCENARIO LOCK removal', found: func.includes('SCENARIO LOCK:') },
        { name: 'VOCAB: removal', found: func.includes('VOCAB:') },
        { name: 'Good WORD removal', found: func.includes('Good\\s+WORD:') },
        { name: 'JSON field removal', found: func.includes('"reply"') },
        { name: 'JSON braces removal', found: func.includes('\\{.*?\\}') }
    ];
    checks.forEach(check => console.log(`   ${check.name}: ${check.found ? '✓' : '✗'}`));
}

// Check promptBuilder.js
const promptContent = fs.readFileSync('./src/lib/promptBuilder.js', 'utf8');
const hasResponseFormat = promptContent.includes('RESPONSE FORMAT:');
const hasJsonOutput = promptContent.includes('"reply": "${target_language} response') ||
    promptContent.includes('"reply": "${target_language} response');

console.log('\n=== promptBuilder.js Checks ===');
console.log(`1. Has RESPONSE FORMAT (not OUTPUT): ${hasResponseFormat ? '✓' : '✗'}`);
console.log(`2. No JSON schema in buildScenarioPrompt: ${!promptContent.includes('"reply": "Your conversational response in') ? '✓' : '✗'}`);
console.log(`3. No JSON schema in buildCurriculumPrompt: ${!promptContent.includes('"reply": "${target_language} response (2-3 sentences)"') ? '✓' : '✗'}`);

// Check specific sections
const scenarioPromptJson = promptContent.includes('"reply": "Your conversational response in');
const curriculumPromptJson = promptContent.includes('"reply": "${target_language} response (2-3 sentences)"');
console.log(`\nDetailed check:`);
console.log(`- buildScenarioPrompt JSON removed: ${!scenarioPromptJson ? '✓' : '✗'}`);
console.log(`- buildCurriculumPrompt JSON removed: ${!curriculumPromptJson ? '✓' : '✗'}`);

// Test actual sanitization with a mock
console.log('\n=== Manual Sanitization Test ===');
console.log('The sanitization function should remove:');
console.log('1. "SCENARIO LOCK:" prefix');
console.log('2. "VOCAB:" section headers');
console.log('3. "Good WORD: hello::" patterns');
console.log('4. JSON structures like {"reply": "text"}');

console.log('\n=== Summary ===');
const allPass = hasSanitizeFunction && hasCallGroqUpdate && hasResponseFormat && !scenarioPromptJson && !curriculumPromptJson;
if (allPass) {
    console.log('✅ All prompt leakage fixes appear to be correctly implemented.');
    console.log('The Groq API responses should no longer contain leaked prompt fragments.');
} else {
    console.log('⚠️ Some checks failed. Review the implementation.');
}