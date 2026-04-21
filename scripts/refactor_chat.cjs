const fs = require('fs');
const path = require('path');

const chatPath = path.join(process.cwd(), 'src/pages/Chat.jsx');
const hookPath = path.join(process.cwd(), 'src/hooks/useChatManager.js');

const chatContent = fs.readFileSync(chatPath, 'utf8');

const fnStartMatch = chatContent.match(/export default function Chat\(\) \{/);
const fnStartIndex = fnStartMatch.index;

const returnRegex = /  return \(\r?\n\s*<div className="flex flex-col h-screen bg-background max-w-md mx-auto">/;
const returnMatch = chatContent.match(returnRegex);
const returnIndex = returnMatch.index;

const importsVars = chatContent.slice(0, fnStartIndex);
const hookBody = chatContent.slice(fnStartIndex + fnStartMatch[0].length, returnIndex);
const jsxBody = chatContent.slice(returnIndex, chatContent.lastIndexOf('}'));

let newHookContent = importsVars.replace('export default function Chat() {', '');
newHookContent += `
export function useChatManager() {
  ${hookBody}
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
`;

const originalImportsOnly = `import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, PaperAirplaneIcon, MicrophoneIcon, StopIcon, SpeakerWaveIcon, SparklesIcon, BookmarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import MynoBird from "@/components/myno/MynoBird";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MessageSkeleton } from '@/components/ui/Skeleton';
import { cn, shareContent, getShareText } from "@/lib/utils";
import { useChatManager } from "@/hooks/useChatManager";
import { getBcp47Tag } from "@/lib/voiceEngine";
import { expandResponse } from "@/lib/textSync";

const getPronunciationLabel = (confidence) => {
    if (!confidence) return { label: "Needs Work", color: "text-red-400", bg: "bg-red-400/10", emoji: "⚠️" };
    const score = Math.round(confidence * 100);
    if (score >= 90) return { label: "Clear", color: "text-green-400", bg: "bg-green-400/10", emoji: "🎯" };
    if (score >= 70) return { label: "Natural", color: "text-blue-400", bg: "bg-blue-400/10", emoji: "👍" };
    return { label: "Needs Work", color: "text-red-400", bg: "bg-red-400/10", emoji: "⚠️" };
  };

export default function Chat() {
  const chatState = useChatManager();
  const {
    navigate,
    messages,
    input, setInput,
    isLoading,
    isListening, stopVoice, startVoiceInput,
    isSpeaking,
    profile,
    suggestedReplies, setSuggestedReplies,
    pronunciationResult,
    sessionMinutes,
    showMilestone,
    xpPopup,
    sessionXP,
    sessionWords,
    sessionMessages,
    showSummary, setShowSummary,
    showScenarios, setShowScenarios,
    showDailyLesson, setShowDailyLesson,
    dailyLessonStep, setDailyLessonStep,
    dailyLessonCompleted, setDailyLessonCompleted,
    drillMode, setDrillMode,
    currentDrill, setCurrentDrill,
    drillResults, setDrillResults,
    drillIndex, setDrillIndex,
    expandedMessageIndices, setExpandedMessageIndices,
    grammarExplanations,
    dictionaryDefinitions,
    showLessonInput, setShowLessonInput,
    lessonTopic, setLessonTopic,
    generatingLesson,
    tutorPersonality, setTutorPersonality,
    showPersonalityPicker, setShowPersonalityPicker,
    currentLevel,
    correctionLanguage, setCorrectionLanguage,
    scrollRef,
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
    CEFR_LEVELS,
    showToast,
    tip,
    phonemeName,
    dismiss
  } = chatState;

${jsxBody}
}
`;

fs.mkdirSync(path.join(process.cwd(), 'src/hooks'), { recursive: true });
fs.writeFileSync(hookPath, newHookContent, 'utf8');
fs.writeFileSync(chatPath, originalImportsOnly, 'utf8');
console.log('Successfully refactored Chat.jsx');
