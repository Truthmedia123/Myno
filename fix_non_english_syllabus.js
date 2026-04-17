#!/usr/bin/env node

/**
 * Batch fix all non-English A1.js and A2.js files to match the exact structure of English A1/A2.
 * 
 * PROBLEM: Non-English languages redirect to onboarding because syllabus validation fails
 * due to missing required fields or incorrect language codes.
 * 
 * This script:
 * 1. Reads each language folder in src/curriculum/ (excluding english)
 * 2. Opens A1.js and A2.js
 * 3. Ensures required fields exist at top level
 * 4. Converts grammarDetails to grammar array if needed
 * 5. Converts phonemeDetails to phonemes array if needed
 * 6. Saves the corrected file
 */

const fs = require('fs');
const path = require('path');

// Language code mapping (folder name -> ISO code)
const LANGUAGE_CODE_MAP = {
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'dutch': 'nl',
    'swedish': 'sv',
    'turkish': 'tr',
    'greek': 'el',
    'arabic': 'ar',
    'hindi': 'hi',
    'japanese': 'ja',
    'korean': 'ko',
    'mandarin': 'zh',
    'russian': 'ru'
};

// Required fields for validation (from curriculum/index.js validateSyllabus)
const REQUIRED_FIELDS = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];

// Base directory
const CURRICULUM_DIR = path.join(__dirname, 'src', 'curriculum');

// Template for A1 structure (based on English A1.js)
const A1_TEMPLATE = {
    level: 'A1',
    cefr: 'A1',
    grammar: [], // array of strings
    grammarDetails: [], // array of objects
    vocab: [], // array of objects
    vocabThemes: [], // array of strings
    phonemes: [], // array of strings
    phonemeDetails: [], // array of objects
    pragmatics: '',
    orthography: null,
    version: '2.0'
};

// Template for A2 structure (needs to be derived from English A2.js but with correct fields)
const A2_TEMPLATE = {
    level: 'A2',
    cefr: 'A2',
    grammar: [], // array of strings
    grammarDetails: [], // array of objects
    vocab: [], // array of objects
    vocabThemes: [], // array of strings
    phonemes: [], // array of strings
    phonemeDetails: [], // array of objects
    pragmatics: '',
    orthography: null,
    version: '2.0'
};

function extractGrammarIds(grammarDetails) {
    if (!Array.isArray(grammarDetails)) return [];
    return grammarDetails.map(item => {
        if (typeof item === 'string') return item;
        if (item.id) return item.id;
        if (item.concept) return item.concept;
        return '';
    }).filter(id => id);
}

function extractPhonemeKeys(phonemeDetails) {
    if (!Array.isArray(phonemeDetails)) return [];
    return phonemeDetails.map(item => {
        if (typeof item === 'string') return item;
        if (item.name) return item.name;
        if (item.phonemeKey) return item.phonemeKey;
        if (item.char) return item.char;
        return '';
    }).filter(key => key);
}

function extractVocabThemes(vocab) {
    if (!Array.isArray(vocab)) return [];
    const themes = new Set();
    vocab.forEach(item => {
        if (item.theme) themes.add(item.theme);
        if (item.category) themes.add(item.category);
    });
    return Array.from(themes);
}

function fixSyllabus(syllabus, level, languageCode) {
    const fixed = { ...syllabus };

    // Ensure required fields
    fixed.level = level;
    fixed.language = languageCode;
    fixed.cefr = level;

    // Handle grammar
    if (!fixed.grammar || !Array.isArray(fixed.grammar)) {
        if (fixed.grammarDetails && Array.isArray(fixed.grammarDetails)) {
            fixed.grammar = extractGrammarIds(fixed.grammarDetails);
        } else {
            fixed.grammar = [];
        }
    }

    // Ensure grammarDetails exists
    if (!fixed.grammarDetails || !Array.isArray(fixed.grammarDetails)) {
        fixed.grammarDetails = [];
    }

    // Handle vocab
    if (!fixed.vocab || !Array.isArray(fixed.vocab)) {
        fixed.vocab = [];
    }

    // Handle vocabThemes
    if (!fixed.vocabThemes || !Array.isArray(fixed.vocabThemes)) {
        fixed.vocabThemes = extractVocabThemes(fixed.vocab);
    }

    // Handle phonemes
    if (!fixed.phonemes || !Array.isArray(fixed.phonemes)) {
        if (fixed.phonemeDetails && Array.isArray(fixed.phonemeDetails)) {
            fixed.phonemes = extractPhonemeKeys(fixed.phonemeDetails);
        } else {
            fixed.phonemes = [];
        }
    }

    // Ensure phonemeDetails exists
    if (!fixed.phonemeDetails || !Array.isArray(fixed.phonemeDetails)) {
        fixed.phonemeDetails = [];
    }

    // Handle pragmatics
    if (!fixed.pragmatics || typeof fixed.pragmatics !== 'string') {
        fixed.pragmatics = '';
    }

    // Handle orthography
    if (!('orthography' in fixed)) {
        fixed.orthography = null;
    }

    // Add version if missing
    if (!fixed.version) {
        fixed.version = '2.0';
    }

    return fixed;
}

