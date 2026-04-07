import React, { memo, useCallback } from 'react';

/**
 * PhonemeFeedback component
 * @param {Object} props
 * @param {number} props.accuracy - Accuracy score between 0 and 1
 * @param {string} props.phoneme - Phoneme name (e.g., "rolled r")
 * @param {string} props.targetLanguage - Target language for TTS
 * @returns {JSX.Element}
 */
const PhonemeFeedback = memo(({ accuracy, phoneme, targetLanguage = 'en-US' }) => {
    const getFeedbackColor = useCallback(() => {
        if (accuracy > 0.8) return 'green';
        if (accuracy >= 0.5) return 'yellow';
        return 'red';
    }, [accuracy]);

    const getFeedbackAnimation = useCallback(() => {
        if (accuracy > 0.8) return 'animate-green-flash scale-105';
        if (accuracy >= 0.5) return 'animate-pulse';
        return 'animate-shake';
    }, [accuracy]);

    const getRingColor = useCallback(() => {
        if (accuracy > 0.8) return 'ring-green-400';
        if (accuracy >= 0.5) return 'ring-yellow-400';
        return 'ring-red-400';
    }, [accuracy]);

    const getTip = useCallback(() => {
        if (accuracy > 0.8) return 'Excellent! Keep practicing.';
        if (accuracy >= 0.5) return 'Good effort. Try to exaggerate the sound.';
        return 'Focus on mouth position. Listen and repeat.';
    }, [accuracy]);

    const handleTTS = useCallback(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(phoneme);
        utterance.lang = targetLanguage;
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }, [phoneme, targetLanguage]);

    const color = getFeedbackColor();
    const animation = getFeedbackAnimation();
    const ringColor = getRingColor();
    const tip = getTip();
    const percentage = Math.round(accuracy * 100);

    return (
        <div className={`p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-4 ${ringColor} transition-all duration-300 ${animation}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {phoneme}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${color === 'green' ? 'bg-green-500' :
                                        color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {percentage}%
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleTTS}
                    className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    aria-label={`Listen to ${phoneme} pronunciation`}
                    title="Listen pronunciation"
                >
                    <span className="text-xl">🎤</span>
                </button>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {tip}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {targetLanguage}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {color === 'green' ? 'Mastered' : color === 'yellow' ? 'Improving' : 'Needs Practice'}
                </span>
            </div>
        </div>
    );
});

PhonemeFeedback.displayName = 'PhonemeFeedback';

export default PhonemeFeedback;