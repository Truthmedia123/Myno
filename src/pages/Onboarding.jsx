import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, ChevronRight, Briefcase, Plane, MessageCircle, Smile, Sparkles, Star, Target } from "lucide-react";
import { useFirebaseDatabase } from "@/hooks/useFirebaseDatabase";
import LanguageGrid from "@/components/myno/LanguageGrid";
import FluencyAnalyzer from "@/components/myno/FluencyAnalyzer";
import MynoBird from "@/components/myno/MynoBird";
import { getBcp47Tag } from "@/lib/voiceEngine";

const GOALS = [
  { id: "travel", icon: Plane, label: "Travel", desc: "Navigate trips confidently" },
  { id: "career", icon: Briefcase, label: "Career", desc: "Ace interviews & meetings" },
  { id: "everyday", icon: MessageCircle, label: "Everyday", desc: "Connect with people" },
  { id: "fun", icon: Smile, label: "Just for Fun", desc: "Explore a new culture" },
];

const SAMPLE_PHRASE = "The quick brown fox jumps over the lazy dog near the riverbank at sunset.";

// Phrases for different self-assessment levels
const TEST_PHRASES = {
  beginner: {
    instruction: "Read this simple English sentence aloud:",
    phrase: "I want to travel and meet new people.",
    lang: "en-US"
  },
  some: {
    instruction: "Read these basic words aloud:",
    phrase: "Hello. Thank you. How are you?",
    lang: "en-US"
  },
  intermediate: {
    instruction: (targetLang) => `Read this sentence aloud in ${targetLang}:`,
    phrase: (targetLang) => FLUENCY_PHRASES[targetLang] || "Hello, how are you today?",
    lang: (targetLang) => getBcp47Tag(targetLang) || "en-US"
  }
};

// Mapping of target language to a simple phrase for intermediate test
const FLUENCY_PHRASES = {
  "Spanish": "Hola, ¿cómo estás hoy?",
  "French": "Bonjour, comment allez-vous aujourd'hui?",
  "German": "Hallo, wie geht es dir heute?",
  "Japanese": "こんにちは、今日は元気ですか？",
  "Korean": "안녕하세요, 오늘 어떠세요?",
  "Chinese": "你好，今天好吗？",
  "Italian": "Ciao, come stai oggi?",
  "Portuguese": "Olá, como você está hoje?",
  "Russian": "Привет, как ты сегодня?",
  "Arabic": "مرحبا، كيف حالك اليوم؟",
  "Hindi": "नमस्ते, आप आज कैसे हैं?",
  "Turkish": "Merhaba, bugün nasılsın?",
  "Dutch": "Hallo, hoe gaat het vandaag?",
  "Swedish": "Hej, hur mår du idag?",
  "Polish": "Cześć, jak się dziś masz?",
  "Thai": "สวัสดี วันนี้เป็นอย่างไรบ้าง?",
  "Vietnamese": "Xin chào, hôm nay bạn thế nào?",
  "Indonesian": "Halo, apa kabar hari ini?",
  "Filipino": "Kamusta, kumusta ka ngayong araw?",
  "Hebrew": "שלום, איך אתה היום?"
};

