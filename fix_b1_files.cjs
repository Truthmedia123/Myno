const fs = require('fs');
const path = require('path');

const b1Files = [
    'src/curriculum/arabic/B1.js',
    'src/curriculum/dutch/B1.js',
    'src/curriculum/english/B1.js', // already fixed but will check
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
    'src/curriculum/spanish/B1.js', // already fixed but will check
    'src/curriculum/swedish/B1.js',
    'src/curriculum/turkish/B1.js'
];

function fixB1File(filePath) {
    console.log(`Processing ${filePath}...`);

    if (!fs.existsSync(filePath)) {
        console.log(`  File not found, skipping`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Replace grammarDetails with grammar
    content = content.replace(/grammarDetails:/g, 'grammar:');

    // 2. Replace phonemeDetails with phonemes
    content = content.replace(/phonemeDetails:/g, 'phonemes:');

    // 3. Add orthography: null after pragmatics if not present
    const pragmaticsPattern = /pragmatics:\s*"[^"]*",/;
    const orthographyPattern = /orthography:\s*(null|"[^"]*"),/;

    if (!orthographyPattern.test(content)) {
        // Find pragmatics line and insert orthography after it
        const match = content.match(pragmaticsPattern);
        if (match) {
            const pragmaticsLine = match[0];
            const replacement = `${pragmaticsLine}\n    orthography: null,`;
            content = content.replace(pragmaticsPattern, replacement);
            console.log(`  Added orthography: null`);
        } else {
            console.log(`  Warning: Could not find pragmatics line`);
        }
    } else {
        console.log(`  orthography already present`);
    }

    // Check if changes were made
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  File updated`);
    } else {
        console.log(`  No changes needed`);
    }
}

// Process all files
console.log(`Fixing ${b1Files.length} B1 files...`);
b1Files.forEach(fixB1File);
console.log('Done!');