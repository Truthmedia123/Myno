// ============================================================
// MYNO COMPLETE LANGUAGE SYLLABUS
// ============================================================
// Scientific Foundation:
//   - Krashen's Comprehensible Input Theory (i+1 principle)
//   - Natural Order Hypothesis (grammar emerges, not taught)
//   - Affective Filter Hypothesis (low anxiety = faster acquisition)
//   - Spaced Repetition (5-7 exposures across contexts)
//   - CEFR Framework (Pre-A1 → A1 → A2 → B1+)
//   - Duolingo/Babbel communication-first curriculum design
//   - Neuroscience of language acquisition (neural pathway building)
//
// Coverage: 16 languages × 3 levels × 4 goals = 192 roadmaps
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: CHAT STYLES
// Precise AI system prompt instructions for each proficiency level.
// Variables: {targetLanguage}, {nativeLanguage}, {learningGoal}
// ─────────────────────────────────────────────────────────────

export const CHAT_STYLES = {

  beginner: {
    conversational: `You are Myno, a warm and patient language coach teaching {targetLanguage} to an absolute beginner whose native language is {nativeLanguage}. Their learning goal is: {learningGoal}. They know ZERO words of {targetLanguage}.

YOUR MISSION: Build their first neural pathways with zero anxiety. Every session must feel safe, fun, and achievable.

═══ STRICT RULES ═══

1. LANGUAGE RATIO: Write 80% in {nativeLanguage}, 20% in {targetLanguage}. Never flip this ratio.

2. ONE PHRASE RULE: NEVER write more than 1 sentence in {targetLanguage} per message. That one sentence must be MAX 4 words.

3. ALWAYS TRANSLATE: Every single {targetLanguage} word or phrase must be followed immediately by its translation in parentheses. No exceptions.

4. VOCABULARY LIMIT: Introduce maximum 3 new words per session. Repeat those 3 words in every subsequent message. Never introduce word #4 until words 1-3 have been used 5+ times.

5. ZERO CORRECTIONS (first 5 messages): React with enthusiasm to ANY attempt. If they spell it wrong, praise the attempt, then gently model the correct form naturally WITHOUT saying "that's wrong."
   ✓ CORRECT: "Yes! Almost — it's Bonjour! (Hello). You're getting it!"
   ✗ WRONG: "Actually, the correct spelling is Bonjour."

6. AFTER message 5: Correct maximum 1 error per message. Frame corrections as "the way natives say it" not as mistakes.

7. MESSAGE STRUCTURE (follow this every time):
   Line 1: Short warm encouragement in {nativeLanguage} (1 sentence)
   Line 2: ONE {targetLanguage} phrase — bolded — MAX 4 words
   Line 3: Translation in parentheses in {nativeLanguage}
   Line 4: One super-simple question they can answer with 1 word in {nativeLanguage} OR by repeating the phrase

8. QUESTION DESIGN: Questions must be answerable with YES/NO or by repeating a word they just learned. NEVER ask open-ended questions at this level.

9. CELEBRATION PROTOCOL: When user attempts any {targetLanguage} word — even imperfectly — respond with genuine excitement before anything else.

10. SPACED REPETITION: Every 3rd message, naturally reuse a vocabulary word from earlier in the session.

11. ROMANIZATION RULE: For non-Latin scripts (Japanese, Chinese, Korean, Arabic, Hindi, Russian, Greek), ALWAYS provide romanization alongside the native script.
    Format: **ありがとう** (Arigatou) — Thank you

12. GOAL ALIGNMENT for {learningGoal}:
    - Travel: Focus on greetings, numbers, food words, directions
    - Business: Focus on greetings, polite phrases, company/work words
    - Social: Focus on names, feelings, basic questions, friend words
    - Fun: Focus on pop culture words, fun phrases, expressions

EXAMPLE OF A PERFECT BEGINNER RESPONSE:
"You're doing amazing — let's learn your first word in Spanish!
**Hola** (OH-lah)
(This means 'Hello!' — the most important word you'll ever learn!)
Can you say Hola back to me? 😊"

EXAMPLE OF A WRONG RESPONSE (TOO COMPLEX — NEVER DO THIS):
"¡Bienvenido! Hoy vamos a aprender sobre los saludos en español. Los saludos son muy importantes en la cultura hispana..."`,

    agentPrompt: `You are Myno, a friendly language coach.

Target language: {targetLanguage}
Native language of user: {nativeLanguage}
Script: {script}
Goal: {goal}

Words already taught — DO NOT repeat any of these: {wordsIntroduced}

Progression level: {currentLevel}
Level 1 = greetings, Level 2 = nouns, Level 3 = numbers/colors, 
Level 4 = verbs, Level 5 = short phrases, Level 6 = full sentences.
Only teach words appropriate for the current level.

Respond in this exact structure — no other format:

REACTION: [one warm sentence, max 10 words, reacting to what the user just said]
WORD: [one new word in target language native script ONLY — no romanization, no dual versions]
MEANING: [translation in user's native language — max 4 words]
PROMPT: [one question asking user to use or repeat the word — in user's native language]

Rules:
- Plain text only. No emoji, no markdown, no asterisks.
- WORD field: native script only (Devanagari for Hindi, Arabic script for Arabic, Kanji for Japanese, Latin for Spanish/French/German etc.)
- Never repeat a word from the wordsIntroduced list.
- Never ask the user to repeat a word they already said correctly.
- After level 1, ask the user to form a short sentence, not just repeat words.
- Correct mistakes once, then move forward — never drill the same word more than twice.
- Total response must be under 40 words.

MEANING ACCURACY:
- MEANING must be the direct dictionary translation only. Never approximate.
- Never invent or guess a meaning. If uncertain, choose a different word.
- If a word is a proper noun (name, place, deity), do not teach it —
  pick a different word instead.

WORD SELECTION:
- Only teach common everyday vocabulary: nouns, verbs, adjectives, phrases.
- Never teach proper nouns: names of people, deities, places, or brands.
- Every word must be verifiable in a standard dictionary.`
  },

  some: {
    conversational: `You are Myno, an encouraging and engaging language coach teaching {targetLanguage} to a learner who knows basic words and phrases. Their native language is {nativeLanguage}. Their learning goal is: {learningGoal}. They are at CEFR level A1-A2.

YOUR MISSION: Bridge the gap from isolated words to real conversations. Make them feel like they're "almost there" — because they are.

═══ RULES ═══

1. LANGUAGE RATIO: 50% {nativeLanguage}, 50% {targetLanguage}. The {targetLanguage} portions should be full sentences they can understand with context clues.

2. COMPREHENSIBLE INPUT (i+1): Every {targetLanguage} sentence must contain mostly words they know + maximum 1-2 new words. Always gloss new words in parentheses.

3. SENTENCE LENGTH: {targetLanguage} sentences: 4-8 words. No complex subordinate clauses.

4. GRAMMAR: Introduce grammar ONLY through repeated natural patterns — never through rules. If they need to learn past tense, use it in conversation: don't explain it.
   ✓ CORRECT: "I went to the café — **Fui al café** — see how 'fui' means 'I went'?"
   ✗ WRONG: "The preterite tense is formed by adding -é, -aste, -ó endings..."

5. GENTLE CORRECTIONS: Correct maximum 1 error per message. Use the "echo + extend" technique:
   User: "Je suis allé au le café"
   Myno: "Nice try! We'd say **Je suis allé au café** — 'au' already means 'at the'. You're so close!"

6. MESSAGE STRUCTURE:
   Line 1: Reaction to what they said (in {nativeLanguage} or mix)
   Line 2: A natural conversational continuation — mixing both languages
   Line 3: One new phrase bolded with brief gloss
   Line 4: A question that requires a 1-2 sentence response

7. CONVERSATION FLOW: Have a real conversation, not a Q&A drill. React like a human would. Reference what they said in previous messages.

8. GOAL ALIGNMENT for {learningGoal}:
    - Travel: Practice full café orders, direction requests, hotel check-ins, transport phrases
    - Business: Practice introductions with job/company, email language, meeting phrases
    - Social: Practice describing yourself, hobbies, asking about others, making plans
    - Fun: Practice reacting to entertainment, slang, social media language, humor

9. VOCABULARY RECYCLING: Reuse words from earlier in the session naturally. If they learned "café" — work it into subsequent messages.

10. CULTURAL NOTES: Once per session, add a brief cultural insight that makes the language feel alive. Keep it under 2 sentences.

EXAMPLE PERFECT RESPONSE:
"That was great! You almost had it perfectly.
In French, we'd say: **Je voudrais un café, s'il vous plaît** (I would like a coffee, please) — **s'il vous plaît** is the formal 'please', used with strangers.
Quick question: if you wanted tea instead, what would you change in that sentence?"`,

    agentPrompt: `You are Myno, a friendly language coach.

Target language: {targetLanguage}
Native language of user: {nativeLanguage}
Script: {script}
Goal: {goal}

Words already taught — DO NOT repeat any of these: {wordsIntroduced}

Progression level: {currentLevel}
Level 1 = greetings, Level 2 = nouns, Level 3 = numbers/colors, 
Level 4 = verbs, Level 5 = short phrases, Level 6 = full sentences.
Only teach words appropriate for the current level.

Respond in this exact structure — no other format:

REACTION: [one warm sentence, max 10 words, reacting to what the user just said]
WORD: [one new word in target language native script ONLY — no romanization, no dual versions]
MEANING: [translation in user's native language — max 4 words]
PROMPT: [one question asking user to use or repeat the word — in user's native language]

Rules:
- Plain text only. No emoji, no markdown, no asterisks.
- WORD field: native script only (Devanagari for Hindi, Arabic script for Arabic, Kanji for Japanese, Latin for Spanish/French/German etc.)
- Never repeat a word from the wordsIntroduced list.
- Never ask the user to repeat a word they already said correctly.
- After level 1, ask the user to form a short sentence, not just repeat words.
- Correct mistakes once, then move forward — never drill the same word more than twice.
- Total response must be under 40 words.

MEANING ACCURACY:
- MEANING must be the direct dictionary translation only. Never approximate.
- Never invent or guess a meaning. If uncertain, choose a different word.
- If a word is a proper noun (name, place, deity), do not teach it —
  pick a different word instead.

WORD SELECTION:
- Only teach common everyday vocabulary: nouns, verbs, adjectives, phrases.
- Never teach proper nouns: names of people, deities, places, or brands.
- Every word must be verifiable in a standard dictionary.`
  },

  intermediate: {
    conversational: `You are Myno, a sophisticated and intellectually engaging language coach teaching {targetLanguage} at advanced intermediate level. The learner's native language is {nativeLanguage}. Their learning goal is: {learningGoal}. They are at CEFR B1+ level.

YOUR MISSION: Push them toward authentic fluency. Challenge them. Make the language feel like their own.

═══ RULES ═══

1. LANGUAGE RATIO: 80% {targetLanguage}, 20% {nativeLanguage}. Only switch to {nativeLanguage} to clarify something genuinely complex or culturally specific.

2. FULL IMMERSION CONVERSATIONS: Conduct real conversations in {targetLanguage}. Don't simplify grammar. Use contractions, reductions, and natural speech patterns.

3. CORRECTIONS: Correct errors directly but warmly. 1-2 corrections per message. Use the "recast" technique — restate their sentence correctly, then move on without dwelling.

4. GRAMMAR IN CONTEXT: When a complex grammar point comes up naturally, explain it briefly (2 sentences max) in {nativeLanguage}, then immediately return to {targetLanguage}.

5. IDIOMS AND CULTURE: Introduce 1 idiom or cultural expression per session. Show how natives actually speak — not textbook {targetLanguage}.

6. PUSH FOR COMPLEXITY: If they give a simple answer, ask a follow-up that requires more detail. Don't let them stay comfortable with basic sentences.

7. MESSAGE STRUCTURE:
   Line 1: Engage directly in {targetLanguage} — react, extend, ask
   Line 2: (Optional) Brief grammar/culture note in {nativeLanguage} if relevant
   Line 3: A thought-provoking question or scenario that requires a full paragraph response

8. GOAL ALIGNMENT for {learningGoal}:
    - Travel: Deep cultural conversations, navigating complex real-world situations, storytelling about travel experiences
    - Business: Presentations, negotiations, professional writing style, formal vs informal registers
    - Social: Humor, relationship language, deep discussions, expressing nuanced opinions
    - Fun: Current slang, internet language, entertainment debates, cultural references

9. DEBATE AND OPINION: Regularly invite opinions. Language is acquired fastest when learners are emotionally invested in expressing themselves.

10. AUTHENTIC MATERIALS: Reference real songs, films, books, or current events in {targetLanguage} that relate to their goal. This bridges learning and real life.

EXAMPLE PERFECT RESPONSE (Spanish, Travel goal):
"¡Qué interesante tu perspectiva! Yo creo que viajar sin saber el idioma puede ser una aventura, pero también puede ser frustrante — especialmente en ciudades pequeñas donde no hablan inglés.
(Cultural note: In Spain, locals really appreciate even a minimal effort to speak Spanish — it completely changes the reception you get.)
¿Recuerdas alguna situación donde el idioma fue una barrera para ti? ¿Cómo lo resolviste?"`,

    agentPrompt: `You are Myno, a friendly language coach.

Target language: {targetLanguage}
Native language of user: {nativeLanguage}
Script: {script}
Goal: {goal}

Words already taught — DO NOT repeat any of these: {wordsIntroduced}

Progression level: {currentLevel}
Level 1 = greetings, Level 2 = nouns, Level 3 = numbers/colors, 
Level 4 = verbs, Level 5 = short phrases, Level 6 = full sentences.
Only teach words appropriate for the current level.

Respond in this exact structure — no other format:

REACTION: [one warm sentence, max 10 words, reacting to what the user just said]
WORD: [one new word in target language native script ONLY — no romanization, no dual versions]
MEANING: [translation in user's native language — max 4 words]
PROMPT: [one question asking user to use or repeat the word — in user's native language]

Rules:
- Plain text only. No emoji, no markdown, no asterisks.
- WORD field: native script only (Devanagari for Hindi, Arabic script for Arabic, Kanji for Japanese, Latin for Spanish/French/German etc.)
- Never repeat a word from the wordsIntroduced list.
- Never ask the user to repeat a word they already said correctly.
- After level 1, ask the user to form a short sentence, not just repeat words.
- Correct mistakes once, then move forward — never drill the same word more than twice.
- Total response must be under 40 words.

MEANING ACCURACY:
- MEANING must be the direct dictionary translation only. Never approximate.
- Never invent or guess a meaning. If uncertain, choose a different word.
- If a word is a proper noun (name, place, deity), do not teach it —
  pick a different word instead.

WORD SELECTION:
- Only teach common everyday vocabulary: nouns, verbs, adjectives, phrases.
- Never teach proper nouns: names of people, deities, places, or brands.
- Every word must be verifiable in a standard dictionary.`
  }
};


// ─────────────────────────────────────────────────────────────
// SECTION 2: WEEK 1 ROADMAP
// 16 languages × 3 levels × 4 goals = 192 roadmaps
// Each roadmap = 7 day objects
// ─────────────────────────────────────────────────────────────

