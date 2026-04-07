/**
 * Myno mascot states and utilities
 * @module mynoMascot
 */

/**
 * @typedef {Object} MynoState
 * @property {string} expression - Emoji representation
 * @property {string} animation - Tailwind animation class
 * @property {string} tip - Short tip/message
 * @property {string} color - Tailwind text color class
 * @property {string} bgColor - Tailwind background color class
 */

/**
 * Available mascot states
 * @type {Object.<string, MynoState>}
 */
export const MYNO_STATES = {
    thinking: {
        expression: '🤔',
        animation: 'animate-bounce-dot',
        tip: "Let me think...",
        color: 'text-blue-500',
        bgColor: 'bg-blue-50'
    },
    celebrating: {
        expression: '🎉',
        animation: 'animate-green-flash',
        tip: "Amazing progress!",
        color: 'text-green-600',
        bgColor: 'bg-green-50'
    },
    correcting: {
        expression: '🔍',
        animation: 'animate-slide-up-bounce',
        tip: "Small tweak:",
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    },
    encouraging: {
        expression: '💪',
        animation: 'scale-on-press',
        tip: "You've got this!",
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
    },
    offline: {
        expression: '📴',
        animation: '',
        tip: "Working offline...",
        color: 'text-gray-500',
        bgColor: 'bg-gray-50'
    },
    focused: {
        expression: '🎯',
        animation: 'pulse',
        tip: "Deep focus mode",
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
    },
    playful: {
        expression: '😄',
        animation: 'bounce',
        tip: "Learning is fun!",
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
    },
    patient: {
        expression: '⏳',
        animation: 'spin',
        tip: "Take your time",
        color: 'text-teal-600',
        bgColor: 'bg-teal-50'
    },
    curious: {
        expression: '🔎',
        animation: 'ping',
        tip: "Let's explore!",
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50'
    },
    proud: {
        expression: '🏆',
        animation: 'animate-green-flash',
        tip: "You're crushing it!",
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
    }
};

/**
 * Determine appropriate mascot state based on AI state and user profile
 * @param {string} aiState - Current AI state ('thinking', 'celebrating', 'correcting', 'encouraging', 'offline', 'focused', 'playful', 'patient', 'curious', 'proud')
 * @param {Object} userProfile - User profile object (optional)
 * @param {Object} context - Additional context for adaptive behavior (optional)
 * @returns {MynoState}
 */
export function getMynoState(aiState, userProfile = null, context = {}) {
    // Default to encouraging if state not recognized
    const stateKey = Object.keys(MYNO_STATES).includes(aiState)
        ? aiState
        : 'encouraging';

    const baseState = MYNO_STATES[stateKey];

    // Customize based on user profile if available
    if (userProfile) {
        const { targetLanguage, cefrLevel, learningGoal } = userProfile;
        const hour = new Date().getHours();

        // Time-based adaptations
        if (hour < 6 || hour > 22) {
            // Late night / early morning
            if (stateKey === 'celebrating') {
                return {
                    ...baseState,
                    tip: "Quiet celebration! Great work at this hour!",
                    expression: '🌟'
                };
            }
        }

        // CEFR level adaptations
        if (cefrLevel === 'A1' && stateKey === 'encouraging') {
            return {
                ...baseState,
                tip: "Great start! Every word is progress!",
                expression: '👶'
            };
        } else if (cefrLevel === 'B2' && stateKey === 'celebrating') {
            return {
                ...baseState,
                tip: "Intermediate mastery! You're thinking in the language!",
                expression: '🚀'
            };
        } else if (cefrLevel === 'C1' && stateKey === 'correcting') {
            return {
                ...baseState,
                tip: "Fine-tuning nuance! You're at an advanced level!",
                expression: '🎓'
            };
        }

        // Learning goal adaptations
        if (learningGoal === 'travel' && stateKey === 'encouraging') {
            return {
                ...baseState,
                tip: "Perfect for your travels! You'll be chatting with locals soon!",
                expression: '✈️'
            };
        } else if (learningGoal === 'work' && stateKey === 'focused') {
            return {
                ...baseState,
                tip: "Professional language skills! Great for your career!",
                expression: '💼'
            };
        }
    }

    // Context-based adaptations
    if (context.consecutiveCorrect >= 5) {
        return {
            ...MYNO_STATES.proud,
            tip: `Amazing streak! ${context.consecutiveCorrect} correct in a row!`
        };
    }

    if (context.phonemeAccuracy < 0.5 && context.sessionMessages > 3) {
        return {
            ...MYNO_STATES.patient,
            tip: "Let's focus on pronunciation. Try slowing down a bit."
        };
    }

    if (context.sessionDuration > 15) {
        return {
            ...MYNO_STATES.focused,
            tip: `Deep focus! ${Math.round(context.sessionDuration)} minutes of quality practice!`
        };
    }

    return baseState;
}

