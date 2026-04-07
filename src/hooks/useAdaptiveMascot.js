/**
 * Adaptive mascot hook for Myno AI Tutor
 * Reacts to user behavior, progress, and context to provide personalized mascot states
 * @module useAdaptiveMascot
 */

import { useState, useEffect, useCallback } from 'react';
import { getMynoState, generateMynoPrompt } from '@/data/mynoMascot';

/**
 * @typedef {Object} MascotContext
 * @property {number} sessionMessages - Messages in current session
 * @property {number} consecutiveCorrect - Consecutive correct answers
 * @property {number} timeOfDay - Hour of day (0-23)
 * @property {boolean} isStreakActive - Whether user has active streak
 * @property {number} phonemeAccuracy - Average phoneme accuracy (0-1)
 * @property {string} lastInteractionType - 'correction' | 'celebration' | 'neutral'
 * @property {number} sessionDuration - Session duration in minutes
 */

/**
 * Adaptive mascot hook
 * @param {Object} userProfile - User profile object
 * @param {MascotContext} context - Current learning context
 * @returns {Object} { state, prompt, updateContext, getAdaptiveTip }
 */
export function useAdaptiveMascot(userProfile = null, initialContext = {}) {
    const [context, setContext] = useState({
        sessionMessages: 0,
        consecutiveCorrect: 0,
        timeOfDay: new Date().getHours(),
        isStreakActive: false,
        phonemeAccuracy: 0.7,
        lastInteractionType: 'neutral',
        sessionDuration: 0,
        ...initialContext
    });

    const [state, setState] = useState(() =>
        getMynoState('encouraging', userProfile)
    );

    // Update time of day periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setContext(prev => ({
                ...prev,
                timeOfDay: new Date().getHours(),
                sessionDuration: prev.sessionDuration + 0.5 // Increment every 30 seconds
            }));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    /**
     * Determine adaptive mascot state based on context
     */
    const determineAdaptiveState = useCallback(() => {
        const {
            sessionMessages,
            consecutiveCorrect,
            timeOfDay,
            isStreakActive,
            phonemeAccuracy,
            lastInteractionType,
            sessionDuration
        } = context;

        // Base state from last interaction
        let baseState = lastInteractionType;
        if (!['thinking', 'celebrating', 'correcting', 'encouraging', 'offline'].includes(baseState)) {
            baseState = 'encouraging';
        }

        // Adaptive adjustments based on context
        if (consecutiveCorrect >= 5) {
            baseState = 'celebrating';
        } else if (phonemeAccuracy < 0.5 && sessionMessages > 3) {
            baseState = 'correcting';
        } else if (sessionDuration > 10 && sessionMessages < 5) {
            // User has been in session but not engaging much
            baseState = 'encouraging';
        }

        // Time-based adjustments
        if (timeOfDay < 6 || timeOfDay > 22) {
            // Late night / early morning
            if (baseState === 'celebrating') {
                baseState = 'encouraging'; // Quieter celebration
            }
        }

        // Streak-based encouragement
        if (isStreakActive && consecutiveCorrect >= 3) {
            baseState = 'celebrating';
        }

        return getMynoState(baseState, userProfile);
    }, [context, userProfile]);

    /**
     * Generate adaptive tip based on context
     */
    const getAdaptiveTip = useCallback(() => {
        const { consecutiveCorrect, phonemeAccuracy, sessionDuration } = context;
        const targetLanguage = userProfile?.target_language || 'English';

        if (consecutiveCorrect >= 5) {
            return `You're on fire! ${consecutiveCorrect} correct in a row!`;
        }

        if (phonemeAccuracy > 0.85) {
            return `Your pronunciation is excellent! Keep it up with ${targetLanguage}!`;
        }

        if (phonemeAccuracy < 0.5) {
            return `Let's focus on pronunciation. Try slowing down a bit.`;
        }

        if (sessionDuration > 15) {
            return `Great focus! You've been practicing for ${Math.round(sessionDuration)} minutes.`;
        }

        if (sessionDuration < 2 && context.sessionMessages > 5) {
            return `You're moving quickly! Take a moment to review.`;
        }

        // Time-based tips
        const hour = context.timeOfDay;
        if (hour < 6) {
            return "Early bird! Great time for focused practice.";
        } else if (hour > 22) {
            return "Night owl! Perfect for relaxed learning.";
        } else if (hour >= 12 && hour < 14) {
            return "Lunch break practice! Efficient use of time.";
        }

        return "You're making great progress!";
    }, [context, userProfile]);

    /**
     * Update context with new interaction data
     */
    const updateContext = useCallback((updates) => {
        setContext(prev => {
            const newContext = { ...prev, ...updates };

            // Auto-update state when context changes significantly
            if (updates.consecutiveCorrect !== undefined ||
                updates.phonemeAccuracy !== undefined ||
                updates.lastInteractionType !== undefined) {
                setTimeout(() => {
                    setState(determineAdaptiveState());
                }, 0);
            }

            return newContext;
        });
    }, [determineAdaptiveState]);

    /**
     * Record user interaction for adaptive learning
     */
    const recordInteraction = useCallback((type, data = {}) => {
        const updates = {
            lastInteractionType: type,
            sessionMessages: context.sessionMessages + 1
        };

        if (type === 'correction') {
            updates.consecutiveCorrect = 0;
        } else if (type === 'celebration') {
            updates.consecutiveCorrect = (context.consecutiveCorrect || 0) + 1;
        }

        if (data.phonemeAccuracy !== undefined) {
            updates.phonemeAccuracy = data.phonemeAccuracy;
        }

        updateContext(updates);
    }, [context, updateContext]);

    /**
     * Get motivational message based on user progress
     */
    const getMotivationalMessage = useCallback(() => {
        const { consecutiveCorrect, sessionDuration } = context;
        const targetLanguage = userProfile?.target_language || 'English';
        const cefrLevel = userProfile?.cefrLevel || 'A1';

        const messages = {
            beginner: [
                `Starting strong with ${targetLanguage}! Every word counts.`,
                `Great foundation! You're building essential ${targetLanguage} skills.`,
                `Perfect for beginners! You're on the right track.`
            ],
            intermediate: [
                `You're connecting the dots in ${targetLanguage}! Impressive progress.`,
                `Building fluency! Your ${targetLanguage} is getting more natural.`,
                `Intermediate level unlocked! You're thinking in ${targetLanguage}.`
            ],
            advanced: [
                `Near-fluent in ${targetLanguage}! You're mastering nuances.`,
                `Advanced expression! Your ${targetLanguage} sounds authentic.`,
                `Expert level! You're thinking like a native ${targetLanguage} speaker.`
            ]
        };

        let level = 'beginner';
        if (cefrLevel.startsWith('B')) level = 'intermediate';
        if (cefrLevel.startsWith('C')) level = 'advanced';

        const levelMessages = messages[level];
        const randomIndex = Math.floor(Math.random() * levelMessages.length);

        return levelMessages[randomIndex];
    }, [context, userProfile]);

    // Update state when context or userProfile changes
    useEffect(() => {
        setState(determineAdaptiveState());
    }, [determineAdaptiveState]);

    // Generate prompt for AI integration
    const prompt = generateMynoPrompt(state, userProfile?.target_language || 'English');

    return {
        state,
        prompt,
        context,
        updateContext,
        recordInteraction,
        getAdaptiveTip,
        getMotivationalMessage,
        setMascotState: (newState) => setState(getMynoState(newState, userProfile))
    };
}

/**
 * Helper to initialize mascot context from localStorage
 */
export function loadMascotContext() {
    try {
        const saved = localStorage.getItem('myno_mascot_context');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load mascot context:', e);
    }

    return {
        sessionMessages: 0,
        consecutiveCorrect: 0,
        timeOfDay: new Date().getHours(),
        isStreakActive: false,
        phonemeAccuracy: 0.7,
        lastInteractionType: 'neutral',
        sessionDuration: 0
    };
}

/**
 * Helper to save mascot context to localStorage
 */
export function saveMascotContext(context) {
    try {
        localStorage.setItem('myno_mascot_context', JSON.stringify(context));
    } catch (e) {
        console.warn('Failed to save mascot context:', e);
    }
}