#!/usr/bin/env node

/**
 * Batch fix all non-English A1.js and A2.js files to match the exact structure of English A1/A2.
 * Uses a more robust parsing approach with bracket counting.
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

// Base directory
const CURRICULUM_DIR = path.join(__dirname, 'src', 'curriculum');

/**
 * Extract JavaScript object from file content using bracket counting
 */
function extractObject(content, varNamePattern) {
    // Find the line with const VAR_NAME = {
    const lines = content.split('\n');
    let startLine = -1;
    let varName = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('const ') && line.includes('=') && line.includes('{')) {
            // Extract variable name
            const match = line.match(/const\s+([A-Z_][A-Z0-9_]*)\s*=/);
            if (match) {
                varName = match[1];
                startLine = i;
                break;
            }
        }
    }

    if (startLine === -1) {
        return null;
    }

    // Find the object start position in the content
    const startMarker = `const ${varName} =`;
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) {
        return null;
    }

    // Find the opening brace after the equals sign
    const braceStart = content.indexOf('{', startIdx + startMarker.length);
    if (braceStart === -1) {
        return null;
    }

    // Use bracket counting to find matching closing brace
    let braceCount = 1;
    let pos = braceStart + 1;

    while (braceCount > 0 && pos < content.length) {
        const char = content[pos];
        const nextChar = pos + 1 < content.length ? content[pos + 1] : '';

        // Handle strings to avoid counting braces inside strings
        if (char === '"' || char === "'" || char === '`') {
            const quote = char;
            pos++;
            // Skip escaped quotes
            while (pos < content.length && (content[pos] !== quote || content[pos - 1] === '\\')) {
                pos++;
            }
        }
        // Handle comments
        else if (char === '/' && nextChar === '/') {
            // Skip to end of line
            while (pos < content.length && content[pos] !== '\n') {
                pos++;
            }
        }
        else if (char === '/' && nextChar === '*') {
            // Skip multiline comment
            pos += 2;
            while (pos < content.length && !(content[pos] === '*' && content[pos + 1] === '/')) {
                pos++;
            }
            pos += 2;
        }
        // Count braces
        else if (char === '{') {
            braceCount++;
        }
        else if (char === '}') {
            braceCount--;
        }

        pos++;
    }

    if (braceCount !== 0) {
        return null;
    }

    const objectStr = content.substring(braceStart, pos);

    try {
        // Use Function constructor instead of eval for safety
        const obj = new Function(`return ${objectStr}`)();
        return obj;
    } catch (error) {
        console.error('Error parsing object:', error.message);
        return null;
    }
}

/**
 * Fix syllabus object to match required structure
 */
function fixSyllabus(syllabus, level, languageCode) {
    const fixed = { ...syllabus };

    // Ensure required fields
    fixed.level = level;
    fixed.language = languageCode;
    fixed.cefr = level;

    // Ensure grammar array exists
    if (!fixed.grammar || !Array.isArray(fixed.grammar)) {
        fixed.grammar = [];
    }

    // If grammarDetails exists but grammar is empty, extract IDs
    if (fixed.grammarDetails && Array.isArray(fixed.grammarDetails) && fixed.grammar.length === 0) {
        fixed.grammar = fixed.grammarDetails.map(item => {
            if (typeof item === 'string') return item;
            if (item.id) return item.id;
            if (item.concept) return item.concept;
            return '';
        }).filter(id => id);
    }

    // Ensure vocab array exists
    if (!fixed.vocab || !Array.isArray(fixed.vocab)) {
        fixed.vocab = [];
    }

    // Extract vocab themes
    if (!fixed.vocabThemes || !Array.isArray(fixed.vocabThemes)) {
        const themes = new Set();
        fixed.vocab.forEach(item => {
            if (item.theme) themes.add(item.theme);
            if (item.category) themes.add(item.category);
        });
        fixed.vocabThemes = Array.from(themes);
    }

    // Ensure phonemes array exists
    if (!fixed.phonemes || !Array.isArray(fixed.phonemes)) {
        fixed.phonemes = [];
    }

    // If phonemeDetails exists but phonemes is empty, extract keys
    if (fixed.phonemeDetails && Array.isArray(fixed.phonemeDetails) && fixed.phonemes.length === 0) {
        fixed.phonemes = fixed.phonemeDetails.map(item => {
            if (typeof item === 'string') return item;
            if (item.name) return item.name;
            if (item.phonemeKey) return item.phonemeKey;
            if (item.char) return item.char;
            return '';
        }).filter(key => key);
    }

    // Ensure pragmatics exists
    if (!fixed.pragmatics || typeof fixed.pragmatics !== 'string') {
        fixed.pragmatics = 'Direct but polite communication style.';
    }

    // Ensure orthography exists (can be null)
    if (!('orthography' in fixed)) {
        fixed.orthography = null;
    }

    // Add version
    fixed.version = '2.0';

    return fixed;
}