/**
 * Get adaptive mascot state based on learning analytics
 * @param {Object} analytics - Learning analytics data
 * @param {Object} userProfile - User profile
 * @returns {MynoState}
 */
export function getAdaptiveMascotState(analytics, userProfile = null) {
    const {
        accuracy = 0.7,
        streak = 0,
        sessionTime = 0,
        recentMistakes = 0,
        engagement = 'medium'
    } = analytics;

    let stateKey = 'encouraging';

    // Determine state based on analytics
    if (accuracy > 0.9 && streak > 3) {
        stateKey = 'proud';
    } else if (accuracy > 0.8) {
        stateKey = 'celebrating';
    } else if (accuracy < 0.5 && recentMistakes > 2) {
        stateKey = 'patient';
    } else if (sessionTime > 600 && engagement === 'high') { // 10+ minutes
        stateKey = 'focused';
    } else if (engagement === 'low' && sessionTime < 120) { // 2 minutes
        stateKey = 'playful';
    } else if (recentMistakes > 0) {
        stateKey = 'correcting';
    }

    return getMynoState(stateKey, userProfile, analytics);
}

/**
 * Get mascot state for specific learning scenario
 * @param {string} scenarioType - Type of learning scenario
 * @param {Object} performance - Performance metrics
 * @returns {MynoState}
 */
export function getScenarioMascotState(scenarioType, performance = {}) {
    const scenarioStates = {
        'vocabulary': 'curious',
        'grammar': 'thinking',
        'pronunciation': 'correcting',
        'conversation': 'playful',
        'listening': 'focused',
        'reading': 'patient'
    };

    const baseState = scenarioStates[scenarioType] || 'encouraging';

    // Adjust based on performance
    if (performance.score > 0.8) {
        return getMynoState('celebrating', null, performance);
    } else if (performance.score < 0.4) {
        return getMynoState('patient', null, performance);
    }

    return getMynoState(baseState, null, performance);
}

/**
 * Generate AI prompt suffix to inject mascot personality
 * @param {MynoState} state - Mascot state object
 * @param {string} targetLanguage - Target language for learning
 * @param {Object} context - Additional context for prompt generation
 * @returns {string} Prompt suffix
 */
export function generateMynoPrompt(state, targetLanguage = 'English', context = {}) {
    const prompts = {
        thinking: `(Myno is thinking carefully about the best way to explain this in ${targetLanguage}...)`,
        celebrating: `(Myno is celebrating your progress! 🎉 Keep up the great work with ${targetLanguage}!)`,
        correcting: `(Myno gently points out a small improvement opportunity in your ${targetLanguage}...)`,
        encouraging: `(Myno believes in you! You're making fantastic progress with ${targetLanguage}!)`,
        offline: `(Myno is working offline but still here to help with ${targetLanguage}!)`,
        focused: `(Myno is focused on helping you master ${targetLanguage}. Deep concentration mode!)`,
        playful: `(Myno is having fun teaching you ${targetLanguage}! Learning should be enjoyable! 😄)`,
        patient: `(Myno is patient and supportive. Take your time with ${targetLanguage} - mastery comes with practice.)`,
        curious: `(Myno is curious about your learning journey with ${targetLanguage}! Let's explore together! 🔎)`,
        proud: `(Myno is incredibly proud of your progress with ${targetLanguage}! You're doing amazing! 🏆)`
    };

    // Find matching state key
    const stateKey = Object.keys(MYNO_STATES).find(key =>
        MYNO_STATES[key].expression === state.expression
    ) || 'encouraging';

    let prompt = prompts[stateKey] || prompts.encouraging;

    // Add context-specific details
    if (context.consecutiveCorrect >= 3) {
        prompt += ` You're on a ${context.consecutiveCorrect}-answer streak!`;
    }

    if (context.sessionDuration > 10) {
        prompt += ` You've been practicing for ${Math.round(context.sessionDuration)} minutes - impressive dedication!`;
    }

    if (context.phonemeAccuracy > 0.85) {
        prompt += ` Your pronunciation accuracy is excellent!`;
    } else if (context.phonemeAccuracy < 0.5) {
        prompt += ` Let's focus a bit more on pronunciation - you'll get there!`;
    }

    return prompt;
}

