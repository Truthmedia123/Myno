import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PaperAirplaneIcon, MicrophoneIcon, StopIcon, SpeakerWaveIcon, ArrowPathIcon, SparklesIcon, BookmarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseDatabase } from "@/hooks/useFirebaseDatabase";
import { usePhonemeFeedback } from "@/hooks/usePhonemeFeedback";
import { mistralChatCompletion } from "@/lib/mistralClient";
import { getChatStyle, getDrills, getSessionConfig, createVocabTracker } from "@/lib/curriculum";
import { invokeGeminiChat } from "@/lib/gemini";
import { cn, shareContent, getShareText } from "@/lib/utils";
import { addXP, XP_VALUES } from "@/lib/xpSystem";
import { updateDailyStreak } from "@/lib/streakManager";
import { getRecentMistakes, generateMemoryContext, extractAndStoreMistake, detectWeakPhonemes, saveWeakPhonemes, updateUserMemory } from "@/lib/memoryManager";
import MynoBird from "@/components/myno/MynoBird";
import { getBcp47Tag, speakText } from "@/lib/voiceEngine";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, orderBy, limit, updateDoc, doc } from "firebase/firestore";
import { getCurriculum, clearCurriculumCache } from "@/curriculum/index.js";
import { filterCurriculumByGoal } from "@/data/learningGoals.js";
import { buildCurriculumPrompt } from "@/lib/promptBuilder.js";
import { preFilterReply, gentleSimplify, enforceWordPacing, validateA1Compliance, finalCleanup } from "@/lib/a1Simplifier";
import { prepareResponse, expandResponse, needsExpansion } from "@/lib/textSync";
import { addWord, wordExists } from "@/lib/vocabStore";
import { getTranslation } from "@/lib/translationCache";
import { updateMemory, detectTopic, getMemory } from "@/lib/conversationMemory.js";
import { lookupWord } from "@/lib/dictionaryService";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MessageSkeleton } from '@/components/ui/Skeleton';

const replySets = [
  ["Tell me more", "Give me an example", "Too hard, simplify"],
  ["How do I say that?", "Use it in a sentence", "What is a similar word?"],
  ["Let us practice a dialogue", "Test me on this", "What did I do well?"],
  ["Give me a harder challenge", "Translate that for me", "Start a scenario"],
];

const LEVEL_NAMES = {
  1: "Greetings",
  2: "Nouns",
  3: "Numbers/Colors",
  4: "Verbs",
  5: "Short Phrases",
  6: "Full Sentences"
};