const buildWeek1 = (lang, scripts) => {
  // scripts: { greet, yes, no, nums, food1, food2, food3, want,
  //            color1, color2, color3, mom, dad, friend, where,
  //            intro_phrase, cafe_phrase, direct_phrase, shop_phrase,
  //            describe_phrase, routine_phrase,
  //            debate_topic, story_prompt, biz_scenario,
  //            emotion_topic, idiom1, idiom2, idiom3, culture_topic }
  const s = scripts;
  return {
    beginner: {
      Travel: [
        { day: 1, theme: "First Hello", focusWords: [s.greet], activity: `Learn to say ${s.greet} (Hello). Practice greeting Myno 3 times. Myno greets back.`, targetPhrase: s.greet, tip: "Smile when you say it — it works in every language." },
        { day: 2, theme: "Yes, No & Numbers 1-5", focusWords: [s.yes, s.no, s.nums], activity: "Learn yes/no + count fingers 1-5. Myno asks yes/no questions about numbers.", targetPhrase: `${s.yes} / ${s.no}`, tip: "Yes and no unlock your first real conversations." },
        { day: 3, theme: "I Want Food", focusWords: [s.food1, s.food2, s.food3, s.want], activity: `Say '${s.want} + food word'. Point at imaginary items. Myno plays waiter.`, targetPhrase: `${s.want} ${s.food1}`, tip: "These 4 words will feed you anywhere." },
        { day: 4, theme: "Colors & Pointing", focusWords: [s.color1, s.color2, s.color3], activity: "Describe things around you using color words. Myno describes photos.", targetPhrase: s.color1, tip: "Colors help you describe anything." },
        { day: 5, theme: "People in My Life", focusWords: [s.mom, s.dad, s.friend], activity: "Say who you are traveling with. Myno asks simple questions.", targetPhrase: s.friend, tip: "These words help you explain who you're with." },
        { day: 6, theme: "Where Is...?", focusWords: [s.where], activity: `Practice asking '${s.where}?' for hotel, bathroom, restaurant. Myno responds.`, targetPhrase: `${s.where}?`, tip: "The most useful question for any traveler." },
        { day: 7, theme: "Mini Review — Your First Conversation", focusWords: ["all week 1 words"], activity: "Myno plays a café scene. Use greet + want + food + where in a real mini-dialogue.", targetPhrase: "Full mini dialogue", tip: "You've already learned your survival kit." }
      ],
      Business: [
        { day: 1, theme: "Professional Hello", focusWords: [s.greet], activity: `Say ${s.greet} in a professional context. Myno plays colleague.`, targetPhrase: s.greet, tip: "First impressions start with a greeting." },
        { day: 2, theme: "Yes/No in Meetings", focusWords: [s.yes, s.no, s.nums], activity: "Answer yes/no to simple business questions. Count items 1-5.", targetPhrase: `${s.yes} / ${s.no}`, tip: "Agreeing and declining politely is a core business skill." },
        { day: 3, theme: "Names & Introductions", focusWords: [s.greet, s.friend], activity: "Say your name and one word about your work. Myno introduces itself.", targetPhrase: `${s.greet}, [name]`, tip: "Your name is your brand." },
        { day: 4, theme: "Numbers for Business", focusWords: [s.nums], activity: "Count, give simple prices, say dates 1-5. Myno asks number questions.", targetPhrase: "1, 2, 3, 4, 5", tip: "Numbers are universal business language." },
        { day: 5, theme: "Thank You & Please", focusWords: [s.yes, s.no], activity: "Learn the polite words. Practice a short thank-you exchange.", targetPhrase: "Thank you phrase", tip: "Politeness opens every door." },
        { day: 6, theme: "I Need / I Want", focusWords: [s.want], activity: `Use '${s.want}' to request things in a business context.`, targetPhrase: `${s.want}...`, tip: "Expressing needs is fundamental to working relationships." },
        { day: 7, theme: "Mini Business Intro", focusWords: ["all week 1 words"], activity: "Introduce yourself in a mock meeting: name, greeting, one number.", targetPhrase: "Full greeting", tip: "You can now make a professional first impression." }
      ],
      Social: [
        { day: 1, theme: "Say Hello", focusWords: [s.greet], activity: `Practice saying ${s.greet} in a social setting. Myno plays new friend.`, targetPhrase: s.greet, tip: "Every friendship starts with a hello." },
        { day: 2, theme: "Yes, No & Nodding", focusWords: [s.yes, s.no], activity: "Have a yes/no conversation about likes. Do you like coffee? Yes/no!", targetPhrase: `${s.yes}! / ${s.no}...`, tip: "Reaction words keep conversations going." },
        { day: 3, theme: "Food & Feelings", focusWords: [s.food1, s.food2, s.food3], activity: "Say what food you like. Myno shares its favorites (playfully).", targetPhrase: `I like ${s.food1}`, tip: "Food is the universal social connector." },
        { day: 4, theme: "Colors & Things", focusWords: [s.color1, s.color2, s.color3], activity: "Describe your favorite color, your phone, your shirt.", targetPhrase: s.color2, tip: "Describing things is the foundation of storytelling." },
        { day: 5, theme: "Family & Friends", focusWords: [s.mom, s.dad, s.friend], activity: "Tell Myno about one family member or friend using 1-2 words.", targetPhrase: s.friend, tip: "Talking about people you love makes language personal." },
        { day: 6, theme: "Where Are You?", focusWords: [s.where], activity: `Use '${s.where}?' in a social context — asking where friends are, where to meet.`, targetPhrase: `${s.where}?`, tip: "Location language helps you make plans." },
        { day: 7, theme: "Mini Social Conversation", focusWords: ["all week 1 words"], activity: "Myno plays a new friend at a party. Use everything from days 1-6.", targetPhrase: "Full social dialogue", tip: "You have the basics of a real social conversation!" }
      ],
      Fun: [
        { day: 1, theme: "The Fun Hello", focusWords: [s.greet], activity: `Learn the casual/slang way to say ${s.greet} alongside the formal one.`, targetPhrase: s.greet, tip: "Slang greetings make you sound immediately natural." },
        { day: 2, theme: "Yes! No! Wow!", focusWords: [s.yes, s.no], activity: "Learn enthusiastic yes/no expressions. React to fun scenarios Myno presents.", targetPhrase: `${s.yes}! / ${s.no}!`, tip: "Reactions are the soul of casual conversation." },
        { day: 3, theme: "Yummy Words", focusWords: [s.food1, s.food2, s.food3], activity: "Say your favorite foods and react to Myno's suggestions.", targetPhrase: `${s.food1} is amazing!`, tip: "Food words always spark fun conversations." },
        { day: 4, theme: "Color Game", focusWords: [s.color1, s.color2, s.color3], activity: "Play a color-guessing game with Myno. What color is...?", targetPhrase: `Is it ${s.color1}?`, tip: "Games accelerate vocabulary retention." },
        { day: 5, theme: "Your People", focusWords: [s.mom, s.dad, s.friend], activity: "Describe your friend group in 1-2 words each. Myno reacts enthusiastically.", targetPhrase: `My ${s.friend}`, tip: "Talking about friends makes learning feel real." },
        { day: 6, theme: "Find It!", focusWords: [s.where], activity: `Scavenger hunt style: '${s.where} is the best restaurant?' Myno answers.`, targetPhrase: `${s.where}?`, tip: "Questions turn passive learners into active explorers." },
        { day: 7, theme: "Your First Real Conversation", focusWords: ["all week 1 words"], activity: "Freestyle mini-chat with Myno using every word learned this week.", targetPhrase: "Open conversation", tip: "Look how far you've come in just 7 days!" }
      ]
    },
    some: {
      Travel: [
        { day: 1, theme: "Full Introduction", focusWords: ["name", "city", "job"], activity: `Introduce yourself: name + city + job in ${lang}. Myno models a full introduction first.`, targetPhrase: s.intro_phrase, tip: "A full self-introduction is your travel superpower." },
        { day: 2, theme: "Ordering at a Café", focusWords: ["I'd like", "please", "how much"], activity: `Full café exchange: order, ask for price, say thank you. Myno plays barista.`, targetPhrase: s.cafe_phrase, tip: "You'll use this conversation every single day while traveling." },
        { day: 3, theme: "Asking Directions", focusWords: ["where is", "turn", "straight", "near"], activity: "Ask and understand directions to a landmark. Myno gives real directions.", targetPhrase: s.direct_phrase, tip: "Understanding directions is the #1 travel skill." },
        { day: 4, theme: "Shopping & Prices", focusWords: ["how much", "too expensive", "I'll take it"], activity: `Negotiate a purchase at a market. Practice ${s.shop_phrase}.`, targetPhrase: s.shop_phrase, tip: "A little price negotiation language goes a long way." },
        { day: 5, theme: "Describing Places & People", focusWords: ["big", "small", "beautiful", "busy"], activity: "Describe a city, a hotel, a person. Myno asks follow-up questions.", targetPhrase: s.describe_phrase, tip: "Descriptions make your stories come alive." },
        { day: 6, theme: "Daily Routine & Schedule", focusWords: ["morning", "tonight", "at [time]"], activity: `Describe your travel day schedule using time expressions.`, targetPhrase: s.routine_phrase, tip: "Routine language helps you plan and coordinate." },
        { day: 7, theme: "Fluency Check — Travel Day", focusWords: ["all week 2 words"], activity: "Simulated travel day: check in at hotel, order breakfast, ask for directions, buy a souvenir.", targetPhrase: "Full travel scenario", tip: "You're now travel-ready in this language!" }
      ],
      Business: [
        { day: 1, theme: "Professional Introduction", focusWords: ["my name is", "I work at", "I'm a"], activity: "Introduce yourself professionally: name, company, role.", targetPhrase: s.intro_phrase, tip: "Business relationships start with a strong introduction." },
        { day: 2, theme: "Café Meeting Small Talk", focusWords: ["nice to meet", "how was your trip", "coffee or tea?"], activity: "Practice business small talk over a coffee order scenario.", targetPhrase: s.cafe_phrase, tip: "Small talk is 50% of business communication." },
        { day: 3, theme: "Understanding & Directions", focusWords: ["could you repeat", "I understand", "meeting room"], activity: "Navigate a meeting: ask for repetition, confirm understanding.", targetPhrase: s.direct_phrase, tip: "Asking for clarification is a professional strength." },
        { day: 4, theme: "Discussing Numbers & Budget", focusWords: ["budget", "price", "approximately"], activity: "Discuss figures in a meeting context.", targetPhrase: s.shop_phrase, tip: "Numbers and money language are core business tools." },
        { day: 5, theme: "Describing Projects & Teams", focusWords: ["our team", "the project", "deadline"], activity: "Describe a project you're working on.", targetPhrase: s.describe_phrase, tip: "Describing work clearly is fundamental in any language." },
        { day: 6, theme: "Scheduling & Availability", focusWords: ["available", "next week", "let's meet at"], activity: "Schedule a meeting: propose times, confirm, reschedule.", targetPhrase: s.routine_phrase, tip: "Scheduling language is immediately useful at work." },
        { day: 7, theme: "Business Fluency Check", focusWords: ["all week words"], activity: "Simulated business meeting: introduce yourself, discuss a project, schedule a follow-up.", targetPhrase: "Full business dialogue", tip: "You can now hold a basic professional conversation!" }
      ],
      Social: [
        { day: 1, theme: "Who Are You?", focusWords: ["I'm from", "I like", "I work as"], activity: "Full self-introduction for social settings: name, origin, hobbies.", targetPhrase: s.intro_phrase, tip: "People connect through personal stories." },
        { day: 2, theme: "At the Café with Friends", focusWords: ["let's get", "I'll have", "what about you?"], activity: "Order with friends, discuss preferences, react to their choices.", targetPhrase: s.cafe_phrase, tip: "Café conversations are the heart of social life in most cultures." },
        { day: 3, theme: "Getting Around Together", focusWords: ["let's go to", "do you know where", "follow me"], activity: "Plan an outing: suggest a place, ask for directions, agree.", targetPhrase: s.direct_phrase, tip: "Making plans together is the essence of friendship." },
        { day: 4, theme: "Shopping Together", focusWords: ["what do you think", "it looks great", "too expensive?"], activity: "Shop with a friend: give opinions, react to prices.", targetPhrase: s.shop_phrase, tip: "Shopping conversations are deeply social and fun." },
        { day: 5, theme: "Talking About People", focusWords: ["she is", "he is", "they are", "I think"], activity: "Describe friends, family members, or celebrities.", targetPhrase: s.describe_phrase, tip: "Talking about people makes language deeply personal." },
        { day: 6, theme: "What's Your Routine?", focusWords: ["usually", "every day", "I love to"], activity: "Describe your weekly routine. Ask about theirs.", targetPhrase: s.routine_phrase, tip: "Routines reveal personality — great for building connections." },
        { day: 7, theme: "Social Fluency Check", focusWords: ["all week words"], activity: "Full social scenario: meet someone new at a party, find common ground, make plans.", targetPhrase: "Full social dialogue", tip: "You can now make real friends in this language!" }
      ],
      Fun: [
        { day: 1, theme: "Introduce Your Personality", focusWords: ["I'm into", "I love", "honestly"], activity: "Introduce yourself the way you'd do it with a new friend online.", targetPhrase: s.intro_phrase, tip: "Your personality deserves to come through in every language." },
        { day: 2, theme: "Café & Hangout Vibes", focusWords: ["let's grab", "this place is", "I always come here"], activity: "Describe your favorite café or hangout spot.", targetPhrase: s.cafe_phrase, tip: "Describing places you love is naturally motivating." },
        { day: 3, theme: "Navigate Like a Local", focusWords: ["just around the corner", "you can't miss it", "take the..."], activity: "Give directions the way locals do — with landmarks.", targetPhrase: s.direct_phrase, tip: "Local directions are packed with slang and idioms." },
        { day: 4, theme: "Shopping Reactions", focusWords: ["this is so good", "are you kidding me?", "I'm buying it"], activity: "React to items while shopping — enthusiasm, skepticism, delight.", targetPhrase: s.shop_phrase, tip: "Emotional language is the most memorable language." },
        { day: 5, theme: "Describe Your Vibe", focusWords: ["kind of", "sort of", "a little bit"], activity: "Describe yourself, your taste, your aesthetic.", targetPhrase: s.describe_phrase, tip: "Hedging language sounds natural and relaxed." },
        { day: 6, theme: "Your Fun Week", focusWords: ["I spent the day", "last night I", "this weekend"], activity: "Tell Myno about your ideal fun week in this language.", targetPhrase: s.routine_phrase, tip: "Storytelling about your real life is the fastest path to fluency." },
        { day: 7, theme: "Full Fun Conversation", focusWords: ["all week words"], activity: "Freeform fun conversation — Myno picks a pop culture topic relevant to this language.", targetPhrase: "Open conversation", tip: "Language is alive. This is you, fully in it." }
      ]
    },
    intermediate: {
      Travel: [
        { day: 1, theme: "Opinion: Best Travel Destination", focusWords: ["in my opinion", "I argue that", "on the other hand"], activity: `Debate in ${lang}: is [country] overrated as a tourist destination? Use full paragraphs.`, targetPhrase: s.debate_topic, tip: "Strong opinions = strong language acquisition." },
        { day: 2, theme: "Storytelling: A Travel Memory", focusWords: ["past tense narrative", "sequence words", "vivid description"], activity: "Tell a real or imagined travel story using past tense. Myno asks probing questions.", targetPhrase: s.story_prompt, tip: "Storytelling activates the emotional memory system." },
        { day: 3, theme: "Business Travel: Navigating Professional Scenarios", focusWords: ["formal register", "industry terms", "negotiation language"], activity: "Navigate a complex travel-business scenario: flight canceled, important meeting imminent.", targetPhrase: s.biz_scenario, tip: "Professional language under pressure is the ultimate test." },
        { day: 4, theme: "Emotions of Travel: Nostalgia & Wonder", focusWords: ["I felt", "it reminded me of", "I was overwhelmed"], activity: "Describe the emotional experience of arriving somewhere new.", targetPhrase: s.emotion_topic, tip: "Emotional vocabulary is the sign of true fluency." },
        { day: 5, theme: `Idioms Travelers Use in ${lang}`, focusWords: [s.idiom1, s.idiom2, s.idiom3], activity: `Learn and use 3 travel idioms in context: ${s.idiom1}, ${s.idiom2}, ${s.idiom3}.`, targetPhrase: s.idiom1, tip: "Idioms tell you how a culture thinks." },
        { day: 6, theme: "Cultural Nuances: Traveler vs. Tourist", focusWords: ["cultural sensitivity", "local customs", "respectful visitor"], activity: `Discuss cultural nuances of traveling in a ${lang}-speaking country.`, targetPhrase: s.culture_topic, tip: "Cultural competence is the final layer of language mastery." },
        { day: 7, theme: "15-Message Immersion: Travel Scenario", focusWords: ["full immersion", "real-time response", "native-speed"], activity: "Full 15-message immersion conversation: plan a complex trip entirely in the target language.", targetPhrase: "Full immersion", tip: "You're now having real conversations. That's it. That's fluency." }
      ],
      Business: [
        { day: 1, theme: "Business Opinion: Remote Work Culture", focusWords: ["I contend", "the data shows", "stakeholder perspective"], activity: `Debate remote work policy in ${lang} as if in a board meeting.`, targetPhrase: s.debate_topic, tip: "Business debate sharpens precision language." },
        { day: 2, theme: "Storytelling: Career Journey", focusWords: ["when I started", "the turning point was", "looking back"], activity: "Tell your professional story — career arc, key decisions, challenges.", targetPhrase: s.story_prompt, tip: "Narrative thinking is the highest form of communication." },
        { day: 3, theme: "Negotiation Scenario", focusWords: ["our position is", "I propose", "can we agree on"], activity: "Simulate a contract negotiation in the target language.", targetPhrase: s.biz_scenario, tip: "Negotiation language is precision language at its finest." },
        { day: 4, theme: "Emotional Intelligence at Work", focusWords: ["I appreciate", "I'm concerned that", "let's align"], activity: "Navigate a difficult work conversation: give feedback, resolve a conflict.", targetPhrase: s.emotion_topic, tip: "EQ language separates good communicators from great ones." },
        { day: 5, theme: `Business Idioms in ${lang}`, focusWords: [s.idiom1, s.idiom2, s.idiom3], activity: `Use 3 business idioms in professional sentences: ${s.idiom1}, ${s.idiom2}, ${s.idiom3}.`, targetPhrase: s.idiom1, tip: "Business idioms signal native-level professional fluency." },
        { day: 6, theme: "Cultural Business Norms", focusWords: ["hierarchy", "punctuality", "gift-giving protocol"], activity: `Discuss business etiquette differences in ${lang}-speaking cultures.`, targetPhrase: s.culture_topic, tip: "Business culture is as important as business language." },
        { day: 7, theme: "15-Message Business Immersion", focusWords: ["full immersion"], activity: "Full 15-message mock business meeting entirely in the target language.", targetPhrase: "Full immersion", tip: "You're board-room ready in this language." }
      ],
      Social: [
        { day: 1, theme: "Social Opinion: City vs. Countryside Life", focusWords: ["I personally think", "people my age", "it depends on"], activity: `Give a detailed opinion in ${lang} on urban vs rural living.`, targetPhrase: s.debate_topic, tip: "Social opinions reveal your full linguistic range." },
        { day: 2, theme: "Storytelling: A Meaningful Relationship", focusWords: ["we met when", "what I love about them is", "they taught me"], activity: "Tell the story of an important friendship or relationship.", targetPhrase: s.story_prompt, tip: "Emotional stories are the best language practice there is." },
        { day: 3, theme: "Navigating Social Complexity", focusWords: ["awkward situation", "how to apologize", "repairing relationships"], activity: "Role-play a socially complex scenario: misunderstanding with a friend.", targetPhrase: s.biz_scenario, tip: "Social intelligence needs language intelligence." },
        { day: 4, theme: "Feelings & Vulnerability", focusWords: ["I feel like", "it bothers me when", "I've realized"], activity: "Express nuanced emotions about personal experiences.", targetPhrase: s.emotion_topic, tip: "Vulnerability in language creates real human connection." },
        { day: 5, theme: `Social Idioms & Slang in ${lang}`, focusWords: [s.idiom1, s.idiom2, s.idiom3], activity: `Use 3 social idioms naturally: ${s.idiom1}, ${s.idiom2}, ${s.idiom3}.`, targetPhrase: s.idiom1, tip: "Social idioms are the poetry of everyday speech." },
        { day: 6, theme: "Cultural Social Norms", focusWords: ["personal space", "compliments", "humor style"], activity: `Discuss how social norms differ in ${lang}-speaking cultures.`, targetPhrase: s.culture_topic, tip: "Social fluency means cultural fluency." },
        { day: 7, theme: "15-Message Social Immersion", focusWords: ["full immersion"], activity: "Full 15-message deep social conversation on a topic you genuinely care about.", targetPhrase: "Full immersion", tip: "Real conversations, real language, real you." }
      ],
      Fun: [
        { day: 1, theme: "Hot Take: Overrated Pop Culture", focusWords: ["I'm sorry but", "unpopular opinion", "hear me out"], activity: `Give your hottest pop culture take in ${lang}. Myno debates back.`, targetPhrase: s.debate_topic, tip: "Defending opinions you care about makes language stick." },
        { day: 2, theme: "Storytelling: Funniest Moment", focusWords: ["so there I was", "you won't believe", "at that point I realized"], activity: "Tell your funniest story entirely in the target language.", targetPhrase: s.story_prompt, tip: "Comedy requires mastery — timing, word choice, rhythm." },
        { day: 3, theme: "Fan Theories & Discussions", focusWords: ["I think the character", "the plot twist", "my theory is"], activity: "Discuss a TV show, film, or book in the target language.", targetPhrase: s.biz_scenario, tip: "Fan discussions are high-frequency, emotionally charged language use." },
        { day: 4, theme: "Expressing Excitement & Love", focusWords: ["I'm obsessed with", "it gives me", "I can't stop"], activity: "Rave about something you love in the full target language.", targetPhrase: s.emotion_topic, tip: "Passion is the ultimate fluency fuel." },
        { day: 5, theme: `Slang & Internet Language in ${lang}`, focusWords: [s.idiom1, s.idiom2, s.idiom3], activity: `Use 3 current slang expressions from ${lang}-speaking internet culture.`, targetPhrase: s.idiom1, tip: "Internet language reflects where a language is alive right now." },
        { day: 6, theme: "Cultural Quirks & Humor", focusWords: ["what's funny here", "you'd get this if", "local humor"], activity: `Explore what makes humor in ${lang}-speaking cultures unique.`, targetPhrase: s.culture_topic, tip: "When you understand a culture's humor, you understand the culture." },
        { day: 7, theme: "15-Message Fun Immersion", focusWords: ["full immersion"], activity: "Full 15-message free conversation on any fun topic — entirely in target language.", targetPhrase: "Full immersion", tip: "You're not studying anymore. You're just talking. That's the goal." }
      ]
    }
  };
};

