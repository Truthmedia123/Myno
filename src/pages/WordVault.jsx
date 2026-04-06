import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, MagnifyingGlassIcon, BookOpenIcon, SpeakerWaveIcon, PlusIcon, ArrowPathIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseDatabase } from "@/hooks/useFirebaseDatabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { shareContent, getShareText } from "@/lib/utils";

// Local storage caching functions
const cacheWordsLocally = (words) => {
  try {
    localStorage.setItem("myno_cached_words", JSON.stringify(words));
    localStorage.setItem("myno_words_cached_at", new Date().toISOString());
  } catch (e) {
    // Ignore localStorage errors (e.g., private browsing)
  }
};

const getLocalWords = () => {
  try {
    const cached = localStorage.getItem("myno_cached_words");
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

// WordCard component as per specification
const WordCard = ({ word, onDelete, onUpdateMastery }) => {
  const LANG_MAP = {
    "English": "en-US", "Spanish": "es-ES", "French": "fr-FR", "German": "de-DE",
    "Italian": "it-IT", "Portuguese": "pt-BR", "Japanese": "ja-JP", "Korean": "ko-KR",
    "Chinese": "zh-CN", "Arabic": "ar-SA", "Hindi": "hi-IN", "Russian": "ru-RU",
    "Dutch": "nl-NL", "Turkish": "tr-TR", "Swedish": "sv-SE", "Greek": "el-GR"
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = LANG_MAP[word.language] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-2">
      {/* Top row: word + language badge */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{word.word}</h3>
          {word.phonetic && (
            <p className="text-xs text-muted-foreground">{word.phonetic}</p>
          )}
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          {word.language || "Unknown"}
        </span>
      </div>

      {/* Definition */}
      {word.definition && (
        <p className="text-sm text-foreground">{word.definition}</p>
      )}

      {/* Example sentence */}
      {word.example_sentence && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
          {word.example_sentence}
        </p>
      )}

      {/* Mastery bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Mastery</span>
          <span>{word.mastery_level || 0}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${word.mastery_level || 0}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={speakWord}
          className="text-xs px-3 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground hover:bg-secondary/40"
        >
          🔊 Pronounce
        </button>
        <button
          onClick={() => onUpdateMastery(word.id, Math.min((word.mastery_level || 0) + 25, 100))}
          className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
        >
          ✓ I know this
        </button>
        <button
          onClick={() => onDelete(word.id)}
          className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-400 hover:bg-red-100 ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default function WordVault() {
  const [search, setSearch] = useState("");
  const [addInput, setAddInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [filterLang, setFilterLang] = useState("All");
  const qc = useQueryClient();

  const dbActions = useFirebaseDatabase();

  const [isOffline, setIsOffline] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["words", dbActions],
    queryFn: async () => {
      try {
        // Try Firestore first
        const result = await dbActions.getSavedWords();
        // Cache the result locally
        cacheWordsLocally(result);
        setIsOffline(false);
        return result;
      } catch (error) {
        console.log("Offline mode: falling back to cached words", error);
        // Fallback to local cache
        const localWords = getLocalWords();
        if (localWords.length > 0) {
          setIsOffline(true);
          return localWords;
        }
        // If no cache and offline, return empty array
        setIsOffline(true);
        return [];
      }
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => dbActions.deleteSavedWord(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["words"] }),
  });

  const updateMasteryMut = useMutation({
    mutationFn: async ({ wordId, newLevel }) => {
      await updateDoc(doc(db, "savedWords", wordId), { mastery_level: newLevel });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["words"] }),
  });

  // Extract unique languages from words
  const languages = ["All", ...new Set(words.map(w => w.language).filter(Boolean))];

  // Filter words based on search and language
  const filteredWords = words.filter(w => {
    const matchesSearch = w.word?.toLowerCase().includes(search.toLowerCase());
    const matchesLang = filterLang === "All" || w.language === filterLang;
    return matchesSearch && matchesLang;
  });

  const handleUpdateMastery = async (wordId, newLevel) => {
    updateMasteryMut.mutate({ wordId, newLevel });
  };

  const handleDelete = async (wordId) => {
    deleteMut.mutate(wordId);
  };

  const addWord = async () => {
    const w = addInput.trim();
    if (!w) return;
    setIsAdding(true);

    // For now, we'll save with default English language
    // In a real implementation, we might ask for language or detect it
    await dbActions.createSavedWord({
      word: w,
      definition: "",
      example_sentence: "",
      phonetic: "",
      mastery_level: 0,
      language: "English"
    });

    qc.invalidateQueries({ queryKey: ["words"] });
    setAddInput("");
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-foreground">Word Vault</h1>
            <p className="text-[11px] text-muted-foreground">{words.length} words collected • {languages.length - 1} languages</p>
          </div>
        </div>

        {/* Language filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setFilterLang(lang)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border transition-colors ${filterLang === lang
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted-foreground border-border"
                }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Share Vault Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={() => shareContent(getShareText("word_vault", { language: filterLang === "All" ? "multiple languages" : filterLang, count: words.length }))}
            className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 font-medium"
          >
            Share Vault 📲
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your words..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl border-2 border-border bg-card text-sm outline-none focus:border-secondary transition-colors"
          />
        </div>

        {/* Add word */}
        <div className="flex gap-2">
          <input
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWord()}
            placeholder="Add a word manually..."
            className="flex-1 h-10 px-4 rounded-2xl border-2 border-border bg-card text-sm outline-none focus:border-secondary transition-colors"
          />
          <button
            onClick={addWord}
            disabled={!addInput.trim() || isAdding}
            className="w-10 h-10 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-40"
          >
            {isAdding ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="mx-4 mb-3 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
          <span className="text-yellow-500">📵</span>
          <p className="text-xs text-yellow-600">Showing cached words — you are offline</p>
        </div>
      )}

      {/* Flashcards button */}
      {filteredWords.length > 0 && (
        <div className="px-4 mb-3">
          <button
            onClick={() => { setFlashcardMode(true); setFlashcardIndex(0); setShowAnswer(false); }}
            className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
          >
            🃏 Flashcards
          </button>
        </div>
      )}

      {/* Word list */}
      <div className="px-4 pt-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-16"><ArrowPathIcon className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filteredWords.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpenIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-bold text-foreground">No words yet</p>
            <p className="text-sm text-muted-foreground px-8">
              {filterLang !== "All"
                ? `No ${filterLang} words found. Try another language filter.`
                : "Chat with Myno — interesting words get saved automatically!"}
            </p>
          </div>
        ) : (
          filteredWords.map((word, i) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <WordCard
                word={word}
                onDelete={handleDelete}
                onUpdateMastery={handleUpdateMastery}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Flashcard Mode Overlay */}
      {flashcardMode && filteredWords.length > 0 && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold">Flashcards 🃏</h2>
            <button onClick={() => setFlashcardMode(false)} className="text-muted-foreground">✕ Exit</button>
          </div>
          <div className="flex gap-1 px-4 pt-3">
            {filteredWords.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= flashcardIndex ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-xs text-muted-foreground mb-2">{flashcardIndex + 1} of {filteredWords.length}</p>
            <div
              className="w-full max-w-sm bg-card border rounded-3xl p-8 cursor-pointer shadow-lg active:scale-98 transition-transform"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <p className="text-3xl font-bold text-foreground mb-2">{filteredWords[flashcardIndex]?.word}</p>
              {filteredWords[flashcardIndex]?.phonetic && (
                <p className="text-sm text-muted-foreground mb-3">{filteredWords[flashcardIndex].phonetic}</p>
              )}
              {showAnswer ? (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-base text-foreground">{filteredWords[flashcardIndex]?.definition}</p>
                  {filteredWords[flashcardIndex]?.example_sentence && (
                    <p className="text-sm text-muted-foreground italic mt-2">{filteredWords[flashcardIndex].example_sentence}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">Tap to reveal meaning</p>
              )}
            </div>
            <button
              onClick={() => {
                const u = new SpeechSynthesisUtterance(filteredWords[flashcardIndex]?.word);
                const LANG_MAP = { English: "en-US", Spanish: "es-ES", French: "fr-FR", German: "de-DE", Italian: "it-IT", Portuguese: "pt-BR", Japanese: "ja-JP", Korean: "ko-KR", Chinese: "zh-CN", Arabic: "ar-SA", Hindi: "hi-IN", Russian: "ru-RU", Dutch: "nl-NL", Turkish: "tr-TR", Swedish: "sv-SE", Greek: "el-GR" };
                u.lang = LANG_MAP[filteredWords[flashcardIndex]?.language] || "en-US";
                window.speechSynthesis.speak(u);
              }}
              className="mt-4 text-sm text-muted-foreground flex items-center gap-1 hover:text-primary"
            >
              🔊 Hear pronunciation
            </button>
          </div>
          <div className="p-6 flex gap-3">
            <button
              onClick={() => { setShowAnswer(false); setFlashcardIndex(prev => Math.max(0, prev - 1)); }}
              disabled={flashcardIndex === 0}
              className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium disabled:opacity-30"
            >
              ← Back
            </button>
            <button
              onClick={() => { setShowAnswer(false); if (flashcardIndex < filteredWords.length - 1) { setFlashcardIndex(prev => prev + 1); } else { setFlashcardMode(false); } }}
              className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold"
            >
              {flashcardIndex < filteredWords.length - 1 ? "Next →" : "Done ✓"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {[
            { path: "/", icon: "🏠", label: "Home" },
            { path: "/chat", icon: "💬", label: "Coach" },
            { path: "/vault", icon: "📖", label: "Vault" },
            { path: "/pro", icon: "👑", label: "Pro" },
          ].map(({ path, icon, label }) => {
            const active = path === "/vault";
            return (
              <Link key={path} to={path} className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl ${active ? "bg-primary/20" : ""}`}>
                <span className="text-lg leading-none">{icon}</span>
                <span className={`text-[10px] font-semibold ${active ? "text-secondary" : "text-muted-foreground"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
