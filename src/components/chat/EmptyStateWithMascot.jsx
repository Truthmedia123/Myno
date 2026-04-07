import React, { memo, useEffect, useState } from 'react';
import MynoAvatar from '../ui/MynoAvatar';

/**
 * EmptyStateWithMascot component
 * @param {Object} props
 * @param {'new'|'returning'} props.userType - Type of user
 * @param {string} props.targetLanguage - Target language for learning
 * @param {Function} props.onStart - Callback when start button is clicked
 * @returns {JSX.Element}
 */
const EmptyStateWithMascot = memo(({ userType, targetLanguage, onStart }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const messages = {
        new: {
            title: "Welcome to Myno! 🦉",
            subtitle: `Let's start learning ${targetLanguage} together.`,
            button: "Start your first scenario"
        },
        returning: {
            title: "Welcome back! 🎯",
            subtitle: `Ready to continue your ${targetLanguage} journey?`,
            button: "Continue learning"
        }
    };

    const { title, subtitle, button } = messages[userType] || messages.new;

    return (
        <div className={`flex flex-col items-center justify-center min-h-[60vh] px-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Glassmorphism card */}
            <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                {/* Mascot */}
                <div className="flex justify-center mb-6">
                    <MynoAvatar
                        state="encouraging"
                        targetLanguage={targetLanguage}
                        size="lg"
                    />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                    {title}
                </h2>

                {/* Subtitle */}
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    {subtitle}
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                    {[
                        "🎯 CEFR-aligned scenarios",
                        "🔊 Pronunciation feedback",
                        "📈 Progress tracking",
                        "🦉 Adaptive mascot guidance"
                    ].map((feature, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                            <span className="text-lg">{feature.split(' ')[0]}</span>
                            <span>{feature.slice(3)}</span>
                        </li>
                    ))}
                </ul>

                {/* Start button */}
                <button
                    onClick={onStart}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                    aria-label={button}
                >
                    {button}
                </button>

                {/* Hint */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
                    Click or tap anywhere to begin
                </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-blue-300/10 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/10 rounded-full blur-xl" />
        </div>
    );
});

EmptyStateWithMascot.displayName = 'EmptyStateWithMascot';

export default EmptyStateWithMascot;