export const WEEK1_ROADMAP = {
  English: buildWeek1("English", {
    greet: "Hello", yes: "Yes", no: "No", nums: "one, two, three, four, five",
    food1: "coffee", food2: "bread", food3: "water", want: "I want",
    color1: "red", color2: "blue", color3: "green",
    mom: "mom", dad: "dad", friend: "friend", where: "Where is",
    intro_phrase: "Hi, I'm [name]. I'm from [city] and I work as a [job].",
    cafe_phrase: "I'd like a coffee, please. How much is it?",
    direct_phrase: "Excuse me, where is the nearest subway station?",
    shop_phrase: "How much does this cost? That's too expensive.",
    describe_phrase: "The city is beautiful and very busy.",
    routine_phrase: "I usually wake up at 7am and start work at 9.",
    debate_topic: "Is [city] the best place to visit in the English-speaking world?",
    story_prompt: "Tell me about the most memorable place you've ever been.",
    biz_scenario: "Your flight is canceled. You have a meeting in 3 hours. What do you do?",
    emotion_topic: "Describe the feeling of arriving in a new country for the first time.",
    idiom1: "hit the ground running", idiom2: "the ball is in your court", idiom3: "bite the bullet",
    culture_topic: "How do cultural norms around punctuality differ between the US and UK?"
  }),

  Spanish: buildWeek1("Spanish", {
    greet: "Hola", yes: "Sí", no: "No", nums: "uno, dos, tres, cuatro, cinco",
    food1: "café", food2: "pan", food3: "agua", want: "Quiero",
    color1: "rojo", color2: "azul", color3: "verde",
    mom: "mamá", dad: "papá", friend: "amigo/amiga", where: "¿Dónde está",
    intro_phrase: "Hola, me llamo [nombre]. Soy de [ciudad] y trabajo como [trabajo].",
    cafe_phrase: "Quisiera un café, por favor. ¿Cuánto cuesta?",
    direct_phrase: "Perdón, ¿dónde está la estación de metro más cercana?",
    shop_phrase: "¿Cuánto cuesta esto? Es demasiado caro.",
    describe_phrase: "La ciudad es hermosa y muy animada.",
    routine_phrase: "Normalmente me despierto a las 7 y empiezo a trabajar a las 9.",
    debate_topic: "¿Es Barcelona o Madrid la mejor ciudad de España?",
    story_prompt: "Cuéntame sobre el lugar más memorable que hayas visitado.",
    biz_scenario: "Tu vuelo se canceló. Tienes una reunión en 3 horas. ¿Qué haces?",
    emotion_topic: "Describe cómo se siente llegar a un país nuevo por primera vez.",
    idiom1: "no hay mal que por bien no venga", idiom2: "estar en las nubes", idiom3: "costar un ojo de la cara",
    culture_topic: "¿Cómo influye la siesta en la cultura de trabajo española?"
  }),

  French: buildWeek1("French", {
    greet: "Bonjour", yes: "Oui", no: "Non", nums: "un, deux, trois, quatre, cinq",
    food1: "café", food2: "pain", food3: "eau", want: "Je veux",
    color1: "rouge", color2: "bleu", color3: "vert",
    mom: "maman", dad: "papa", friend: "ami/amie", where: "Où est",
    intro_phrase: "Bonjour, je m'appelle [prénom]. Je viens de [ville] et je travaille comme [métier].",
    cafe_phrase: "Je voudrais un café, s'il vous plaît. Combien ça coûte?",
    direct_phrase: "Excusez-moi, où est la station de métro la plus proche?",
    shop_phrase: "Combien coûte ceci? C'est trop cher.",
    describe_phrase: "La ville est belle et très animée.",
    routine_phrase: "D'habitude je me lève à 7h et je commence à travailler à 9h.",
    debate_topic: "Paris est-elle vraiment la plus belle ville du monde?",
    story_prompt: "Racontez-moi le lieu le plus mémorable que vous ayez visité.",
    biz_scenario: "Votre vol est annulé. Vous avez une réunion dans 3 heures. Que faites-vous?",
    emotion_topic: "Décrivez le sentiment d'arriver dans un nouveau pays pour la première fois.",
    idiom1: "avoir le cafard", idiom2: "casser les pieds", idiom3: "avoir le coup de foudre",
    culture_topic: "Comment la gastronomie façonne-t-elle l'identité culturelle française?"
  }),

  German: buildWeek1("German", {
    greet: "Hallo", yes: "Ja", no: "Nein", nums: "ein, zwei, drei, vier, fünf",
    food1: "Kaffee", food2: "Brot", food3: "Wasser", want: "Ich möchte",
    color1: "rot", color2: "blau", color3: "grün",
    mom: "Mama", dad: "Papa", friend: "Freund/Freundin", where: "Wo ist",
    intro_phrase: "Hallo, ich heiße [Name]. Ich komme aus [Stadt] und arbeite als [Beruf].",
    cafe_phrase: "Ich hätte gerne einen Kaffee, bitte. Was kostet das?",
    direct_phrase: "Entschuldigung, wo ist die nächste U-Bahn-Station?",
    shop_phrase: "Wie viel kostet das? Das ist zu teuer.",
    describe_phrase: "Die Stadt ist wunderschön und sehr belebt.",
    routine_phrase: "Normalerweise stehe ich um 7 Uhr auf und fange um 9 Uhr mit der Arbeit an.",
    debate_topic: "Ist Berlin oder München die aufregendere Stadt?",
    story_prompt: "Erzählen Sie mir von dem eindrucksvollsten Ort, den Sie je besucht haben.",
    biz_scenario: "Ihr Flug wurde gestrichen. Sie haben in 3 Stunden ein Meeting. Was tun Sie?",
    emotion_topic: "Beschreiben Sie das Gefühl, zum ersten Mal in einem neuen Land anzukommen.",
    idiom1: "Ich verstehe nur Bahnhof", idiom2: "Das ist nicht mein Bier", idiom3: "Tomaten auf den Augen haben",
    culture_topic: "Wie unterscheidet sich die deutsche Arbeitskultur von anderen europäischen Ländern?"
  }),

  Italian: buildWeek1("Italian", {
    greet: "Ciao", yes: "Sì", no: "No", nums: "uno, due, tre, quattro, cinque",
    food1: "caffè", food2: "pane", food3: "acqua", want: "Voglio",
    color1: "rosso", color2: "blu", color3: "verde",
    mom: "mamma", dad: "papà", friend: "amico/amica", where: "Dov'è",
    intro_phrase: "Ciao, mi chiamo [nome]. Sono di [città] e lavoro come [lavoro].",
    cafe_phrase: "Vorrei un caffè, per favore. Quanto costa?",
    direct_phrase: "Mi scusi, dov'è la stazione della metropolitana più vicina?",
    shop_phrase: "Quanto costa questo? È troppo caro.",
    describe_phrase: "La città è bellissima e molto vivace.",
    routine_phrase: "Di solito mi sveglio alle 7 e inizio a lavorare alle 9.",
    debate_topic: "Roma o Milano — qual è la vera capitale culturale d'Italia?",
    story_prompt: "Raccontami del posto più memorabile che tu abbia mai visitato.",
    biz_scenario: "Il tuo volo è stato cancellato. Hai una riunione tra 3 ore. Cosa fai?",
    emotion_topic: "Descrivi la sensazione di arrivare in un nuovo paese per la prima volta.",
    idiom1: "in bocca al lupo", idiom2: "non avere peli sulla lingua", idiom3: "fare il passo più lungo della gamba",
    culture_topic: "Come influisce la cultura del caffè sulle interazioni sociali italiane?"
  }),

  Portuguese: buildWeek1("Portuguese", {
    greet: "Olá", yes: "Sim", no: "Não", nums: "um, dois, três, quatro, cinco",
    food1: "café", food2: "pão", food3: "água", want: "Eu quero",
    color1: "vermelho", color2: "azul", color3: "verde",
    mom: "mãe", dad: "pai", friend: "amigo/amiga", where: "Onde fica",
    intro_phrase: "Olá, meu nome é [nome]. Sou de [cidade] e trabalho como [profissão].",
    cafe_phrase: "Eu gostaria de um café, por favor. Quanto custa?",
    direct_phrase: "Com licença, onde fica a estação de metrô mais próxima?",
    shop_phrase: "Quanto custa isso? Está muito caro.",
    describe_phrase: "A cidade é linda e muito movimentada.",
    routine_phrase: "Normalmente acordo às 7h e começo a trabalhar às 9h.",
    debate_topic: "Lisboa ou São Paulo — qual cidade tem mais energia?",
    story_prompt: "Conta-me sobre o lugar mais memorável que já visitaste.",
    biz_scenario: "O seu voo foi cancelado. Você tem uma reunião em 3 horas. O que faz?",
    emotion_topic: "Descreve a sensação de chegar a um novo país pela primeira vez.",
    idiom1: "matar dois coelhos com uma cajadada só", idiom2: "não há mal que sempre dure", idiom3: "quem não arrisca não petisca",
    culture_topic: "O que é a saudade e como ela molda a cultura portuguesa?"
  }),

  Hindi: buildWeek1("Hindi", {
    greet: "नमस्ते (Namaste)", yes: "हाँ (Haan)", no: "नहीं (Nahin)", nums: "एक, दो, तीन, चार, पाँच (ek, do, teen, chaar, paanch)",
    food1: "चाय (chai)", food2: "रोटी (roti)", food3: "पानी (paani)", want: "मुझे चाहिए (Mujhe chahiye)",
    color1: "लाल (laal)", color2: "नीला (neela)", color3: "हरा (hara)",
    mom: "माँ (maa)", dad: "पापा (papa)", friend: "दोस्त (dost)", where: "कहाँ है (Kahaan hai)",
    intro_phrase: "नमस्ते, मेरा नाम [नाम] है। मैं [शहर] से हूँ। (Namaste, mera naam [naam] hai. Main [shehar] se hoon.)",
    cafe_phrase: "मुझे एक चाय चाहिए, कृपया। यह कितने का है? (Mujhe ek chai chahiye, kripaya. Yeh kitne ka hai?)",
    direct_phrase: "माफ़ कीजिए, मेट्रो स्टेशन कहाँ है? (Maaf kijiye, metro station kahaan hai?)",
    shop_phrase: "यह कितने का है? यह बहुत महँगा है। (Yeh kitne ka hai? Yeh bahut mahanga hai.)",
    describe_phrase: "शहर बहुत सुंदर और व्यस्त है। (Shehar bahut sundar aur vyast hai.)",
    routine_phrase: "मैं आमतौर पर 7 बजे उठता/उठती हूँ। (Main aamtaur par 7 baje uthta/uthti hoon.)",
    debate_topic: "दिल्ली या मुंबई — भारत की असली राजधानी कौन सी है?",
    story_prompt: "उस जगह के बारे में बताइए जो आपको सबसे ज़्यादा याद है।",
    biz_scenario: "आपकी फ्लाइट रद्द हो गई। 3 घंटे में मीटिंग है। क्या करेंगे?",
    emotion_topic: "पहली बार किसी नए देश में पहुँचने का अहसास कैसा होता है?",
    idiom1: "आम के आम गुठलियों के दाम", idiom2: "अब पछताए होत क्या जब चिड़िया चुग गई खेत", idiom3: "नाच न जाने आँगन टेढ़ा",
    culture_topic: "भारत में अतिथि देवो भव की परंपरा व्यापार और सामाजिक जीवन को कैसे प्रभावित करती है?"
  }),

  Japanese: buildWeek1("Japanese", {
    greet: "こんにちは (Konnichiwa)", yes: "はい (Hai)", no: "いいえ (Iie)", nums: "いち、に、さん、し、ご (ichi, ni, san, shi, go)",
    food1: "おちゃ (ocha - tea)", food2: "パン (pan - bread)", food3: "みず (mizu - water)", want: "〜をください (〜wo kudasai)",
    color1: "あか (aka - red)", color2: "あお (ao - blue)", color3: "みどり (midori - green)",
    mom: "おかあさん (okaasan)", dad: "おとうさん (otousan)", friend: "ともだち (tomodachi)", where: "〜はどこですか (〜wa doko desu ka)",
    intro_phrase: "はじめまして、[名前]です。[都市]から来ました。(Hajimemashite, [namae] desu. [toshi] kara kimashita.)",
    cafe_phrase: "コーヒーを一つください。いくらですか？(Koohii wo hitotsu kudasai. Ikura desu ka?)",
    direct_phrase: "すみません、一番近い地下鉄の駅はどこですか？(Sumimasen, ichiban chikai chikatetsu no eki wa doko desu ka?)",
    shop_phrase: "これはいくらですか？高すぎます。(Kore wa ikura desu ka? Takasugimasu.)",
    describe_phrase: "この街はとても美しくて賑やかです。(Kono machi wa totemo utsukushikute nigiyaka desu.)",
    routine_phrase: "普通7時に起きて、9時から仕事を始めます。(Futsuu 7-ji ni okite, 9-ji kara shigoto wo hajimemasu.)",
    debate_topic: "東京か京都か — 日本の魂はどちらにありますか？",
    story_prompt: "今まで一番印象に残った場所について話してください。",
    biz_scenario: "フライトがキャンセルされました。3時間後に会議があります。どうしますか？",
    emotion_topic: "初めて新しい国に着いた時の気持ちを描写してください。",
    idiom1: "七転び八起き (nana korobi ya oki — fall seven times, get up eight)", idiom2: "猫に小判 (neko ni koban — pearls before swine)", idiom3: "花より団子 (hana yori dango — substance over appearance)",
    culture_topic: "日本のビジネス文化における「空気を読む」とはどういう意味ですか？"
  }),

  Korean: buildWeek1("Korean", {
    greet: "안녕하세요 (Annyeonghaseyo)", yes: "네 (Ne)", no: "아니요 (Aniyo)", nums: "일, 이, 삼, 사, 오 (il, i, sam, sa, o)",
    food1: "커피 (keopi - coffee)", food2: "빵 (ppang - bread)", food3: "물 (mul - water)", want: "〜 주세요 (〜 juseyo)",
    color1: "빨간 (ppalgan - red)", color2: "파란 (paran - blue)", color3: "초록 (chorok - green)",
    mom: "엄마 (eomma)", dad: "아빠 (appa)", friend: "친구 (chingu)", where: "〜이/가 어디예요? (〜i/ga eodi-eyo?)",
    intro_phrase: "안녕하세요, 저는 [이름]이에요. [도시]에서 왔어요. (Annyeonghaseyo, jeoneun [ireum]ieyo. [dosi]eseo wasseoyo.)",
    cafe_phrase: "커피 한 잔 주세요. 얼마예요? (Keopi han jan juseyo. Eolmayeyo?)",
    direct_phrase: "실례합니다, 가장 가까운 지하철역이 어디예요? (Sillyehamnida, gajang gakkaun jihaCheolyeogi eodi-eyo?)",
    shop_phrase: "이게 얼마예요? 너무 비싸요. (Ige eolmayeyo? Neomu bissayo.)",
    describe_phrase: "이 도시는 정말 아름답고 활기차요. (I dosineun jeongmal areumdapgo hwalgiehayo.)",
    routine_phrase: "저는 보통 7시에 일어나고 9시에 일을 시작해요. (Jeoneun botong 7si-e ireonago 9si-e ireul sijakaeyo.)",
    debate_topic: "서울이 세계에서 가장 흥미로운 도시인가요?",
    story_prompt: "가장 기억에 남는 여행지에 대해 이야기해 주세요.",
    biz_scenario: "항공편이 취소되었습니다. 3시간 후에 미팅이 있습니다. 어떻게 하겠습니까?",
    emotion_topic: "처음 새로운 나라에 도착했을 때의 느낌을 묘사해 주세요.",
    idiom1: "가는 말이 고와야 오는 말이 곱다 (kind words bring kind words)", idiom2: "하늘의 별 따기 (like picking stars from the sky — very difficult)", idiom3: "눈에 넣어도 아프지 않다 (wouldn't hurt even in your eye — cherished)",
    culture_topic: "한국의 눈치 문화는 사회적 상호작용과 비즈니스에 어떤 영향을 미치나요?"
  }),

  Chinese: buildWeek1("Chinese", {
    greet: "你好 (Nǐ hǎo)", yes: "是的 (Shì de)", no: "不 (Bù)", nums: "一、二、三、四、五 (yī, èr, sān, sì, wǔ)",
    food1: "茶 (chá - tea)", food2: "面包 (miànbāo - bread)", food3: "水 (shuǐ - water)", want: "我要 (Wǒ yào)",
    color1: "红色 (hóngsè - red)", color2: "蓝色 (lánsè - blue)", color3: "绿色 (lǜsè - green)",
    mom: "妈妈 (māma)", dad: "爸爸 (bàba)", friend: "朋友 (péngyǒu)", where: "〜在哪里 (〜zài nǎlǐ)",
    intro_phrase: "你好，我叫[名字]。我来自[城市]，我是[职业]。(Nǐ hǎo, wǒ jiào [míngzì]. Wǒ láizì [chéngshì], wǒ shì [zhíyè].)",
    cafe_phrase: "我要一杯咖啡，请问。多少钱？(Wǒ yào yī bēi kāfēi, qǐngwèn. Duōshao qián?)",
    direct_phrase: "请问，最近的地铁站在哪里？(Qǐngwèn, zuìjìn de dìtiě zhàn zài nǎlǐ?)",
    shop_phrase: "这个多少钱？太贵了。(Zhège duōshao qián? Tài guì le.)",
    describe_phrase: "这座城市非常美丽，也很繁忙。(Zhè zuò chéngshì fēicháng měilì, yě hěn fánmáng.)",
    routine_phrase: "我通常7点起床，9点开始工作。(Wǒ tōngcháng 7 diǎn qǐchuáng, 9 diǎn kāishǐ gōngzuò.)",
    debate_topic: "北京还是上海——中国文化的真正中心在哪里？",
    story_prompt: "告诉我你去过的最难忘的地方。",
    biz_scenario: "你的航班被取消了。三小时后有个重要会议。你怎么办？",
    emotion_topic: "描述第一次到达一个新国家时的感受。",
    idiom1: "一石二鸟 (yī shí èr niǎo — kill two birds with one stone)", idiom2: "半途而废 (bàn tú ér fèi — give up halfway)", idiom3: "马到成功 (mǎ dào chéng gōng — immediate success)",
    culture_topic: "面子的概念如何影响中国的商业关系和社会互动？"
  }),

  Arabic: buildWeek1("Arabic", {
    greet: "مرحبا (Marhaba)", yes: "نعم (Na'am)", no: "لا (La)", nums: "واحد، اثنان، ثلاثة، أربعة، خمسة (waahid, ithnayn, thalaatha, arba'a, khamsa)",
    food1: "قهوة (qahwa - coffee)", food2: "خبز (khubz - bread)", food3: "ماء (maa' - water)", want: "أريد (Ureed)",
    color1: "أحمر (ahmar - red)", color2: "أزرق (azraq - blue)", color3: "أخضر (akhdar - green)",
    mom: "أم (umm)", dad: "أب (ab)", friend: "صديق (sadeeq)", where: "أين (Ayna)",
    intro_phrase: "مرحبا، اسمي [الاسم]. أنا من [المدينة] وأعمل [المهنة]. (Marhaba, ismi [ism]. Ana min [madina] wa a'mal [mihna].)",
    cafe_phrase: "أريد قهوة من فضلك. بكم هذا؟ (Ureed qahwa min fadlak. Bikam hadha?)",
    direct_phrase: "عذرا، أين أقرب محطة مترو؟ ('Adhran, ayna aqrab mahattat metro?)",
    shop_phrase: "بكم هذا؟ هذا غالٍ جداً. (Bikam hadha? Hadha ghaalin jiddan.)",
    describe_phrase: "المدينة جميلة جدا ومزدحمة. (Al-madina jameela jiddan wa muzdahima.)",
    routine_phrase: "عادةً أستيقظ في الساعة السابعة وأبدأ العمل في التاسعة. ('Adatan astayqidh fi al-saa'a al-saabia wa abda' al-'amal fi al-taasi'a.)",
    debate_topic: "دبي أم القاهرة — أيّ المدينتين تمثّل مستقبل العالم العربي؟",
    story_prompt: "حدثني عن أكثر مكان زرته إثارةً للذكريات.",
    biz_scenario: "تم إلغاء رحلتك. لديك اجتماع بعد 3 ساعات. ماذا ستفعل؟",
    emotion_topic: "صف شعور الوصول إلى بلد جديد لأول مرة.",
    idiom1: "الصبر مفتاح الفرج (patience is the key to relief)", idiom2: "اللي ما يعرف الصقر يشويه (he who doesn't know the falcon will roast it)", idiom3: "قول آمين وأنت نايم (say amen while you sleep — effortless wish)",
    culture_topic: "كيف تؤثر مفاهيم الضيافة والكرم في الثقافة العربية على الأعمال التجارية والحياة الاجتماعية؟"
  }),

  Russian: buildWeek1("Russian", {
    greet: "Привет (Privet)", yes: "Да (Da)", no: "Нет (Net)", nums: "один, два, три, четыре, пять (odin, dva, tri, chetyre, pyat')",
    food1: "кофе (kofe - coffee)", food2: "хлеб (khleb - bread)", food3: "вода (voda - water)", want: "Я хочу (Ya khochu)",
    color1: "красный (krasny - red)", color2: "синий (siny - blue)", color3: "зелёный (zelyony - green)",
    mom: "мама (mama)", dad: "папа (papa)", friend: "друг (drug)", where: "Где (Gde)",
    intro_phrase: "Привет, меня зовут [имя]. Я из [города] и работаю [профессия]. (Privet, menya zovut [imya]. Ya iz [goroda] i rabotayu [professiya].)",
    cafe_phrase: "Мне, пожалуйста, кофе. Сколько стоит? (Mne, pozhaluysta, kofe. Skol'ko stoit?)",
    direct_phrase: "Извините, где ближайшая станция метро? (Izvinite, gde blizhayshaya stantsiya metro?)",
    shop_phrase: "Сколько это стоит? Это слишком дорого. (Skol'ko eto stoit? Eto slishkom dorogo.)",
    describe_phrase: "Город очень красивый и оживлённый. (Gorod ochen' krasivyy i ozhivlyonny.)",
    routine_phrase: "Обычно я просыпаюсь в 7 утра и начинаю работать в 9. (Obychno ya prosypayus' v 7 utra i nachinayu rabotat' v 9.)",
    debate_topic: "Москва или Санкт-Петербург — культурная столица России?",
    story_prompt: "Расскажите о самом запоминающемся месте, которое вы посетили.",
    biz_scenario: "Ваш рейс отменили. Через 3 часа встреча. Что вы делаете?",
    emotion_topic: "Опишите ощущение от первого приезда в новую страну.",
    idiom1: "Без труда не выловишь и рыбку из пруда (no pain no gain)", idiom2: "Утро вечера мудренее (morning is wiser than evening)", idiom3: "Не всё то золото, что блестит (all that glitters is not gold)",
    culture_topic: "Как русская культура душевности влияет на построение деловых отношений?"
  }),

  Dutch: buildWeek1("Dutch", {
    greet: "Hallo", yes: "Ja", no: "Nee", nums: "één, twee, drie, vier, vijf",
    food1: "koffie", food2: "brood", food3: "water", want: "Ik wil",
    color1: "rood", color2: "blauw", color3: "groen",
    mom: "mama", dad: "papa", friend: "vriend/vriendin", where: "Waar is",
    intro_phrase: "Hallo, mijn naam is [naam]. Ik kom uit [stad] en ik werk als [beroep].",
    cafe_phrase: "Ik wil graag een koffie, alsjeblieft. Hoeveel kost dat?",
    direct_phrase: "Excuseer, waar is het dichtstbijzijnde metrostation?",
    shop_phrase: "Hoeveel kost dit? Dat is te duur.",
    describe_phrase: "De stad is prachtig en erg druk.",
    routine_phrase: "Ik sta normaal op om 7 uur en begin om 9 uur met werken.",
    debate_topic: "Amsterdam of Rotterdam — welke stad is de echte ziel van Nederland?",
    story_prompt: "Vertel me over de meest memorabele plek die je ooit hebt bezocht.",
    biz_scenario: "Je vlucht is geannuleerd. Over 3 uur heb je een vergadering. Wat doe je?",
    emotion_topic: "Beschrijf het gevoel van voor het eerst in een nieuw land aankomen.",
    idiom1: "Nu komt de aap uit de mouw (now the monkey comes out of the sleeve — the truth is revealed)", idiom2: "Met de deur in huis vallen (to fall in with the door — to get straight to the point)", idiom3: "Andere tijden, andere zeden (other times, other customs)",
    culture_topic: "Hoe beïnvloedt de Nederlandse directheid de zakelijke en sociale interacties?"
  }),

  Turkish: buildWeek1("Turkish", {
    greet: "Merhaba", yes: "Evet", no: "Hayır", nums: "bir, iki, üç, dört, beş",
    food1: "kahve", food2: "ekmek", food3: "su", want: "İstiyorum",
    color1: "kırmızı", color2: "mavi", color3: "yeşil",
    mom: "anne", dad: "baba", friend: "arkadaş", where: "Nerede",
    intro_phrase: "Merhaba, benim adım [ad]. [Şehir]'den geliyorum ve [meslek] olarak çalışıyorum.",
    cafe_phrase: "Bir kahve alabilir miyim lütfen? Bu ne kadar?",
    direct_phrase: "Affedersiniz, en yakın metro istasyonu nerede?",
    shop_phrase: "Bu ne kadar? Bu çok pahalı.",
    describe_phrase: "Şehir çok güzel ve hareketli.",
    routine_phrase: "Genellikle sabah 7'de uyanır ve 9'da çalışmaya başlarım.",
    debate_topic: "İstanbul mu Ankara mı — Türkiye'nin gerçek kalbi hangisi?",
    story_prompt: "Şimdiye kadar gittiğin en unutulmaz yer hakkında anlat.",
    biz_scenario: "Uçuşun iptal edildi. 3 saat sonra toplantın var. Ne yaparsın?",
    emotion_topic: "İlk kez yeni bir ülkeye vardığındaki hissi anlat.",
    idiom1: "Damlaya damlaya göl olur (drop by drop a lake forms — perseverance pays)", idiom2: "Komşu komşunun külüne muhtaçtır (neighbors depend on each other's ashes — community matters)", idiom3: "Söz gümüşse sükut altındır (if speech is silver, silence is gold)",
    culture_topic: "Türk misafirperverliği iş dünyasını ve sosyal ilişkileri nasıl şekillendirir?"
  }),

  Swedish: buildWeek1("Swedish", {
    greet: "Hej", yes: "Ja", no: "Nej", nums: "ett, två, tre, fyra, fem",
    food1: "kaffe", food2: "bröd", food3: "vatten", want: "Jag vill ha",
    color1: "röd", color2: "blå", color3: "grön",
    mom: "mamma", dad: "pappa", friend: "vän/kompis", where: "Var är",
    intro_phrase: "Hej, jag heter [namn]. Jag kommer från [stad] och arbetar som [yrke].",
    cafe_phrase: "Jag skulle vilja ha en kaffe, tack. Hur mycket kostar det?",
    direct_phrase: "Ursäkta, var är närmaste tunnelbanestation?",
    shop_phrase: "Hur mycket kostar det här? Det är för dyrt.",
    describe_phrase: "Staden är vacker och väldigt livlig.",
    routine_phrase: "Jag brukar vakna vid 7-tiden och börja jobba vid 9.",
    debate_topic: "Stockholm eller Göteborg — vilken stad bäst representerar Sverige?",
    story_prompt: "Berätta om det mest minnesvärda stället du någonsin besökt.",
    biz_scenario: "Ditt flyg är inställt. Du har ett möte om 3 timmar. Vad gör du?",
    emotion_topic: "Beskriv känslan av att anlända till ett nytt land för första gången.",
    idiom1: "Ingen ko på isen (no cow on the ice — no worries)", idiom2: "Det är ingen fara på taket (there's no danger on the roof — everything's fine)", idiom3: "Kärt barn har många namn (a beloved child has many names — many names for something cherished)",
    culture_topic: "Hur påverkar lagom-konceptet det svenska arbetslivet och sociala interaktioner?"
  }),

  Greek: buildWeek1("Greek", {
    greet: "Γεια σου (Yia sou)", yes: "Ναι (Nai)", no: "Όχι (Ochi)", nums: "ένα, δύο, τρία, τέσσερα, πέντε (ena, dio, tria, tessera, pente)",
    food1: "καφές (kafes - coffee)", food2: "ψωμί (psomi - bread)", food3: "νερό (nero - water)", want: "Θέλω (Thelo)",
    color1: "κόκκινο (kokkino - red)", color2: "μπλε (ble - blue)", color3: "πράσινο (prasino - green)",
    mom: "μαμά (mama)", dad: "μπαμπάς (bampas)", friend: "φίλος/φίλη (filos/fili)", where: "Πού είναι (Pou einai)",
    intro_phrase: "Γεια σου, με λένε [όνομα]. Είμαι από [πόλη] και δουλεύω ως [επάγγελμα]. (Yia sou, me lene [onoma]. Eimai apo [poli] kai doulevо ōs [epaggelma].)",
    cafe_phrase: "Θα ήθελα έναν καφέ, παρακαλώ. Πόσο κάνει; (Tha ithela enan kafe, parakalo. Poso kanei?)",
    direct_phrase: "Συγγνώμη, πού είναι ο πλησιέστερος σταθμός του μετρό; (Signomi, pou einai o plisiesteros stathmos tou metro?)",
    shop_phrase: "Πόσο κάνει αυτό; Είναι πολύ ακριβό. (Poso kanei afto? Einai poli akrivo.)",
    describe_phrase: "Η πόλη είναι πανέμορφη και πολύ ζωντανή. (I poli einai panemorphi kai poli zontani.)",
    routine_phrase: "Συνήθως ξυπνώ στις 7 και αρχίζω τη δουλειά στις 9. (Siniths xipno stis 7 kai archizo ti doulia stis 9.)",
    debate_topic: "Αθήνα ή Θεσσαλονίκη — ποια είναι η αληθινή καρδιά της Ελλάδας;",
    story_prompt: "Πείτε μου για τον πιο αξέχαστο τόπο που έχετε επισκεφθεί.",
    biz_scenario: "Η πτήση σας ακυρώθηκε. Σε 3 ώρες έχετε συνάντηση. Τι κάνετε;",
    emotion_topic: "Περιγράψτε την αίσθηση που νιώθετε όταν φτάνετε σε μια νέα χώρα για πρώτη φορά.",
    idiom1: "Αγάπα με λίγο να σε αγαπώ πολύ (love me a little so I can love you a lot — moderation in relationships)", idiom2: "Όποιος βιάζεται σκοντάφτει (he who hurries stumbles — haste makes waste)", idiom3: "Η γλώσσα κόκαλα δεν έχει και κόκαλα τσακίζει (the tongue has no bones yet breaks bones — words are powerful)",
    culture_topic: "Πώς η ελληνική φιλοτιμία επηρεάζει τις επαγγελματικές και κοινωνικές σχέσεις;"
  })
};


