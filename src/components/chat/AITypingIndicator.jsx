import React, { memo } from 'react';

/**
 * AITypingIndicator component
 * @param {Object} props
 * @param {boolean} props.isThinking - Whether the AI is currently thinking/typing
 * @returns {JSX.Element|null}
 */
const AITypingIndicator = memo(({ isThinking }) => {
    if (!isThinking) return null;

    return (
        <div
            className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md"
            role="status"
            aria-live="polite"
        >
            {/* Bouncing dots */}
            <div className="flex items-center gap-1">
                <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-dot"
                    style={{ animationDelay: '0ms' }}
                />
                <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-dot"
                    style={{ animationDelay: '150ms' }}
                />
                <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-dot"
                    style={{ animationDelay: '300ms' }}
                />
            </div>

            {/* Text */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Myno is thinking...
            </span>
        </div>
    );
});

AITypingIndicator.displayName = 'AITypingIndicator';

export default AITypingIndicator;