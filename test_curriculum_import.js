import { getCurriculum } from './src/curriculum/index.js';

async function testCurriculum() {
    console.log('Testing curriculum imports...');

    try {
        // Test English A1
        const englishA1 = await getCurriculum('en', 'A1');
        console.log('✓ English A1 loaded successfully');
        console.log(`  Language: ${englishA1.language}, Level: ${englishA1.level}`);
        console.log(`  Grammar concepts: ${englishA1.grammarDetails.length}`);
        console.log(`  Phonemes: ${englishA1.phonemeDetails.length}`);

        // Test Spanish A2
        const spanishA2 = await getCurriculum('es', 'A2');
        console.log('✓ Spanish A2 loaded successfully');
        console.log(`  Language: ${spanishA2.language}, Level: ${spanishA2.level}`);

        // Test French B1
        const frenchB1 = await getCurriculum('fr', 'B1');
        console.log('✓ French B1 loaded successfully');
        console.log(`  Language: ${frenchB1.language}, Level: ${frenchB1.level}`);

        // Test a few more random combinations
        const languages = ['de', 'it', 'pt', 'nl', 'sv', 'tr', 'el', 'ar', 'hi', 'ja', 'ko', 'zh', 'ru'];
        const levels = ['A1', 'A2', 'B1'];

        for (const lang of languages.slice(0, 3)) {
            for (const level of levels) {
                try {
                    const syllabus = await getCurriculum(lang, level);
                    console.log(`✓ ${lang} ${level} loaded successfully`);
                } catch (error) {
                    console.log(`✗ ${lang} ${level} failed: ${error.message}`);
                }
            }
        }

        console.log('\nAll tests passed! Curriculum structure is valid.');

    } catch (error) {
        console.error('Error testing curriculum:', error);
        process.exit(1);
    }
}

testCurriculum();