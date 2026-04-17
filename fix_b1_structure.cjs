const fs = require('fs');
const path = require('path');

// Language name to code mapping
const NAME_TO_CODE = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    italian: 'it',
    portuguese: 'pt',
    japanese: 'ja',
    korean: 'ko',
    mandarin: 'zh',
    arabic: 'ar',
    hindi: 'hi',
    russian: 'ru',
    dutch: 'nl',
    turkish: 'tr',
    swedish: 'sv',
    greek: 'el'
};

// Vocabulary themes for B1 level (generic - can be customized per language)
const VOCAB_THEMES = [
    "education",
    "technology",
    "work",
    "travel",
    "health",
    "environment",
    "culture",
    "social"
];

const b1Files = [
    'src/curriculum/arabic/B1.js',
    'src/curriculum/dutch/B1.js',
    'src/curriculum/english/B1.js', // already fixed but will validate
    'src/curriculum/french/B1.js',
    'src/curriculum/german/B1.js',
    'src/curriculum/greek/B1.js',
    'src/curriculum/hindi/B1.js',
    'src/curriculum/italian/B1.js',
    'src/curriculum/japanese/B1.js',
    'src/curriculum/korean/B1.js',
    'src/curriculum/mandarin/B1.js',
    'src/curriculum/portuguese/B1.js',
    'src/curriculum/russian/B1.js',
    'src/curriculum/spanish/B1.js',
    'src/curriculum/swedish/B1.js',
    'src/curriculum/turkish/B1.js'
];

function parseObjectFromFile(content) {
    // Extract the main object definition
    const match = content.match(/const\s+[A-Z_]+_B1\s*=\s*(\{[\s\S]*?\});/);
    if (!match) {
        throw new Error('Could not find B1 object definition');
    }

    // Use eval to parse the object (safe in this controlled context)
    const obj = eval(`(${match[1]})`);
    return obj;
}

function getLanguageCodeFromPath(filePath) {
    const folderName = path.dirname(filePath).split(path.sep).pop();
    return NAME_TO_CODE[folderName] || folderName;
}

function transformB1Object(obj, langCode) {
    const transformed = { ...obj };

    // 1. Ensure language field is code, not name
    transformed.language = langCode;

    // 2. Add cefr field if missing
    if (!transformed.cefr) {
        transformed.cefr = "B1";
    }

    // 3. Handle grammar structure
    if (Array.isArray(transformed.grammar)) {
        // Check if grammar is array of objects
        if (transformed.grammar.length > 0 && typeof transformed.grammar[0] === 'object') {
            // Extract concept IDs for grammar array
            const grammarIds = transformed.grammar.map(g => g.concept || g.id || 'unknown');
            // Move objects to grammarDetails
            transformed.grammarDetails = transformed.grammar;
            transformed.grammar = grammarIds;
        }
    }

    // 4. Handle phonemes structure
    if (Array.isArray(transformed.phonemes)) {
        // Check if phonemes is array of objects
        if (transformed.phonemes.length > 0 && typeof transformed.phonemes[0] === 'object') {
            // Extract keys for phonemes array
            const phonemeKeys = transformed.phonemes.map(p => p.key || p.concept || 'unknown');
            // Move objects to phonemeDetails
            transformed.phonemeDetails = transformed.phonemes;
            transformed.phonemes = phonemeKeys;
        }
    }

    // 5. Add vocabThemes if missing
    if (!transformed.vocabThemes) {
        transformed.vocabThemes = [...VOCAB_THEMES];
    }

    // 6. Ensure orthography field exists
    if (!transformed.orthography) {
        transformed.orthography = null;
    }

    // 7. Ensure pragmatics is a string
    if (!transformed.pragmatics) {
        transformed.pragmatics = "Intermediate conversation skills: expressing opinions, describing experiences, making plans, discussing familiar topics with some fluency.";
    }

    return transformed;
}

