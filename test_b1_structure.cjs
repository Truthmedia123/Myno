const fs = require('fs');
const path = require('path');

// Test English B1.js structure
const b1Path = path.join(__dirname, 'src/curriculum/english/B1.js');
const a1Path = path.join(__dirname, 'src/curriculum/english/A1.js');

console.log('Testing B1.js structure...');

// Read and evaluate the B1 file
const b1Content = fs.readFileSync(b1Path, 'utf8');
const a1Content = fs.readFileSync(a1Path, 'utf8');

// Extract the exported object using a simple regex
const b1Match = b1Content.match(/const ENGLISH_B1 = (\{[\s\S]*?\});/);
const a1Match = a1Content.match(/const ENGLISH_A1 = (\{[\s\S]*?\});/);

if (!b1Match || !a1Match) {
    console.error('❌ Could not extract syllabus objects');
    process.exit(1);
}

// Evaluate the objects (safe eval in controlled environment)
const ENGLISH_B1 = eval(`(${b1Match[1]})`);
const ENGLISH_A1 = eval(`(${a1Match[1]})`);

console.log('✅ Loaded B1 and A1 objects');

// Check required fields from validateSyllabus
const requiredFields = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
console.log('\n=== Required Field Validation ===');
for (const field of requiredFields) {
    const hasField = field in ENGLISH_B1;
    const value = ENGLISH_B1[field];
    console.log(`${hasField ? '✅' : '❌'} ${field}: ${hasField ? typeof value : 'MISSING'}`);
    if (hasField && Array.isArray(value)) {
        console.log(`   Array length: ${value.length}`);
    }
}

// Check language field format
console.log('\n=== Language Field ===');
console.log(`B1 language: "${ENGLISH_B1.language}" (should be "en")`);
console.log(`A1 language: "${ENGLISH_A1.language}" (reference)`);

// Check grammar structure
console.log('\n=== Grammar Structure ===');
console.log(`B1 grammar type: ${Array.isArray(ENGLISH_B1.grammar) ? 'array' : typeof ENGLISH_B1.grammar}`);
if (Array.isArray(ENGLISH_B1.grammar)) {
    console.log(`B1 grammar first item: "${ENGLISH_B1.grammar[0]}" (should be string ID)`);
    console.log(`B1 grammarDetails exists: ${'grammarDetails' in ENGLISH_B1}`);
}

// Check phonemes structure
console.log('\n=== Phonemes Structure ===');
console.log(`B1 phonemes type: ${Array.isArray(ENGLISH_B1.phonemes) ? 'array' : typeof ENGLISH_B1.phonemes}`);
if (Array.isArray(ENGLISH_B1.phonemes)) {
    console.log(`B1 phonemes first item: "${ENGLISH_B1.phonemes[0]}" (should be string ID)`);
    console.log(`B1 phonemeDetails exists: ${'phonemeDetails' in ENGLISH_B1}`);
}

// Check additional fields
console.log('\n=== Additional Fields ===');
console.log(`B1 has cefr field: ${'cefr' in ENGLISH_B1} (value: ${ENGLISH_B1.cefr || 'undefined'})`);
console.log(`B1 has vocabThemes: ${'vocabThemes' in ENGLISH_B1}`);
if ('vocabThemes' in ENGLISH_B1) {
    console.log(`B1 vocabThemes length: ${ENGLISH_B1.vocabThemes.length}`);
}

// Compare with A1 structure
console.log('\n=== Comparison with A1 ===');
console.log(`A1 grammar type: ${Array.isArray(ENGLISH_A1.grammar) ? 'array' : typeof ENGLISH_A1.grammar}`);
console.log(`A1 phonemes type: ${Array.isArray(ENGLISH_A1.phonemes) ? 'array' : typeof ENGLISH_A1.phonemes}`);
console.log(`A1 has grammarDetails: ${'grammarDetails' in ENGLISH_A1}`);
console.log(`A1 has phonemeDetails: ${'phonemeDetails' in ENGLISH_A1}`);
console.log(`A1 has cefr: ${'cefr' in ENGLISH_A1} (value: ${ENGLISH_A1.cefr})`);

// Validation summary
const missingFields = requiredFields.filter(field => !(field in ENGLISH_B1));
const arrayFields = ['grammar', 'vocab', 'phonemes'];
const nonArrayFields = arrayFields.filter(field => !Array.isArray(ENGLISH_B1[field]));

console.log('\n=== Validation Summary ===');
if (missingFields.length === 0 && nonArrayFields.length === 0) {
    console.log('✅ All required fields present and correctly typed');
    console.log('✅ B1 structure appears valid');
} else {
    console.log('❌ Issues found:');
    if (missingFields.length > 0) {
        console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }
    if (nonArrayFields.length > 0) {
        console.log(`   Non-array fields that should be arrays: ${nonArrayFields.join(', ')}`);
    }
    process.exit(1);
}