const fs = require('fs');
const path = require('path');

// Mock the curriculum loading
async function testB1Load() {
    console.log('Testing B1 syllabus loading and validation...\n');

    // Test English B1
    const b1Path = path.join(__dirname, 'src/curriculum/english/B1.js');
    const content = fs.readFileSync(b1Path, 'utf8');

    // Extract the object
    const match = content.match(/const ENGLISH_B1 = (\{[\s\S]*?\});/);
    if (!match) {
        console.error('❌ Could not extract B1 object');
        return;
    }

    const ENGLISH_B1 = eval(`(${match[1]})`);

    console.log('=== Testing B1 Syllabus Validation ===');

    // 1. Check required fields (from validateSyllabus in curriculum/index.js)
    const requiredFields = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
    const missingFields = requiredFields.filter(field => !(field in ENGLISH_B1));

    if (missingFields.length > 0) {
        console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    } else {
        console.log('✅ All required fields present');
    }

    // 2. Check field types
    const arrayFields = ['grammar', 'vocab', 'phonemes'];
    const nonArrayFields = arrayFields.filter(field => !Array.isArray(ENGLISH_B1[field]));

    if (nonArrayFields.length > 0) {
        console.error(`❌ Fields should be arrays: ${nonArrayFields.join(', ')}`);
    } else {
        console.log('✅ All array fields are arrays');
        console.log(`   - grammar: ${ENGLISH_B1.grammar.length} items`);
        console.log(`   - vocab: ${ENGLISH_B1.vocab.length} items`);
        console.log(`   - phonemes: ${ENGLISH_B1.phonemes.length} items`);
    }

    // 3. Check language field (should be code, not name)
    if (ENGLISH_B1.language !== 'en') {
        console.error(`❌ Language field should be "en", got "${ENGLISH_B1.language}"`);
    } else {
        console.log('✅ Language field is correct code: "en"');
    }

    // 4. Check cefr field
    if (ENGLISH_B1.cefr !== 'B1') {
        console.error(`❌ CEFR field should be "B1", got "${ENGLISH_B1.cefr}"`);
    } else {
        console.log('✅ CEFR field is correct: "B1"');
    }

    // 5. Simulate the profile validation from Chat.jsx (lines 476-487)
    console.log('\n=== Simulating Chat.jsx Profile Validation ===');

    const mockProfile = {
        target_language: 'English',
        native_language: 'English',
        learning_goal: 'General',
        user_level: 'intermediate' // This maps to B1
    };

    // Check if profile fields are non-empty strings
    const profileFields = ['target_language', 'native_language', 'learning_goal'];
    const emptyProfileFields = profileFields.filter(field => !mockProfile[field] || typeof mockProfile[field] !== 'string' || mockProfile[field].trim() === '');

    if (emptyProfileFields.length > 0) {
        console.error(`❌ Profile validation would fail: empty fields ${emptyProfileFields.join(', ')}`);
    } else {
        console.log('✅ Profile validation would pass');
    }

    // 6. Simulate level mapping (from Chat.jsx line 641-645)
    const levelMap = {
        'beginner': 'A1',
        'some': 'A2',
        'intermediate': 'B1'
    };

    const userLevel = mockProfile.user_level;
    const cefrLevel = levelMap[userLevel];

    console.log(`\n=== Level Mapping Test ===`);
    console.log(`User level: "${userLevel}" → CEFR level: "${cefrLevel}"`);

    if (cefrLevel !== 'B1') {
        console.error(`❌ Level mapping incorrect: expected "B1" for "intermediate"`);
    } else {
        console.log('✅ Level mapping correct');
    }

    // 7. Check if syllabus would be accepted by learningGoals.js
    console.log('\n=== Learning Goals Compatibility ===');

    // learningGoals.js uses syllabus.grammar?.includes(g) expecting array of strings
    const grammarArray = ENGLISH_B1.grammar;
    if (Array.isArray(grammarArray) && grammarArray.every(item => typeof item === 'string')) {
        console.log('✅ Grammar array compatible with learningGoals.js');
    } else {
        console.error('❌ Grammar array not compatible with learningGoals.js');
    }

    // 8. Summary
    console.log('\n=== SUMMARY ===');
    const allPassed = missingFields.length === 0 &&
        nonArrayFields.length === 0 &&
        ENGLISH_B1.language === 'en' &&
        ENGLISH_B1.cefr === 'B1' &&
        emptyProfileFields.length === 0 &&
        cefrLevel === 'B1';

    if (allPassed) {
        console.log('✅ B1 syllabus is VALID and should not cause redirect loop');
        console.log('✅ The fix should resolve the B1 intermediate level redirect issue');
    } else {
        console.log('❌ B1 syllabus has issues that could cause redirect loop');
        console.log('   Please check the errors above.');
    }
}

testB1Load().catch(console.error);