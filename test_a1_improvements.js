// Test script for A1 vocabulary improvements and punctuation fixes
import { preFilterReply, finalCleanup } from './src/lib/a1Simplifier.js';

// Mock syllabus with limited vocabulary (simulating small test syllabus)
const mockSyllabus = {
    vocab: [
        { word: 'hello' },
        { word: 'water' }
    ]
};

console.log('=== Testing A1 Vocabulary Improvements ===\n');

// Test 1: preFilterReply with expanded A1 allowlist
console.log('Test 1: preFilterReply with expanded A1 allowlist');
const testCases = [
    {
        input: "I am happy and want to eat food",
        description: "Contains A1 words: happy, want, eat, food"
    },
    {
        input: "The big house is very nice but old",
        description: "Contains A1 words: big, house, very, nice, but, old"
    },
    {
        input: "I need to go there today because I am tired",
        description: "Contains A1 words: need, go, there, today, because, tired"
    },
    {
        input: "That is really good and easy to understand",
        description: "Contains A1 words: that, really, good, and, easy"
    },
    {
        input: "The complicated terminology perplexes beginners",
        description: "Contains complex words not in A1 allowlist"
    }
];

testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    const result = preFilterReply(testCase.input, mockSyllabus, 'en');
    console.log(`Output: "${result}"`);
    if (result === testCase.input) {
        console.log('✓ Allowed (words in A1 allowlist or syllabus)');
    } else {
        console.log('✗ Some words blocked (replaced with [...])');
    }
});

// Test 2: finalCleanup punctuation fixes
console.log('\n\n=== Testing Punctuation Fixes ===\n');

const punctuationTestCases = [
    {
        input: "Hello world  ?? How are you  !!",
        expected: "Hello world? How are you!"
    },
    {
        input: "I like it  .but not that  .",
        expected: "I like it. But not that."
    },
    {
        input: "[...]  hello  [...] [...] .how are you?",
        expected: "Hello [...]. How are you?"
    },
    {
        input: "This is good!! Really?? Yes!!!",
        expected: "This is good! Really? Yes!"
    },
    {
        input: "Wait,what? No,,, maybe... yes!",
        expected: "Wait, what? No, maybe... yes!"
    },
    {
        input: "[...].hello[...]?world[...]!",
        expected: "Hello [...]? World [...]!"
    }
];

punctuationTestCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Input: "${testCase.input}"`);
    const result = finalCleanup(testCase.input);
    console.log(`Output: "${result}"`);
    console.log(`Expected: "${testCase.expected}"`);
    if (result === testCase.expected) {
        console.log('✓ PASS');
    } else {
        console.log('✗ FAIL');
    }
});

// Test 3: Edge cases
console.log('\n\n=== Testing Edge Cases ===\n');

const edgeCases = [
    {
        function: 'preFilterReply',
        input: "A very complicated and sophisticated terminology perplexes beginners",
        description: "Mixed A1 and complex words"
    },
    {
        function: 'finalCleanup',
        input: "  multiple   spaces   and  .weird.punctuation  ??!!  ",
        description: "Multiple spaces and weird punctuation"
    },
    {
        function: 'finalCleanup',
        input: "[...][...][...]",
        description: "Multiple [...] without spaces"
    }
];

edgeCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.function}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);

    let result;
    if (testCase.function === 'preFilterReply') {
        result = preFilterReply(testCase.input, mockSyllabus, 'en');
    } else {
        result = finalCleanup(testCase.input);
    }

    console.log(`Output: "${result}"`);
});

console.log('\n=== All tests completed ===');