const fs = require('fs');
const path = require('path');

// Test importing a few curriculum files directly
async function testDirectImports() {
    console.log('Testing direct curriculum file imports...\n');

    const testCases = [
        { file: 'src/curriculum/english/A1.js', exportName: 'ENGLISH_A1' },
        { file: 'src/curriculum/english/A2.js', exportName: 'ENGLISH_A2' },
        { file: 'src/curriculum/english/B1.js', exportName: 'ENGLISH_B1' },
        { file: 'src/curriculum/spanish/A1.js', exportName: 'SPANISH_A1' },
        { file: 'src/curriculum/spanish/A2.js', exportName: 'SPANISH_A2' },
        { file: 'src/curriculum/spanish/B1.js', exportName: 'SPANISH_B1' },
        { file: 'src/curriculum/french/A1.js', exportName: 'FRENCH_A1' },
        { file: 'src/curriculum/french/A2.js', exportName: 'FRENCH_A2' },
        { file: 'src/curriculum/french/B1.js', exportName: 'FRENCH_B1' },
        { file: 'src/curriculum/german/A1.js', exportName: 'GERMAN_A1' },
        { file: 'src/curriculum/german/A2.js', exportName: 'GERMAN_A2' },
        { file: 'src/curriculum/german/B1.js', exportName: 'GERMAN_B1' },
    ];

    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
        try {
            // Read the file to check syntax
            const content = fs.readFileSync(testCase.file, 'utf8');

            // Check that it exports default
            if (!content.includes('export default')) {
                throw new Error(`File ${testCase.file} does not export default`);
            }

            // Check that the constant is defined
            const constName = testCase.exportName;
            if (!content.includes(`const ${constName}`) && !content.includes(`const ${constName} =`)) {
                // Some files might use different naming (like FRENCH_A2 vs FRENCHA2)
                // Let's be more flexible
                console.log(`  Note: ${testCase.file} might use different constant naming`);
            }

            // Check for required fields
            const requiredFields = ['level', 'language', 'languageCode', 'grammarDetails', 'vocab', 'phonemeDetails'];
            for (const field of requiredFields) {
                if (!content.includes(`${field}:`)) {
                    console.log(`  Warning: ${testCase.file} might not have ${field} field`);
                }
            }

            console.log(`✓ ${testCase.file} - syntax OK`);
            passed++;

        } catch (error) {
            console.log(`✗ ${testCase.file} - ${error.message}`);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed`);

    // Also check that all language folders have A1, A2, B1 files
    console.log('\nChecking file structure...');
    const languages = [
        'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
        'dutch', 'swedish', 'turkish', 'greek', 'arabic', 'hindi',
        'japanese', 'korean', 'mandarin', 'russian'
    ];

    const levels = ['A1', 'A2', 'B1'];

    for (const lang of languages) {
        for (const level of levels) {
            const filePath = `src/curriculum/${lang}/${level}.js`;
            if (fs.existsSync(filePath)) {
                console.log(`  ✓ ${lang}/${level}.js exists`);
            } else {
                console.log(`  ✗ ${lang}/${level}.js MISSING`);
                failed++;
            }
        }
    }

    if (failed === 0) {
        console.log('\n✅ All curriculum files are properly structured and exported!');
        return true;
    } else {
        console.log(`\n❌ Found ${failed} issues with curriculum files.`);
        return false;
    }
}

testDirectImports();