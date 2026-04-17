const { getCurriculum } = require('./src/curriculum/index.js');

async function test() {
    try {
        console.log('Testing B1 syllabus load for English...');
        const syllabus = await getCurriculum('en', 'B1');
        console.log('✅ Successfully loaded B1 syllabus');
        console.log('Level:', syllabus.level);
        console.log('Language:', syllabus.language);
        console.log('Grammar array length:', syllabus.grammar.length);
        console.log('Vocab array length:', syllabus.vocab.length);
        console.log('Phonemes array length:', syllabus.phonemes.length);
        console.log('Has vocabThemes?', 'vocabThemes' in syllabus);
        console.log('Has grammarDetails?', 'grammarDetails' in syllabus);
        console.log('Has phonemeDetails?', 'phonemeDetails' in syllabus);
    } catch (error) {
        console.error('❌ Failed to load B1 syllabus:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

test();