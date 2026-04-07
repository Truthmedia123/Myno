import React, { memo, useEffect, useCallback, useState } from 'react';

/**
 * ScenarioUnlockCelebration component
 * @param {Object} props
 * @param {boolean} props.unlocked - Whether to show the celebration
 * @param {string} props.cefrLevel - CEFR level that was unlocked (e.g., "A2")
 * @param {Function} props.onComplete - Callback when celebration completes/dismissed
 * @returns {JSX.Element|null}
 */
const ScenarioUnlockCelebration = memo(({ unlocked, cefrLevel, onComplete }) => {
    const [visible, setVisible] = useState(unlocked);
    const [dismissed, setDismissed] = useState(false);

    const handleDismiss = useCallback(() => {
        setVisible(false);
        setDismissed(true);
        onComplete?.();
    }, [onComplete]);

    useEffect(() => {
        if (unlocked && !dismissed) {
            setVisible(true);
            const timer = setTimeout(handleDismiss, 3000);
            return () => clearTimeout(timer);
        }
    }, [unlocked, dismissed, handleDismiss]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            role="alert"
            aria-live="assertive"
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm" />

            {/* Celebration content */}
            <div className="relative animate-slide-up-bounce pointer-events-auto">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 max-w-md border border-gray-200 dark:border-gray-700">
                    {/* Confetti emojis */}
                    <div className="flex justify-center gap-4 mb-6 text-4xl">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎉</span>
                        <span className="animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
                        <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🦉</span>
                        <span className="animate-bounce" style={{ animationDelay: '600ms' }}>🎊</span>
                        <span className="animate-bounce" style={{ animationDelay: '800ms' }}>🌟</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                        {cefrLevel} Unlocked!
                    </h2>

                    {/* Subtitle */}
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        New scenarios are now available. Keep up the great work!
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse" />
                    </div>

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 active:scale-95"
                        aria-label="Dismiss celebration"
                    >
                        Continue Learning
                    </button>

                    {/* Auto-dismiss hint */}
                    <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
                        Auto-dismiss in 3 seconds
                    </p>
                </div>
            </div>

            {/* Click-to-dismiss overlay */}
            <div
                className="absolute inset-0 cursor-pointer pointer-events-auto"
                onClick={handleDismiss}
                aria-hidden="true"
            />
        </div>
    );
});

ScenarioUnlockCelebration.displayName = 'ScenarioUnlockCelebration';

export default ScenarioUnlockCelebration;