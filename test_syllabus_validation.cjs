#!/usr/bin/env node

/**
 * Test that all A1/A2 syllabus files pass validation
 */

const fs = require('fs');
const path = require('path');

// Mock the validateSyllabus function from curriculum/index.js
function validateSyllabus(syllabus) {
    const required = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
    const missing = required.filter(key => !(key in syllabus));
    if (missing.length > 0) {
        throw new Error(`Syllabus validation failed: missing keys ${missing.join(', ')}`);
    }
    // Ensure arrays
    if (!Array.isArray(syllabus.grammar)) throw new Error('grammar must be an array');
    if (!Array.isArray(syllabus.vocab)) throw new Error('vocab must be an array');
    if (!Array.isArray(syllabus.phonemes)) throw new Error('phonemes must be an array');
}

// Language folders to test
const CURRICULUM_DIR = path.join(__dirname, 'src', 'curriculum');
const LANGUAGE_FOLDERS = [
    'arabic', 'dutch', 'french', 'german', 'greek', 'hindi',
    'italian', 'japanese', 'korean', 'mandarin', 'portuguese',
    'russian', 'spanish', 'swedish', 'turkish', 'english'
];

// Extract object from file (simplified version)
function extractObject(content) {
    // Find the line with const VAR_NAME = {
    const lines = content.split('\n');
    let startLine = -1;
    let varName = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('const ') && line.includes('=') && line.includes('{')) {
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

        // Handle strings
        if (char === '"' || char === "'" || char === '`') {
            const quote = char;
            pos++;
            while (pos < content.length && (content[pos] !== quote || content[pos - 1] === '\\')) {
                pos++;
            }
        }
        // Handle comments
        else if (char === '/' && nextChar === '/') {
            while (pos < content.length && content[pos] !== '\n') {
                pos++;
            }
        }
        else if (char === '/' && nextChar === '*') {
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
        const obj = new Function(`return ${objectStr}`)();
        return obj;
    } catch (error) {
        console.error('Error parsing object:', error.message);
        return null;
    }
}

async function testAll() {
    console.log('Testing syllabus validation for all languages...\n');

    let totalFiles = 0;
    let passedFiles = 0;
    let failedFiles = [];

    for (const lang of LANGUAGE_FOLDERS) {
        const langDir = path.join(CURRICULUM_DIR, lang);
        if (!fs.existsSync(langDir)) {
            console.warn(`Language folder not found: ${lang}`);
            continue;
        }

        // Test A1.js
        const a1Path = path.join(langDir, 'A1.js');
        if (fs.existsSync(a1Path)) {
            totalFiles++;
            try {
                const content = fs.readFileSync(a1Path, 'utf8');
                const syllabus = extractObject(content);
                if (!syllabus) {
                    throw new Error('Could not parse syllabus object');
                }
                validateSyllabus(syllabus);
                console.log(`✓ ${lang}/A1.js - PASS`);
                passedFiles++;
            } catch (error) {
                console.error(`✗ ${lang}/A1.js - FAIL: ${error.message}`);
                failedFiles.push(`${lang}/A1.js: ${error.message}`);
            }
        }

        // Test A2.js
        const a2Path = path.join(langDir, 'A2.js');
        if (fs.existsSync(a2Path)) {
            totalFiles++;
            try {
                const content = fs.readFileSync(a2Path, 'utf8');
                const syllabus = extractObject(content);
                if (!syllabus) {
                    throw new Error('Could not parse syllabus object');
                }
                validateSyllabus(syllabus);
                console.log(`✓ ${lang}/A2.js - PASS`);
                passedFiles++;
            } catch (error) {
                console.error(`✗ ${lang}/A2.js - FAIL: ${error.message}`);
                failedFiles.push(`${lang}/A2.js: ${error.message}`);
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passedFiles}/${totalFiles} files passed validation`);

    if (failedFiles.length > 0) {
        console.log('\nFailed files:');
        failedFiles.forEach(f => console.log(`  ${f}`));
        process.exit(1);
    } else {
        console.log('\nAll files passed validation!');
        process.exit(0);
    }
}

testAll().catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});