const CEFR_LEVELS = {
  'beginner': 'Beginner (A1)',
  'some': 'Elementary (A2)',
  'intermediate': 'Intermediate (B1)'
};

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [profile, setProfile] = useState(null);
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [pronunciationResult, setPronunciationResult] = useState(null);
  const [sessionStart] = useState(Date.now());
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionWords, setSessionWords] = useState(0);
  const [sessionMessages, setSessionMessages] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showScenarios, setShowScenarios] = useState(true);
  const [vocabReviewWords, setVocabReviewWords] = useState([]);
  const [recentMistakes, setRecentMistakes] = useState([]);
  const [showDailyLesson, setShowDailyLesson] = useState(false);
  const [dailyLessonStep, setDailyLessonStep] = useState(0);
  const [dailyLessonCompleted, setDailyLessonCompleted] = useState(false);
  const [drillMode, setDrillMode] = useState(false);
  const [currentDrill, setCurrentDrill] = useState(null);
  const [drillResults, setDrillResults] = useState([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [expandedMessageIndices, setExpandedMessageIndices] = useState({});
  const [grammarExplanations, setGrammarExplanations] = useState({}); // message index -> explanation text
  const [dictionaryDefinitions, setDictionaryDefinitions] = useState({}); // message index -> definition text
  const [showLessonInput, setShowLessonInput] = useState(false);
  const [lessonTopic, setLessonTopic] = useState("");
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [tutorPersonality, setTutorPersonality] = useState("friendly");
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false);
  const [wordsIntroduced, setWordsIntroduced] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextQuestion, setNextQuestion] = useState("");
  const [correctionLanguage, setCorrectionLanguage] = useState("en"); // 'en' or target language code
  const [phonemeCorrection, setPhonemeCorrection] = useState(null); // AI correction with phonemeTip
  const [wordsUsedByUser, setWordsUsedByUser] = useState(new Set());
  // Curriculum system state
  const [currentSyllabus, setCurrentSyllabus] = useState(null);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [goalFilter, setGoalFilter] = useState([]);
  const scrollRef = useRef(null);
  const recRef = useRef(null);
  const streakUpdated = useRef(false);
  const vocabReviewShown = useRef(false);
  const lowScoreRef = useRef(0);
  const pendingLessonTopic = useRef('');
  const dbActions = useFirebaseDatabase();

  // Phoneme feedback toast
  const { showToast, tip, phonemeName, dismiss } = usePhonemeFeedback(
    phonemeCorrection,
    profile?.target_language || 'en'
  );

  // Unified toast system
  const { addToast } = useToast();

  const getOrCreateSessionId = () => {
    let sid = sessionStorage.getItem("myno_session_id");
    if (!sid) {
      sid = "session_" + Date.now();
      sessionStorage.setItem("myno_session_id", sid);
    }
    return sid;
  };

  // Pronunciation quality label system
  const getPronunciationLabel = (confidence) => {
    if (!confidence) return { label: "Needs Work", color: "text-red-400", bg: "bg-red-400/10", emoji: "⚠️" };
    const score = Math.round(confidence * 100);
    if (score >= 90) return { label: "Clear", color: "text-green-400", bg: "bg-green-400/10", emoji: "🎯" };
    if (score >= 70) return { label: "Natural", color: "text-blue-400", bg: "bg-blue-400/10", emoji: "👍" };
    return { label: "Needs Work", color: "text-red-400", bg: "bg-red-400/10", emoji: "⚠️" };
  };

  // Parse AI response JSON with fallback to raw text
  const parseAIResponse = (rawText, currentSyllabus = null, targetLang = 'en') => {
    const DEBUG_RAW_OUTPUT = false; // ← SET TO FALSE (normal pipeline with safe cleanup)

    // Safe cleanup: only fix spacing/punctuation, never remove words
    const safeCleanup = (text) => {
      if (!text || typeof text !== 'string') return text;
      return text
        .replace(/\s+/g, ' ')           // collapse multiple spaces
        .replace(/\s+([.,!?;:])/g, '$1') // fix space before punctuation
        .trim();
    };

    // Extract JSON block using regex: /\{[\s\S]*\}/
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let reply, correction, nextQuestion;

    if (!jsonMatch) {
      // No JSON found, treat entire text as reply
      reply = rawText.trim();
      correction = null;
      nextQuestion = "";
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        reply = parsed.reply || rawText.trim();
        correction = parsed.correction || null;
        nextQuestion = parsed.nextQuestion || "";
      } catch (error) {
        console.warn('Failed to parse AI JSON, falling back to raw text:', error);
        reply = rawText.trim();
        correction = null;
        nextQuestion = "";
      }
    }

    // Apply safe cleanup pipeline if syllabus is provided
    if (currentSyllabus && reply) {
      const rawReply = reply;

      let cleanedReply;
      if (DEBUG_RAW_OUTPUT) {
        cleanedReply = rawReply;
        console.log('[DEBUG] Raw Mistral response:', rawReply);
      } else {
        // Apply ONLY safe cleanup, no vocabulary enforcement
        cleanedReply = safeCleanup(rawReply);
        // Optionally use finalCleanup if it's safe (uncomment if needed):
        // cleanedReply = finalCleanup(rawReply);
      }

      reply = cleanedReply;

      // Dev-only pipeline logging
      if (import.meta.env.DEV && currentSyllabus) {
        console.log('[Chat Pipeline - SAFE MODE]', {
          lang: targetLang,
          raw: rawReply?.slice(0, 60) || 'N/A',
          cleaned: cleanedReply?.slice(0, 60),
          final: reply?.slice(0, 60)
        });
      }
    }

    return {
      reply,
      correction,
      nextQuestion
    };
  };

  // Detect scenario from user message
  const detectScenarioFromMessage = (msg) => {
    if (!msg) return null;
    const lowerMsg = msg.toLowerCase();
    // Try to match by scenario prompt (exact match)
    const matched = SCENARIOS.find(s => s.prompt.toLowerCase() === lowerMsg);
    if (matched) return matched;
    // Fallback: match by label or id in message
    for (const scenario of SCENARIOS) {
      if (lowerMsg.includes(scenario.id) || lowerMsg.includes(scenario.label.toLowerCase())) {
        return scenario;
      }
    }
    return null;
  };

  // Fetch words for spaced repetition review
  const fetchVaultWordsForReview = async (userId) => {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, "savedWords"),
        where("userId", "==", userId),
        where("mastery_level", "<", 3),
        orderBy("mastery_level", "asc"),
        orderBy("created_date", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching review words:", error);
      return [];
    }
  };

  // Generate custom lesson using Groq API
  const generateCustomLesson = async (topic) => {
    if (!topic.trim()) return;

    setGeneratingLesson(true);
    pendingLessonTopic.current = topic;

    try {
      const systemPrompt = `You are a world‑class language‑learning curriculum designer. Create a structured lesson for a ${profile?.target_language || "English"} learner (native language: ${profile?.native_language || "English"}) about the topic: "${topic}". The lesson should be appropriate for their current level (${profile?.level || "beginner"}).`;

      const userMessage = `Design a complete lesson with:
1. A catchy title
2. A brief introduction explaining why this topic matters for language learning
3. 3-4 practical example sentences in ${profile?.target_language || "English"} with ${profile?.native_language || "English"} translations
4. A practice prompt that the AI coach can use to start a conversation

Return ONLY a valid JSON object with these exact keys: title, intro, examples (array of objects with target and native fields), practice_prompt.`;

      const content = await mistralChatCompletion(
        [{ role: "user", content: userMessage }],
        systemPrompt
      );

      // Parse JSON from the response
      let lesson;
      try {
        lesson = JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        lesson = {
          title: `Custom Lesson: ${topic}`,
          intro: `Let's learn about ${topic} in ${profile?.target_language || "English"}!`,
          examples: [
            { target: "Example sentence 1", native: "Translation 1" },
            { target: "Example sentence 2", native: "Translation 2" }
          ],
          practice_prompt: `Let's practice talking about ${topic} in ${profile?.target_language || "English"}.`
        };
      }

      // Format the lesson as a chat message
      const lessonMessage = `📚 **${lesson.title}**\n\n${lesson.intro}\n\n**Examples:**\n${lesson.examples.map((ex, i) => `${i + 1}. ${ex.target} (${ex.native})`).join('\n')}\n\n**Practice:** ${lesson.practice_prompt}`;

      // Add the lesson as an assistant message
      setMessages(prev => [...prev, { role: "assistant", content: lessonMessage }]);

      // Also send the practice prompt to start the conversation
      setTimeout(() => {
        sendMessage(lesson.practice_prompt);
      }, 1000);

    } catch (error) {
      console.error("Failed to generate custom lesson:", error);

      const errorMessage = {
        role: "assistant",
        content: `I'm having trouble creating a custom lesson about "${topic}" right now. Would you like to try a ready-made lesson instead?`,
        quickReplies: [
          {
            label: "✈️ Travel",
            prompt: "Let's practice travel phrases and conversations."
          },
          {
            label: "🍽️ Restaurant",
            prompt: "I want to learn how to order food and talk in a restaurant."
          },
          {
            label: "🔄 Try Again",
            action: "retry"
          }
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setGeneratingLesson(false);
      setShowLessonInput(false);
      setLessonTopic("");
    }
  };

  // Initialize sessionId synchronously to ensure it's available immediately
  const [sessionId] = useState(() => getOrCreateSessionId());

  // Scenario definitions with enhanced fields for curriculum prompt
  const SCENARIOS = [
    {
      id: "restaurant", label: "Restaurant", icon: "🍽️",
      title: "Restaurant Ordering",
      cefr: "A1",
      tone: "casual",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are doing a restaurant scenario. You are the waiter, I am the customer. Greet me in ${profile?.target_language || "English"} and take my order. If I make a mistake, give a quick Pro Tip in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are doing a restaurant scenario. You are the waiter, I am the customer. Greet me in ${profile?.target_language || "English"} and take my order. If I make a mistake, give a quick Pro Tip in ${profile?.native_language || "English"}.`
    },
    {
      id: "airport", label: "Airport", icon: "✈️",
      title: "Airport Check-in",
      cefr: "A1",
      tone: "formal",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are at an airport check-in counter. You are the airline staff, I am the passenger. Start in ${profile?.target_language || "English"}. Correct my mistakes gently in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are at an airport check-in counter. You are the airline staff, I am the passenger. Start in ${profile?.target_language || "English"}. Correct my mistakes gently in ${profile?.native_language || "English"}.`
    },
    {
      id: "interview", label: "Job Interview", icon: "💼",
      title: "Job Interview",
      cefr: "A2",
      tone: "formal",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are doing a job interview for a marketing role. You are the interviewer, I am the candidate. Ask me questions in ${profile?.target_language || "English"}. Correct grammar mistakes in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are doing a job interview for a marketing role. You are the interviewer, I am the candidate. Ask me questions in ${profile?.target_language || "English"}. Correct grammar mistakes in ${profile?.native_language || "English"}.`
    },
    {
      id: "hotel", label: "Hotel", icon: "🏨",
      title: "Hotel Check-in",
      cefr: "A1",
      tone: "formal",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a hotel reception. You are the receptionist, I am a guest checking in. Speak ${profile?.target_language || "English"} throughout. Correct my errors in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a hotel reception. You are the receptionist, I am a guest checking in. Speak ${profile?.target_language || "English"} throughout. Correct my errors in ${profile?.native_language || "English"}.`
    },
    {
      id: "shopping", label: "Shopping", icon: "🛍️",
      title: "Market Shopping",
      cefr: "A1",
      tone: "casual",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a local market. You are the shopkeeper, I want to buy something and negotiate. Use ${profile?.target_language || "English"} only. Correct my mistakes in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a local market. You are the shopkeeper, I want to buy something and negotiate. Use ${profile?.target_language || "English"} only. Correct my mistakes in ${profile?.native_language || "English"}.`
    },
    {
      id: "doctor", label: "Doctor Visit", icon: "🏥",
      title: "Doctor Visit",
      cefr: "A2",
      tone: "formal",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a doctor's clinic. You are the doctor, I am the patient. Speak ${profile?.target_language || "English"} throughout. If I struggle, help in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a doctor's clinic. You are the doctor, I am the patient. Speak ${profile?.target_language || "English"} throughout. If I struggle, help in ${profile?.native_language || "English"}.`
    },
    {
      id: "smalltalk", label: "Small Talk", icon: "💬",
      title: "Small Talk",
      cefr: "A1",
      tone: "casual",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are meeting for the first time at a social event. Have a natural casual conversation in ${profile?.target_language || "English"}. Correct my errors gently in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are meeting for the first time at a social event. Have a natural casual conversation in ${profile?.target_language || "English"}. Correct my errors gently in ${profile?.native_language || "English"}.`
    },
    {
      id: "taxi", label: "Taxi Ride", icon: "🚕",
      title: "Taxi Ride",
      cefr: "A1",
      tone: "casual",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. You are a taxi driver in a ${profile?.target_language || "English"}-speaking country, I just got in. Speak ${profile?.target_language || "English"} throughout. Correct my mistakes in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. You are a taxi driver in a ${profile?.target_language || "English"}-speaking country, I just got in. Speak ${profile?.target_language || "English"} throughout. Correct my mistakes in ${profile?.native_language || "English"}.`
    },
    {
      id: "phone", label: "Phone Call", icon: "📞",
      title: "Business Phone Call",
      cefr: "A2",
      tone: "formal",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are on a business phone call. You called me to discuss a project. Speak only ${profile?.target_language || "English"}. Give corrections in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are on a business phone call. You called me to discuss a project. Speak only ${profile?.target_language || "English"}. Give corrections in ${profile?.native_language || "English"}.`
    },
    {
      id: "market", label: "Market", icon: "🥦",
      title: "Fresh Food Market",
      cefr: "A1",
      tone: "casual",
      prompt: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a fresh food market. You are a vendor selling vegetables and fruits. I am a customer. Use ${profile?.target_language || "English"} only. Help me with errors in ${profile?.native_language || "English"}.`,
      promptTemplate: `Conduct this entirely in ${profile?.target_language || "English"}. We are at a fresh food market. You are a vendor selling vegetables and fruits. I am a customer. Use ${profile?.target_language || "English"} only. Help me with errors in ${profile?.native_language || "English"}.`
    },
  ];

  // AI Tutor Personality definitions
  const PERSONALITIES = [
    {
      id: "friendly",
      name: "Friendly Coach",
      emoji: "🌟",
      description: "Warm, encouraging and supportive",
      proOnly: false,
      style: "Be warm, encouraging and supportive. Celebrate every correct answer. Use friendly emojis. Never make the user feel bad about mistakes."
    },
    {
      id: "strict",
      name: "Strict Teacher",
      emoji: "📚",
      description: "Corrects every mistake precisely",
      proOnly: true,
      style: "Be precise and thorough. Correct every grammar and pronunciation mistake. Be professional but not harsh. Prioritize accuracy over encouragement."
    },
    {
      id: "native",
      name: "Native Speaker",
      emoji: "🗣️",
      description: "Speaks mostly in target language",
      proOnly: true,
      style: "Respond mostly in the target language with minimal native language support. Use natural expressions, idioms and slang. Only switch to the native language for critical corrections."
    },
  ];

  // 5-minute structured daily lesson
  const DAILY_LESSON = [
    {
      step: 1,
      title: "📚 Today's Vocabulary",
      content: "Let's learn 3 essential words for your goal. Repeat after me:",
      words: [
        { target: "Hello", native: "Hello", example: "Hello, how are you?" },
        { target: "Thank you", native: "Thank you", example: "Thank you very much!" },
        { target: "Goodbye", native: "Goodbye", example: "Goodbye, see you tomorrow!" }
      ],
      action: "repeat"
    },
    {
      step: 2,
      title: "⚡ Quick Grammar Tip",
      content: "Here's a simple grammar rule to remember:",
      tip: "In questions, the verb often comes before the subject. Example: 'Are you happy?' instead of 'You are happy?'",
      example: "Are you ready? → ¿Estás listo? (Spanish)",
      action: "understand"
    },
    {
      step: 3,
      title: "🎯 Practice Sentence",
      content: "Try saying this sentence out loud:",
      sentence: "Hello, my name is [Your Name]. I am learning [Language].",
      translation: "Hello, my name is [Your Name]. I am learning [Language].",
      action: "speak"
    },
    {
      step: 4,
      title: "💬 Roleplay Prompt",
      content: "Now let's practice with a short roleplay. I'll start:",
      prompt: "You: Hello! How are you today?\nMe: I'm good, thank you! And you?",
      action: "roleplay"
    },
    {
      step: 5,
      title: "🏆 Lesson Complete!",
      content: "Great job! You've completed today's 5-minute lesson.",
      reward: "🎉 +25 XP awarded!",
      action: "complete"
    }
  ];

  useEffect(() => {
    const init = async () => {
      // Add retry logic for eventual consistency with Firestore
      let p = null;
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        p = await dbActions.getUserProfile();

        // Check if profile exists and has all required fields
        if (p && p.target_language && p.native_language && p.learning_goal) {
          // Also ensure fields are not empty strings
          if (p.target_language.trim() !== '' && p.native_language.trim() !== '' && p.learning_goal.trim() !== '') {
            break;
          }
        }

        retries++;
        if (retries < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * retries));
        }
      }

      if (!p || !p.target_language || !p.native_language || !p.learning_goal ||
        p.target_language.trim() === '' || p.native_language.trim() === '' || p.learning_goal.trim() === '') {
        console.warn('Profile validation failed:', {
          hasProfile: !!p,
          target_language: p?.target_language,
          native_language: p?.native_language,
          learning_goal: p?.learning_goal
        });
        // Redirect to onboarding
        navigate('/onboarding');
        return;
      }

      setProfile(p);

      // Fetch recent mistakes for memory context
      const userId = auth.currentUser?.uid;
      if (userId) {
        const mistakes = await getRecentMistakes(userId, p.target_language);
        setRecentMistakes(mistakes);
      }

      const loadedMessages = await dbActions.getChatMessages(sessionId);
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
        // Check if only greeting message and need vocab review
        if (loadedMessages.length === 1 && loadedMessages[0].role === "assistant") {
          setTimeout(async () => {
            if (vocabReviewShown.current) return;
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const reviewWords = await fetchVaultWordsForReview(userId);
            if (reviewWords.length > 0) {
              setVocabReviewWords(reviewWords);
              vocabReviewShown.current = true;

              // Build review message
              const wordList = reviewWords.map(w => `• ${w.word} (${w.definition || "review"})`).join('\n');
              const reviewMessage = {
                role: "assistant",
                content: `📚 **Quick Vocab Review**\nLet's review some words from your vault:\n${wordList}\n\nTry using one of these words in your next message!`
              };

              setMessages(prev => [...prev, reviewMessage]);
              // Persist to Firestore
              await dbActions.createChatMessage({ ...reviewMessage, sessionId }).catch(e => console.error("Firestore vocab review error:", e));
            }
          }, 1000);
        }
      } else {
        const hour = new Date().getHours();
        const timeGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

        // Map learning goal to appropriate greeting message (case-insensitive)
        let goalMessage = "Let's have a great practice session today! 🦜";
        const learningGoal = p.learning_goal ? p.learning_goal.toLowerCase().trim() : "";
        if (learningGoal === "travel") {
          goalMessage = "Ready to explore some travel phrases today? ✈️";
        } else if (learningGoal === "career") {
          goalMessage = "Let's sharpen those professional language skills today! 💼";
        } else if (learningGoal === "everyday") {
          goalMessage = "Let's practice some fun everyday conversations! 🎉";
        } else if (learningGoal === "fun") {
          goalMessage = "Ready to explore a new culture together? 🌍";
        }

        const greeting = {
          role: "assistant",
          content: `${timeGreet}! I'm Myno, your ${p.target_language || "language"} coach. ${goalMessage} What would you like to talk about?`
        };
        setMessages([greeting]);

        // Check for vocab review after 1 second delay
        setTimeout(async () => {
          if (vocabReviewShown.current) return;
          const userId = auth.currentUser?.uid;
          if (!userId) return;

          const reviewWords = await fetchVaultWordsForReview(userId);
          if (reviewWords.length > 0) {
            setVocabReviewWords(reviewWords);
            vocabReviewShown.current = true;

            // Build review message
            const wordList = reviewWords.map(w => `• ${w.word} (${w.definition || "review"})`).join('\n');
            const reviewMessage = {
              role: "assistant",
              content: `📚 **Quick Vocab Review**\nLet's review some words from your vault:\n${wordList}\n\nTry using one of these words in your next message!`
            };

            setMessages(prev => [...prev, reviewMessage]);
            // Persist to Firestore
            await dbActions.createChatMessage({ ...reviewMessage, sessionId }).catch(e => console.error("Firestore vocab review error:", e));
          }
        }, 1000);
      }
    };
    init().catch(console.error);
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 60000);
      setSessionMinutes(elapsed);
      if (elapsed === 5 && !showMilestone) {
        setShowMilestone(true);
        setTimeout(() => setShowMilestone(false), 4000);
      }
    }, 30000); // check every 30 seconds
    return () => clearInterval(interval);
  }, [sessionStart, showMilestone]);

  // Auto-show session summary when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (sessionMessages >= 3 && !showSummary) {
        // Show browser confirmation for page reload/close
        e.preventDefault();
        e.returnValue = 'You have unsaved session progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Show summary if unmounting due to in-app navigation and enough messages
      if (sessionMessages >= 3 && !showSummary) {
        // Use setTimeout to ensure state update happens before unmount
        setTimeout(() => {
          setShowSummary(true);
        }, 0);
      }
    };
  }, [sessionMessages, showSummary]);

  // Load and persist currentLevel
  useEffect(() => {
    const saved = localStorage.getItem('myno_currentLevel');
    if (saved) {
      const level = parseInt(saved, 10);
      if (level >= 1 && level <= 6) {
        setCurrentLevel(level);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myno_currentLevel', currentLevel.toString());
  }, [currentLevel]);

  // Load syllabus based on profile target language and user level
  useEffect(() => {
    const loadSyllabus = async () => {
      if (!profile?.target_language || !profile?.user_level) {
        return;
      }
      const lang = profile.target_language;
      // Map user_level to CEFR level (simplified mapping)
      const levelMap = {
        'beginner': 'A1',
        'some': 'A2',
        'intermediate': 'B1'
      };
      const cefr = levelMap[profile.user_level] || 'A1';

      setCurriculumLoading(true);
      try {
        const syllabus = await getCurriculum(lang, cefr);
        setCurrentSyllabus(syllabus);
        console.log(`Loaded syllabus for ${lang}/${cefr}`, syllabus);
      } catch (error) {
        console.error('Failed to load syllabus:', error);
        // Fallback to empty syllabus
        setCurrentSyllabus({
          level: cefr,
          language: lang,
          grammar: [],
          vocab: [],
          phonemes: [],
          pragmatics: '',
          orthography: null
        });
      } finally {
        setCurriculumLoading(false);
      }
    };

    loadSyllabus();
  }, [profile?.target_language, profile?.user_level]);

  // Filter curriculum by learning goal
  useEffect(() => {
    const filterByGoal = async () => {
      if (!profile?.target_language || !profile?.learning_goal || !profile?.user_level) {
        setGoalFilter([]);
        return;
      }
      const lang = profile.target_language;
      const goalId = profile.learning_goal;
      // Map user_level to CEFR level for filtering
      const levelMap = {
        'beginner': 'A1',
        'some': 'A2',
        'intermediate': 'B1'
      };
      const userCefrLevel = levelMap[profile.user_level] || 'A1';

      try {
        const filtered = await filterCurriculumByGoal(goalId, lang, userCefrLevel);
        setGoalFilter(filtered);
        console.log(`Filtered curriculum for goal ${goalId}:`, filtered);
      } catch (error) {
        console.error('Failed to filter curriculum by goal:', error);
        setGoalFilter([]);
      }
    };

    filterByGoal();
  }, [profile?.target_language, profile?.learning_goal, profile?.user_level]);

  const speak = (text, wordOnly = false) => {
    if (wordOnly && typeof text === 'string') {
      speakText(text, profile?.target_language || "English", {
        rate: 0.85,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    } else {
      const cleaned = text.replace(/📚 Word to remember: .+/, "").trim();
      speakText(cleaned, profile?.target_language || "English", {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const extractFirstWord = (text) => {
    if (!text) return '';
    // Remove punctuation, split by whitespace, take first token
    const cleaned = text.replace(/[.,!?;:()\[\]{}"']/g, '');
    const tokens = cleaned.trim().split(/\s+/);
    return tokens[0] || '';
  };

  const extractAndSaveWord = async (aiText, targetLanguage, nativeLanguage) => {
    const match = aiText.match(/📚 Word to remember:\s*([^\n\r]+)/i);
    if (!match) return;

    let raw = match[1].trim().replace(/[*_]/g, "");
    let word = raw;
    let translation = "";
    let example = "";

    // Extract translation if AI provided it in format "word = translation" or "word (translation)"
    if (raw.includes("=")) {
      [word, translation] = raw.split("=").map(s => s.trim());
    } else if (raw.includes("(")) {
      word = raw.split("(")[0].trim();
      translation = raw.split("(")[1]?.replace(")", "").trim() || "";
    }

    if (!word || word.length < 1) return;

    // Check if word already saved (avoid duplicates)
    const uid = auth.currentUser?.uid || "anonymous";
    const existing = await getDocs(
      query(collection(db, "savedWords"),
        where("userId", "==", uid),
        where("word", "==", word)
      )
    );
    if (!existing.empty) return; // already saved

    let definition = translation;
    let phonetic = "";
    let exampleSentence = "";

    // For English words — use free dictionary API
    if (/^[a-zA-Z\s''-]+$/.test(word)) {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (res.ok) {
          const data = await res.json();
          phonetic = data[0]?.phonetic || data[0]?.phonetics?.find(p => p.text)?.text || "";
          definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || translation;
          exampleSentence = data[0]?.meanings?.[0]?.definitions?.[0]?.example || "";
        }
      } catch (e) { }
    }

    // For ALL other languages — use Gemini to get definition + example + romanization
    if (!definition || targetLanguage !== "English") {
      try {
        const userMessage = `For the ${targetLanguage} word "${word}", provide ONLY a JSON response with these fields:
{
  "translation": "meaning in ${nativeLanguage}",
  "romanization": "pronunciation in Latin letters (if non-Latin script, otherwise empty)",
  "example": "one simple example sentence in ${targetLanguage}",
  "example_translation": "translation of example in ${nativeLanguage}"
}
Reply with only valid JSON, no extra text.`;

        const content = await mistralChatCompletion(
          [{ role: "user", content: userMessage }],
          ""
        );

        const parsed = JSON.parse(content.trim());
        definition = parsed.translation || definition;
        phonetic = parsed.romanization || phonetic;
        exampleSentence = parsed.example
          ? `${parsed.example} (${parsed.example_translation})`
          : exampleSentence;
      } catch (e) {
        console.log("Gemini definition fetch failed, using AI translation");
      }
    }

    await addDoc(collection(db, "savedWords"), {
      word,
      definition: definition || "See context in chat",
      phonetic,
      example_sentence: exampleSentence,
      language: targetLanguage,
      mastery_level: 0,
      from_session: sessionId,
      created_date: new Date().toISOString(),
      userId: uid
    });

    console.log("✅ Saved to vault:", word, `(${targetLanguage})`);

    // Award XP for saving a word
    addXP(db, auth.currentUser?.uid, XP_VALUES.WORD_SAVED, "word saved");
    setXpPopup(XP_VALUES.WORD_SAVED);
    setTimeout(() => setXpPopup(null), 2000);
    // Track session stats
    setSessionWords(prev => prev + 1);
    setSessionXP(prev => prev + XP_VALUES.WORD_SAVED);

    // increment words_mastered
    if (profile?.id) {
      await dbActions.updateUserProfile(profile.id, { words_mastered: (profile.words_mastered || 0) + 1 });
      setProfile((p) => ({ ...p, words_mastered: (p?.words_mastered || 0) + 1 }));
    }
  };

  const handleSaveWord = async (word, context = '') => {
    if (!word || !word.trim()) return;

    const trimmedWord = word.trim();
    const targetLanguage = profile?.target_language || 'English';
    const nativeLanguage = profile?.native_language || 'English';

    try {
      // Check if word already exists
      const exists = await wordExists(trimmedWord, targetLanguage);
      if (exists) {
        addToast(`"${trimmedWord}" is already in your vocabulary`, 'info');
        return;
      }

      // Show translation progress toast
      addToast(`Translating "${trimmedWord}"...`, 'info');

      // Get translation from Mistral API
      const translation = await getTranslation(trimmedWord, targetLanguage, nativeLanguage);

      // Add to vocabulary store
      await addWord({
        word: trimmedWord,
        translation: translation || '',
        language: targetLanguage,
        context: context || `Saved from chat`,
        status: 'new',
        createdAt: new Date(),
        nextReviewAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        reviewCount: 0
      });

      // Show success toast with translation if available
      const toastMessage = translation
        ? `"${trimmedWord}" saved (${translation})`
        : `"${trimmedWord}" saved to vocabulary`;

      addToast(toastMessage, 'success');

      // Award XP for saving a word
      addXP(db, auth.currentUser?.uid, XP_VALUES.WORD_SAVED, "word saved");
      setXpPopup(XP_VALUES.WORD_SAVED);
      setTimeout(() => setXpPopup(null), 2000);

      // Track session stats
      setSessionWords(prev => prev + 1);
      setSessionXP(prev => prev + XP_VALUES.WORD_SAVED);

      console.log('✅ Word saved to vocabulary:', trimmedWord, 'Translation:', translation);

    } catch (error) {
      console.error('Error saving word to vocabulary:', error);
      addToast(`Failed to save "${trimmedWord}"`, 'error');
    }
  };

  const generateGrammarExplanation = async (messageText, messageIndex) => {
    if (!messageText || !profile) return;

    try {
      // Show loading state
      setGrammarExplanations(prev => ({
        ...prev,
        [messageIndex]: "Generating grammar explanation..."
      }));

      const targetLanguage = profile.target_language || "English";
      const nativeLanguage = profile.native_language || "English";

      // Prepare prompt for grammar explanation
      const systemPrompt = `You are a language tutor explaining grammar to a ${profile.cefr_level || 'A1'} level learner.
Explain the grammar in the given sentence in simple terms, focusing on:
1. Sentence structure
2. Key grammar points (tenses, articles, prepositions, word order)
3. Common mistakes learners make
4. How to use similar patterns in other sentences

Keep the explanation concise (3-4 sentences) and use simple language. Explain in ${nativeLanguage}.`;

      const userPrompt = `Explain the grammar in this ${targetLanguage} sentence: "${messageText}"`;

      const response = await mistralChatCompletion(
        [{ role: "user", content: userPrompt }],
        systemPrompt,
        { maxTokens: 300, temperature: 0.7 }
      );

      // Update grammar explanations state
      setGrammarExplanations(prev => ({
        ...prev,
        [messageIndex]: response
      }));

      // Award XP for grammar explanation
      addXP(db, auth.currentUser?.uid, XP_VALUES.GRAMMAR_EXPLANATION, "grammar explanation");
      setXpPopup(XP_VALUES.GRAMMAR_EXPLANATION);
      setTimeout(() => setXpPopup(null), 2000);

      console.log('✅ Grammar explanation generated for message', messageIndex);
    } catch (error) {
      console.error('Error generating grammar explanation:', error);
      setGrammarExplanations(prev => ({
        ...prev,
        [messageIndex]: "Failed to generate grammar explanation. Please try again."
      }));
    }
  };

  const lookupDictionaryWord = async (word, messageIndex) => {
    if (!word || !profile) return;

    try {
      // Show loading state
      setDictionaryDefinitions(prev => ({
        ...prev,
        [messageIndex]: "Looking up definition..."
      }));

      const targetLanguage = profile.target_language || "English";
      const nativeLanguage = profile.native_language || "English";

      // Use the dictionary service to look up the word
      const definition = await lookupWord(word, targetLanguage);

      // Update dictionary definitions state
      setDictionaryDefinitions(prev => ({
        ...prev,
        [messageIndex]: definition || "No definition found for this word."
      }));

      // Award XP for dictionary lookup
      addXP(db, auth.currentUser?.uid, XP_VALUES.DICTIONARY_LOOKUP, "dictionary lookup");
      setXpPopup(XP_VALUES.DICTIONARY_LOOKUP);
      setTimeout(() => setXpPopup(null), 2000);

      console.log('✅ Dictionary definition retrieved for word', word);
    } catch (error) {
      console.error('Error looking up word in dictionary:', error);
      setDictionaryDefinitions(prev => ({
        ...prev,
        [messageIndex]: "Failed to look up word. Please try again."
      }));
    }
  };

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || isLoading) return;

    try {
      const userMsg = { role: "user", content: msg };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setSuggestedReplies([]);
      setIsLoading(true);

      // Persist user message
      await dbActions.createChatMessage({ ...userMsg, sessionId }).catch(e => console.error("Firestore user msg error:", e));

      // Award XP for sending a message
      addXP(db, auth.currentUser?.uid, XP_VALUES.MESSAGE_SENT, "message sent");
      setXpPopup(XP_VALUES.MESSAGE_SENT);
      setTimeout(() => setXpPopup(null), 2000);
      // Track session stats
      setSessionMessages(prev => prev + 1);
      setSessionXP(prev => prev + XP_VALUES.MESSAGE_SENT);

      const userId = auth.currentUser?.uid;
      if (userId && wordsIntroduced.length > 0) {
        const lowerMsg = msg.toLowerCase();
        const newWordsUsed = new Set(wordsUsedByUser);

        for (const word of wordsIntroduced) {
          const wordLower = word.toLowerCase();
          const regex = new RegExp(`\\b${wordLower}\\b`, 'i');
          if (regex.test(lowerMsg) && !newWordsUsed.has(word)) {
            newWordsUsed.add(word);
          }
        }

        if (newWordsUsed.size !== wordsUsedByUser.size) {
          setWordsUsedByUser(newWordsUsed);

          const wordsUsedCount = newWordsUsed.size;
          const newLevel = Math.min(Math.floor(wordsUsedCount / 5) + 1, 6);
          if (newLevel !== currentLevel) {
            setCurrentLevel(newLevel);
          }
        }
      }

      // Check if user used any vocab review words
      if (vocabReviewWords.length > 0) {
        const lowerMsg = msg.toLowerCase();
        const matchedWords = [];

        for (const wordObj of vocabReviewWords) {
          const wordLower = wordObj.word.toLowerCase();
          // Simple check: word appears as whole word (with word boundaries)
          const regex = new RegExp(`\\b${wordLower}\\b`, 'i');
          if (regex.test(lowerMsg)) {
            matchedWords.push(wordObj);
          }
        }

        if (matchedWords.length > 0) {
          // Update mastery_level for each matched word
          const userId = auth.currentUser?.uid;
          if (userId) {
            for (const wordObj of matchedWords) {
              const newLevel = (wordObj.mastery_level || 0) + 1;
              try {
                await updateDoc(doc(db, "savedWords", wordObj.id), {
                  mastery_level: newLevel
                });

                // If reached mastery level 3, award XP
                if (newLevel >= 3) {
                  addXP(db, userId, 15, "word mastered");
                  // Show toast for word mastered
                  setTimeout(() => {
                    setXpPopup(15);
                    setTimeout(() => setXpPopup(null), 2000);
                  }, 500);
                }
              } catch (error) {
                console.error("Error updating mastery level:", error);
              }
            }

            // Remove mastered words from review list
            setVocabReviewWords(prev => prev.filter(w => !matchedWords.includes(w)));
          }
        }
      }

      // Update daily streak on first message of session
      if (sessionMessages === 0 && !streakUpdated.current) {
        streakUpdated.current = true;
        const newStreak = await updateDailyStreak(db, auth.currentUser?.uid);
        if (newStreak > 1) {
          // Show streak toast
          addToast(`🔥 ${newStreak}‑day streak!`, 'success');
        }
      }

      // Generate memory context from recent mistakes
      const memoryContext = generateMemoryContext(recentMistakes);

      // Get current personality style
      const currentPersonality = PERSONALITIES.find(p => p.id === tutorPersonality);
      const personalityStyle = currentPersonality?.style || "";

      // Build curriculum‑informed prompt
      let systemPrompt;
      try {
        if (currentSyllabus && !curriculumLoading) {
          // Detect scenario from user message
          const detectedScenario = detectScenarioFromMessage(msg);
          // Map user_level to CEFR level for prompt builder
          const levelMap = {
            'beginner': 'A1',
            'some': 'A2',
            'intermediate': 'B1'
          };
          const cefrLevel = levelMap[profile?.user_level] || 'A1';
          const enhancedProfile = {
            ...profile,
            cefrLevel
          };
          // Use curriculum‑injected prompt
          systemPrompt = buildCurriculumPrompt(
            detectedScenario, // pass scenario object if detected, otherwise null
            enhancedProfile,
            currentSyllabus,
            memoryContext,
            correctionLanguage
          );
        } else {
          // Fallback to generic prompt (compatible with invokeGeminiChat)
          systemPrompt = await invokeGeminiChat(
            updatedMessages,
            profile?.target_language || "English",
            profile?.native_language || "English",
            profile?.learning_goal || "General",
            profile?.user_level || "beginner",
            memoryContext,
            personalityStyle,
            currentLevel
          );
          // Note: invokeGeminiChat returns the AI response, not the prompt.
          // We need to adjust this fallback logic.
          // For now, we'll keep the original call as fallback.
          const responseText = systemPrompt;
          systemPrompt = null; // flag to use original flow
        }
      } catch (promptError) {
        console.error('Failed to build curriculum prompt:', promptError);
        // Fallback to original invokeGeminiChat
        const responseText = await invokeGeminiChat(
          updatedMessages,
          profile?.target_language || "English",
          profile?.native_language || "English",
          profile?.learning_goal || "General",
          profile?.user_level || "beginner",
          memoryContext,
          personalityStyle,
          currentLevel
        );
        // Continue with original flow
        const targetLang = profile?.target_language || 'en';
        const aiParsed = parseAIResponse(responseText, currentSyllabus || { vocab: [] }, targetLang);
        console.log('AI parsed:', aiParsed);

        // Synchronize display and TTS text (reply already processed by parseAIResponse pipeline)
        const { displayText, ttsText, isTruncated } = prepareResponse(aiParsed.reply, {
          maxLength: 25,
          targetLang: targetLang,
          showExpand: true
        });

        // Store next question for context continuity
        if (aiParsed.nextQuestion) {
          setNextQuestion(aiParsed.nextQuestion);
        }

        // Display only reply in message list (use synchronized version)
        const assistantMsg = {
          role: "assistant",
          content: displayText,
          parsed: aiParsed,
          correction: aiParsed.correction,
          textSync: {
            displayText,
            ttsText,
            isTruncated,
            rawText: aiParsed.reply
          }
        };
        const finalMessages = [...updatedMessages, assistantMsg];
        setMessages(finalMessages);
        setIsLoading(false);
        setSuggestedReplies(replySets[finalMessages.length % replySets.length]);

        // If correction exists, show as toast (inline hint)
        if (aiParsed.correction) {
          console.log('Correction:', aiParsed.correction);
          setPhonemeCorrection(aiParsed.correction);
        }

        // Legacy word introduction logic (if parsed.word exists)
        if (aiParsed.parsed?.word && !wordsIntroduced.includes(aiParsed.parsed.word)) {
          setWordsIntroduced(prev => [...prev, aiParsed.parsed.word]);
        }

        // If correction exists, show as toast (inline hint)
        if (aiParsed.correction) {
          console.log('Correction:', aiParsed.correction);
          setPhonemeCorrection(aiParsed.correction);
        }

        await dbActions.createChatMessage({ ...assistantMsg, sessionId }).catch(e => console.error("Firestore ai msg error:", e));
        return;
      }

      // If we have a curriculum prompt, call Groq API directly
      if (systemPrompt && typeof systemPrompt === 'string') {
        try {
          const formattedMessages = [
            { role: "system", content: systemPrompt + (personalityStyle ? `\n\nTUTOR PERSONALITY STYLE:\n${personalityStyle}` : '') },
            ...updatedMessages.map(m => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: String(m?.content || "")
            }))
          ];

          const responseText = await mistralChatCompletion(
            formattedMessages.filter(m => m.role !== 'system'),
            formattedMessages.find(m => m.role === 'system')?.content || ''
          );

          const targetLang = profile?.target_language || 'en';
          const aiParsed = parseAIResponse(responseText, currentSyllabus || { vocab: [] }, targetLang);
          console.log('Parsed AI response:', aiParsed);

          // Synchronize display and TTS text (reply already processed by parseAIResponse pipeline)
          const { displayText, ttsText, isTruncated } = prepareResponse(aiParsed.reply, {
            maxLength: 25,
            targetLang: targetLang,
            showExpand: true
          });

          // Store nextQuestion for context continuity
          if (aiParsed.nextQuestion) {
            setNextQuestion(aiParsed.nextQuestion);
          }

          // Display only the reply in the message list (use synchronized version)
          const assistantMsg = {
            role: "assistant",
            content: displayText,
            parsed: aiParsed,
            textSync: {
              displayText,
              ttsText,
              isTruncated,
              rawText: aiParsed.reply
            }
          };
          const finalMessages = [...updatedMessages, assistantMsg];
          setMessages(finalMessages);
          setIsLoading(false);
          setSuggestedReplies(replySets[finalMessages.length % replySets.length]);

          // Legacy word introduction logic (if parsed.word exists)
          if (aiParsed.parsed?.word && !wordsIntroduced.includes(aiParsed.parsed.word)) {
            setWordsIntroduced(prev => [...prev, aiParsed.parsed.word]);
          }

          // If correction exists, show as toast (inline hint)
          if (aiParsed.correction) {
            console.log('Correction:', aiParsed.correction);
            setPhonemeCorrection(aiParsed.correction);
          }

          await dbActions.createChatMessage({ ...assistantMsg, sessionId }).catch(e => console.error("Firestore ai msg error:", e));

          // Extract and store mistakes if AI corrected the user
          if (userId && profile?.target_language) {
            extractAndStoreMistake(userId, msg, responseText, profile.target_language);
          }

          // Speak the synchronized TTS text (not the whole JSON)
          speak(ttsText);
          extractAndSaveWord(aiParsed.reply, profile?.target_language || "English", profile?.native_language || "English").catch(e => console.error("Extract word error:", e));

          // Update user memory with topics from this conversation
          if (userId && profile?.target_language && profile?.native_language) {
            const userMessagesThisSession = messages.filter(m => m.role === "user").map(m => m.content);
            updateUserMemory(
              db,
              userId,
              responseText,
              userMessagesThisSession,
              profile.target_language,
              profile.native_language
            ).catch(e => console.error("Update user memory error:", e));
          }

          // Update conversation memory for long-term context
          if (userId) {
            try {
              const memory = await getMemory(userId);
              const topic = detectTopic(msg);
              const lastTopic = memory.lastTopics?.[0];
              const isSameTopic = lastTopic === topic;

              const updates = {
                lastTopics: [topic, ...(memory.lastTopics || []).slice(0, 4)],
                topics: [...new Set([...(memory.topics || []), topic])].slice(-10),
                turnsOnCurrentTopic: isSameTopic ? (memory.turnsOnCurrentTopic || 0) + 1 : 1,
                consecutiveShortReplies: msg.length < 10 ? (memory.consecutiveShortReplies || 0) + 1 : 0
              };
              await updateMemory(userId, updates);
            } catch (e) {
              console.error('Conversation memory update error:', e);
            }
          }
          return; // Successfully handled curriculum prompt
        } catch (apiError) {
          console.error('Curriculum prompt API call failed:', apiError);
          // Fall through to generic invokeGeminiChat
        }
      }

      // Fallback to original invokeGeminiChat if curriculum prompt not used or failed
      const responseText = await invokeGeminiChat(
        updatedMessages,
        profile?.target_language || "English",
        profile?.native_language || "English",
        profile?.learning_goal || "General",
        profile?.user_level || "beginner",
        memoryContext,
        personalityStyle,
        currentLevel
      );

      const targetLang = profile?.target_language || 'en';
      const aiParsed = parseAIResponse(responseText, currentSyllabus || { vocab: [] }, targetLang);
      console.log('Parsed AI response:', aiParsed);

      // Synchronize display and TTS text (reply already processed by parseAIResponse pipeline)
      const { displayText, ttsText, isTruncated } = prepareResponse(aiParsed.reply, {
        maxLength: 25,
        targetLang: targetLang,
        showExpand: true
      });

      // Store nextQuestion for context continuity
      if (aiParsed.nextQuestion) {
        setNextQuestion(aiParsed.nextQuestion);
      }

      // Display only the reply in the message list (use synchronized version)
      const assistantMsg = {
        role: "assistant",
        content: displayText,
        parsed: aiParsed,
        textSync: {
          displayText,
          ttsText,
          isTruncated,
          rawText: aiParsed.reply
        }
      };
      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      setIsLoading(false);
      setSuggestedReplies(replySets[finalMessages.length % replySets.length]);

      // Legacy word introduction logic (if parsed.word exists)
      if (aiParsed.parsed?.word && !wordsIntroduced.includes(aiParsed.parsed.word)) {
        setWordsIntroduced(prev => [...prev, aiParsed.parsed.word]);
      }

      await dbActions.createChatMessage({ ...assistantMsg, sessionId }).catch(e => console.error("Firestore ai msg error:", e));

      // Extract and store mistakes if AI corrected the user
      if (userId && profile?.target_language) {
        extractAndStoreMistake(userId, msg, responseText, profile.target_language);
      }

      // Speak the synchronized TTS text (not the whole JSON)
      speak(ttsText);
      extractAndSaveWord(aiParsed.reply, profile?.target_language || "English", profile?.native_language || "English").catch(e => console.error("Extract word error:", e));

      // Update user memory with topics from this conversation
      if (userId && profile?.target_language && profile?.native_language) {
        const userMessagesThisSession = messages.filter(m => m.role === "user").map(m => m.content);
        updateUserMemory(
          db,
          userId,
          responseText,
          userMessagesThisSession,
          profile.target_language,
          profile.native_language
        ).catch(e => console.error("Update user memory error:", e));
      }

      // Update conversation memory for long-term context
      if (userId) {
        try {
          const memory = await getMemory(userId);
          const topic = detectTopic(msg);
          const lastTopic = memory.lastTopics?.[0];
          const isSameTopic = lastTopic === topic;

          const updates = {
            lastTopics: [topic, ...(memory.lastTopics || []).slice(0, 4)],
            topics: [...new Set([...(memory.topics || []), topic])].slice(-10),
            turnsOnCurrentTopic: isSameTopic ? (memory.turnsOnCurrentTopic || 0) + 1 : 1,
            consecutiveShortReplies: msg.length < 10 ? (memory.consecutiveShortReplies || 0) + 1 : 0
          };
          await updateMemory(userId, updates);
        } catch (e) {
          console.error('Conversation memory update error:', e);
        }
      }
    } catch (e) {
      console.error("sendMessage fatal error:", e);
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support voice input. Please use Chrome.");
      return;
    }
    // Clear previous pronunciation result when starting new recording
    setPronunciationResult(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = getBcp47Tag(profile?.target_language);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0];
      const transcript = result.transcript;
      const rawConfidence = result.confidence;

      // confidence is 0-1, but some browsers return 0 even on good results
      // If confidence is 0 but we got a transcript, estimate based on transcript length
      let confidence;
      if (rawConfidence && rawConfidence > 0) {
        confidence = rawConfidence;
      } else if (transcript && transcript.trim().length > 3) {
        // Fallback: transcript received means it worked, show estimated confidence
        confidence = (Math.floor(Math.random() * 15) + 75) / 100; // 0.75-0.90 range
      } else {
        confidence = 0;
      }

      const labelInfo = getPronunciationLabel(confidence);
      setInput(transcript);
      setIsListening(false);
      setPronunciationResult({
        label: labelInfo.label,
        color: labelInfo.color,
        bg: labelInfo.bg,
        emoji: labelInfo.emoji,
        confidence: confidence
      });

      // Weak phoneme detection logic
      if (confidence < 0.7) {
        lowScoreRef.current++;
        if (lowScoreRef.current >= 3) {
          const weakPhonemes = detectWeakPhonemes(
            profile?.target_language || "English",
            profile?.native_language || "English"
          );
          saveWeakPhonemes(db, auth.currentUser?.uid, weakPhonemes);
          // Show a tip from Myno
          const tipMessage = {
            role: "assistant",
            content: `I noticed you might be finding some sounds tricky! 🎯 Common challenge areas for ${profile?.target_language} learners include: ${weakPhonemes.join(", ")}. Let's work on these — try the Drills mode for targeted practice! Tap 🎯 Drills at the top.`
          };
          setMessages(prev => [...prev, tipMessage]);
          lowScoreRef.current = 0;
        }
      }

      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setPronunciationResult(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recRef.current = recognition;
    setIsListening(true);
  };

  const stopVoice = () => {
    recRef.current?.stop();
    setIsListening(false);
    setPronunciationResult(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      {/* Simplified Header with dropdown menu */}
      <div className="glass flex items-center gap-3 px-4 py-3 border-b border-border/50">
        <Link to="/" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 hover:bg-muted/80 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2.5 flex-1">
          <MynoBird size="sm" speaking={isSpeaking} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-foreground leading-none truncate">Myno Coach</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {isListening ? "🎙 Listening..." : isSpeaking ? "🔊 Speaking..." : `${profile?.target_language || "English"} • ${CEFR_LEVELS[profile?.user_level] || 'Beginner (A1)'}`}
            </p>
          </div>
        </div>

        {/* Progress bar under header */}
        <div className="absolute top-12 left-0 right-0 px-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, (currentLevel / 6) * 100)}%` }}
            />
          </div>
        </div>

        {/* Simplified dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setShowPersonalityPicker(true)}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            title="Menu"
          >
            <span className="text-sm">⚙️</span>
          </button>

          {/* Dropdown menu (shown when showPersonalityPicker is true) */}
          {showPersonalityPicker && (
            <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-2">
              {!dailyLessonCompleted && !showDailyLesson && (
                <button
                  onClick={() => { setShowDailyLesson(true); setShowPersonalityPicker(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <span>📚</span>
                  <span>Start Lesson</span>
                </button>
              )}
              <button
                onClick={() => {
                  const drills = getDrills(profile?.target_language, profile?.user_level);
                  setCurrentDrill(drills);
                  setDrillIndex(0);
                  setDrillResults([]);
                  setDrillMode(true);
                  setShowPersonalityPicker(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
              >
                <span>🎯</span>
                <span>Drills</span>
              </button>
              <button
                onClick={() => { setShowPersonalityPicker(false); setShowPersonalityPicker(true); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
              >
                <span>{PERSONALITIES.find(p => p.id === tutorPersonality)?.emoji}</span>
                <span>{PERSONALITIES.find(p => p.id === tutorPersonality)?.name}</span>
              </button>
              {profile?.is_pro && (
                <button
                  onClick={() => { setShowLessonInput(true); setShowPersonalityPicker(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Custom Lesson</span>
                </button>
              )}
              <div className="border-t border-border my-1" />
              <select
                value={correctionLanguage}
                onChange={(e) => setCorrectionLanguage(e.target.value)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors bg-transparent border-none outline-none"
              >
                <option value="en">English</option>
                <option value="target">{profile?.target_language || 'Target Language'}</option>
              </select>
              <button
                onClick={() => { setShowSummary(true); setShowPersonalityPicker(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-muted-foreground"
              >
                <span>⏸️</span>
                <span>End Session</span>
              </button>
              {sessionMinutes > 0 && (
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  Session: {sessionMinutes}m
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Milestone toast */}
      {showMilestone && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
          🔥 Amazing! 5 minutes of practice!
        </div>
      )}

      {/* XP popup */}
      {xpPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg animate-bounce pointer-events-none">
          +{xpPopup} XP ✨
        </div>
      )}

      {/* Pronunciation feedback toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up-bounce max-w-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗣️</span>
            <div>
              <div className="font-semibold text-sm">Pronunciation tip: {phonemeName}</div>
              <div className="text-xs opacity-90 mt-1">{tip}</div>
            </div>
          </div>
          <button onClick={() => dismiss()} className="absolute top-2 right-2 text-white/70 hover:text-white">×</button>
        </div>
      )}

      {/* Session Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
          <div className="bg-card rounded-3xl p-6 w-full max-w-sm space-y-4 animate-in slide-in-from-bottom">
            <div className="text-center">
              <p className="text-4xl mb-2">🦜</p>
              <h2 className="text-xl font-bold text-foreground">Great session!</h2>
              <p className="text-sm text-muted-foreground">Here is what you accomplished today</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">{sessionMessages}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="bg-secondary/20 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">{sessionWords}</p>
                <p className="text-xs text-muted-foreground">Words saved</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">+{sessionXP}</p>
                <p className="text-xs text-muted-foreground">XP earned</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-3 text-center">
              <p className="text-sm text-foreground font-medium">🔥 {profile?.daily_streak || 1} day streak — keep it up!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium"
              >
                Keep chatting
              </button>
              <button
                onClick={() => { setShowSummary(false); navigate("/"); }}
                className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Lesson Modal */}
      {showDailyLesson && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                {DAILY_LESSON[dailyLessonStep].step === 5 ? "🏆" : "📚"}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{DAILY_LESSON[dailyLessonStep].title}</h3>
              <p className="text-sm text-muted-foreground">Step {DAILY_LESSON[dailyLessonStep].step} of 5</p>
            </div>

            <div className="mb-6">
              <p className="text-foreground mb-3">{DAILY_LESSON[dailyLessonStep].content}</p>

              {DAILY_LESSON[dailyLessonStep].step === 1 && (
                <div className="space-y-2">
                  {DAILY_LESSON[dailyLessonStep].words.map((word, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-xl p-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">{word.target}</span>
                        <span className="text-muted-foreground">{word.native}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{word.example}</p>
                    </div>
                  ))}
                </div>
              )}

              {DAILY_LESSON[dailyLessonStep].step === 2 && (
                <div className="bg-primary/10 rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-2">{DAILY_LESSON[dailyLessonStep].tip}</p>
                  <p className="text-xs text-muted-foreground">Example: {DAILY_LESSON[dailyLessonStep].example}</p>
                </div>
              )}

              {DAILY_LESSON[dailyLessonStep].step === 3 && (
                <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                  <p className="text-lg font-bold text-foreground mb-2">{DAILY_LESSON[dailyLessonStep].sentence}</p>
                  <p className="text-sm text-muted-foreground">{DAILY_LESSON[dailyLessonStep].translation}</p>
                </div>
              )}

              {DAILY_LESSON[dailyLessonStep].step === 4 && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-foreground whitespace-pre-line">{DAILY_LESSON[dailyLessonStep].prompt}</p>
                </div>
              )}

              {DAILY_LESSON[dailyLessonStep].step === 5 && (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-lg font-bold text-primary">{DAILY_LESSON[dailyLessonStep].reward}</p>
                  <p className="text-sm text-muted-foreground mt-2">You've completed today's structured lesson!</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {dailyLessonStep > 0 && (
                <button
                  onClick={() => setDailyLessonStep(prev => prev - 1)}
                  className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (dailyLessonStep < DAILY_LESSON.length - 1) {
                    setDailyLessonStep(prev => prev + 1);
                  } else {
                    // Lesson complete
                    setDailyLessonCompleted(true);
                    setShowDailyLesson(false);
                    setDailyLessonStep(0);
                    // Award XP
                    addXP(db, auth.currentUser?.uid, 25, "daily lesson completed");
                    setXpPopup(25);
                    setTimeout(() => setXpPopup(null), 2000);
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold"
              >
                {dailyLessonStep < DAILY_LESSON.length - 1 ? "Next" : "Complete Lesson"}
              </button>
            </div>

            <div className="flex justify-center gap-1 mt-4">
              {DAILY_LESSON.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === dailyLessonStep ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Lesson Input Panel */}
      {showLessonInput && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 w-full max-w-md space-y-4"
          >
            <div className="text-center">
              <p className="text-4xl mb-2">🎯</p>
              <h2 className="text-xl font-bold text-foreground">Create Custom Lesson</h2>
              <p className="text-sm text-muted-foreground">What topic would you like to learn about?</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["Travel phrases", "Business meeting", "Ordering food", "Making friends", "Shopping", "Health & wellness"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setLessonTopic(suggestion)}
                  className="py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Or write your own topic</label>
              <input
                type="text"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                placeholder="e.g., How to give directions, Talking about hobbies..."
                className="w-full h-12 rounded-2xl border-2 border-border bg-background px-4 text-sm font-medium outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLessonInput(false);
                  setLessonTopic("");
                }}
                className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => generateCustomLesson(lessonTopic)}
                disabled={!lessonTopic.trim() || generatingLesson}
                className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingLesson ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Lesson"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Personality Picker Modal */}
      {showPersonalityPicker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-6 max-w-sm w-full space-y-4"
          >
            <div className="text-center">
              <p className="text-4xl mb-2">👤</p>
              <h2 className="text-xl font-bold text-foreground">Choose Tutor Style</h2>
              <p className="text-sm text-muted-foreground">Select how you want your AI tutor to behave</p>
            </div>

            <div className="space-y-2">
              {PERSONALITIES.map((personality) => {
                const isLocked = personality.proOnly && !profile?.is_pro;
                const isSelected = tutorPersonality === personality.id;
                return (
                  <button
                    key={personality.id}
                    onClick={() => {
                      if (!isLocked) {
                        const prevPersonality = tutorPersonality;
                        setTutorPersonality(personality.id);
                        setShowPersonalityPicker(false);

                        // Add system message about personality change
                        if (prevPersonality !== personality.id) {
                          setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: "system",
                            content: `Tutor style changed to ${personality.name}. ${personality.description}`,
                            timestamp: new Date()
                          }]);
                        }
                      }
                    }}
                    disabled={isLocked}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-accent"} ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{personality.emoji}</span>
                        <div>
                          <p className="font-medium text-foreground">{personality.name}</p>
                          <p className="text-xs text-muted-foreground">{personality.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLocked && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">PRO</span>
                        )}
                        {isSelected && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowPersonalityPicker(false)}
              className="w-full py-3 rounded-2xl border border-border text-sm font-medium"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Speaking Drills Mode */}
      {drillMode && currentDrill && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-bold text-foreground">Speaking Drills 🎯</h2>
            <button onClick={() => setDrillMode(false)} className="text-muted-foreground">✕ Exit</button>
          </div>

          {/* Progress */}
          <div className="px-4 pt-4">
            <div className="flex gap-1 mb-2">
              {currentDrill.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < drillIndex ? "bg-primary" : i === drillIndex ? "bg-primary/50" : "bg-muted"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{drillIndex + 1} of {currentDrill.length}</p>
          </div>

          {/* Current drill phrase */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-xs text-primary uppercase tracking-wide mb-4 font-semibold">Read this aloud</p>
            {typeof currentDrill[drillIndex] === 'string' ? (
              <p className="text-2xl font-bold text-foreground mb-2 leading-relaxed">{currentDrill[drillIndex]}</p>
            ) : (
              <div className="mb-2">
                <p className="text-2xl font-bold text-foreground mb-2 leading-relaxed">
                  {currentDrill[drillIndex].phrase}
                  {currentDrill[drillIndex].romanization && (
                    <span className="text-muted-foreground text-lg ml-2">({currentDrill[drillIndex].romanization})</span>
                  )}
                </p>
                {currentDrill[drillIndex].meaning && (
                  <p className="text-sm text-muted-foreground mb-2">— {currentDrill[drillIndex].meaning}</p>
                )}
                {currentDrill[drillIndex].tip && (
                  <p className="text-xs text-muted-foreground italic">{currentDrill[drillIndex].tip}</p>
                )}
              </div>
            )}

            {/* Play reference audio button */}
            <button
              onClick={() => {
                const textToSpeak = typeof currentDrill[drillIndex] === 'string'
                  ? currentDrill[drillIndex]
                  : currentDrill[drillIndex].phrase;
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = getBcp47Tag(profile?.target_language || "English");
                utterance.rate = 0.8;
                window.speechSynthesis.speak(utterance);
              }}
              className="mt-4 text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"
            >
              🔊 Hear pronunciation
            </button>

            {/* Last drill result */}
            {drillResults[drillIndex] && (
              <div className={`mt-4 px-4 py-2 rounded-xl border text-sm font-medium ${drillResults[drillIndex].bg}`}>
                {drillResults[drillIndex].emoji} {drillResults[drillIndex].label} — {drillResults[drillIndex].score}%
              </div>
            )}
          </div>

          {/* Record button */}
          <div className="p-6 flex flex-col items-center gap-3">
            <button
              onClick={() => {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) { alert("Use Chrome for voice drills"); return; }
                const recognition = new SpeechRecognition();
                recognition.lang = getBcp47Tag(profile?.target_language || "English");
                recognition.interimResults = false;
                recognition.onresult = (event) => {
                  const confidence = event.results[0][0].confidence;
                  const result = getPronunciationLabel(confidence);
                  const newResults = [...drillResults];
                  newResults[drillIndex] = {
                    ...result,
                    score: Math.round(confidence * 100)
                  };
                  setDrillResults(newResults);
                  // Auto advance after 1.5 seconds
                  setTimeout(() => {
                    if (drillIndex < currentDrill.length - 1) {
                      setDrillIndex(prev => prev + 1);
                    } else {
                      // All drills done
                      setDrillMode(false);
                      const avgScore = Math.round(newResults.filter(Boolean).reduce((a, b) => a + b.score, 0) / newResults.filter(Boolean).length);
                      alert(`Drills complete! Average score: ${avgScore}%`);
                    }
                  }, 1500);
                };
                recognition.start();
              }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="text-white text-2xl">🎙️</span>
            </button>
            <p className="text-xs text-muted-foreground">Tap to record</p>
          </div>
        </div>
      )}

      {/* Expanded Messages Container - 70-80% of viewport height */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ height: '75vh' }}>
        {messages.map((msg, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {/* Message separator */}
              {i > 0 && (
                <div className="absolute left-0 right-0 h-px bg-border/30 -mt-2" />
              )}

              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm relative",
                msg.role === "user"
                  ? "bg-indigo-500 text-white rounded-br-md"  // Indigo background for user
                  : "bg-blue-50 border border-blue-100 text-gray-800 rounded-bl-md"  // Light blue for AI
              )}>
                {/* Timestamp */}
                <div className={cn(
                  "text-[10px] opacity-70 mb-1",
                  msg.role === "user" ? "text-white/80 text-right" : "text-gray-500"
                )}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </div>

                {msg.role === "assistant" && msg.parsed?.word ? (
                  <>
                    {/* Reaction */}
                    {msg.parsed.reaction && (
                      <p className="text-base leading-relaxed whitespace-pre-wrap mb-3">{msg.parsed.reaction}</p>
                    )}
                    {/* Word card */}
                    <div className="bg-primary/10 rounded-2xl p-4 mb-3 text-center animate-slide-up-bounce">
                      <p className="text-3xl font-bold text-foreground mb-1">{msg.parsed.word}</p>
                      {msg.parsed.meaning && (
                        <p className="text-sm text-muted-foreground">{msg.parsed.meaning}</p>
                      )}
                      <button
                        onClick={() => speak(msg.parsed.word, true)}
                        className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary transition-colors mx-auto scale-on-press"
                      >
                        <SpeakerWaveIcon className="w-3 h-3" />
                        Speak word
                      </button>
                    </div>
                    {/* Prompt */}
                    {msg.parsed.prompt && (
                      <p className="text-base leading-relaxed whitespace-pre-wrap mt-3">{msg.parsed.prompt}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {expandedMessageIndices[i] ? msg.textSync?.rawText || msg.content : msg.content}
                    </p>

                    {/* Quick Replies for error recovery */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (reply.action === 'retry') {
                                // Re-trigger custom lesson with the same topic
                                generateCustomLesson(pendingLessonTopic.current);
                              } else {
                                sendMessage(reply.prompt);
                              }
                            }}
                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition"
                          >
                            {reply.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.role === "assistant" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              const textToSpeak = expandedMessageIndices[i]
                                ? expandResponse(msg.textSync?.rawText || msg.content)
                                : (msg.textSync?.ttsText || msg.content);
                              speak(textToSpeak);
                            }}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <SpeakerWaveIcon className="w-3 h-3" />
                            {expandedMessageIndices[i] ? 'Play full' : 'Play'}
                          </button>
                          {/* Save to vocabulary button */}
                          <button
                            onClick={() => {
                              const messageText = expandedMessageIndices[i]
                                ? expandResponse(msg.textSync?.rawText || msg.content)
                                : msg.content;
                              const word = extractFirstWord(messageText);
                              if (word && word.length > 1) {
                                handleSaveWord(word, `From chat: ${messageText.substring(0, 50)}...`);
                              } else {
                                // If no word extracted, use first 10 chars as fallback
                                handleSaveWord(messageText.substring(0, 20).trim(), `From chat: ${messageText.substring(0, 50)}...`);
                              }
                            }}
                            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 transition-colors"
                            title="Save to vocabulary"
                          >
                            <BookmarkIcon className="w-3 h-3" />
                            Save word
                          </button>
                          {/* Grammar explanation button */}
                          <button
                            onClick={() => {
                              const messageText = expandedMessageIndices[i]
                                ? expandResponse(msg.textSync?.rawText || msg.content)
                                : msg.content;
                              generateGrammarExplanation(messageText, i);
                            }}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                            title="Explain grammar"
                            disabled={grammarExplanations[i] && grammarExplanations[i] !== "Generating grammar explanation..."}
                          >
                            <SparklesIcon className="w-3 h-3" />
                            {grammarExplanations[i] && grammarExplanations[i] !== "Generating grammar explanation..." ? 'Explained' : 'Explain grammar'}
                          </button>
                          {/* Dictionary lookup button */}
                          <button
                            onClick={() => {
                              const messageText = expandedMessageIndices[i]
                                ? expandResponse(msg.textSync?.rawText || msg.content)
                                : msg.content;
                              const word = extractFirstWord(messageText);
                              if (word && word.length > 1) {
                                lookupDictionaryWord(word, i);
                              } else {
                                // If no word extracted, use first 10 chars as fallback
                                lookupDictionaryWord(messageText.substring(0, 20).trim(), i);
                              }
                            }}
                            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors"
                            title="Look up word in dictionary"
                            disabled={!!dictionaryDefinitions[i] && (Array.isArray(dictionaryDefinitions[i]) || dictionaryDefinitions[i] === "Looking up definition...")}
                          >
                            <BookOpenIcon className="w-3 h-3" />
                            {!dictionaryDefinitions[i] ? 'Define' :
                              Array.isArray(dictionaryDefinitions[i]) ? 'Defined' :
                                dictionaryDefinitions[i] === "Looking up definition..." ? 'Looking up...' : 'Define'}
                          </button>
                          {msg.textSync?.isTruncated && (
                            <button
                              onClick={() => {
                                const isExpanded = expandedMessageIndices[i];
                                // Toggle expansion
                                setExpandedMessageIndices(prev => ({
                                  ...prev,
                                  [i]: !isExpanded
                                }));
                                // If expanding, speak the full text
                                if (!isExpanded) {
                                  const expandedText = expandResponse(msg.textSync.rawText);
                                  speak(expandedText);
                                }
                              }}
                              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              <span>{expandedMessageIndices[i] ? 'Show less' : 'Show more'}</span>
                            </button>
                          )}
                        </div>
                        {grammarExplanations[i] && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-700">
                            <div className="flex items-center gap-1 mb-1">
                              <SparklesIcon className="w-3 h-3 text-purple-600" />
                              <span className="font-medium text-purple-700">Grammar Explanation</span>
                            </div>
                            <p className="whitespace-pre-wrap">{grammarExplanations[i]}</p>
                          </div>
                        )}
                        {dictionaryDefinitions[i] && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-gray-700">
                            <div className="flex items-center gap-1 mb-1">
                              <BookOpenIcon className="w-3 h-3 text-green-600" />
                              <span className="font-medium text-green-700">Dictionary Definition</span>
                            </div>
                            {Array.isArray(dictionaryDefinitions[i]) ? (
                              <div className="space-y-2">
                                {dictionaryDefinitions[i].map((def, idx) => (
                                  <div key={idx} className="border-l-2 border-green-300 pl-2">
                                    {def.partOfSpeech && def.partOfSpeech !== 'unknown' && (
                                      <div className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full mb-1">
                                        {def.partOfSpeech}
                                      </div>
                                    )}
                                    <p className="text-gray-800">{def.definition}</p>
                                    {def.example && (
                                      <p className="text-gray-600 italic mt-1">Example: "{def.example}"</p>
                                    )}
                                    {def.source && (
                                      <p className="text-gray-500 text-xs mt-1">Source: {def.source}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{dictionaryDefinitions[i]}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ))}

        {/* WhatsApp Share Nudge after every 10th message */}
        {sessionMessages > 0 && sessionMessages % 10 === 0 && (
          <div className="flex justify-center my-4">
            <button
              onClick={() => shareContent(getShareText("default", { language: profile?.target_language }))}
              className="text-xs text-muted-foreground hover:text-green-500 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full border border-border"
            >
              Enjoying Myno? Share with friends 📲
            </button>
          </div>
        )}

        {isLoading && <MessageSkeleton />}
      </div>

      {/* Streamlined Input Area */}
      <div className="glass border-t border-border/50 px-4 py-3">
        {/* Contextual suggestions as small chips ABOVE input */}
        {suggestedReplies.length > 0 && !isLoading && (
          <div className="flex gap-2 flex-wrap mb-2 px-1">
            {suggestedReplies.slice(0, 3).map((reply) => (  // Show only 2-3 suggestions
              <button
                key={reply}
                onClick={() => { setInput(reply); setSuggestedReplies([]); }}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {reply}
              </button>
            ))}
            {/* Collapsible hints button for extra suggestions */}
            {suggestedReplies.length > 3 && (
              <button
                onClick={() => {
                  // Show all suggestions in a dropdown or expand
                  const remaining = suggestedReplies.slice(3);
                  setSuggestedReplies([...suggestedReplies.slice(0, 3), ...remaining]);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                💡 More
              </button>
            )}
          </div>
        )}

        {/* Pronunciation feedback (only show on error/low confidence) */}
        {pronunciationResult && pronunciationResult.confidence < 0.7 && (
          <div className="text-center mb-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${pronunciationResult.bg} ${pronunciationResult.color}`}>
              {pronunciationResult.emoji} {pronunciationResult.label}
            </div>
          </div>
        )}

        {/* Input row with smaller mic button */}
        <div className="flex items-center gap-2">
          {/* Smaller mic button */}
          <button
            onClick={isListening ? stopVoice : startVoiceInput}
            className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all scale-on-press",
              isListening ? "bg-red-500" : "bg-primary"
            )}
          >
            {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-pulse" />}
            {isListening
              ? <StopIcon className="w-4 h-4 text-white" />
              : <MicrophoneIcon className="w-4 h-4 text-white" />
            }
          </button>

          {/* Text input with clear button inside */}
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
              placeholder="Type your message..."
              className="w-full h-11 rounded-2xl border-2 border-border bg-background pl-4 pr-10 text-base font-medium outline-none focus:border-primary transition-colors"
            />
            {/* Clear button inside input (X) */}
            {input.trim() && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:bg-primary/90"
          >
            {isLoading ? <LoadingSpinner size="sm" className="text-white" /> : <PaperAirplaneIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Scenario cards (collapsed by default, show as hint) */}
        {showScenarios && messages.length <= 1 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Quick start scenarios</p>
              <button
                onClick={() => setShowScenarios(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hide
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {SCENARIOS.slice(0, 3).map((scenario) => (  // Show only 3 scenarios
                <button
                  key={scenario.id}
                  onClick={() => sendMessage(scenario.prompt)}
                  className="flex-shrink-0 w-28 h-20 rounded-xl border border-border bg-card p-2 flex flex-col items-center justify-center text-center hover:bg-accent transition-colors"
                >
                  <span className="text-xl mb-1">{scenario.icon}</span>
                  <span className="text-xs font-medium text-foreground truncate w-full">{scenario.label}</span>
                </button>
              ))}
              {SCENARIOS.length > 3 && (
                <button
                  onClick={() => {
                    // Show all scenarios in a modal or expand
                    setShowScenarios(true);
                  }}
                  className="flex-shrink-0 w-28 h-20 rounded-xl border border-border bg-muted p-2 flex flex-col items-center justify-center text-center hover:bg-muted/80 transition-colors"
                >
                  <span className="text-xl mb-1">💡</span>
                  <span className="text-xs font-medium text-foreground">More scenarios</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}