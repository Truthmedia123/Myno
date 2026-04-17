const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/curriculum/shared/phonemeGuide.js'), 'utf8');

// Find all phoneme keys (lines with "key": {)
const lines = content.split('\n');
const phonemeKeys = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Look for lines that start with " (quoted key)
    if (line.trim().match(/^"[^"]+":\s*{$/)) {
        const key = line.trim().match(/^"([^"]+)":\s*{$/)[1];
        phonemeKeys.push(key);
    }
}

console.log('All phoneme keys:');
phonemeKeys.forEach((key, idx) => {
    console.log(`${idx + 1}. "${key}"`);
});

// Find which ones have English language variants
console.log('\nPhoneme keys with English language variants:');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('languageVariants')) {
        // Look backward to find the key
        for (let j = i - 1; j >= 0; j--) {
            if (lines[j].trim().match(/^"[^"]+":\s*{$/)) {
                const key = lines[j].trim().match(/^"([^"]+)":\s*{$/)[1];
                // Check if this variant has English
                if (lines[i + 1] && lines[i + 1].includes('en:')) {
                    console.log(`- "${key}"`);
                }
                break;
            }
        }
    }
}