/**
 * Generate mascot tip based on user progress and context
 * @param {Object} userProfile - User profile
 * @param {Object} context - Learning context
 * @returns {string} Personalized tip
 */
export function generateAdaptiveTip(userProfile = null, context = {}) {
    const targetLanguage = userProfile?.target_language || 'English';
    const cefrLevel = userProfile?.cefrLevel || 'A1';
    const hour = new Date().getHours();

    const tips = {
        morning: [
            `Good morning! Perfect time for fresh ${targetLanguage} practice!`,
            `Morning brain is ready to absorb new ${targetLanguage} vocabulary!`,
            `Start your day with ${targetLanguage} - you'll remember it all day!`
        ],
        afternoon: [
            `Afternoon ${targetLanguage} practice - great way to stay sharp!`,
            `Lunch break learning! Efficient ${targetLanguage} practice.`,
            `Mid-day ${targetLanguage} session - perfect for maintaining momentum!`
        ],
        evening: [
            `Evening ${targetLanguage} review - consolidate what you learned today!`,
            `Wind down with some ${targetLanguage} practice - relaxing and productive!`,
            `Nighttime ${targetLanguage} - great for memory consolidation while you sleep!`
        ],
        lateNight: [
            `Late night ${targetLanguage} - dedicated practice time!`,
            `Night owl ${targetLanguage} session - quiet and focused!`,
            `Even at this hour, ${targetLanguage} practice shows dedication!`
        ]
    };

    // Determine time of day
    let timeKey = 'afternoon';
    if (hour < 12) timeKey = 'morning';
    else if (hour < 17) timeKey = 'afternoon';
    else if (hour < 22) timeKey = 'evening';
    else timeKey = 'lateNight';

    const timeTips = tips[timeKey];
    const randomTimeTip = timeTips[Math.floor(Math.random() * timeTips.length)];

    // Add CEFR-specific encouragement
    let cefrTip = '';
    if (cefrLevel === 'A1') {
        cefrTip = `As a beginner, every ${targetLanguage} word is a victory!`;
    } else if (cefrLevel === 'A2') {
        cefrTip = `You're building solid ${targetLanguage} foundations!`;
    } else if (cefrLevel.startsWith('B')) {
        cefrTip = `Intermediate ${targetLanguage} skills - you're thinking in the language!`;
    } else if (cefrLevel.startsWith('C')) {
        cefrTip = `Advanced ${targetLanguage} mastery - you sound authentic!`;
    }

    // Add context-specific tip
    let contextTip = '';
    if (context.consecutiveCorrect >= 5) {
        contextTip = ` ${context.consecutiveCorrect} correct in a row - incredible streak!`;
    } else if (context.sessionDuration > 15) {
        contextTip = ` ${Math.round(context.sessionDuration)} minutes of focused practice - impressive!`;
    } else if (context.phonemeAccuracy > 0.9) {
        contextTip = ` Your pronunciation is near-perfect!`;
    }

    return `${randomTimeTip} ${cefrTip}${contextTip}`;
}

/**
 * Get mascot color scheme for UI theming
 * @param {MynoState} state - Mascot state
 * @returns {Object} Color scheme object
 */
export function getMascotColorScheme(state) {
    const stateKey = Object.keys(MYNO_STATES).find(key =>
        MYNO_STATES[key].expression === state.expression
    ) || 'encouraging';

    const baseState = MYNO_STATES[stateKey];

    return {
        text: baseState.color,
        bg: baseState.bgColor,
        border: baseState.color.replace('text-', 'border-'),
        ring: baseState.color.replace('text-', 'ring-')
    };
}

/**
 * Get mascot animation class with optional intensity
 * @param {MynoState} state - Mascot state
 * @param {string} intensity - 'subtle' | 'normal' | 'emphatic'
 * @returns {string} Tailwind animation classes
 */
export function getMascotAnimation(state, intensity = 'normal') {
    const baseAnimation = state.animation;

    if (!baseAnimation) return '';

    const intensityMap = {
        subtle: 'animate-subtle',
        normal: '',
        emphatic: 'animate-emphatic'
    };

    const intensityClass = intensityMap[intensity] || '';

    return `${baseAnimation} ${intensityClass}`.trim();
}