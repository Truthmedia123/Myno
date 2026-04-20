import React from "react";
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
                        aria-label="Play"
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
                            aria-label="Play"
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
                            aria-label="Save word"
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
                            aria-label="Explain grammar"
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
                            aria-label="Define"
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
            aria-label="Record voice"
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
            aria-label="Send message"
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
