import React, { memo, useCallback } from 'react';
import { getLanguageCode, speakText, formatWarmupAudioText } from '../../lib/lessonPrepper.js';

/**
 * Micro-lesson card displayed before AI conversation starts.
 * Provides vocabulary, grammar, and cultural tips for scenario preparation.
 * @param {Object} props - Component props
 * @param {Object} props.lesson - Micro-lesson object from getMicroLesson()
 * @param {Function} props.onClose - Callback when card is closed
 * @param {Function} props.onStartScenario - Callback when "Start Practice" is clicked
 * @param {string} props.targetLanguage - Target language name (e.g., "Spanish")
 */
const MicroLessonCard = memo(function MicroLessonCard({
    lesson,
    onClose,
    onStartScenario,
    targetLanguage = 'English'
}) {
    const handlePlayVocab = useCallback(() => {
        if (!lesson?.vocab) return;

        const audioText = formatWarmupAudioText(lesson.vocab);
        const languageCode = getLanguageCode(targetLanguage);
        speakText(audioText, languageCode);
    }, [lesson?.vocab, targetLanguage]);

    const handleStart = useCallback(() => {
        if (onStartScenario) {
            onStartScenario(lesson?.scenarioId);
        }
    }, [onStartScenario, lesson?.scenarioId]);

    if (!lesson) {
        return null;
    }

    const { scenarioTitle, cefr, vocab = [], grammar = '', tip = '', warmupPrompt = '' } = lesson;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
            <div className="relative w-full max-w-md animate-slide-up-bounce">
                {/* Glassmorphism card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                                        CEFR {cefr}
                                    </span>
                                    <span className="text-xs opacity-90">Pre‑lesson Prep</span>
                                </div>
                                <h3 className="text-xl font-bold">{scenarioTitle}</h3>
                                <p className="text-sm opacity-90 mt-1">{warmupPrompt}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white text-2xl leading-none p-1 transition-colors"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-5">
                        {/* Vocabulary Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="text-blue-600">📚</span> Key Vocabulary
                                </h4>
                                <button
                                    onClick={handlePlayVocab}
                                    className="flex items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full transition-all active:scale-95"
                                    aria-label="Play vocabulary pronunciation"
                                >
                                    <span>🎤</span> Practice Pronunciation
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {vocab.map((word, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-medium"
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Grammar Note */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 text-lg">📝</span>
                                <div>
                                    <h5 className="font-semibold text-amber-800 text-sm">Grammar Focus</h5>
                                    <p className="text-amber-900">{grammar}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cultural Tip */}
                        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <span className="text-emerald-600 text-lg">💡</span>
                                <div>
                                    <h5 className="font-semibold text-emerald-800 text-sm">Cultural Tip</h5>
                                    <p className="text-emerald-900">{tip}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Review Later
                            </button>
                            <button
                                onClick={handleStart}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-on-press"
                            >
                                Start Practice
                            </button>
                        </div>

                        {/* TTS Note */}
                        <div className="text-xs text-gray-500 text-center pt-2">
                            Click 🎤 to hear vocabulary pronounced in {targetLanguage}.
                            {!('speechSynthesis' in window) && (
                                <span className="block text-amber-600 mt-1">
                                    Note: Text‑to‑speech not supported in your browser.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

MicroLessonCard.displayName = 'MicroLessonCard';

export default MicroLessonCard;