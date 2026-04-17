const fs = require('fs');
const path = require('path');

const languages = [
    { name: 'English', code: 'en', folder: 'english' },
    { name: 'Spanish', code: 'es', folder: 'spanish' },
    { name: 'French', code: 'fr', folder: 'french' },
    { name: 'German', code: 'de', folder: 'german' },
    { name: 'Italian', code: 'it', folder: 'italian' },
    { name: 'Portuguese', code: 'pt', folder: 'portuguese' },
    { name: 'Dutch', code: 'nl', folder: 'dutch' },
    { name: 'Swedish', code: 'sv', folder: 'swedish' },
    { name: 'Turkish', code: 'tr', folder: 'turkish' },
    { name: 'Greek', code: 'el', folder: 'greek' },
    { name: 'Russian', code: 'ru', folder: 'russian' },
    { name: 'Hindi', code: 'hi', folder: 'hindi' },
    { name: 'Japanese', code: 'ja', folder: 'japanese' },
    { name: 'Korean', code: 'ko', folder: 'korean' },
    { name: 'Mandarin', code: 'zh', folder: 'mandarin' },
    { name: 'Arabic', code: 'ar', folder: 'arabic' }
];

console.log('Testing all 16 B1 files for structural validity...\n');

const requiredFields = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
const results = [];

for (const lang of languages) {
    const filePath = `src/curriculum/${lang.folder}/B1.js`;

    try {
        if (!fs.existsSync(filePath)) {
            results.push({ lang: lang.name, status: '❌', error: 'File not found' });
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/const\s+[A-Z_]+_B1\s*=\s*(\{[\s\S]*?\});/);

        if (!match) {
            results.push({ lang: lang.name, status: '❌', error: 'Could not extract object' });
            continue;
        }

        const syllabus = eval(`(${match[1]})`);

        // Check required fields
        const missingFields = requiredFields.filter(field => !(field in syllabus));
        const arrayFields = ['grammar', 'vocab', 'phonemes'];
        const nonArrayFields = arrayFields.filter(field => !Array.isArray(syllabus[field]));

        // Check language field
        const languageCorrect = syllabus.language === lang.code;
        const cefrCorrect = syllabus.cefr === 'B1';

        const hasGrammarDetails = 'grammarDetails' in syllabus;
        const hasPhonemeDetails = 'phonemeDetails' in syllabus;
        const hasVocabThemes = 'vocabThemes' in syllabus;

        const errors = [];
        if (missingFields.length > 0) errors.push(`Missing: ${missingFields.join(', ')}`);
        if (nonArrayFields.length > 0) errors.push(`Non-array: ${nonArrayFields.join(', ')}`);
        if (!languageCorrect) errors.push(`Language should be "${lang.code}", got "${syllabus.language}"`);
        if (!cefrCorrect) errors.push(`CEFR should be "B1", got "${syllabus.cefr}"`);
        if (!hasGrammarDetails) errors.push('Missing grammarDetails');
        if (!hasPhonemeDetails) errors.push('Missing phonemeDetails');
        if (!hasVocabThemes) errors.push('Missing vocabThemes');

        if (errors.length === 0) {
            results.push({
                lang: lang.name,
                status: '✅',
                details: `Grammar: ${syllabus.grammar.length}, Vocab: ${syllabus.vocab.length}, Phonemes: ${syllabus.phonemes.length}`
            });
        } else {
            results.push({ lang: lang.name, status: '❌', error: errors.join('; ') });
        }

    } catch (error) {
        results.push({ lang: lang.name, status: '❌', error: `Parse error: ${error.message}` });
    }
}

// Print results
console.log('RESULTS:');
console.log('========');
results.forEach(r => {
    if (r.status === '✅') {
        console.log(`${r.status} ${r.lang.padEnd(12)} ${r.details}`);
    } else {
        console.log(`${r.status} ${r.lang.padEnd(12)} ${r.error}`);
    }
});

// Summary
const passed = results.filter(r => r.status === '✅').length;
const failed = results.filter(r => r.status === '❌').length;

console.log('\nSUMMARY:');
console.log('========');
console.log(`Total: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
    console.log('\n🎉 All 16 B1 files are valid and should work correctly!');
    console.log('The B1 intermediate level redirect loop should be resolved.');
} else {
    console.log('\n⚠️ Some B1 files have issues that need to be fixed.');
    process.exit(1);
}