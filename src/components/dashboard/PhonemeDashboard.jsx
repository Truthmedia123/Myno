import React, { useState, useCallback, useMemo } from 'react';
import { getPhonemeStatus, generatePhonemeDrill, speakPhonemeExample, getProgressRingProps } from '../../lib/phonemeUtils';

/**
 * Phoneme progress dashboard with visual feedback and TTS practice
 * @component
 * @param {object} props
 * @param {object} props.userProfile - User profile with weakPhonemes and phonemeAccuracy
 * @param {string} props.targetLanguage - Target language code
 * @param {function} props.onPracticeSelect - Callback when user selects a phoneme for practice
 */
const PhonemeDashboard = React.memo(function PhonemeDashboard({
    userProfile = {},
    targetLanguage = 'English',
    onPracticeSelect
}) {
    const [selectedPhoneme, setSelectedPhoneme] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Extract phoneme data from user profile
    const { weakPhonemes = [], phonemeAccuracy = {} } = userProfile;

    // Get all phonemes for the target language
    const allPhonemes = useMemo(() => {
        // In a real app, this would come from memoryManager.js
        // For now, we'll use a combination of weak phonemes and common ones
        const commonPhonemes = [
            "'th' sounds (think/that)",
            "'v' vs 'w' (very/wary)",
            "Short vowels (bit vs beat)",
            "Silent letters (know/write)",
            "Rolled 'r' and 'rr'",
            "Nasal vowels (on/an/in/un)",
            "'ch' sound (Bach/ich)",
            "Pitch accent patterns",
            "Tones (4 tones + neutral)",
            "Guttural sounds (ع/غ/خ/ح)"
        ].filter(phoneme =>
            phoneme.toLowerCase().includes(targetLanguage.toLowerCase().slice(0, 3)) ||
            targetLanguage === 'English'
        );

        // Combine with weak phonemes, deduplicate
        const combined = [...new Set([...weakPhonemes, ...commonPhonemes])];
        return combined.slice(0, 8); // Limit to 8 for UI
    }, [weakPhonemes, targetLanguage]);

    // Generate drill data for selected phoneme
    const selectedDrill = useMemo(() => {
        if (!selectedPhoneme) return null;
        return generatePhonemeDrill(selectedPhoneme, targetLanguage);
    }, [selectedPhoneme, targetLanguage]);

    // Handle phoneme card click
    const handlePhonemeClick = useCallback((phoneme) => {
        setSelectedPhoneme(prev => prev === phoneme ? null : phoneme);
    }, []);

    // Handle TTS button click
    const handleSpeakExample = useCallback(async () => {
        if (!selectedDrill || !selectedDrill.practiceWords.length) return;

        setIsSpeaking(true);
        const word = selectedDrill.practiceWords[0];
        const langCode = targetLanguage === 'Spanish' ? 'es-ES' :
            targetLanguage === 'French' ? 'fr-FR' :
                targetLanguage === 'German' ? 'de-DE' :
                    targetLanguage === 'Japanese' ? 'ja-JP' : 'en-US';

        await speakPhonemeExample(word, langCode);
        setIsSpeaking(false);
    }, [selectedDrill, targetLanguage]);

    // Handle start drill button
    const handleStartDrill = useCallback(() => {
        if (!selectedPhoneme || !onPracticeSelect) return;
        onPracticeSelect(selectedPhoneme);
    }, [selectedPhoneme, onPracticeSelect]);

    // Progress ring component
    const ProgressRing = useCallback(({ accuracy, size = 80 }) => {
        const { radius, circumference, strokeDashoffset, center, strokeWidth } =
            getProgressRingProps(accuracy, size);
        const status = getPhonemeStatus('', accuracy);

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        className="text-gray-200"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className={`text-${status.color}-500 transition-all duration-700 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold text-${status.color}-700`}>
                        {Math.round(accuracy * 100)}%
                    </span>
                </div>
            </div>
        );
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Your Pronunciation Progress</h1>
                <p className="text-gray-600 mt-2">
                    Track your phoneme mastery and practice difficult sounds
                </p>
            </div>

            {/* Phoneme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {allPhonemes.map((phoneme) => {
                    const accuracy = phonemeAccuracy[phoneme] || 0.3;
                    const status = getPhonemeStatus(phoneme, accuracy);
                    const isSelected = selectedPhoneme === phoneme;

                    return (
                        <button
                            key={phoneme}
                            onClick={() => handlePhonemeClick(phoneme)}
                            className={`${status.bgColor} rounded-xl p-4 border-2 transition-all duration-200 ${isSelected ? `border-${status.color}-500 shadow-md` : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-${status.color}-100`}>
                                    <span className={`text-xl text-${status.color}-700`}>{status.icon}</span>
                                </div>

                                {/* Phoneme Name */}
                                <h3 className={`font-medium text-sm text-center ${status.textColor} mb-2 line-clamp-2`}>
                                    {phoneme}
                                </h3>

                                {/* Progress Ring */}
                                <div className="mb-2">
                                    <ProgressRing accuracy={accuracy} size={60} />
                                </div>

                                {/* Status Badge */}
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${status.color}-100 ${status.textColor}`}>
                                    {status.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Practice Panel */}
            {selectedPhoneme && selectedDrill && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Practice: <span className="text-blue-700">{selectedPhoneme}</span>
                            </h3>
                            <p className="text-gray-700 mb-4">{selectedDrill.tip}</p>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-800 mb-2">Practice Words:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDrill.practiceWords.map((word, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-blue-800 font-medium shadow-sm"
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* TTS Button */}
                            <button
                                onClick={handleSpeakExample}
                                disabled={isSpeaking}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-blue-300 rounded-xl text-blue-700 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
                            >
                                <span className="text-xl">🎤</span>
                                <span>{isSpeaking ? 'Speaking...' : 'Hear Example'}</span>
                            </button>

                            {/* Start Drill Button */}
                            <button
                                onClick={handleStartDrill}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                            >
                                <span className="text-lg">▶</span>
                                <span>Start Drill</span>
                            </button>
                        </div>
                    </div>

                    {/* Audio Prompt */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-gray-700 text-sm">
                            <span className="font-medium">Audio Prompt:</span> {selectedDrill.audioPrompt}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedPhoneme && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-3">👆</div>
                    <p className="text-lg">Click on a phoneme card to see practice words and start a drill</p>
                </div>
            )}

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Progress Legend</h4>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-sm text-gray-700">Weak (0-59%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-gray-700">Improving (60-84%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-gray-700">Mastered (85-100%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PhonemeDashboard;