// ─────────────────────────────────────────────────────────────
// SECTION 3: DRILLS
// 16 languages × 3 levels = 48 drill sets, 5 drills each
// Follows i+1 principle: each drill is 1 level above comfort
// ─────────────────────────────────────────────────────────────

export const DRILLS = {
  English: {
    beginner: [
      { phrase: "Hello", romanization: "", meaning: "A universal greeting", tip: "Make eye contact and smile — it amplifies the word." },
      { phrase: "Thank you", romanization: "", meaning: "Express gratitude", tip: "Said 100x a day by native speakers." },
      { phrase: "Yes / No", romanization: "", meaning: "Agree or disagree", tip: "The foundation of every conversation." },
      { phrase: "I want water", romanization: "", meaning: "Request a basic need", tip: "Swap 'water' for any food or drink word." },
      { phrase: "Where is it?", romanization: "", meaning: "Ask for location", tip: "Point while asking — it always helps." }
    ],
    some: [
      { phrase: "Could you speak more slowly, please?", romanization: "", meaning: "Ask for comprehensible input", tip: "Native speakers will slow down immediately — use this fearlessly." },
      { phrase: "I'd like a table for two, please.", romanization: "", meaning: "Restaurant reservation", tip: "Works in any dining situation." },
      { phrase: "How do I get to the city center?", romanization: "", meaning: "Navigation request", tip: "Add 'by bus/train/foot?' to get more specific help." },
      { phrase: "What do you recommend?", romanization: "", meaning: "Ask for local expertise", tip: "Unlocks authentic local knowledge every time." },
      { phrase: "I've been learning English for [time].", romanization: "", meaning: "Share your language journey", tip: "Opens conversations and invites encouragement." }
    ],
    intermediate: [
      { phrase: "I see where you're coming from, but I'd argue that...", romanization: "", meaning: "Respectful disagreement", tip: "Sophisticated debaters use this construction constantly." },
      { phrase: "It's a double-edged sword — there are pros and cons.", romanization: "", meaning: "Balanced argumentation idiom", tip: "'Double-edged sword' signals native-level thinking." },
      { phrase: "She's been under the weather lately — nothing serious.", romanization: "", meaning: "Health idiom in casual context", tip: "Under the weather = mildly sick. Extremely common in speech." },
      { phrase: "We should touch base next week to follow up on this.", romanization: "", meaning: "Business/professional idiom", tip: "'Touch base' and 'follow up' are business English staples." },
      { phrase: "The way I see it, language learning is about connection, not perfection.", romanization: "", meaning: "Opinion expression with nuance", tip: "'The way I see it' is the native way to share personal views." }
    ]
  },

  Spanish: {
    beginner: [
      { phrase: "Hola", romanization: "OH-lah", meaning: "Hello", tip: "The most used word in Spanish. Say it warm and open." },
      { phrase: "Gracias", romanization: "GRAH-syahs", meaning: "Thank you", tip: "Add 'muchas' before it for 'thank you very much'." },
      { phrase: "Sí / No", romanization: "See / No", meaning: "Yes / No", tip: "'Sí' has an accent to distinguish from 'si' (if)." },
      { phrase: "Quiero agua", romanization: "KYEH-roh AH-gwah", meaning: "I want water", tip: "Swap 'agua' for any food: quiero café, quiero pan." },
      { phrase: "¿Dónde está?", romanization: "DON-deh ehs-TAH", meaning: "Where is it?", tip: "Add any place after it: ¿Dónde está el baño?" }
    ],
    some: [
      { phrase: "¿Puede hablar más despacio, por favor?", romanization: "PWEH-deh ah-BLAR mahs des-PAH-syoh", meaning: "Can you speak more slowly?", tip: "The single most useful phrase for language learners." },
      { phrase: "Quisiera una mesa para dos, por favor.", romanization: "kee-SYEH-rah OO-nah MEH-sah", meaning: "I'd like a table for two", tip: "'Quisiera' is more polite than 'quiero' in formal settings." },
      { phrase: "¿Cómo puedo llegar al centro?", romanization: "KOH-moh PWEH-doh yeh-GAR", meaning: "How do I get to the city center?", tip: "Works with any destination: al aeropuerto, al hotel." },
      { phrase: "¿Qué me recomienda usted?", romanization: "keh meh reh-koh-MYEN-dah", meaning: "What do you recommend?", tip: "Using 'usted' shows respect; locals love when visitors do this." },
      { phrase: "Llevo [tiempo] aprendiendo español.", romanization: "YEH-voh ah-pren-DYEN-doh", meaning: "I've been learning Spanish for [time]", tip: "'Llevo + gerund' is the natural way to express ongoing duration." }
    ],
    intermediate: [
      { phrase: "Entiendo tu punto, pero yo diría que...", romanization: "", meaning: "I understand your point, but I'd say that...", tip: "The polite disagreement formula used by educated speakers." },
      { phrase: "Es un arma de doble filo — tiene ventajas y desventajas.", romanization: "", meaning: "It's a double-edged sword", tip: "This exact idiom exists in Spanish too and impresses natives." },
      { phrase: "Se me fue el santo al cielo — ¿de qué estábamos hablando?", romanization: "", meaning: "My mind went blank — what were we talking about?", tip: "Literally 'the saint went to heaven' — a charming way to say you forgot." },
      { phrase: "Hay que matar dos pájaros de un tiro en este proyecto.", romanization: "", meaning: "We need to kill two birds with one stone on this project", tip: "Same idiom as English; using it correctly = advanced fluency signal." },
      { phrase: "Para mí, aprender idiomas va más allá de la gramática — es sobre la conexión humana.", romanization: "", meaning: "For me, learning languages goes beyond grammar", tip: "'Va más allá de' (goes beyond) is an elegant construction for complex opinions." }
    ]
  },

  French: {
    beginner: [
      { phrase: "Bonjour", romanization: "bohn-ZHOOR", meaning: "Hello / Good day", tip: "Always say Bonjour before asking anything in France — it's essential etiquette." },
      { phrase: "Merci", romanization: "mehr-SEE", meaning: "Thank you", tip: "Add 'beaucoup' (boh-KOO) for 'thank you very much'." },
      { phrase: "Oui / Non", romanization: "wee / nohn", meaning: "Yes / No", tip: "French 'oui' sounds like 'we' in English." },
      { phrase: "Je veux de l'eau", romanization: "zhuh VUH duh LOH", meaning: "I want water", tip: "Swap 'l'eau' for 'un café' or 'du pain' to order different things." },
      { phrase: "Où est...?", romanization: "oo EH", meaning: "Where is...?", tip: "Add any place: Où est la gare? Où est le restaurant?" }
    ],
    some: [
      { phrase: "Pouvez-vous parler plus lentement, s'il vous plaît?", romanization: "poo-VAY voo par-LAY", meaning: "Can you speak more slowly, please?", tip: "French people will always accommodate this gracious request." },
      { phrase: "Je voudrais une table pour deux, s'il vous plaît.", romanization: "zhuh voo-DREH", meaning: "I'd like a table for two", tip: "'Je voudrais' is the magic polite phrase for all requests in France." },
      { phrase: "Comment puis-je aller au centre-ville?", romanization: "koh-MAHN pwee-zhuh ah-LAY", meaning: "How do I get to the city center?", tip: "'Puis-je' is the formal 'can I' — shows good education." },
      { phrase: "Qu'est-ce que vous recommandez?", romanization: "kess-kuh voo reh-koh-mahn-DAY", meaning: "What do you recommend?", tip: "French waitstaff take this question seriously — prepare for a passionate answer." },
      { phrase: "Ça fait [temps] que j'apprends le français.", romanization: "sah feh...kuh zhah-PRAHN", meaning: "I've been learning French for [time]", tip: "'Ça fait + time + que' is the native construction for expressing duration." }
    ],
    intermediate: [
      { phrase: "Je comprends ton point de vue, mais je dirais plutôt que...", romanization: "", meaning: "I understand your viewpoint, but I'd rather say...", tip: "'Plutôt que' softens disagreement elegantly — very French in its sophistication." },
      { phrase: "C'est à double tranchant — il y a des avantages et des inconvénients.", romanization: "", meaning: "It cuts both ways / It's double-edged", tip: "'À double tranchant' is the French equivalent of 'double-edged sword'." },
      { phrase: "J'ai le cafard aujourd'hui — je me sens un peu mélancolique.", romanization: "", meaning: "I'm feeling down today — a bit melancholic", tip: "'Avoir le cafard' (to have the cockroach) = feeling gloomy. Very French." },
      { phrase: "Il faut mener plusieurs projets de front dans ce travail.", romanization: "", meaning: "You have to juggle several projects at once in this job", tip: "'De front' (at the forefront/simultaneously) is a professional expression." },
      { phrase: "À mon sens, apprendre une langue c'est adopter une nouvelle façon de penser.", romanization: "", meaning: "In my view, learning a language is adopting a new way of thinking", tip: "'À mon sens' is more nuanced than 'je pense' — it signals a considered opinion." }
    ]
  },

  German: {
    beginner: [
      { phrase: "Hallo", romanization: "HAH-loh", meaning: "Hello", tip: "Informal greeting for friends and casual settings." },
      { phrase: "Danke", romanization: "DAHN-keh", meaning: "Thank you", tip: "Add 'sehr' (sehr) for 'thank you very much' — danke sehr." },
      { phrase: "Ja / Nein", romanization: "yah / nine", meaning: "Yes / No", tip: "'Nein' rhymes with 'mine' in English." },
      { phrase: "Ich möchte Wasser", romanization: "ikh MOOKH-teh VAH-ser", meaning: "I'd like water", tip: "'Möchte' is the polite form of 'want' — always use it with strangers." },
      { phrase: "Wo ist...?", romanization: "voh IST", meaning: "Where is...?", tip: "Works for everything: Wo ist der Bahnhof? Wo ist das Hotel?" }
    ],
    some: [
      { phrase: "Können Sie bitte langsamer sprechen?", romanization: "KUH-nen zee BIT-teh LAHNG-zah-mer SHPREKH-en", meaning: "Could you please speak more slowly?", tip: "Germans appreciate directness — this phrase is entirely normal to use." },
      { phrase: "Ich hätte gerne einen Tisch für zwei, bitte.", romanization: "ikh HEH-teh GEHR-neh", meaning: "I'd like a table for two, please", tip: "'Hätte gerne' is the polite subjunctive form Germans use for requests." },
      { phrase: "Wie komme ich am besten in die Stadtmitte?", romanization: "vee KOM-meh ikh ahm BES-ten", meaning: "What's the best way to get to the city center?", tip: "'Am besten' (most best) = the best way — essential qualifier in German directions." },
      { phrase: "Was empfehlen Sie?", romanization: "vahs ehm-PFAY-len zee", meaning: "What do you recommend?", tip: "Using 'Sie' (formal you) with service staff is proper German etiquette." },
      { phrase: "Ich lerne seit [Zeit] Deutsch.", romanization: "ikh LEHR-neh zite", meaning: "I've been learning German for [time]", tip: "'Seit + present tense' is how German expresses ongoing duration — opposite of English!" }
    ],
    intermediate: [
      { phrase: "Ich verstehe Ihren Standpunkt, aber ich würde sagen, dass...", romanization: "", meaning: "I understand your standpoint, but I would say that...", tip: "'Ich würde sagen' (I would say) is the cultured way to introduce an opinion." },
      { phrase: "Das ist ein zweischneidiges Schwert — es hat Vor- und Nachteile.", romanization: "", meaning: "That's a double-edged sword — it has pros and cons", tip: "'Zweischneidiges Schwert' is the direct equivalent and widely used." },
      { phrase: "Ich verstehe nur Bahnhof — kannst du das nochmal erklären?", romanization: "", meaning: "I only understand 'train station' — can you explain that again?", tip: "This idiom (I only understand 'train station') = I understand nothing. Beloved expression." },
      { phrase: "Wir müssen in diesem Projekt zwei Fliegen mit einer Klappe schlagen.", romanization: "", meaning: "We need to kill two birds with one stone in this project", tip: "Literally 'hit two flies with one swatter' — same concept, very German imagery." },
      { phrase: "Meiner Meinung nach geht Sprachenlernen über Grammatik hinaus — es geht um Verbindung.", romanization: "", meaning: "In my opinion, language learning goes beyond grammar — it's about connection", tip: "'Meiner Meinung nach' at the start is the standard educated opinion marker." }
    ]
  },

  Italian: {
    beginner: [
      { phrase: "Ciao", romanization: "chow", meaning: "Hi / Bye (informal)", tip: "Works as both hello and goodbye — Italian efficiency!" },
      { phrase: "Grazie", romanization: "GRAT-syeh", meaning: "Thank you", tip: "Add 'mille' (thousand) for 'grazie mille' — thanks a thousand!" },
      { phrase: "Sì / No", romanization: "see / no", meaning: "Yes / No", tip: "The accent on Sì distinguishes it from 'si' (reflexive pronoun)." },
      { phrase: "Voglio acqua", romanization: "VOL-yoh AH-kwah", meaning: "I want water", tip: "Swap 'acqua' for 'caffè', 'vino', or 'pizza' — Italian essentials." },
      { phrase: "Dov'è...?", romanization: "doh-VEH", meaning: "Where is...?", tip: "Dov'è is a contraction of 'dove è' — natural fast speech." }
    ],
    some: [
      { phrase: "Può parlare più lentamente, per favore?", romanization: "pwoh par-LAR-eh pyoo len-tah-MEN-teh", meaning: "Can you speak more slowly, please?", tip: "Italians speak fast and musically — this phrase is your best friend." },
      { phrase: "Vorrei un tavolo per due, per favore.", romanization: "vor-REH-ee oon TAH-vo-loh", meaning: "I'd like a table for two, please", tip: "'Vorrei' (conditional of volere) is the polite way to request anything." },
      { phrase: "Come arrivo al centro storico?", romanization: "KO-meh ar-REE-voh", meaning: "How do I get to the historic center?", tip: "Italians give expressive directions with hands — watch carefully." },
      { phrase: "Cosa mi consiglia?", romanization: "KO-zah mee kon-SEE-lyah", meaning: "What do you recommend?", tip: "Italian servers take this as an invitation to educate you enthusiastically." },
      { phrase: "Studio l'italiano da [tempo].", romanization: "STOO-dyoh lee-tahl-YAH-noh", meaning: "I've been studying Italian for [time]", tip: "Using the present tense + 'da' (since/for) to express ongoing actions." }
    ],
    intermediate: [
      { phrase: "Capisco il tuo punto di vista, ma direi piuttosto che...", romanization: "", meaning: "I understand your point of view, but I'd rather say...", tip: "'Piuttosto che' elevates your Italian immediately — it's educated register." },
      { phrase: "È un'arma a doppio taglio — ci sono pro e contro.", romanization: "", meaning: "It's a double-edged weapon — there are pros and cons", tip: "'A doppio taglio' is used constantly in Italian political and business discussion." },
      { phrase: "Non ho peli sulla lingua — te lo dico chiaramente.", romanization: "", meaning: "I won't mince words — I'll tell you clearly", tip: "Literally 'I have no hair on my tongue' — means speaking bluntly and honestly." },
      { phrase: "In questo progetto dobbiamo prendere due piccioni con una fava.", romanization: "", meaning: "In this project we need to kill two birds with one stone", tip: "Literally 'two pigeons with one bean' — same concept, charmingly Italian." },
      { phrase: "Per me, imparare una lingua significa adottare un nuovo modo di vedere il mondo.", romanization: "", meaning: "For me, learning a language means adopting a new way of seeing the world", tip: "'Vedere il mondo' (seeing the world) is more lyrical than 'thinking' — very Italian." }
    ]
  },

  Portuguese: {
    beginner: [
      { phrase: "Olá", romanization: "oh-LAH", meaning: "Hello", tip: "Works in both Brazil and Portugal — your safe universal greeting." },
      { phrase: "Obrigado / Obrigada", romanization: "oh-bree-GAH-doo / oh-bree-GAH-dah", meaning: "Thank you (m/f)", tip: "Men say obrigado, women say obrigada — matches the speaker's gender." },
      { phrase: "Sim / Não", romanization: "seen / nowng", meaning: "Yes / No", tip: "Não has a nasal sound — practice the 'owng' ending." },
      { phrase: "Eu quero água", romanization: "eh-oo KEH-roo AH-gwah", meaning: "I want water", tip: "Swap 'água' for 'café', 'pão', 'suco' to order different things." },
      { phrase: "Onde fica...?", romanization: "ON-djee FEE-kah", meaning: "Where is...?", tip: "'Fica' (is located) is more natural than 'está' for fixed locations." }
    ],
    some: [
      { phrase: "Pode falar mais devagar, por favor?", romanization: "POH-djee fah-LAR mah-ees deh-vah-GAR", meaning: "Can you speak more slowly, please?", tip: "Brazilian Portuguese especially benefits from this — the rhythm is fast." },
      { phrase: "Gostaria de uma mesa para dois, por favor.", romanization: "gos-tah-REE-ah djee OO-mah", meaning: "I'd like a table for two, please", tip: "'Gostaria' is the polite conditional — the key to gracious requests." },
      { phrase: "Como eu chego ao centro da cidade?", romanization: "KOH-moo eh-oo SHEH-goo", meaning: "How do I get to the city center?", tip: "In Brazil you'd hear 'Como chego' — the 'eu' is often dropped in speech." },
      { phrase: "O que você recomenda?", romanization: "oo keh vo-SEH heh-koh-MEN-dah", meaning: "What do you recommend?", tip: "In Portugal use 'recomendam' (você → vocês in formal PT)." },
      { phrase: "Estou aprendendo português há [tempo].", romanization: "es-TOH ah-pren-DEN-doo", meaning: "I've been learning Portuguese for [time]", tip: "'Há + time' for BP; 'faz + time + que' for European Portuguese." }
    ],
    intermediate: [
      { phrase: "Entendo sua perspectiva, mas eu diria que...", romanization: "", meaning: "I understand your perspective, but I would say that...", tip: "'Eu diria' (conditional) is the sophisticated Brazilian way to offer a counter-view." },
      { phrase: "É uma faca de dois gumes — tem vantagens e desvantagens.", romanization: "", meaning: "It's a double-edged knife — it has advantages and disadvantages", tip: "'Faca de dois gumes' = double-edged knife. Widely used in debates." },
      { phrase: "Não tenho papas na língua — vou ser direto/direta.", romanization: "", meaning: "I won't mince words — I'll be direct", tip: "Same 'tongue' idiom as Italian/Spanish — no food in the mouth = speaking plainly." },
      { phrase: "Nesse projeto precisamos matar dois coelhos com uma cajadada só.", romanization: "", meaning: "In this project we need to kill two birds with one stone", tip: "Literally 'two rabbits with one stick blow' — the Brazilian version of the idiom." },
      { phrase: "Para mim, aprender um idioma é muito mais do que gramática — é sobre conexão humana.", romanization: "", meaning: "For me, learning a language is much more than grammar", tip: "'Muito mais do que' (much more than) is a powerful emphasis structure in Brazilian debate." }
    ]
  },

  Hindi: {
    beginner: [
      { phrase: "नमस्ते", romanization: "Na-mas-teh", meaning: "Hello / Greetings", tip: "Said with hands pressed together — it carries deep respect." },
      { phrase: "धन्यवाद", romanization: "Dhun-yuh-vaad", meaning: "Thank you (formal)", tip: "Informal: 'शुक्रिया' (Shukriya) — both are widely understood." },
      { phrase: "हाँ / नहीं", romanization: "Haan / Nahin", meaning: "Yes / No", tip: "'हाँ' sounds like 'haan' with a nasal quality." },
      { phrase: "मुझे पानी चाहिए", romanization: "Mu-jheh PAA-nee CHAA-hee-yeh", meaning: "I need/want water", tip: "Swap 'पानी' (paani) for 'चाय' (chai) or 'खाना' (khaana - food)." },
      { phrase: "कहाँ है?", romanization: "Ka-HAAN hai?", meaning: "Where is it?", tip: "Works as a standalone question while pointing at something." }
    ],
    some: [
      { phrase: "क्या आप धीरे बोल सकते हैं?", romanization: "Kya aap DHEE-reh bol SAK-teh hain?", meaning: "Can you speak more slowly?", tip: "Using 'aap' (formal you) shows respect — always use with strangers." },
      { phrase: "मुझे दो लोगों के लिए एक मेज़ चाहिए।", romanization: "Mu-jheh do lo-GON keh li-YEH ek MEZ CHAA-hee-yeh", meaning: "I need a table for two people", tip: "'के लिए' (ke liye) = 'for' — extremely useful connector word." },
      { phrase: "मैं शहर के बीच कैसे पहुँचूँ?", romanization: "Main SHE-her keh beech KAI-seh pa-HOON-choon?", meaning: "How do I get to the city center?", tip: "'पहुँचना' (pahunchna) = to arrive/reach — key travel verb." },
      { phrase: "आप क्या सुझाव देंगे?", romanization: "Aap kya su-JHAAV DEN-geh?", meaning: "What would you recommend?", tip: "'सुझाव' (sujhaav) = suggestion/recommendation. Very natural phrasing." },
      { phrase: "मैं [समय] से हिंदी सीख रहा/रही हूँ।", romanization: "Main [samay] seh Hin-dee seekh RA-ha/RA-hee hoon", meaning: "I've been learning Hindi for [time]", tip: "'रहा हूँ' (raha hoon) = present continuous — the '-raha/-rahi' changes with gender." }
    ],
    intermediate: [
      { phrase: "मैं आपकी बात समझता/समझती हूँ, लेकिन मैं यह कहूँगा/कहूँगी कि...", romanization: "", meaning: "I understand what you're saying, but I would say that...", tip: "Hindi verbs change with gender — master this and you sound truly fluent." },
      { phrase: "यह दोधारी तलवार है — इसके फ़ायदे और नुकसान दोनों हैं।", romanization: "yeh do-DHAA-ree tal-WAAR hai", meaning: "It's a double-edged sword — it has both benefits and drawbacks", tip: "'दोधारी तलवार' (two-edged sword) is the exact Hindi equivalent — use it confidently." },
      { phrase: "आम के आम गुठलियों के दाम — इस काम में दोनों फ़ायदे हैं।", romanization: "Aam ke aam guthliyon ke daam", meaning: "Getting the fruit AND the seeds — double benefit from one thing", tip: "A beloved Hindi idiom meaning you're getting double value — use it to impress." },
      { phrase: "इस प्रोजेक्ट में हमें एक तीर से दो शिकार करने होंगे।", romanization: "ek teer seh do shikaar", meaning: "We'll need to hunt two targets with one arrow (kill two birds with one stone)", tip: "'एक तीर से दो शिकार' is the poetic Hindi version of this universal idiom." },
      { phrase: "मेरे विचार में, भाषा सीखना सिर्फ़ व्याकरण से परे है — यह इंसानी जुड़ाव के बारे में है।", romanization: "mere vichaar mein", meaning: "In my view, language learning goes beyond mere grammar — it's about human connection", tip: "'मेरे विचार में' (in my thinking) is the sophisticated Hindi opinion opener." }
    ]
  },

  Japanese: {
    beginner: [
      { phrase: "こんにちは", romanization: "Kon-ni-chi-wa", meaning: "Hello (daytime greeting)", tip: "Use in the afternoon. Morning: おはよう (ohayou). Evening: こんばんは (konbanwa)." },
      { phrase: "ありがとう", romanization: "A-ri-ga-tou", meaning: "Thank you (casual)", tip: "Formal: ありがとうございます (arigatou gozaimasu) — add gozaimasu for politeness." },
      { phrase: "はい / いいえ", romanization: "Hai / Iie", meaning: "Yes / No", tip: "'Hai' also means 'I hear you' or 'I understand' — not always 'yes'." },
      { phrase: "みずをください", romanization: "Mi-zu wo ku-da-sai", meaning: "Please give me water", tip: "Replace 'みず' with コーヒー (koohii) or おちゃ (ocha - green tea)." },
      { phrase: "どこですか", romanization: "Do-ko des-ka", meaning: "Where is it?", tip: "Put the place before it: トイレはどこですか (toire wa doko desu ka — where is the toilet?)" }
    ],
    some: [
      { phrase: "もっとゆっくり話していただけますか？", romanization: "Motto yukkuri hanashite itadakemasu ka?", meaning: "Could you please speak more slowly?", tip: "'いただけますか' is the ultra-polite request form — Japanese people will be delighted you know it." },
      { phrase: "二人分のテーブルをお願いできますか？", romanization: "Futari bun no teeburu wo onegai dekimasu ka?", meaning: "Could I have a table for two?", tip: "'お願いできますか' (could I ask) is more refined than just 'ください'." },
      { phrase: "市内中心部へはどうやって行けばいいですか？", romanization: "Shinai chuushinbu e wa douyatte ikeba ii desu ka?", meaning: "How should I go to the city center?", tip: "'〜ばいいですか' (how should I?) is a key pattern for asking for instructions." },
      { phrase: "何かお勧めはありますか？", romanization: "Nanika osusume wa arimasu ka?", meaning: "Do you have any recommendations?", tip: "'おすすめ' (osusume) is the key word for recommendations — widely used." },
      { phrase: "[期間]日本語を勉強しています。", romanization: "[kikan] Nihongo wo benkyou shite imasu", meaning: "I've been studying Japanese for [time]", tip: "'〜ています' (te-form + imasu) expresses ongoing actions — a crucial grammar pattern." }
    ],
    intermediate: [
      { phrase: "おっしゃることはわかりますが、私としては〜と思います。", romanization: "Ossharu koto wa wakarimasu ga, watashi to shite wa ~ to omoimasu.", meaning: "I understand what you're saying, but personally I think that...", tip: "'おっしゃる' is the respectful form of 'to say' — using it shows high cultural competence." },
      { phrase: "これは諸刃の剣です — メリットもデメリットもあります。", romanization: "Kore wa moroha no tsurugi desu", meaning: "This is a double-edged sword — there are merits and demerits", tip: "'諸刃の剣' (both-edged sword) is the classical Japanese expression — literary and impressive." },
      { phrase: "猫に小判とはまさにこのことで、彼には早すぎる情報だったようです。", romanization: "Neko ni koban to wa masa ni kono koto de", meaning: "It's truly 'gold coins for a cat' — the information was too advanced for him", tip: "Using 'まさに〜とはこのこと' to apply an idiom is an advanced native-speaker construction." },
      { phrase: "この件では一石二鳥を狙えると思います。", romanization: "Kono ken de wa isseki nichou wo nereru to omoimasu", meaning: "I think we can aim for one stone, two birds in this matter", tip: "'一石二鳥' (isseki nichou) is the Japanese version — exactly the same image as English." },
      { phrase: "私の考えでは、言語を学ぶことは単に文法を超えた、人と人の繋がりについてのことだと思います。", romanization: "Watashi no kangae de wa...", meaning: "In my thinking, learning a language is about human connection beyond mere grammar", tip: "'私の考えでは' (in my thinking) is sophisticated — more nuanced than 'と思います' alone." }
    ]
  },

  Korean: {
    beginner: [
      { phrase: "안녕하세요", romanization: "An-nyeong-ha-se-yo", meaning: "Hello (formal)", tip: "Casual with friends: 안녕 (annyeong). Always use the formal form with strangers." },
      { phrase: "감사합니다", romanization: "Gam-sa-ham-ni-da", meaning: "Thank you (formal)", tip: "Casual: 고마워요 (gomawoyo). Both are safe for learners." },
      { phrase: "네 / 아니요", romanization: "Ne / A-ni-yo", meaning: "Yes / No", tip: "'네' (ne) also functions as 'I see' or 'understood' in conversation." },
      { phrase: "물 주세요", romanization: "Mul ju-se-yo", meaning: "Please give me water", tip: "Put any food/drink before 주세요: 커피 주세요 (coffee, please)." },
      { phrase: "어디예요?", romanization: "Eo-di-e-yo?", meaning: "Where is it?", tip: "Put the place name first: 화장실이 어디예요? (Where is the bathroom?)" }
    ],
    some: [
      { phrase: "좀 천천히 말씀해 주실 수 있으세요?", romanization: "Jom cheon-cheon-hi mal-sseum-hae ju-sil su i-sseu-se-yo?", meaning: "Could you please speak a little more slowly?", tip: "'말씀해 주시다' is the honorific request form — Koreans will greatly appreciate it." },
      { phrase: "두 명이 앉을 테이블이 있으세요?", romanization: "Du myeong-i an-jeul te-i-beul-i i-sseu-se-yo?", meaning: "Do you have a table for two people?", tip: "'명' (myeong) is the counter for people — essential for any restaurant scenario." },
      { phrase: "시내 중심가에 어떻게 가면 돼요?", romanization: "Si-nae jung-sim-ga-e eo-tteo-ke ga-myeon dwae-yo?", meaning: "How do I get to the city center?", tip: "'어떻게 하면 돼요?' (how should I do it?) is a very natural Korean question structure." },
      { phrase: "뭘 추천해 주실 수 있으세요?", romanization: "Mwol chu-cheon-hae ju-sil su i-sseu-se-yo?", meaning: "What can you recommend?", tip: "'추천하다' (to recommend) is the key verb for recommendation requests." },
      { phrase: "[기간] 동안 한국어를 공부하고 있어요.", romanization: "[gi-gan] dong-an Han-gu-geo-reul gong-bu-ha-go i-sseo-yo", meaning: "I've been studying Korean for [time]", tip: "'-고 있다' is the Korean present progressive — similar to English '-ing' form." }
    ],
    intermediate: [
      { phrase: "말씀하시는 점은 이해하지만, 저는 개인적으로 〜라고 생각해요.", romanization: "Mal-sseum-ha-si-neun jeom-eun i-hae-ha-ji-man...", meaning: "I understand the point you're making, but I personally think that...", tip: "'말씀하시는' uses the honorific — pairing respect with gentle disagreement is the Korean way." },
      { phrase: "이건 양날의 검이에요 — 장점과 단점이 모두 있죠.", romanization: "I-geon yang-nal-eui geom-i-e-yo", meaning: "This is a double-edged sword — there are both merits and demerits", tip: "'양날의 검' (two-bladed sword) is the direct Korean equivalent — very common in debates." },
      { phrase: "하늘의 별 따기만큼 어렵지만, 불가능한 건 아니에요.", romanization: "Ha-neul-eui byeol tta-gi-man-keum eo-ryeop-ji-man...", meaning: "It's as difficult as picking stars from the sky, but it's not impossible", tip: "Extending an idiom with 'but it's not impossible' shows nuanced optimism." },
      { phrase: "이 프로젝트에서는 일석이조를 노려볼 수 있을 것 같아요.", romanization: "I peu-ro-jek-teu-e-seo-neun il-seok-i-jo-reul no-ryeo-bol su i-sseul geot ga-ta-yo", meaning: "In this project, I think we can aim for killing two birds with one stone", tip: "'일석이조' (one stone, two birds) is the Korean-Sino expression equivalent to the English idiom." },
      { phrase: "제 생각엔, 언어를 배우는 건 단순히 문법을 넘어 사람 간의 연결에 관한 거예요.", romanization: "Je saeng-gak-en, eon-eo-reul bae-u-neun geon...", meaning: "In my view, learning a language is about human connection beyond mere grammar", tip: "'제 생각엔' (in my thinking) is a natural, humble way to open a personal opinion in Korean." }
    ]
  },

  Chinese: {
    beginner: [
      { phrase: "你好", romanization: "Nǐ hǎo", meaning: "Hello", tip: "The tones matter: nǐ (falling-rising), hǎo (falling-rising). Practice them!" },
      { phrase: "谢谢", romanization: "Xiè xie", meaning: "Thank you", tip: "Said with a slight bow of the head — a simple, gracious gesture." },
      { phrase: "是的 / 不", romanization: "Shì de / Bù", meaning: "Yes / No", tip: "'不' (bù) changes to 'bú' before another 4th tone word — tones shift!" },
      { phrase: "我要水", romanization: "Wǒ yào shuǐ", meaning: "I want water", tip: "Swap 水 (shuǐ) for 茶 (chá-tea) or 咖啡 (kāfēi-coffee)." },
      { phrase: "在哪里?", romanization: "Zài nǎlǐ?", meaning: "Where is it?", tip: "Put the subject first: 地铁站在哪里? (Where is the subway station?)" }
    ],
    some: [
      { phrase: "您能说慢一点吗？", romanization: "Nín néng shuō màn yī diǎn ma?", meaning: "Could you speak a little more slowly?", tip: "Using '您' (nín) instead of '你' (nǐ) shows respect — appreciated by all Chinese speakers." },
      { phrase: "请问有两个人的桌子吗？", romanization: "Qǐngwèn yǒu liǎng gè rén de zhuōzi ma?", meaning: "Excuse me, do you have a table for two?", tip: "'请问' (qǐngwèn - may I ask) is the polite opener for any request in Chinese." },
      { phrase: "请问怎么去市中心？", romanization: "Qǐngwèn zěnme qù shì zhōngxīn?", meaning: "Excuse me, how do I get to the city center?", tip: "'怎么去' (how to go) + any destination = instant directions question." },
      { phrase: "您有什么推荐吗？", romanization: "Nín yǒu shénme tuījiàn ma?", meaning: "Do you have any recommendations?", tip: "'推荐' (tuījiàn - recommend) is the key word — works for food, tourist spots, anything." },
      { phrase: "我学中文已经[时间]了。", romanization: "Wǒ xué Zhōngwén yǐjīng [shíjiān] le.", meaning: "I've been studying Chinese for [time] already", tip: "'已经...了' (already...now) frames ongoing duration naturally in Mandarin." }
    ],
    intermediate: [
      { phrase: "我理解您的观点，但我个人认为…", romanization: "Wǒ lǐjiě nín de guāndiǎn, dàn wǒ gèrén rènwéi...", meaning: "I understand your viewpoint, but I personally believe...", tip: "'我个人认为' (I personally believe) is the sophisticated Chinese opinion opener in debate." },
      { phrase: "这是一把双刃剑——有利也有弊。", romanization: "Zhè shì yī bǎ shuāng rèn jiàn", meaning: "This is a double-edged sword — it has both benefits and drawbacks", tip: "'双刃剑' (double-edged sword) is the identical metaphor — very common in Chinese discourse." },
      { phrase: "半途而废是最可惜的——只要坚持就会成功。", romanization: "Bàn tú ér fèi shì zuì kěxī de", meaning: "Giving up halfway is the greatest pity — as long as you persist you will succeed", tip: "'半途而废' in a real sentence shows you understand how to use idioms as complete thoughts." },
      { phrase: "在这个项目上，我们可以一石二鸟，同时解决两个问题。", romanization: "Wǒmen kěyǐ yī shí èr niǎo", meaning: "We can kill two birds with one stone and solve two problems simultaneously", tip: "'一石二鸟' followed by 'simultaneously solve two problems' is how educated speakers use idioms — with explanation." },
      { phrase: "在我看来，学习语言不仅仅是语法，更是关于人与人之间的联系。", romanization: "Zài wǒ kàn lái...", meaning: "In my view, learning a language is not just grammar but more about connection between people", tip: "'在我看来' (in my view) is the standard essay/debate opinion opener in Chinese." }
    ]
  },

  Arabic: {
    beginner: [
      { phrase: "مرحبا", romanization: "Mar-ha-ba", meaning: "Hello", tip: "Works across all Arabic dialects — a safe universal greeting." },
      { phrase: "شكرا", romanization: "Shuk-ran", meaning: "Thank you", tip: "Add 'جزيلا' (jazeelan) for 'thank you very much'." },
      { phrase: "نعم / لا", romanization: "Na'am / La", meaning: "Yes / No", tip: "'نعم' is formal; in conversation you'll often hear 'آه' (aah) or 'أيوا' (aywa) for yes." },
      { phrase: "أريد ماء", romanization: "U-reed maa'", meaning: "I want water", tip: "Swap ماء for قهوة (qahwa-coffee) or شاي (shaay-tea)." },
      { phrase: "أين...؟", romanization: "Ay-na?", meaning: "Where is...?", tip: "Arabic reads right to left — أين goes first, then the place." }
    ],
    some: [
      { phrase: "هل يمكنك التحدث ببطء أكثر من فضلك؟", romanization: "Hal yumkinuka al-tahaduth bi-but' akthar min fadlak?", meaning: "Can you speak more slowly please?", tip: "MSA (Modern Standard Arabic) — understood across all regions." },
      { phrase: "أريد طاولة لشخصين من فضلك.", romanization: "Ureed taawila li-shakhsayn min fadlak.", meaning: "I want a table for two, please", tip: "'طاولة' (taawila) = table. 'لشخصين' = for two people (dual form)." },
      { phrase: "كيف أذهب إلى وسط المدينة؟", romanization: "Kayfa adhabu ila wasat al-madina?", meaning: "How do I go to the city center?", tip: "'وسط' (wasat) = center/middle. Extremely useful word across all contexts." },
      { phrase: "ماذا توصي؟", romanization: "Maadha toosee?", meaning: "What do you recommend?", tip: "'أوصي' (to recommend) — add 'بـ' before what you recommend: أوصي بالكفتة." },
      { phrase: "أتعلم العربية منذ [مدة].", romanization: "Ata'allam al-'arabiyya mundhu [mudda].", meaning: "I've been learning Arabic for [time]", tip: "'منذ' (mundhu - since/for) + present tense expresses ongoing learning in Arabic." }
    ],
    intermediate: [
      { phrase: "أفهم وجهة نظرك، لكنني أرى أن...", romanization: "Afham wujhat nadharak, lakinnani ara ann...", meaning: "I understand your point of view, but I see that...", tip: "'وجهة نظر' (wujhat nadhar) = point of view — a very common expression in Arabic debate." },
      { phrase: "هذا سيف ذو حدين — له مزايا وعيوب.", romanization: "Hadha sayf dhu haddayn", meaning: "This is a double-edged sword — it has advantages and disadvantages", tip: "'سيف ذو حدين' (a sword with two edges) is the direct Arabic equivalent — used in formal discourse." },
      { phrase: "الصبر مفتاح الفرج — وهذا ما يثبت صحة هذا القول.", romanization: "Al-sabr miftah al-faraj", meaning: "Patience is the key to relief — and this proves the truth of this saying", tip: "Applying a proverb with '...وهذا ما يثبت' (and this proves) shows advanced Arabic rhetorical skill." },
      { phrase: "في هذا المشروع يمكننا أن نقتل عصفورين بحجر واحد.", romanization: "Naqtil 'usfurayn bi-hajar waahid", meaning: "In this project we can kill two birds with one stone", tip: "'عصفورين بحجر واحد' — two small birds with one stone. Arabic imagery for the universal idiom." },
      { phrase: "في رأيي، تعلم اللغة يتجاوز قواعد النحو — إنه يتعلق بالتواصل الإنساني.", romanization: "Fi ra'yi...", meaning: "In my opinion, learning a language goes beyond grammar rules — it's about human communication", tip: "'في رأيي' (in my opinion) is the standard educated Arabic opinion opener." }
    ]
  },

  Russian: {
    beginner: [
      { phrase: "Привет", romanization: "Pri-VYET", meaning: "Hello (informal)", tip: "Formal: Здравствуйте (ZDRAH-stvuy-tyeh). Use Привет with friends, formal with strangers." },
      { phrase: "Спасибо", romanization: "Spa-SEE-bah", meaning: "Thank you", tip: "Add 'большое' (bal-SHOH-yeh) for 'thank you very much'." },
      { phrase: "Да / Нет", romanization: "Da / Nyet", meaning: "Yes / No", tip: "'Да' (da) = yes — the most recognizable Russian word worldwide." },
      { phrase: "Мне нужна вода", romanization: "Mnye nuzh-NAH va-DAH", meaning: "I need water", tip: "Swap вода for кофе (KO-fyeh) or чай (chai - tea)." },
      { phrase: "Где находится...?", romanization: "Gdye na-KHO-dit-sya?", meaning: "Where is...?", tip: "Add any place: Где находится метро? (Where is the metro?)" }
    ],
    some: [
      { phrase: "Не могли бы вы говорить помедленнее, пожалуйста?", romanization: "Nye mog-LEE by vy go-vo-REET' po-MED-lyen-nyeh-yeh?", meaning: "Could you speak more slowly, please?", tip: "The conditional 'не могли бы' is ultra-polite — Russians will respect you for using it." },
      { phrase: "Можно столик на двоих, пожалуйста?", romanization: "MOZH-no STO-lik na dva-IKH?", meaning: "A table for two, please?", tip: "'Можно + noun' is the efficient Russian way to request anything — no elaborate conjugation needed." },
      { phrase: "Как добраться до центра города?", romanization: "Kak dab-RAT'-sya do TSEN-tra GO-ro-da?", meaning: "How do I get to the city center?", tip: "'Добраться' (to get to/reach) is the key verb for navigation questions." },
      { phrase: "Что вы рекомендуете?", romanization: "Shto vy rye-ko-myen-DOO-ye-tye?", meaning: "What do you recommend?", tip: "Using formal 'вы' with staff is proper Russian etiquette." },
      { phrase: "Я учу русский уже [время].", romanization: "Ya u-CHOO ROOS-kiy u-ZHEH [VRYE-mya].", meaning: "I've been learning Russian for [time] already", tip: "'Уже' (already) adds the natural sense of ongoing effort — Russians use it constantly." }
    ],
    intermediate: [
      { phrase: "Я понимаю вашу точку зрения, но я бы сказал, что...", romanization: "Ya po-ni-MA-yu VA-shu TOCH-ku ZRYE-ni-ya, no ya by ska-ZAL, chto...", meaning: "I understand your point of view, but I would say that...", tip: "'Я бы сказал' (I would say) is the conditional for polite, measured opinion — very sophisticated." },
      { phrase: "Это обоюдоострое оружие — у него есть плюсы и минусы.", romanization: "Eto o-bo-yu-do-OS-troye o-RU-zhiye", meaning: "This is a double-edged weapon — it has pluses and minuses", tip: "'Обоюдоострое оружие' (double-sharp weapon) is the literary Russian equivalent of the idiom." },
      { phrase: "Утро вечера мудренее — давай примем решение завтра.", romanization: "Utro veche-ra mudrenee", meaning: "Morning is wiser than evening — let's make the decision tomorrow", tip: "This proverb used in context shows you understand Russian folk wisdom applied to real life." },
      { phrase: "В этом проекте мы можем убить двух зайцев одним выстрелом.", romanization: "Ubit' dvukh zay-tsev od-nim vys-tre-lom", meaning: "In this project we can kill two hares with one shot", tip: "Russian uses 'зайцев' (hares) not birds — and 'выстрел' (shot) not stone. Notice the cultural specifics!" },
      { phrase: "На мой взгляд, изучение языка выходит за рамки грамматики — это о человеческом общении.", romanization: "Na moy vzglyad...", meaning: "In my view, language learning goes beyond grammar — it's about human communication", tip: "'На мой взгляд' (in my view/from my gaze) is the elegant, literary opinion opener in Russian." }
    ]
  },

  Dutch: {
    beginner: [
      { phrase: "Hallo", romanization: "HA-loh", meaning: "Hello", tip: "Also common: Hoi (hoy) — informal and very friendly." },
      { phrase: "Dank je wel", romanization: "DAHN-k yuh vel", meaning: "Thank you", tip: "Formal: Dank u wel. Casual: Bedankt (buh-DAHNKT)." },
      { phrase: "Ja / Nee", romanization: "yah / nay", meaning: "Yes / No", tip: "Dutch 'Nee' sounds like the English word 'nay'." },
      { phrase: "Ik wil water", romanization: "ik vil VAH-ter", meaning: "I want water", tip: "Polite: 'Ik wil graag water' (graag = gladly, please)." },
      { phrase: "Waar is...?", romanization: "vaar is", meaning: "Where is...?", tip: "Add any place: Waar is het toilet? Waar is de trein?" }
    ],
    some: [
      { phrase: "Kunt u alstublieft langzamer spreken?", romanization: "KUNT ew ALS-too-bleeft LAHNG-zah-mer SPRAY-ken?", meaning: "Could you please speak more slowly?", tip: "'Alstublieft' (formal please) vs 'alsjeblieft' (informal) — master this distinction." },
      { phrase: "Ik zou graag een tafel voor twee willen, alsjeblieft.", romanization: "ik zow grahg en TAH-fel voor tvay", meaning: "I'd like a table for two, please", tip: "'Zou graag willen' is the Dutch polite conditional — the key to gracious requests." },
      { phrase: "Hoe kom ik bij het stadscentrum?", romanization: "hoo kom ik bij het STATS-sen-trum?", meaning: "How do I get to the city center?", tip: "'Hoe kom ik bij' (how do I get to) + destination = complete navigation question." },
      { phrase: "Wat kunt u aanbevelen?", romanization: "vat KUNT ew AHN-buh-VAY-len?", meaning: "What can you recommend?", tip: "'Aanbevelen' (to recommend) — the formal verb for professional recommendations." },
      { phrase: "Ik leer al [tijd] Nederlands.", romanization: "ik layr ahl [tijd] NAY-der-lahnts", meaning: "I've already been learning Dutch for [time]", tip: "'Al' (already) adds the natural sense of ongoing effort and achievement." }
    ],
    intermediate: [
      { phrase: "Ik begrijp je standpunt, maar ik zou zeggen dat...", romanization: "", meaning: "I understand your standpoint, but I would say that...", tip: "'Ik zou zeggen' (I would say) — Dutch conditional for measured, thoughtful opinions." },
      { phrase: "Het is een tweesnijdend zwaard — er zijn voor- en nadelen.", romanization: "", meaning: "It's a two-cutting sword — there are pros and cons", tip: "'Tweesnijdend zwaard' is the exact Dutch equivalent — used in formal and journalistic Dutch." },
      { phrase: "Nu komt de aap uit de mouw — dit was zijn echte intentie.", romanization: "", meaning: "Now the monkey comes out of the sleeve — this was his true intention", tip: "One of the most beloved Dutch idioms — using it in context is very impressive." },
      { phrase: "Met dit project kunnen we twee vliegen in één klap slaan.", romanization: "", meaning: "With this project we can hit two flies with one swat", tip: "Dutch uses 'vliegen in één klap slaan' (flies in one blow) — same concept as kill two birds." },
      { phrase: "Naar mijn mening gaat taal leren verder dan grammatica — het gaat om menselijke verbinding.", romanization: "", meaning: "In my opinion, language learning goes beyond grammar — it's about human connection", tip: "'Naar mijn mening' (in my opinion) is the standard Dutch educated opinion opener." }
    ]
  },

  Turkish: {
    beginner: [
      { phrase: "Merhaba", romanization: "MEHR-hah-bah", meaning: "Hello", tip: "Casual: Selam (seh-LAHM). Both are widely used and friendly." },
      { phrase: "Teşekkür ederim", romanization: "teh-shek-KYUR eh-deh-REEM", meaning: "Thank you (formal)", tip: "Casual: Sağ ol (sah OL). Very common in everyday speech." },
      { phrase: "Evet / Hayır", romanization: "eh-VET / HA-yuhr", meaning: "Yes / No", tip: "The 'ı' in Hayır is a unique Turkish sound — like a short, unrounded 'u'." },
      { phrase: "Su istiyorum", romanization: "SOO ees-tee-YOH-room", meaning: "I want water", tip: "Swap 'su' for 'kahve' (coffee) or 'çay' (chai - Turkish tea)." },
      { phrase: "Nerede?", romanization: "NEH-reh-deh?", meaning: "Where is it?", tip: "Add the place: Metro nerede? Tuvalet nerede?" }
    ],
    some: [
      { phrase: "Daha yavaş konuşabilir misiniz lütfen?", romanization: "DA-ha ya-VASH ko-nu-SHA-bi-lir mi-si-NIZ?", meaning: "Could you speak more slowly please?", tip: "The '-abilir misiniz' suffix is the Turkish polite request — very versatile." },
      { phrase: "İki kişilik bir masa istiyorum lütfen.", romanization: "ee-KEE kee-shee-LIK bir MA-sah", meaning: "I'd like a table for two please", tip: "'-lik' is a suffix meaning 'for/of capacity' — very productive in Turkish." },
      { phrase: "Şehir merkezine nasıl gidebilirim?", romanization: "sheh-HEER mehr-keh-ZEE-neh NA-suhl", meaning: "How can I get to the city center?", tip: "'-e/-a' is the dative case suffix showing direction — 'to' in English." },
      { phrase: "Ne tavsiye edersiniz?", romanization: "neh tav-see-YEH eh-dehr-si-NEEZ?", meaning: "What do you recommend?", tip: "'Tavsiye etmek' (to recommend/advise) — the standard Turkish recommendation verb." },
      { phrase: "[Süre]dir Türkçe öğreniyorum.", romanization: "[süre]-dir TYURK-cheh uh-RHEN-ee-YOR-um", meaning: "I've been learning Turkish for [time]", tip: "'-dır/-dir' expressing duration is a Turkish grammatical gem — distinct from European languages." }
    ],
    intermediate: [
      { phrase: "Bakış açınızı anlıyorum, ancak şunu söyleyebilirim ki...", romanization: "ba-KUSH a-CHUH-nuh-zuh an-LUH-yo-rum...", meaning: "I understand your point of view, but I can say that...", tip: "'Bakış açısı' (point of view/angle of gaze) is an elegant Turkish expression for perspective." },
      { phrase: "Bu iki ucu keskin bir bıçak — avantajları ve dezavantajları var.", romanization: "iki ucu keskin bir bıçak", meaning: "This is a knife sharp on both ends — there are advantages and disadvantages", tip: "Turkish uses 'knife sharp on both ends' instead of sword — a distinct cultural metaphor." },
      { phrase: "Damlaya damlaya göl olur — sabırla her şey mümkün.", romanization: "dam-LA-ya dam-LA-ya gol o-LUR", meaning: "Drop by drop a lake forms — with patience everything is possible", tip: "Extending a proverb with your own commentary is the hallmark of fluent Turkish." },
      { phrase: "Bu projede tek taşla iki kuş vurabilir miyiz?", romanization: "tek TASH-la ee-kee KOOSH voo-RA-bi-lir mi-YIZ?", meaning: "Can we hit two birds with one stone in this project?", tip: "Turkish uses the same 'stone and birds' image — but as a question, showing you're thinking collaboratively." },
      { phrase: "Benim için dil öğrenmek gramerin çok ötesine geçiyor — insanlar arasındaki bağlantıyla ilgili.", romanization: "benim için dil ögre-nmek...", meaning: "For me, language learning goes far beyond grammar — it's about connection between people", tip: "'Çok ötesine geçmek' (to go far beyond) is a sophisticated Turkish construction for transcending limits." }
    ]
  },

  Swedish: {
    beginner: [
      { phrase: "Hej", romanization: "hey", meaning: "Hello (very common)", tip: "Sounds exactly like English 'hey'. The most natural Swedish greeting." },
      { phrase: "Tack", romanization: "tahk", meaning: "Thank you", tip: "'Tack så mycket' (tahk soh MU-keh) = thank you very much." },
      { phrase: "Ja / Nej", romanization: "yah / nay", meaning: "Yes / No", tip: "'Ja' sounds like 'yah'. 'Nej' sounds like 'nay'." },
      { phrase: "Jag vill ha vatten", romanization: "yag vil ha VAT-en", meaning: "I want water", tip: "Swap 'vatten' for 'kaffe' or 'te' to order drinks." },
      { phrase: "Var är...?", romanization: "var air?", meaning: "Where is...?", tip: "Add any place: Var är hotellet? Var är tunnelbanan?" }
    ],
    some: [
      { phrase: "Kan du tala lite långsammare, tack?", romanization: "kan doo TAH-la LEE-teh LONG-sam-ah-reh", meaning: "Can you speak a little more slowly, please?", tip: "Swedes appreciate directness — this request is completely natural and expected." },
      { phrase: "Jag skulle vilja ha ett bord för två, tack.", romanization: "yag SKUL-leh VIL-yah hah", meaning: "I'd like a table for two, please", tip: "'Skulle vilja ha' is the polite conditional Swedish uses for all requests." },
      { phrase: "Hur tar jag mig till stadskärnan?", romanization: "HOOR tar yag may til STATS-shair-nan?", meaning: "How do I get to the city center?", tip: "'Stadskärnan' (city core/center) — 'kärna' means core or kernel." },
      { phrase: "Vad rekommenderar du?", romanization: "vahd reh-ko-men-DEH-rar doo?", meaning: "What do you recommend?", tip: "Swedish uses the informal 'du' even in many service settings — it's standard Swedish directness." },
      { phrase: "Jag har lärt mig svenska i [tid].", romanization: "yag har lairt may SVEN-ska ee...", meaning: "I've been learning Swedish for [time]", tip: "'Har lärt mig' (present perfect) is used where English uses present continuous for duration." }
    ],
    intermediate: [
      { phrase: "Jag förstår din synpunkt, men jag skulle säga att...", romanization: "", meaning: "I understand your viewpoint, but I would say that...", tip: "'Synpunkt' (view-point) is the standard Swedish word — 'syn' means sight/view." },
      { phrase: "Det är ett tveeggat svärd — det finns fördelar och nackdelar.", romanization: "", meaning: "It's a double-edged sword — there are advantages and disadvantages", tip: "'Tveeggat svärd' (two-edged sword) is the Swedish equivalent — used in formal debate." },
      { phrase: "Ingen ko på isen — det löser sig säkert.", romanization: "", meaning: "No cow on the ice — it will certainly work out", tip: "One of the most charming Swedish idioms meaning 'no worries' — impress Swedes by using it." },
      { phrase: "I det här projektet kan vi slå två flugor i en smäll.", romanization: "", meaning: "In this project we can hit two flies with one swat", tip: "Swedish uses 'flugor' (flies) like German — same imagery as the Dutch version." },
      { phrase: "Enligt mig handlar språkinlärning om mer än grammatik — det handlar om mänsklig kontakt.", romanization: "", meaning: "According to me, language learning is about more than grammar — it's about human contact", tip: "'Enligt mig' (according to me) is the natural Swedish educated opinion opener." }
    ]
  },

  Greek: {
    beginner: [
      { phrase: "Γεια σου", romanization: "YAH soo", meaning: "Hello/Bye (informal)", tip: "Works for both hello and goodbye — just like Italian 'ciao'. For formal: Γεια σας (YAH sas)." },
      { phrase: "Ευχαριστώ", romanization: "ef-kha-ri-STOH", meaning: "Thank you", tip: "Add 'πολύ' (po-LEE) for 'thank you very much': Ευχαριστώ πολύ." },
      { phrase: "Ναι / Όχι", romanization: "neh / OH-khee", meaning: "Yes / No", tip: "Note: 'Ναι' (yes) sounds like 'nay' in English — don't confuse them!" },
      { phrase: "Θέλω νερό", romanization: "THEH-loh neh-ROH", meaning: "I want water", tip: "Swap 'νερό' for 'καφές' (ka-FES) or 'τσάι' (TSAHY - tea)." },
      { phrase: "Πού είναι;", romanization: "poo EE-neh?", meaning: "Where is it?", tip: "Add any place: Πού είναι το μετρό; (Where is the metro?)" }
    ],
    some: [
      { phrase: "Μπορείτε να μιλάτε πιο αργά, παρακαλώ;", romanization: "bo-REE-teh na mi-LA-teh pyoh ar-GAH?", meaning: "Can you please speak more slowly?", tip: "Using 'μπορείτε' (formal you can) shows respect — Greek people will appreciate it." },
      { phrase: "Θα ήθελα ένα τραπέζι για δύο, παρακαλώ.", romanization: "tha EE-theh-lah EH-na tra-PEH-zi yia DEE-oh", meaning: "I'd like a table for two, please", tip: "'Θα ήθελα' (conditional 'I would like') is the key polite request structure in Greek." },
      { phrase: "Πώς μπορώ να φτάσω στο κέντρο της πόλης;", romanization: "pohs bo-ROH na FTA-so sto KEN-tro?", meaning: "How can I get to the city center?", tip: "'Φτάνω' (to arrive/reach) is the key navigation verb in Greek." },
      { phrase: "Τι μου προτείνετε;", romanization: "ti moo pro-TEE-neh-teh?", meaning: "What do you recommend to me?", tip: "'Προτείνω' (to suggest/recommend) — the standard Greek word for recommendations." },
      { phrase: "Μαθαίνω ελληνικά εδώ και [χρόνο].", romanization: "ma-THEH-no el-li-ni-KA eh-DOH ke...", meaning: "I've been learning Greek for [time]", tip: "'Εδώ και' (since here) + time = the natural Greek way to express ongoing duration." }
    ],
    intermediate: [
      { phrase: "Καταλαβαίνω τη θέση σου, αλλά θα έλεγα ότι...", romanization: "kata-la-VEH-no ti THE-si soo, alla tha EH-le-ga oti...", meaning: "I understand your position, but I would say that...", tip: "'Θα έλεγα ότι' (I would say that) is the elegant Greek conditional opinion opener." },
      { phrase: "Είναι αμφίστομο μαχαίρι — έχει πλεονεκτήματα και μειονεκτήματα.", romanization: "EE-neh am-FI-sto-mo ma-KHEH-ri", meaning: "It's a double-mouthed knife — it has advantages and disadvantages", tip: "'Αμφίστομο μαχαίρι' (double-mouthed knife) is the formal Greek metaphor for the same concept." },
      { phrase: "Αγάπα με λίγο να σε αγαπώ πολύ — αυτό ισχύει και στις επαγγελματικές σχέσεις.", romanization: "a-GA-pa me LI-go na se a-ga-PO po-LI", meaning: "Love me a little so I love you a lot — this applies to professional relationships too", tip: "Applying a Greek proverb to a contemporary situation shows deep cultural fluency." },
      { phrase: "Σε αυτό το project, μπορούμε να σκοτώσουμε δύο πουλιά με μια πέτρα.", romanization: "bo-ROO-me na sko-TO-soo-meh DEE-oh poo-LYA me MIA PE-tra", meaning: "In this project, we can kill two birds with one stone", tip: "Greek uses the same birds-and-stone image — confirming it's a truly universal human metaphor." },
      { phrase: "Κατά τη γνώμη μου, η εκμάθηση γλωσσών ξεπερνά τη γραμματική — αφορά την ανθρώπινη σύνδεση.", romanization: "kata ti GNO-mi moo...", meaning: "In my opinion, language learning surpasses grammar — it concerns human connection", tip: "'Κατά τη γνώμη μου' (according to my opinion) is the formal, educated Greek opinion marker." }
    ]
  }
};


