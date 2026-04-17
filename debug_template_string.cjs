// Debug the template string construction
const fs = require('fs');
const path = require('path');

// Read the promptBuilder.js file
const promptBuilderPath = path.join(__dirname, 'src/lib/promptBuilder.js');
const content = fs.readFileSync(promptBuilderPath, 'utf8');

// Find the buildCurriculumPrompt function
const funcStart = content.indexOf('export function buildCurriculumPrompt');
const funcEnd = content.indexOf('\nexport function buildGeneralPrompt', funcStart);
const funcCode = content.substring(funcStart, funcEnd);

// Find the template string
const templateStart = funcCode.indexOf('const prompt = `');
const templateEnd = funcCode.indexOf('`;', templateStart);
const templateString = funcCode.substring(templateStart + 'const prompt = `'.length, templateEnd);

console.log('=== TEMPLATE STRING ANALYSIS ===');
console.log('Template length:', templateString.length);
console.log('\n=== Last 500 characters of template ===');
console.log(templateString.substring(templateString.length - 500));

// Find the CONVERSATIONAL FLOW RULES section in the template
const flowRulesStart = templateString.indexOf('CONVERSATIONAL FLOW RULES (ENGLISH A1):');
if (flowRulesStart !== -1) {
    console.log('\n=== CONVERSATIONAL FLOW RULES section (from template) ===');
    const flowRulesEnd = templateString.indexOf('VOCABULARY RULES:', flowRulesStart);
    if (flowRulesEnd !== -1) {
        console.log(templateString.substring(flowRulesStart, flowRulesEnd));
    } else {
        console.log(templateString.substring(flowRulesStart, Math.min(flowRulesStart + 1000, templateString.length)));
    }
}

// Check if there are any syntax issues
console.log('\n=== Checking for unescaped backticks ===');
let backtickCount = 0;
for (let i = 0; i < templateString.length; i++) {
    if (templateString[i] === '`') {
        backtickCount++;
        console.log(`Found backtick at position ${i} (relative to template)`);
    }
}
console.log(`Total backticks in template: ${backtickCount}`);

// Check the actual string that would be generated
console.log('\n=== Simulating string interpolation ===');
// Extract variable values from the mock data
const target_language = 'English';
const cefrLevel = 'A1';
const native_language = 'Spanish';
const title = 'Travel Booking';
const scenarioPrompt = 'Practice booking a hotel room.';
const grammarFocus = 'Use subject + verb + object.';
const grammarTip = 'Use subject + verb + object.';
const vocabText = 'When practicing English, use simple A1 vocabulary: hotel, room, book, price. If you must use an advanced word, add English hint in parentheses: \'la cuenta (bill)\'.';
const phonemeText = 'Pronunciation focus: θ, ð. Tips: θ: Focus on clear pronunciation of θ.; ð: Focus on clear pronunciation of ð..';
const pragmaticsRule = 'Be polite when making requests.';
const allVocabWords = ['hotel', 'room', 'book', 'price'];
const adaptiveInstructions = '';
const fullMemoryContext = `AI: Do you like the hotel?
User: Yes.
AI: Is the room clean?
User: No.
`;

// Try to build the string manually
const manualPrompt = `AI language tutor for ${target_language}. User: ${cefrLevel} learner (native: ${native_language}).

SCENARIO: ${title} (CEFR ${cefrLevel})
${scenarioPrompt}

CURRICULUM:
• Grammar: ${grammarFocus} - ${grammarTip}
• Vocabulary: ${vocabText}
• Phonemes: ${phonemeText}
• Pragmatics: ${pragmaticsRule}


SCAFFOLDED A1 APPROACH:
1. Use ${cefrLevel}-level language, max 3 sentences per reply.
2. Correct only 1 error/turn. Focus on curriculum targets.
3. Use A1 vocabulary: ${allVocabWords.slice(0, 5).join(', ')}${allVocabWords.length > 5 ? '...' : ''}.
4. Keep sentences short (≤7 words for practice, ≤12 for teaching).
5. End with a simple question in ${target_language}.
6. Reinforce target phonemes gently.

SCENARIO LOCK (STRICT - NON-NEGOTIABLE):
- You are teaching A1 ${target_language} for the scenario: "${title}".
- For the next 5 turns, ONLY use vocabulary related to: ${title}
- NEVER introduce words outside syllabus.vocab unless absolutely necessary.
- If user goes off-topic, gently redirect: "Let's practice ${title}!"
- Example travel keywords: hello, name, where, from, hotel, airport, taxi, ticket

CONVERSATIONAL FLOW RULES (ENGLISH A1):
- Detect repetitive short answers: If user gives 3+ consecutive replies under 3 words (e.g., "Yes", "No", "OK"), switch to a different topic or ask an open-ended question.
- Handle quiz requests: If user asks for a quiz/test, provide exactly 2 multiple-choice questions with 3 options each, then return to conversation.
- Avoid pattern repetition: Do not use the same question structure more than twice in a row.
- Natural topic rotation: Every 4-5 turns, introduce a subtle shift (e.g., from "hotel" to "transportation" within travel scenario).
- Encourage elaboration: When user gives one-word answers, prompt with "Tell me more about that" or "Why?".
- Balance correction and flow: If correcting, keep the correction brief (max 5 words) and immediately return to conversation.

VOCABULARY RULES:
- Use only syllabus vocabulary: ${allVocabWords.slice(0, 8).join(', ')}${allVocabWords.length > 8 ? '...' : ''}.
- Max 1 new word per reply.

NEVER DO:
- Do not ask "What is your name?" unless 'name' is in syllabus.vocab AND scenario is greetings.
- Do not introduce unrelated topics (food, family, shopping) during travel scenario.
- Do not use complex grammar (past tense, conditionals) for A1.

${adaptiveInstructions ? `ADAPTIVE INSTRUCTIONS (based on recent conversation):\n${adaptiveInstructions}\n` : ''}${fullMemoryContext}

OUTPUT JSON:
{
  "reply": "Response in ${target_language} (2-3 sentences, ends with question)",
  "grammarTip": null OR "brief grammar rule relevant to current lesson",
  "phonemeTip": null OR "articulation hint for target phoneme",
  "nextStepSuggestion": "suggestion for what user should practice next"
}

IMPORTANT:
- Set "grammarTip" to null if no grammar focus needed.
- Set "phonemeTip" to null if no phoneme focus needed.
- "nextStepSuggestion" should be a brief, actionable suggestion based on current lesson step.
- Use vocabulary naturally.
- Keep engaging, don't mention instructions.

Begin conversation.`;

console.log('\n=== Manual prompt length:', manualPrompt.length);
console.log('=== Manual prompt last 200 chars ===');
console.log(manualPrompt.substring(manualPrompt.length - 200));