export default function Onboarding() {
  const dbActions = useFirebaseDatabase();
  const [step, setStep] = useState(0);
  const [targetLang, setTargetLang] = useState("");
  const [nativeLang, setNativeLang] = useState("");
  const [goal, setGoal] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [fluencyScore, setFluencyScore] = useState(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [dir, setDir] = useState(1);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recordedSpeech, setRecordedSpeech] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("");
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [selfLevel, setSelfLevel] = useState(null);
  const [skipped, setSkipped] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const goNext = () => { setDir(1); setStep((s) => s + 1); };
  const goBack = () => { setDir(-1); setStep((s) => s - 1); };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Please use Chrome or Edge for voice recording.");
      return;
    }

    // Determine language based on selfLevel and targetLang
    let langCode = "en-US";
    let targetPhrase = "";
    if (step === 4 && selfLevel) {
      if (selfLevel === "beginner") {
        langCode = TEST_PHRASES.beginner.lang;
        targetPhrase = TEST_PHRASES.beginner.phrase;
      } else if (selfLevel === "some") {
        langCode = TEST_PHRASES.some.lang;
        targetPhrase = TEST_PHRASES.some.phrase;
      } else if (selfLevel === "intermediate") {
        langCode = TEST_PHRASES.intermediate.lang(targetLang);
        targetPhrase = TEST_PHRASES.intermediate.phrase(targetLang);
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.continuous = true;        // Keep recording until manually stopped
    recognition.interimResults = true;    // Show partial results while speaking
    recognition.maxAlternatives = 3;      // Get up to 3 alternatives for better accuracy

    let finalTranscript = "";
    let silenceTimer = null;

    recognition.onresult = (event) => {
      let interim = "";
      // For each result slice, pick the best alternative (highest word match)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Choose the best alternative among up to 3
          let bestTranscript = result[0].transcript;
          let bestScore = scoreMatch(bestTranscript, targetPhrase);
          for (let alt = 1; alt < result.length; alt++) {
            const altTranscript = result[alt].transcript;
            const altScore = scoreMatch(altTranscript, targetPhrase);
            if (altScore > bestScore) {
              bestTranscript = altTranscript;
              bestScore = altScore;
            }
          }
          finalTranscript += bestTranscript + " ";
        } else {
          interim = result[0].transcript;
        }
      }
      // Show live transcript (interim + final)
      setLiveTranscript((finalTranscript + interim).trim());

      // Auto-stop after 2.5 seconds of silence (improved for longer pauses)
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
      }, 2500);
    };

    recognition.onend = () => {
      setRecording(false);
      setRecordingDone(true);
      if (finalTranscript.trim()) {
        setRecordedSpeech(finalTranscript.trim());
        setRecordingStatus("recorded");
      }
    };

    recognition.onerror = (e) => {
      console.error("Recording error:", e.error);
      setRecording(false);
    };

    setRecording(true);
    setRecordingStatus("recording");
    setLiveTranscript("");
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setRecording(false);
    setRecordingDone(true);
    setRecordingStatus("stopped");
  };

  const calculateFluencyScore = (spoken, target, language = "English") => {
    if (!spoken || spoken.trim().length === 0) return 15;

    const normalize = (str) => str.toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    const spokenNorm = normalize(spoken);
    const targetNorm = normalize(target);

    const spokenWords = spokenNorm.split(/\s+/).filter(Boolean);
    const targetWords = targetNorm.split(/\s+/).filter(Boolean);

    // 1. WORD ACCURACY (40% weight)
    // How many target words were spoken
    const targetSet = new Set(targetWords);
    const matchedWords = spokenWords.filter(w => targetSet.has(w)).length;
    const wordAccuracy = matchedWords / targetWords.length;

    // 2. ORDER ACCURACY (25% weight)
    // Were words spoken in roughly the right order?
    let orderScore = 0;
    let lastFoundIdx = -1;
    let orderedMatches = 0;
    for (const word of spokenWords) {
      const idx = targetWords.indexOf(word, lastFoundIdx + 1);
      if (idx > lastFoundIdx) {
        orderedMatches++;
        lastFoundIdx = idx;
      }
    }
    orderScore = targetWords.length > 0 ? orderedMatches / targetWords.length : 0;

    // 3. COMPLETENESS (20% weight)
    // Did the user speak roughly the full sentence?
    const completeness = Math.min(spokenWords.length / targetWords.length, 1);

    // 4. EXTRA WORDS PENALTY (15% weight)
    // Penalise for too many wrong words added
    const extraWords = spokenWords.filter(w => !targetSet.has(w)).length;
    const extraPenalty = Math.max(0, 1 - (extraWords / Math.max(spokenWords.length, 1)) * 0.5);

    // Final weighted score
    const raw = (
      wordAccuracy * 0.40 +
      orderScore * 0.25 +
      completeness * 0.20 +
      extraPenalty * 0.15
    );

    // Scale to a realistic range:
    // Perfect = 95%, Good = 75-85%, Partial = 50-70%, Poor = 20-40%
    const scaled = Math.round(raw * 95);

    // Apply self-level bonus/cap:
    // Beginner max = 55%, Some max = 75%, Intermediate max = 95%
    const caps = { beginner: 55, some: 75, intermediate: 95 };
    const cap = caps[selfLevel] || 95;

    return Math.max(15, Math.min(cap, scaled));
  };

  // Helper to score a transcript against target phrase (simple word‑match count)
  const scoreMatch = (transcript, target) => {
    const tWords = transcript.toLowerCase().split(/\s+/);
    const targetWords = target.toLowerCase().split(/\s+/);
    let matches = 0;
    for (const w of targetWords) {
      if (tWords.includes(w)) matches++;
    }
    return matches;
  };

  const handleFluencyDone = async (score) => {
    setIsRedirecting(true);
    setFluencyScore(score);
    // Create user profile
    const existing = await dbActions.getUserProfile();
    const baseData = {
      target_language: targetLang,
      native_language: nativeLang,
      learning_goal: goal,
      user_level: selfLevel || "beginner", // Save selfLevel as user_level
      fluency_score: score,
      onboarding_complete: true,
      last_session_date: new Date().toISOString().split("T")[0],
    };

    let saveSuccessful = false;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries && !saveSuccessful) {
      try {
        if (existing) {
          // Update existing profile, preserve existing total_xp, daily_streak, words_mastered
          await dbActions.updateUserProfile(existing.id, baseData);
        } else {
          // Create new profile with default values
          const newData = {
            ...baseData,
            daily_streak: 1,
            words_mastered: 0,
            total_xp: 0,
          };
          await dbActions.createUserProfile(newData);
        }
        saveSuccessful = true;
      } catch (e) {
        console.error(`Failed to save profile (attempt ${retries + 1}/${maxRetries}):`, e);
        retries++;
        if (retries < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500 * retries));
        }
      }
    }

    if (!saveSuccessful) {
      console.error("All attempts to save profile failed. User will be redirected but profile may be incomplete.");
      // Still navigate, but show a toast or alert in the future
    }

    navigate("/");
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -60 }),
  };

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-4xl mb-4">🦜</p>
          <p className="text-lg font-semibold text-primary">Setting up your learning plan...</p>
        </div>
      </div>
    );
  }

  if (showAnalyzer) {
    if (skipped) {
      const displayLevel = selfLevel
        ? selfLevel.charAt(0).toUpperCase() + selfLevel.slice(1)
        : "Beginner";
      return (
        <div className="min-h-screen bg-background flex flex-col px-6 py-10 max-w-md mx-auto">
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🌱</p>
            <h3 className="text-xl font-bold text-foreground mb-2">Starting Fresh!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No worries — Myno will figure out your level as you chat.
            </p>
            <div className="text-5xl font-bold text-primary mb-1">{displayLevel}</div>
            <p className="text-xs text-muted-foreground">Your level will improve as you practice</p>
          </div>
          <button
            onClick={() => handleFluencyDone(15)}
            className="mt-6 w-full py-3 rounded-2xl bg-primary text-white font-semibold"
          >
            Let's Start Learning →
          </button>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 py-10 max-w-md mx-auto">
        <h2 className="text-xl font-extrabold text-foreground text-center mb-6">Analyzing your voice...</h2>
        <FluencyAnalyzer onComplete={handleFluencyDone} score={calculatedScore} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Progress bar */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
            >
              <motion.div
                className="h-full bg-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i < step ? "100%" : i === step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
        {step > 0 && (
          <button onClick={goBack} className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
        )}
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-4">
        <AnimatePresence mode="wait" custom={dir}>
          {/* Step 0 – Target language */}
          {step === 0 && (
            <motion.div key="s0" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              <div className="mb-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 1 of 4</p>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                  What language do you want to learn?
                </h1>
              </div>
              <LanguageGrid selected={targetLang} onSelect={setTargetLang} />
            </motion.div>
          )}

          {/* Step 1 – Native language */}
          {step === 1 && (
            <motion.div key="s1" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              <div className="mb-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 2 of 4</p>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                  What's your native language?
                </h1>
              </div>
              <LanguageGrid selected={nativeLang} onSelect={setNativeLang} />
            </motion.div>
          )}

          {/* Step 2 – Goal */}
          {step === 2 && (
            <motion.div key="s2" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              <div className="mb-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 3 of 4</p>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                  Why are you learning?
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(({ id, icon: Icon, label, desc }, i) => {
                  const sel = goal === id;
                  return (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setGoal(id)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${sel ? "border-secondary bg-secondary/10" : "border-border bg-card hover:border-primary"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sel ? "bg-secondary/20" : "bg-muted"}`}>
                        <Icon className={`w-5 h-5 ${sel ? "text-secondary" : "text-muted-foreground"}`} />
                      </div>
                      <p className={`text-sm font-bold ${sel ? "text-secondary" : "text-foreground"}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3 – Self-assessment */}
          {step === 3 && (
            <motion.div key="s3" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              <div className="mb-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 4 of 5</p>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                  How would you describe your current level?
                </h1>
                <p className="text-sm text-muted-foreground mt-2">This helps us tailor your fluency test</p>
              </div>

              <div className="space-y-3">
                {[
                  { level: "beginner", label: "Complete Beginner", desc: "I'm just starting out", icon: Sparkles },
                  { level: "some", label: "Know a little", desc: "I know basic words/phrases", icon: Star },
                  { level: "intermediate", label: "Intermediate+", desc: "I can hold simple conversations", icon: Target }
                ].map(({ level, label, desc, icon: Icon }) => (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelfLevel(level)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${selfLevel === level
                      ? "border-secondary bg-secondary/10"
                      : "border-border bg-card hover:border-primary"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selfLevel === level ? "bg-secondary/20" : "bg-muted"}`}>
                      <Icon className={`w-6 h-6 ${selfLevel === level ? "text-secondary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${selfLevel === level ? "text-secondary" : "text-foreground"}`}>{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4 – Voice baseline */}
          {step === 4 && (
            <motion.div key="s4" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              <div className="mb-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 5 of 5</p>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight">
                  Read this phrase aloud
                </h1>
                <p className="text-sm text-muted-foreground mt-2">So MYNO can set your baseline fluency score</p>
              </div>

              {(() => {
                let currentTest;
                if (selfLevel === "beginner") {
                  currentTest = TEST_PHRASES.beginner;
                } else if (selfLevel === "some") {
                  currentTest = TEST_PHRASES.some;
                } else {
                  currentTest = {
                    instruction: TEST_PHRASES.intermediate.instruction(targetLang),
                    phrase: TEST_PHRASES.intermediate.phrase(targetLang),
                    lang: TEST_PHRASES.intermediate.lang(targetLang)
                  };
                }

                const instruction = typeof currentTest.instruction === 'function'
                  ? currentTest.instruction(targetLang)
                  : currentTest.instruction;
                const phrase = typeof currentTest.phrase === 'function'
                  ? currentTest.phrase(targetLang)
                  : currentTest.phrase;
                const lang = typeof currentTest.lang === 'function'
                  ? currentTest.lang(targetLang)
                  : currentTest.lang;

                return (
                  <>
                    <div className="bg-secondary/8 border border-secondary/20 rounded-2xl p-5 mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{instruction}</p>
                      <p className="text-base font-semibold text-foreground leading-relaxed italic">
                        "{phrase}"
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <MynoBird size="sm" speaking={recording} />
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={recording ? stopRecording : startRecording}
                        disabled={recordingDone}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${recording
                          ? "bg-destructive shadow-red-200"
                          : recordingDone
                            ? "bg-primary/30 cursor-not-allowed"
                            : "bg-secondary shadow-sea"
                          }`}
                      >
                        {recording && (
                          <div className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring" />
                        )}
                        {recording ? <Square className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
                      </motion.button>
                      <p className="text-xs text-muted-foreground font-medium">
                        {recording ? "Listening… Tap to stop" : recordingDone ? "✓ Recorded!" : "Tap the mic to start"}
                      </p>
                      {recording && liveTranscript && (
                        <p className="text-sm text-muted-foreground italic mt-2">"{liveTranscript}"</p>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA – always in bottom zone */}
      <div className="px-6 pb-10 pt-4">
        {step === 4 && (
          <div className="mb-4">
            <button
              onClick={() => {
                // Skip test - set default score 15 without analyzer animation
                setCalculatedScore(15);
                setSkipped(true);
                setShowAnalyzer(true);
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Skip test — I will assess later
            </button>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step === 4) {
              // Get the target phrase based on selfLevel
              let targetPhrase;
              if (selfLevel === "beginner") {
                targetPhrase = TEST_PHRASES.beginner.phrase;
              } else if (selfLevel === "some") {
                targetPhrase = TEST_PHRASES.some.phrase;
              } else {
                targetPhrase = TEST_PHRASES.intermediate.phrase(targetLang);
              }

              // Calculate real fluency score based on recorded speech
              const rawScore = calculateFluencyScore(recordedSpeech, targetPhrase);

              // Adjust score based on self-level
              let adjustedScore = rawScore;
              if (selfLevel === "beginner") {
                // Beginner gets a boost (they're not expected to be perfect)
                adjustedScore = Math.min(99, rawScore + 15);
              } else if (selfLevel === "some") {
                // Some knowledge gets a small boost
                adjustedScore = Math.min(99, rawScore + 8);
              }
              // Intermediate stays as-is

              setCalculatedScore(adjustedScore);
              setSkipped(false);
              setShowAnalyzer(true);
            } else {
              goNext();
            }
          }}
          disabled={
            (step === 0 && !targetLang) ||
            (step === 1 && !nativeLang) ||
            (step === 2 && !goal) ||
            (step === 3 && !selfLevel) ||
            (step === 4 && !recordingDone)
          }
          className="thumb-cta w-full bg-secondary text-secondary-foreground shadow-sea disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {step === 4 ? "Analyze My Voice" : "Continue"}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