function generateFileContent(syllabus, languageName, level) {
    const constName = languageName.toUpperCase().replace(/[^A-Z]/g, '_') + '_' + level;

    return `// src/curriculum/${languageName}/${level}.js
/**
 * ${languageName.charAt(0).toUpperCase() + languageName.slice(1)} ${level} syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for ${level === 'A1' ? 'beginner' : 'elementary'} level.
 * @module curriculum/${languageName}/${level}
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ${constName} = ${JSON.stringify(syllabus, null, 4)};

export default ${constName};`;
}

async function processLanguage(languageFolder) {
    const languageName = path.basename(languageFolder);

    if (languageName === 'english' || languageName === 'shared') {
        console.log(`Skipping ${languageName}`);
        return 0;
    }

    const languageCode = LANGUAGE_CODE_MAP[languageName];
    if (!languageCode) {
        console.warn(`No language code mapping for ${languageName}, skipping`);
        return 0;
    }

    console.log(`Processing ${languageName} (${languageCode})...`);

    let filesFixed = 0;

    // Process A1.js
    const a1Path = path.join(languageFolder, 'A1.js');
    if (fs.existsSync(a1Path)) {
        try {
            const content = fs.readFileSync(a1Path, 'utf8');
            // Extract the syllabus object (simplified approach)
            const match = content.match(/const\s+[A-Z_]+\s*=\s*({[\s\S]*?});/);
            if (match) {
                const syllabus = eval(`(${match[1]})`);
                const fixed = fixSyllabus(syllabus, 'A1', languageCode);
                const newContent = generateFileContent(fixed, languageName, 'A1');
                fs.writeFileSync(a1Path, newContent);
                console.log(`  Fixed ${languageName}/A1.js`);
                filesFixed++;
            } else {
                console.warn(`  Could not parse syllabus object in ${languageName}/A1.js`);
            }
        } catch (error) {
            console.error(`  Error processing ${languageName}/A1.js:`, error.message);
        }
    }

    // Process A2.js
    const a2Path = path.join(languageFolder, 'A2.js');
    if (fs.existsSync(a2Path)) {
        try {
            const content = fs.readFileSync(a2Path, 'utf8');
            const match = content.match(/const\s+[A-Z_]+\s*=\s*({[\s\S]*?});/);
            if (match) {
                const syllabus = eval(`(${match[1]})`);
                const fixed = fixSyllabus(syllabus, 'A2', languageCode);
                const newContent = generateFileContent(fixed, languageName, 'A2');
                fs.writeFileSync(a2Path, newContent);
                console.log(`  Fixed ${languageName}/A2.js`);
                filesFixed++;
            } else {
                console.warn(`  Could not parse syllabus object in ${languageName}/A2.js`);
            }
        } catch (error) {
            console.error(`  Error processing ${languageName}/A2.js:`, error.message);
        }
    }

    return filesFixed;
}

async function main() {
    console.log('Batch fixing non-English A1/A2 syllabus files...\n');

    if (!fs.existsSync(CURRICULUM_DIR)) {
        console.error(`Curriculum directory not found: ${CURRICULUM_DIR}`);
        process.exit(1);
    }

    const languageFolders = fs.readdirSync(CURRICULUM_DIR)
        .map(name => path.join(CURRICULUM_DIR, name))
        .filter(item => fs.statSync(item).isDirectory());

    let totalFilesFixed = 0;

    for (const folder of languageFolders) {
        totalFilesFixed += await processLanguage(folder);
    }

    console.log(`\nDone! Fixed ${totalFilesFixed} files.`);

    // Also fix English A2.js if it has issues
    const englishA2Path = path.join(CURRICULUM_DIR, 'english', 'A2.js');
    if (fs.existsSync(englishA2Path)) {
        console.log('\nChecking English A2.js...');
        try {
            const content = fs.readFileSync(englishA2Path, 'utf8');
            const match = content.match(/const\s+[A-Z_]+\s*=\s*({[\s\S]*?});/);
            if (match) {
                const syllabus = eval(`(${match[1]})`);
                // Check if it has required fields
                const missing = REQUIRED_FIELDS.filter(key => !(key in syllabus));
                if (missing.length > 0) {
                    console.log(`  English A2.js missing fields: ${missing.join(', ')}`);
                    console.log('  Consider fixing English A2.js as well for consistency.');
                } else {
                    console.log('  English A2.js appears valid.');
                }
            }
        } catch (error) {
            console.error('  Error checking English A2.js:', error.message);
        }
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});