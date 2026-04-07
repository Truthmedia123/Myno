/**
 * Adaptive mascot avatar component
 * Reacts to user behavior and learning context with dynamic expressions
 * @module AdaptiveMascotAvatar
 */

import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdaptiveMascot } from '@/hooks/useAdaptiveMascot';
import { getMascotColorScheme, getMascotAnimation } from '@/data/mynoMascot';

/**
 * @typedef {Object} AdaptiveMascotAvatarProps
 * @property {Object} userProfile - User profile object
 * @property {Object} context - Initial mascot context
 * @property {'sm' | 'md' | 'lg' | 'xl'} size - Avatar size
 * @property {boolean} showTip - Whether to show adaptive tip
 * @property {boolean} animated - Whether to apply animations
 * @property {Function} onStateChange - Callback when mascot state changes
 * @property {string} className - Additional CSS classes
 */

/**
 * Adaptive mascot avatar component
 * @param {AdaptiveMascotAvatarProps} props
 */
const AdaptiveMascotAvatar = memo(function AdaptiveMascotAvatar({
    userProfile = null,
    context = {},
    size = 'md',
    showTip = true,
    animated = true,
    onStateChange = () => { },
    className = ''
}) {
    const {
        state,
        prompt,
        context: mascotContext,
        updateContext,
        recordInteraction,
        getAdaptiveTip,
        getMotivationalMessage
    } = useAdaptiveMascot(userProfile, context);

    const [isVisible, setIsVisible] = useState(true);
    const [pulse, setPulse] = useState(false);

    // Notify parent of state changes
    useEffect(() => {
        onStateChange(state);
    }, [state, onStateChange]);

    // Auto-update context periodically
    useEffect(() => {
        const interval = setInterval(() => {
            updateContext({
                sessionDuration: mascotContext.sessionDuration + 0.5
            });
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [updateContext, mascotContext.sessionDuration]);

    // Trigger pulse animation on state change
    useEffect(() => {
        setPulse(true);
        const timer = setTimeout(() => setPulse(false), 1000);
        return () => clearTimeout(timer);
    }, [state.expression]);

    // Size mappings
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-12 h-12 text-2xl',
        lg: 'w-16 h-16 text-3xl',
        xl: 'w-20 h-20 text-4xl'
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    // Get color scheme
    const colors = getMascotColorScheme(state);

    // Get animation class
    const animationClass = animated ? getMascotAnimation(state, 'normal') : '';
    const pulseClass = pulse ? 'animate-pulse' : '';

    // Handle click interaction
    const handleClick = () => {
        // Cycle through states on click for demo/debug
        const states = ['thinking', 'celebrating', 'correcting', 'encouraging', 'focused', 'playful'];
        const currentIndex = states.findIndex(s => s === state.expression);
        const nextState = states[(currentIndex + 1) % states.length];

        recordInteraction(nextState, { phonemeAccuracy: 0.8 });

        // Trigger visual feedback
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
    };

    // Get current tip
    const currentTip = showTip ? getAdaptiveTip() : '';
    const motivationalMessage = getMotivationalMessage();

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            {/* Mascot Avatar */}
            <div className="relative">
                <button
                    type="button"
                    onClick={handleClick}
                    className={cn(
                        'relative flex items-center justify-center rounded-full transition-all duration-300',
                        sizeClass,
                        colors.bg,
                        animationClass,
                        pulseClass,
                        'hover:scale-105 active:scale-95',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        colors.ring,
                        'border-2',
                        colors.border,
                        'shadow-lg',
                        'cursor-pointer select-none'
                    )}
                    aria-label={`Myno mascot: ${state.expression} ${state.tip}`}
                    title={state.tip}
                >
                    {/* Animated expression */}
                    <span
                        className={cn(
                            'transition-transform duration-300',
                            animated && 'hover:scale-110'
                        )}
                        role="img"
                        aria-hidden="true"
                    >
                        {state.expression}
                    </span>

                    {/* Status indicator dot */}
                    <div className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                        colors.bg.replace('bg-', 'bg-').replace('-50', '-500')
                    )} />
                </button>

                {/* Speech bubble for tip */}
                {showTip && currentTip && (
                    <div className={cn(
                        'absolute -top-12 left-1/2 transform -translate-x-1/2',
                        'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
                        colors.bg,
                        colors.text,
                        'border',
                        colors.border,
                        'shadow-lg',
                        'animate-fade-in'
                    )}>
                        <div className="relative">
                            {currentTip}
                            {/* Speech bubble pointer */}
                            <div className={cn(
                                'absolute -bottom-2 left-1/2 transform -translate-x-1/2',
                                'w-0 h-0 border-l-4 border-r-4 border-t-4',
                                'border-l-transparent border-r-transparent',
                                colors.border.replace('border-', 'border-t-')
                            )} />
                        </div>
                    </div>
                )}
            </div>

            {/* Motivational message (optional) */}
            {motivationalMessage && (
                <div className={cn(
                    'text-xs text-center max-w-[200px] px-2 py-1 rounded',
                    colors.bg,
                    colors.text,
                    'opacity-80'
                )}>
                    {motivationalMessage}
                </div>
            )}

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-1 text-center">
                    <div>State: {state.expression}</div>
                    <div>Session: {Math.round(mascotContext.sessionDuration)}m</div>
                    <div>Streak: {mascotContext.consecutiveCorrect}</div>
                </div>
            )}
        </div>
    );
});

export default AdaptiveMascotAvatar;

/**
 * Helper component for mascot with auto-context
 */
export function MascotWithContext({ userProfile, children }) {
    const { state, context, updateContext } = useAdaptiveMascot(userProfile);

    return children({
        state,
        context,
        updateContext,
        colors: getMascotColorScheme(state),
        animation: getMascotAnimation(state)
    });
}

/**
 * Simple mascot badge for inline display
 */
export function MascotBadge({ state, size = 'sm' }) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-base',
        lg: 'w-10 h-10 text-lg'
    };

    const colors = getMascotColorScheme(state);

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-full',
                sizeClasses[size],
                colors.bg,
                colors.text,
                'border',
                colors.border
            )}
            role="img"
            aria-label={`Myno: ${state.tip}`}
            title={state.tip}
        >
            {state.expression}
        </span>
    );
}