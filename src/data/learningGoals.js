/**
 * Learning goal definitions for Myno AI Tutor.
 * Each goal filters scenarios and adapts curriculum focus.
 * @module learningGoals
 */

/**
 * @typedef {Object} LearningGoal
 * @property {string} id - Unique identifier ('travel', 'work', 'exam', 'casual')
 * @property {string} label - Display name
 * @property {string} icon - Emoji or SVG representation
 * @property {string} description - Brief explanation
 * @property {string[]} scenarioIds - Array of scenario IDs from scenarios.js
 * @property {[string, string]} cefrRange - Minimum and maximum CEFR levels ['A1','B1']
 */

/** @type {LearningGoal[]} */
export const LEARNING_GOALS = [
    {
        id: 'travel',
        label: 'Travel & Tourism',
        icon: '✈️',
        description: 'Master essential phrases for hotels, restaurants, transportation, and sightseeing.',
        scenarioIds: ['airport_checkin', 'hotel_checkin', 'restaurant_ordering', 'asking_directions', 'shopping_market'],
        cefrRange: ['A1', 'B1']
    },
    {
        id: 'work',
        label: 'Business & Work',
        icon: '💼',
        description: 'Learn professional communication, meetings, emails, and workplace vocabulary.',
        scenarioIds: ['business_introduction', 'meeting_discussion', 'email_composition', 'presentation_practice', 'networking_event'],
        cefrRange: ['A2', 'B2']
    },
    {
        id: 'exam',
        label: 'Exam Preparation',
        icon: '📚',
        description: 'Focus on grammar accuracy, academic vocabulary, and test‑taking strategies.',
        scenarioIds: ['grammar_drill', 'vocabulary_quiz', 'listening_comprehension', 'writing_practice', 'speaking_interview'],
        cefrRange: ['A2', 'C1']
    },
    {
        id: 'casual',
        label: 'Casual Conversation',
        icon: '😊',
        description: 'Build confidence in everyday chats, hobbies, friendships, and social situations.',
        scenarioIds: ['meeting_new_people', 'discussing_hobbies', 'daily_routine', 'making_plans', 'sharing_stories'],
        cefrRange: ['A1', 'B1']
    }
];

/**
 * Get learning goal by ID.
 * @param {string} goalId - Goal identifier
 * @returns {LearningGoal|undefined} Matching goal object
 */
export function getGoalById(goalId) {
    return LEARNING_GOALS.find(goal => goal.id === goalId);
}

/**
 * Get all learning goals as options for selectors.
 * @returns {Array<{value: string, label: string, icon: string}>} Selector options
 */
export function getGoalOptions() {
    return LEARNING_GOALS.map(goal => ({
        value: goal.id,
        label: goal.label,
        icon: goal.icon,
        description: goal.description
    }));
}

/**
 * Check if a scenario is relevant to a learning goal.
 * @param {string} scenarioId - Scenario ID from scenarios.js
 * @param {string} goalId - Learning goal ID
 * @returns {boolean} True if scenario belongs to goal
 */
export function isScenarioInGoal(scenarioId, goalId) {
    const goal = getGoalById(goalId);
    if (!goal) return false;
    return goal.scenarioIds.includes(scenarioId);
}

/**
 * Filter scenarios by learning goal and CEFR level.
 * @param {Array} allScenarios - Complete scenarios array
 * @param {string} goalId - Learning goal ID
 * @param {string} userCefrLevel - User's CEFR level (e.g., 'A2')
 * @returns {Array} Filtered scenarios
 */
export function filterScenariosByGoal(allScenarios, goalId, userCefrLevel) {
    const goal = getGoalById(goalId);
    if (!goal) return allScenarios;

    const [minCefr, maxCefr] = goal.cefrRange;
    const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userLevelIndex = cefrOrder.indexOf(userCefrLevel);
    const minIndex = cefrOrder.indexOf(minCefr);
    const maxIndex = cefrOrder.indexOf(maxCefr);

    return allScenarios.filter(scenario => {
        // Check if scenario is in goal's scenarioIds
        const inGoal = goal.scenarioIds.includes(scenario.id);
        if (!inGoal) return false;

        // Check CEFR compatibility
        const scenarioCefrIndex = cefrOrder.indexOf(scenario.cefr || 'A1');
        return scenarioCefrIndex >= minIndex && scenarioCefrIndex <= maxIndex && scenarioCefrIndex <= userLevelIndex;
    });
}

/**
 * Get default learning goal (first one).
 * @returns {LearningGoal} Default goal
 */
export function getDefaultGoal() {
    return LEARNING_GOALS[0];
}