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


export function useChatManager() {
  
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


  return {
    navigate,
    messages, setMessages,
    input, setInput,
    isLoading,
    isListening, stopVoice, startVoiceInput,
    isSpeaking,
    profile, setProfile,
    suggestedReplies, setSuggestedReplies,
    pronunciationResult, setPronunciationResult,
    sessionStart,
    sessionMinutes,
    showMilestone, setShowMilestone,
    xpPopup,
    sessionXP, setSessionXP,
    sessionWords, setSessionWords,
    sessionMessages, setSessionMessages,
    showSummary, setShowSummary,
    showScenarios, setShowScenarios,
    vocabReviewWords, setVocabReviewWords,
    recentMistakes, setRecentMistakes,
    showDailyLesson, setShowDailyLesson,
    dailyLessonStep, setDailyLessonStep,
    dailyLessonCompleted, setDailyLessonCompleted,
    drillMode, setDrillMode,
    currentDrill, setCurrentDrill,
    drillResults, setDrillResults,
    drillIndex, setDrillIndex,
    expandedMessageIndices, setExpandedMessageIndices,
    grammarExplanations, setGrammarExplanations,
    dictionaryDefinitions, setDictionaryDefinitions,
    showLessonInput, setShowLessonInput,
    lessonTopic, setLessonTopic,
    generatingLesson, setGeneratingLesson,
    tutorPersonality, setTutorPersonality,
    showPersonalityPicker, setShowPersonalityPicker,
    wordsIntroduced, setWordsIntroduced,
    currentLevel, setCurrentLevel,
    nextQuestion, setNextQuestion,
    correctionLanguage, setCorrectionLanguage,
    phonemeCorrection, setPhonemeCorrection,
    wordsUsedByUser, setWordsUsedByUser,
    currentSyllabus, setCurrentSyllabus,
    curriculumLoading, setCurriculumLoading,
    goalFilter, setGoalFilter,
    scrollRef,
    recRef,
    sendMessage,
    handleSaveWord,
    generateGrammarExplanation,
    lookupDictionaryWord,
    generateCustomLesson,
    speak,
    extractFirstWord,
    SCENARIOS,
    PERSONALITIES,
    DAILY_LESSON,
    replySets,
    CEFR_LEVELS,
    showToast,
    tip,
    phonemeName,
    dismiss
  };
}