function generateFileContent(obj, languageName, langCode) {
    const varName = languageName.toUpperCase() + '_B1';

    // Helper to stringify arrays with proper indentation
    function stringifyArray(arr, indent = '    ') {
        if (!Array.isArray(arr)) return JSON.stringify(arr);
        if (arr.length === 0) return '[]';

        const items = arr.map(item => {
            if (typeof item === 'string') {
                return `${indent}    "${item}"`;
            } else if (typeof item === 'object') {
                return `${indent}    ${JSON.stringify(item, null, 4).replace(/\n/g, `\n${indent}`)}`;
            } else {
                return `${indent}    ${JSON.stringify(item)}`;
            }
        }).join(',\n');

        return `[\n${items}\n${indent}]`;
    }

    // Build the object string
    let result = `const ${varName} = {\n`;

    // Add basic fields
    result += `    level: "${obj.level}",\n`;
    result += `    language: "${obj.language}",\n`;
    result += `    cefr: "${obj.cefr}",\n`;
    result += `    languageCode: "${langCode}",\n\n`;

    // Add grammar (string IDs)
    result += `    // String IDs for learningGoals.js compatibility\n`;
    result += `    grammar: ${stringifyArray(obj.grammar)},\n\n`;

    // Add grammarDetails if exists
    if (obj.grammarDetails) {
        result += `    // Detailed grammar objects for other parts of the app\n`;
        result += `    grammarDetails: ${stringifyArray(obj.grammarDetails)},\n\n`;
    }

    // Add vocab
    result += `    vocab: ${stringifyArray(obj.vocab)},\n\n`;

    // Add vocabThemes
    result += `    vocabThemes: ${stringifyArray(obj.vocabThemes)},\n\n`;

    // Add phonemes (string IDs)
    result += `    phonemes: ${stringifyArray(obj.phonemes)},\n\n`;

    // Add phonemeDetails if exists
    if (obj.phonemeDetails) {
        result += `    phonemeDetails: ${stringifyArray(obj.phonemeDetails)},\n\n`;
    }

    // Add pragmatics and orthography
    result += `    pragmatics: "${obj.pragmatics}",\n`;
    result += `    orthography: ${obj.orthography === null ? 'null' : JSON.stringify(obj.orthography)},\n\n`;

    // Add meta if exists
    if (obj.meta) {
        result += `    meta: ${JSON.stringify(obj.meta, null, 4).replace(/\n/g, '\n    ')},\n`;
    }

    // Close the object
    result = result.replace(/,\n\n$/g, '\n'); // Remove trailing comma
    result += `};\n\n`;
    result += `export default ${varName};\n`;

    return result;
}

function fixB1File(filePath) {
    console.log(`\nProcessing ${filePath}...`);

    if (!fs.existsSync(filePath)) {
        console.log(`  File not found, skipping`);
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const langCode = getLanguageCodeFromPath(filePath);
        const languageName = path.dirname(filePath).split(path.sep).pop();

        // Parse the object
        const obj = parseObjectFromFile(content);

        // Transform the object
        const transformed = transformB1Object(obj, langCode);

        // Generate new content
        const newContent = `/**
 * ${languageName.charAt(0).toUpperCase() + languageName.slice(1)} B1 syllabus
 * CEFR Level: B1 (Intermediate)
 * @module curriculum/${languageName}/B1
 */

` + generateFileContent(transformed, languageName, langCode);

        // Write back
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`  ✅ Fixed ${languageName} B1.js`);
        console.log(`    - language: "${obj.language}" → "${transformed.language}"`);
        console.log(`    - Added cefr: "${transformed.cefr}"`);
        console.log(`    - Grammar: ${Array.isArray(transformed.grammar) ? transformed.grammar.length + ' string IDs' : 'fixed'}`);
        console.log(`    - Phonemes: ${Array.isArray(transformed.phonemes) ? transformed.phonemes.length + ' string IDs' : 'fixed'}`);
        console.log(`    - Added vocabThemes: ${transformed.vocabThemes.length} categories`);

    } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
    }
}

// Process all files
console.log(`Fixing ${b1Files.length} B1 files to match A1 structure...`);
b1Files.forEach(fixB1File);
console.log('\n✅ All B1 files have been updated!');