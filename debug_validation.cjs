#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy the extractObject function from fix script
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

const content = fs.readFileSync('src/curriculum/spanish/A2.js', 'utf8');
console.log('File length:', content.length);
const obj = extractObject(content);
if (obj) {
    console.log('Object keys:', Object.keys(obj).join(', '));
    console.log('Has grammar?', 'grammar' in obj);
    console.log('Has grammarDetails?', 'grammarDetails' in obj);
    console.log('Has phonemes?', 'phonemes' in obj);
    console.log('Has phonemeDetails?', 'phonemeDetails' in obj);

    // Validate
    const required = ['level', 'language', 'grammar', 'vocab', 'phonemes', 'pragmatics', 'orthography'];
    const missing = required.filter(key => !(key in obj));
    console.log('Missing fields:', missing);

    if ('grammar' in obj) {
        console.log('grammar type:', Array.isArray(obj.grammar) ? 'array' : typeof obj.grammar);
        console.log('grammar value:', JSON.stringify(obj.grammar));
    }
} else {
    console.log('Could not extract object');
}