import React, { memo } from 'react';
import { MYNO_STATES } from '../../data/mynoMascot';

/**
 * MynoAvatar component
 * @param {Object} props
 * @param {keyof typeof MYNO_STATES} props.state - Mascot state
 * @param {string} props.targetLanguage - Target language for learning
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Avatar size
 * @returns {JSX.Element}
 */
const MynoAvatar = memo(({ state, targetLanguage = 'English', size = 'md' }) => {
    const mascotState = MYNO_STATES[state] || MYNO_STATES.encouraging;
    const { expression, animation, tip } = mascotState;

    const sizeClasses = {
        sm: 'w-12 h-12 text-2xl',
        md: 'w-16 h-16 text-3xl',
        lg: 'w-20 h-20 text-4xl'
    };

    const containerClasses = `flex flex-col items-center gap-2 ${sizeClasses[size]}`;

    return (
        <div className={containerClasses} aria-hidden="true">
            {/* Avatar circle */}
            <div
                className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg ${animation}`}
                aria-label={`Myno the Owl, ${state}`}
                role="img"
            >
                {/* Emoji expression */}
                <span className="select-none" aria-hidden="true">
                    {expression}
                </span>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse" />
            </div>

            {/* Tip text (only for md/lg sizes) */}
            {(size === 'md' || size === 'lg') && (
                <div className="text-center">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 max-w-[120px] truncate">
                        {tip}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500">
                        {targetLanguage}
                    </p>
                </div>
            )}
        </div>
    );
});

MynoAvatar.displayName = 'MynoAvatar';

export default MynoAvatar;