// Test script for TTS sanitizer function
// This tests the cleanTextForTTS logic

function cleanTextForTTS(text) {
    if (!text || typeof text !== 'string') return '';

    return text
        // Remove emojis (covers most common emoji ranges)
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{FE0F}]/gu, '')

        // Remove markdown formatting symbols
        .replace(/\*\*(.*?)\*\*/g, '$1')  // bold **text** -> text
        .replace(/__(.*?)__/g, '$1')      // bold __text__ -> text
        .replace(/\*(.*?)\*/g, '$1')      // italic *text* -> text
        .replace(/_(.*?)_/g, '$1')        // italic _text_ -> text
        .replace(/~~(.*?)~~/g, '$1')      // strikethrough

        // Remove placeholder markers
        .replace(/\[\.\.\.\]/g, '')       // [...] -> empty
        .replace(/\.\.\./g, '')           // ... -> empty (optional, keep if natural pause desired)

        // Remove backticks and code blocks
        .replace(/`{1,3}[^`]*`{1,3}/g, '')

        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

// Test cases
const testCases = [
    {
        input: "Hello! 🌍 Let's learn map today. It's a [...] picture.",
        expected: "Hello! Let's learn map today. It's a picture.",
        description: "Emoji and placeholder removal"
    },
    {
        input: "**Important** word and _italic_ text",
        expected: "Important word and italic text",
        description: "Markdown formatting removal"
    },
    {
        input: "This is `code` and ```multiline code```",
        expected: "This is and",
        description: "Backtick removal"
    },
    {
        input: "Asterisk *test* and **double** asterisk",
        expected: "Asterisk test and double asterisk",
        description: "Asterisk removal"
    },
    {
        input: "Text with ... ellipsis and [...] placeholder",
        expected: "Text with ellipsis and placeholder",
        description: "Ellipsis and placeholder removal"
    },
    {
        input: "Mixed 🌟 **bold** and _italic_ with ...",
        expected: "Mixed bold and italic with",
        description: "Mixed special characters"
    },
    {
        input: "Normal text without special characters",
        expected: "Normal text without special characters",
        description: "Normal text unchanged"
    }
];

console.log("Testing TTS sanitizer function...\n");

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    const result = cleanTextForTTS(test.input);
    const success = result === test.expected;

    if (success) {
        passed++;
        console.log(`✓ Test ${index + 1}: ${test.description}`);
    } else {
        failed++;
        console.log(`✗ Test ${index + 1}: ${test.description}`);
        console.log(`  Input:    "${test.input}"`);
        console.log(`  Expected: "${test.expected}"`);
        console.log(`  Got:      "${result}"`);
    }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log("All tests passed! TTS sanitizer is working correctly.");
} else {
    console.log("Some tests failed. Review the sanitizer function.");
    process.exit(1);
}