/**
 * Generate file content with proper formatting
 */
function generateFileContent(syllabus, languageName, level) {
    const varName = languageName.toUpperCase().replace(/[^A-Z]/g, '_') + '_' + level;

    return `/**
 * ${languageName} ${level} syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for ${level === 'A1' ? 'beginner' : 'elementary'} level.
 * @module curriculum/${languageName.toLowerCase()}/${level}
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const ${varName} = ${JSON.stringify(syllabus, null, 4)};

export default ${varName};`;
}

/**
 * Process a language folder
 */
function processLanguage(languageFolder) {
    const folderName = path.basename(languageFolder);

    if (folderName === 'english' || folderName === 'shared') {
        return 0; // Skip English and shared
    }

    const languageName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
    const languageCode = LANGUAGE_CODE_MAP[folderName.toLowerCase()];

    if (!languageCode) {
        console.warn(`No language code mapping for ${folderName}, skipping`);
        return 0;
    }

    console.log(`Processing ${languageName} (${languageCode})...`);

    let filesFixed = 0;

    // Process A1.js
    const a1Path = path.join(languageFolder, 'A1.js');
    if (fs.existsSync(a1Path)) {
        try {
            const content = fs.readFileSync(a1Path, 'utf8');
            const syllabus = extractObject(content);

            if (syllabus) {
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
            const syllabus = extractObject(content);

            if (syllabus) {
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

/**
 * Fix English A2.js if needed
 */
function fixEnglishA2() {
    const englishA2Path = path.join(CURRICULUM_DIR, 'english', 'A2.js');
    if (!fs.existsSync(englishA2Path)) {
        return false;
    }

    console.log('\nChecking English A2.js...');

    try {
        const content = fs.readFileSync(englishA2Path, 'utf8');
        const syllabus = extractObject(content);

        if (!syllabus) {
            console.warn('  Could not parse English A2.js');
            return false;
        }

        // Check required fields
        const REQUIRED_FIELDS = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
        const missing = REQUIRED_FIELDS.filter(key => !(key in syllabus));

        if (missing.length > 0) {
            console.log(`  English A2.js missing fields: ${missing.join(', ')}`);
            console.log('  Fixing English A2.js...');

            const fixed = fixSyllabus(syllabus, 'A2', 'en');
            const newContent = generateFileContent(fixed, 'English', 'A2');
            fs.writeFileSync(englishA2Path, newContent);
            console.log('  Fixed English A2.js');
            return true;
        } else {
            console.log('  English A2.js appears valid.');
            return false;
        }
    } catch (error) {
        console.error('  Error checking English A2.js:', error.message);
        return false;
    }
}

/**
 * Main function
 */
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
        totalFilesFixed += processLanguage(folder);
    }

    // Fix English A2 if needed
    const englishFixed = fixEnglishA2();
    if (englishFixed) {
        totalFilesFixed++;
    }

    console.log(`\nDone! Fixed ${totalFilesFixed} files.`);
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});