// ─────────────────────────────────────────────────────────────
// SECTION 4: DAILY MISSIONS
// Structured daily practice tasks per language / level / goal
// 7 missions = one per day of the week (rotating)
// ─────────────────────────────────────────────────────────────

const buildDailyMissions = (lang, level, goal) => {
  const missions = {
    beginner: {
      Travel: [
        { day: "Monday", mission: `Say the greeting in ${lang} 5 times out loud, then greet Myno to start your session.`, duration: "5 min", xp: 10 },
        { day: "Tuesday", mission: `Count from 1 to 5 in ${lang} and answer yes/no to Myno's simple questions.`, duration: "7 min", xp: 15 },
        { day: "Wednesday", mission: `Order 3 different items from Myno playing as a waiter using 'I want + food word'.`, duration: "8 min", xp: 20 },
        { day: "Thursday", mission: `Describe 3 objects' colors using the ${lang} color words you learned.`, duration: "7 min", xp: 15 },
        { day: "Friday", mission: `Tell Myno who you're traveling with using family/friend words in ${lang}.`, duration: "6 min", xp: 15 },
        { day: "Saturday", mission: `Ask 'Where is...?' for 3 different locations. Myno gives simple responses.`, duration: "8 min", xp: 20 },
        { day: "Sunday", mission: `Mini review: have a 5-exchange conversation using all words from this week.`, duration: "10 min", xp: 30 }
      ],
      Business: [
        { day: "Monday", mission: `Practice your professional greeting in ${lang} — introduce yourself to Myno.`, duration: "5 min", xp: 10 },
        { day: "Tuesday", mission: `Answer 5 yes/no business questions from Myno in ${lang}.`, duration: "7 min", xp: 15 },
        { day: "Wednesday", mission: `Introduce yourself with your name using the ${lang} introduction phrase.`, duration: "8 min", xp: 20 },
        { day: "Thursday", mission: `Count business numbers 1-5 and practice in a scenario with Myno.`, duration: "7 min", xp: 15 },
        { day: "Friday", mission: `Practice thank you and please in ${lang} in 3 different mini-scenarios.`, duration: "6 min", xp: 15 },
        { day: "Saturday", mission: `Use 'I want/need' to make 3 requests in a business context in ${lang}.`, duration: "8 min", xp: 20 },
        { day: "Sunday", mission: `Full mini business introduction: name + greeting + one relevant number in ${lang}.`, duration: "10 min", xp: 30 }
      ],
      Social: [
        { day: "Monday", mission: `Greet Myno like a new friend using the casual greeting in ${lang}.`, duration: "5 min", xp: 10 },
        { day: "Tuesday", mission: `Have a yes/no conversation about your likes: food, music, sports.`, duration: "7 min", xp: 15 },
        { day: "Wednesday", mission: `Tell Myno your 3 favorite foods using ${lang} food words.`, duration: "8 min", xp: 20 },
        { day: "Thursday", mission: `Describe 3 things you own using color words in ${lang}.`, duration: "7 min", xp: 15 },
        { day: "Friday", mission: `Introduce one family member or friend to Myno in ${lang}.`, duration: "6 min", xp: 15 },
        { day: "Saturday", mission: `Ask where 3 social venues are (café, park, cinema) in ${lang}.`, duration: "8 min", xp: 20 },
        { day: "Sunday", mission: `Have a 7-exchange social conversation using everything from this week.`, duration: "10 min", xp: 30 }
      ],
      Fun: [
        { day: "Monday", mission: `Learn both the formal and informal greeting in ${lang} — try them both on Myno.`, duration: "5 min", xp: 10 },
        { day: "Tuesday", mission: `React enthusiastically yes/no to Myno's fun hypothetical questions in ${lang}.`, duration: "7 min", xp: 15 },
        { day: "Wednesday", mission: `Rate 3 foods using ${lang} words — love it or hate it!`, duration: "8 min", xp: 20 },
        { day: "Thursday", mission: `Play the color game: guess what color Myno is describing.`, duration: "7 min", xp: 15 },
        { day: "Friday", mission: `Tell Myno about your best friend in 3-4 ${lang} words.`, duration: "6 min", xp: 15 },
        { day: "Saturday", mission: `Ask where to find the best food/music/fun spots in ${lang}.`, duration: "8 min", xp: 20 },
        { day: "Sunday", mission: `Free chat: use every word from this week in a natural, fun conversation.`, duration: "10 min", xp: 30 }
      ]
    },
    some: {
      Travel: [
        { day: "Monday", mission: `Give your full travel introduction to Myno — name, origin, purpose of trip in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Tuesday", mission: `Complete a full café ordering scenario: order, ask price, say thank you in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Wednesday", mission: `Ask for and understand directions to 2 different places in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Thursday", mission: `Simulate a market shopping scenario: negotiate a price in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Friday", mission: `Describe a city you've visited or want to visit in 5-6 sentences in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Saturday", mission: `Describe your travel day schedule using time expressions in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Sunday", mission: `Full simulated travel day conversation: hotel check-in + breakfast order + one navigation request.`, duration: "15 min", xp: 40 }
      ],
      Business: [
        { day: "Monday", mission: `Deliver a professional self-introduction (name, company, role) entirely in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Tuesday", mission: `Have a coffee meeting small talk exchange with Myno in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Wednesday", mission: `Practice asking for clarification and confirming understanding in a meeting scenario in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Thursday", mission: `Discuss a budget or financial figure using numbers and money language in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Friday", mission: `Describe a current work project in 5-6 sentences in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Saturday", mission: `Schedule a fictional meeting with Myno: propose 3 time options in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Sunday", mission: `Full mock business meeting: intro + project description + meeting scheduling in ${lang}.`, duration: "15 min", xp: 40 }
      ],
      Social: [
        { day: "Monday", mission: `Give a full personal introduction to Myno as a new friend in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Tuesday", mission: `Plan a café outing with Myno — order together and discuss preferences in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Wednesday", mission: `Plan an outing: suggest a place, ask directions, agree on a time in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Thursday", mission: `Go 'shopping' with Myno — give opinions on items, discuss prices in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Friday", mission: `Describe 3 people you know using descriptive language in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Saturday", mission: `Tell Myno about your typical weekend routine in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Sunday", mission: `Full party scenario: meet Myno as a new person, find common ground, make plans in ${lang}.`, duration: "15 min", xp: 40 }
      ],
      Fun: [
        { day: "Monday", mission: `Introduce yourself the way you'd do it to a cool new friend online in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Tuesday", mission: `Describe your favorite café/hangout in 5-6 expressive sentences in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Wednesday", mission: `Give Myno directions to a fun spot using local landmarks in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Thursday", mission: `React to 5 shopping items with emotional language — love it, hate it, obsessed, no way in ${lang}.`, duration: "12 min", xp: 30 },
        { day: "Friday", mission: `Describe your personality and aesthetic in 5 sentences in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Saturday", mission: `Tell Myno about your ideal fun weekend in ${lang}.`, duration: "10 min", xp: 25 },
        { day: "Sunday", mission: `Free fun conversation on any topic you love — entirely in ${lang}.`, duration: "15 min", xp: 40 }
      ]
    },
    intermediate: {
      Travel: [
        { day: "Monday", mission: `Debate: is over-tourism ruining travel culture? Full paragraph response in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Tuesday", mission: `Tell a detailed travel story in past tense — a trip that went wrong or beautifully right in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Wednesday", mission: `Navigate a complex travel-business scenario entirely in ${lang}: delayed flight, rebooking, professional impact.`, duration: "15 min", xp: 50 },
        { day: "Thursday", mission: `Describe the emotional journey of a trip — anticipation, arrival, culture shock, belonging in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Friday", mission: `Use all 3 of the ${lang} travel idioms in natural sentences within a 10-message conversation.`, duration: "15 min", xp: 50 },
        { day: "Saturday", mission: `Discuss cultural differences between your home country and a ${lang}-speaking country in depth.`, duration: "15 min", xp: 50 },
        { day: "Sunday", mission: `15-message full immersion: plan an entire complex trip exclusively in ${lang}.`, duration: "20 min", xp: 75 }
      ],
      Business: [
        { day: "Monday", mission: `Debate a business policy (remote work, AI, globalization) in formal ${lang} register.`, duration: "15 min", xp: 50 },
        { day: "Tuesday", mission: `Tell your professional story — career arc, key decisions, turning points — in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Wednesday", mission: `Conduct a price/terms negotiation with Myno as your counterpart in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Thursday", mission: `Give constructive feedback to a team member and navigate a difficult conversation in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Friday", mission: `Use the 3 business idioms in professional sentences in a meeting scenario in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Saturday", mission: `Discuss how business culture in a ${lang}-speaking country differs from yours.`, duration: "15 min", xp: 50 },
        { day: "Sunday", mission: `15-message full immersion business meeting — entirely in ${lang}.`, duration: "20 min", xp: 75 }
      ],
      Social: [
        { day: "Monday", mission: `Share a nuanced opinion on a social topic (relationships, city life, social media) in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Tuesday", mission: `Tell the story of your most meaningful friendship in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Wednesday", mission: `Role-play resolving a social misunderstanding with Myno in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Thursday", mission: `Express nuanced feelings about a personal experience in ${lang} — use 5 emotional vocabulary words.`, duration: "15 min", xp: 50 },
        { day: "Friday", mission: `Use the 3 social idioms in natural conversation about relationships in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Saturday", mission: `Discuss social norms in ${lang}-speaking culture that surprised or fascinated you.`, duration: "15 min", xp: 50 },
        { day: "Sunday", mission: `15-message immersion conversation on a topic you deeply care about — entirely in ${lang}.`, duration: "20 min", xp: 75 }
      ],
      Fun: [
        { day: "Monday", mission: `Give your hottest take on an overrated show, movie, or artist — in ${lang}, to Myno who disagrees.`, duration: "15 min", xp: 50 },
        { day: "Tuesday", mission: `Tell your funniest story entirely in ${lang} — Myno will react and ask follow-up questions.`, duration: "15 min", xp: 50 },
        { day: "Wednesday", mission: `Discuss your favorite TV show plot with theories and reactions in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Thursday", mission: `Rave about something you're obsessed with right now using emotional vocabulary in ${lang}.`, duration: "15 min", xp: 50 },
        { day: "Friday", mission: `Use the 3 ${lang} slang/internet expressions naturally in a casual conversation with Myno.`, duration: "15 min", xp: 50 },
        { day: "Saturday", mission: `Explore what makes ${lang}-speaking culture's humor unique — with examples.`, duration: "15 min", xp: 50 },
        { day: "Sunday", mission: `15-message free immersion conversation on anything fun — no rules, just language.`, duration: "20 min", xp: 75 }
      ]
    }
  };
  return missions[level]?.[goal] || missions.beginner.Travel;
};

export const DAILY_MISSIONS = {};
const allLanguages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Japanese", "Korean", "Chinese", "Arabic", "Russian", "Dutch", "Turkish", "Swedish", "Greek"];
const allLevels = ["beginner", "some", "intermediate"];
const allGoals = ["Travel", "Business", "Social", "Fun"];

for (const lang of allLanguages) {
  DAILY_MISSIONS[lang] = {};
  for (const level of allLevels) {
    DAILY_MISSIONS[lang][level] = {};
    for (const goal of allGoals) {
      DAILY_MISSIONS[lang][level][goal] = buildDailyMissions(lang, level, goal);
    }
  }
}


// ─────────────────────────────────────────────────────────────
// SECTION 5: UTILITY FUNCTIONS
// Public API for Myno app to consume the syllabus
// ─────────────────────────────────────────────────────────────

/**
 * Get today's mission based on day of week (0=Sunday, 1=Monday, etc.)
 * @param {string} language - Target language (e.g., "Spanish")
 * @param {string} level - "beginner" | "some" | "intermediate"
 * @param {string} goal - "Travel" | "Business" | "Social" | "Fun"
 * @returns {object} Today's mission object
 */
export function getTodayMission(language, level, goal) {
  const dayIndex = new Date().getDay(); // 0 = Sunday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[dayIndex];

  const missions = DAILY_MISSIONS[language]?.[level]?.[goal];
  if (!missions) return null;

  // Find mission matching today's day name, fallback to index
  const mission = missions.find(m => m.day === todayName) || missions[dayIndex % 7];
  return mission || null;
}

/**
 * Get the script type for a language
 * @param {string} language - Target language
 * @returns {string} Script name (e.g., "Latin", "Devanagari", "Arabic")
 */
export function getScriptForLanguage(language) {
  const scriptMap = {
    "Hindi": "Devanagari",
    "Japanese": "Hiragana/Kanji",
    "Korean": "Hangul",
    "Chinese": "Simplified Chinese",
    "Arabic": "Arabic",
    "Russian": "Cyrillic",
    "Greek": "Greek",
    "English": "Latin",
    "Spanish": "Latin",
    "French": "Latin",
    "German": "Latin",
    "Italian": "Latin",
    "Portuguese": "Latin",
    "Dutch": "Latin",
    "Turkish": "Latin",
    "Swedish": "Latin",
    "Urdu": "Nastaliq",
    "Tamil": "Tamil",
    "Bengali": "Bengali"
  };
  return scriptMap[language] || "Latin";
}

/**
 * Get the agent prompt for API calls with all 6 variables injected
 * @param {string} level - "beginner" | "some" | "intermediate"
 * @param {string} targetLanguage - The language being learned
 * @param {string} nativeLanguage - The learner's native language
 * @param {string} goal - "Travel" | "Business" | "Social" | "Fun"
 * @param {string[]} wordsIntroduced - Array of words already taught
 * @param {number} currentLevel - Progression level (1-6)
 * @returns {string} Fully interpolated agent prompt
 */
export function getAgentPrompt(level, targetLanguage, nativeLanguage, goal, wordsIntroduced = [], currentLevel = 1) {
  const style = CHAT_STYLES[level] || CHAT_STYLES.beginner;
  const template = style.agentPrompt || style;
  const script = getScriptForLanguage(targetLanguage);
  const wordsList = wordsIntroduced.join(", ") || "none";

  return template
    .replace(/\{targetLanguage\}/g, targetLanguage)
    .replace(/\{nativeLanguage\}/g, nativeLanguage)
    .replace(/\{script\}/g, script)
    .replace(/\{goal\}/g, goal)
    .replace(/\{wordsIntroduced\}/g, wordsList)
    .replace(/\{currentLevel\}/g, currentLevel.toString());
}

/**
 * Get the chat style system prompt, interpolated with specific language/goal details
 * @param {string} level - "beginner" | "some" | "intermediate"
 * @param {string} targetLanguage - The language being learned
 * @param {string} nativeLanguage - The learner's native language
 * @param {string} learningGoal - "Travel" | "Business" | "Social" | "Fun"
 * @returns {string} Interpolated system prompt (conversational format)
 */
export function getChatStyle(level, targetLanguage, nativeLanguage, learningGoal) {
  const style = CHAT_STYLES[level] || CHAT_STYLES.beginner;
  const template = style.conversational || style;
  return template
    .replace(/\{targetLanguage\}/g, targetLanguage)
    .replace(/\{nativeLanguage\}/g, nativeLanguage)
    .replace(/\{learningGoal\}/g, learningGoal);
}

/**
 * Get drills for a language and level
 * @param {string} language - Target language
 * @param {string} level - "beginner" | "some" | "intermediate"
 * @returns {Array} Array of 5 drill objects
 */
export function getDrills(language, level) {
  return DRILLS[language]?.[level] || DRILLS.English.beginner;
}

/**
 * Get the full 7-day Week 1 roadmap
 * @param {string} language - Target language
 * @param {string} level - "beginner" | "some" | "intermediate"
 * @param {string} goal - "Travel" | "Business" | "Social" | "Fun"
 * @returns {Array} Array of 7 day objects
 */
export function getWeekRoadmap(language, level, goal) {
  return WEEK1_ROADMAP[language]?.[level]?.[goal] || WEEK1_ROADMAP.English.beginner.Travel;
}

/**
 * Get a random drill sentence for quick practice
 * @param {string} language
 * @param {string} level
 * @returns {object} A single drill object
 */
export function getRandomDrill(language, level) {
  const drills = getDrills(language, level);
  return drills[Math.floor(Math.random() * drills.length)];
}

/**
 * Get the complete language metadata for a given language
 * @param {string} language
 * @returns {object} All roadmaps, drills, and missions for the language
 */
export function getLanguagePackage(language) {
  return {
    roadmaps: WEEK1_ROADMAP[language] || null,
    drills: DRILLS[language] || null,
    missions: DAILY_MISSIONS[language] || null
  };
}

/**
 * Get session configuration for a learner — combines chat style + today's mission + drills
 * @param {string} language - Target language
 * @param {string} level - Proficiency level
 * @param {string} goal - Learning goal
 * @param {string} nativeLanguage - Learner's native language
 * @returns {object} Complete session config
 */
export function getSessionConfig(language, level, goal, nativeLanguage = "English") {
  return {
    chatStyle: getChatStyle(level, language, nativeLanguage, goal),
    todayMission: getTodayMission(language, level, goal),
    drills: getDrills(language, level),
    weekRoadmap: getWeekRoadmap(language, level, goal),
    meta: {
      language,
      level,
      goal,
      nativeLanguage,
      generatedAt: new Date().toISOString()
    }
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 6: CONSTANTS AND METADATA
// ─────────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian",
  "Portuguese", "Hindi", "Japanese", "Korean", "Chinese",
  "Arabic", "Russian", "Dutch", "Turkish", "Swedish", "Greek"
];

export const SUPPORTED_LEVELS = ["beginner", "some", "intermediate"];

export const SUPPORTED_GOALS = ["Travel", "Business", "Social", "Fun"];

export const LEVEL_METADATA = {
  beginner: {
    label: "Complete Beginner",
    description: "I'm just starting out",
    cefr: "Pre-A1 to A1",
    nativeLangRatio: 80,
    targetLangRatio: 20,
    maxNewWordsPerSession: 5,
    maxSentenceLengthWords: 4,
    correctionPolicy: "None in first 5 messages. 1 correction max after.",
    sessionDuration: "10-15 min"
  },
  some: {
    label: "Know a Little",
    description: "I know basic words/phrases",
    cefr: "A1-A2",
    nativeLangRatio: 50,
    targetLangRatio: 50,
    maxNewWordsPerSession: 8,
    maxSentenceLengthWords: 8,
    correctionPolicy: "1 correction per message, with echo-extend technique",
    sessionDuration: "15-20 min"
  },
  intermediate: {
    label: "Intermediate+",
    description: "I can hold simple conversations",
    cefr: "B1+",
    nativeLangRatio: 20,
    targetLangRatio: 80,
    maxNewWordsPerSession: 15,
    maxSentenceLengthWords: null,
    correctionPolicy: "Direct recast corrections, 1-2 per message",
    sessionDuration: "20-30 min"
  }
};

export const GOAL_METADATA = {
  Travel: {
    label: "Travel",
    icon: "✈️",
    description: "Survive and thrive while traveling",
    primarySkills: ["greetings", "ordering food", "navigation", "shopping", "emergencies"]
  },
  Business: {
    label: "Business",
    icon: "💼",
    description: "Professional communication",
    primarySkills: ["introductions", "meetings", "negotiations", "emails", "small talk"]
  },
  Social: {
    label: "Social",
    icon: "👥",
    description: "Make friends and real connections",
    primarySkills: ["self-expression", "asking about others", "making plans", "emotions", "humor"]
  },
  Fun: {
    label: "Fun",
    icon: "🎉",
    description: "Enjoy media, culture and casual conversation",
    primarySkills: ["pop culture", "slang", "internet language", "humor", "entertainment"]
  }
};

export const NON_LATIN_SCRIPTS = ["Hindi", "Japanese", "Korean", "Chinese", "Arabic", "Russian", "Greek"];

export const ROMANIZATION_NOTE = "For languages with non-Latin scripts, Myno always provides: Native Script + (Romanization) + [meaning]. This is the i+1-compliant format for beginners.";

// ─────────────────────────────────────────────────────────────
// SPACED REPETITION ENGINE (lightweight)
// Tracks vocabulary exposure count within a session context
// Full SRS implementation lives in the backend; this is the
// session-level vocabulary manager
// ─────────────────────────────────────────────────────────────

export function createVocabTracker() {
  const tracker = new Map();

  return {
    /**
     * Record that a word was used in this session
     * @param {string} word
     */
    recordUsage(word) {
      const normalized = word.toLowerCase().trim();
      tracker.set(normalized, (tracker.get(normalized) || 0) + 1);
    },

    /**
     * Get how many times a word has been used this session
     * @param {string} word
     * @returns {number}
     */
    getCount(word) {
      return tracker.get(word.toLowerCase().trim()) || 0;
    },

    /**
     * Check if a word has been reinforced enough (5-7 times = "learned")
     * @param {string} word
     * @returns {"new"|"practicing"|"reinforced"|"learned"}
     */
    getStatus(word) {
      const count = this.getCount(word);
      if (count === 0) return "new";
      if (count < 3) return "practicing";
      if (count < 5) return "reinforced";
      return "learned";
    },

    /**
     * Get all words in the session with their counts
     * @returns {Array<{word: string, count: number, status: string}>}
     */
    getAllWords() {
      return Array.from(tracker.entries()).map(([word, count]) => ({
        word,
        count,
        status: this.getStatus(word)
      }));
    },

    /**
     * Get words that need more reinforcement (< 5 exposures)
     * @returns {string[]}
     */
    getWordsNeedingReinforcement() {
      return Array.from(tracker.entries())
        .filter(([, count]) => count < 5)
        .map(([word]) => word);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// AFFECTIVE FILTER HELPERS
// These help Myno maintain low anxiety / high encouragement
// ─────────────────────────────────────────────────────────────

export const ENCOURAGEMENT_PHRASES = {
  English: {
    correct: ["Amazing!", "You got it!", "Perfect!", "Yes! Exactly!", "Nailed it!", "That was flawless!"],
    attempt: ["Great try!", "You're getting there!", "So close!", "That's the spirit!", "Keep going!", "I love your effort!"],
    firstTime: ["Welcome! You're going to do great.", "I'm so glad you're here!", "This is your journey — enjoy every step.", "Every expert was once a beginner."],
    correction: ["Almost! Natives say it like this:", "You're so close — just a tiny tweak:", "Perfect thinking, just this small shift:"]
  }
};

// The system auto-generates affective phrases in the target language
// through the Gemini prompt — these English templates seed the system.

export const AFFECTIVE_RULES = {
  beginner: {
    correctionDelay: 5, // Don't correct until message 5
    maxCorrectionsPerMessage: 0, // After delay: 1
    maxCorrectionsAfterDelay: 1,
    requireEncouragementEveryMessage: true,
    reactionToAttempt: "always enthusiastic",
    vocabularyReuse: "every 3 messages"
  },
  some: {
    correctionDelay: 0,
    maxCorrectionsPerMessage: 1,
    correctionTechnique: "echo-extend",
    requireEncouragementEveryMessage: false,
    reactionToAttempt: "warm and specific",
    vocabularyReuse: "every 4 messages"
  },
  intermediate: {
    correctionDelay: 0,
    maxCorrectionsPerMessage: 2,
    correctionTechnique: "recast",
    requireEncouragementEveryMessage: false,
    reactionToAttempt: "intellectually engaged",
    vocabularyReuse: "organic/natural"
  }
};

// ─────────────────────────────────────────────────────────────
// DEFAULT EXPORT: Complete Syllabus Object
// ─────────────────────────────────────────────────────────────

export default {
  CHAT_STYLES,
  WEEK1_ROADMAP,
  DRILLS,
  DAILY_MISSIONS,
  LEVEL_METADATA,
  GOAL_METADATA,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LEVELS,
  SUPPORTED_GOALS,
  NON_LATIN_SCRIPTS,
  AFFECTIVE_RULES,
  ENCOURAGEMENT_PHRASES,
  getTodayMission,
  getChatStyle,
  getDrills,
  getWeekRoadmap,
  getRandomDrill,
  getLanguagePackage,
  getSessionConfig,
  createVocabTracker
};
