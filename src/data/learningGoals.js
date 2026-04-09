/**
 * Learning goal definitions for Myno AI Tutor.
 * Each goal filters curriculum syllabi and adapts learning focus.
 * @module learningGoals
 */

import { normalizeLangCode } from '@/lib/langUtils.js';

/**
 * @typedef {Object} CurriculumFocus
 * @property {string[]} grammar - Grammar point IDs to prioritize
 * @property {string[]} vocabThemes - Theme tags: 'travel', 'food', etc.
 * @property {string[]} phonemes - Phoneme keys to emphasize
 * @property {string[]} cefrLevels - CEFR levels to target, e.g., ['A1','A2']
 */

/**
 * @typedef {Object} LearningGoal
 * @property {string} id - Unique identifier ('travel', 'work', 'exam', 'casual')
 * @property {string} label - Display name
 * @property {string} icon - Emoji or SVG representation
 * @property {string} description - Brief explanation
 * @property {CurriculumFocus} curriculumFocus - Content focus for this goal
 * @property {[string, string]} cefrRange - Minimum and maximum CEFR levels ['A1','B1']
 */

/** @type {LearningGoal[]} */
export const LEARNING_GOALS = [
    {
        id: 'travel',
        label: 'Travel & Tourism',
        icon: '✈️',
        description: 'Master essential phrases for hotels, restaurants, transportation, and sightseeing.',
        curriculumFocus: {
            grammar: ['present_tense', 'imperative', 'questions'],
            vocabThemes: ['travel', 'food', 'transportation', 'directions', 'shopping'],
            phonemes: ['p', 't', 'k', 'r', 'l'],
            cefrLevels: ['A1', 'A2']
        },
        cefrRange: ['A1', 'B1']
    },
    {
        id: 'work',
        label: 'Business & Work',
        icon: '💼',
        description: 'Learn professional communication, meetings, emails, and workplace vocabulary.',
        curriculumFocus: {
            grammar: ['formal_present', 'past_tense', 'modals', 'conditionals'],
            vocabThemes: ['business', 'meetings', 'email', 'presentation', 'networking'],
            phonemes: ['s', 'z', 'ʃ', 'tʃ'],
            cefrLevels: ['A2', 'B2']
        },
        cefrRange: ['A2', 'B2']
    },
    {
        id: 'exam',
        label: 'Exam Preparation',
        icon: '📚',
        description: 'Focus on grammar accuracy, academic vocabulary, and test‑taking strategies.',
        curriculumFocus: {
            grammar: ['all_tenses', 'passive_voice', 'relative_clauses', 'subjunctive'],
            vocabThemes: ['academic', 'formal_writing', 'test_phrases', 'analysis'],
            phonemes: ['θ', 'ð', 'ŋ', 'ʒ'],
            cefrLevels: ['A2', 'C1']
        },
        cefrRange: ['A2', 'C1']
    },
    {
        id: 'casual',
        label: 'Casual Conversation',
        icon: '😊',
        description: 'Build confidence in everyday chats, hobbies, friendships, and social situations.',
        curriculumFocus: {
            grammar: ['present_continuous', 'simple_past', 'future_intent', 'slang'],
            vocabThemes: ['social', 'hobbies', 'daily_routine', 'feelings', 'plans'],
            phonemes: ['m', 'n', 'h', 'w', 'j'],
            cefrLevels: ['A1', 'B1']
        },
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
 * Check if a syllabus is relevant to a learning goal.
 * @param {Object} syllabus - Syllabus object from curriculum
 * @param {LearningGoal} goal - Learning goal
 * @returns {boolean} True if syllabus matches goal's curriculum focus
 */
export function isSyllabusRelevant(syllabus, goal) {
    const focus = goal.curriculumFocus;
    // Check grammar overlap
    const grammarMatch = focus.grammar.some(g => syllabus.grammar?.includes(g));
    // Check vocab theme overlap
    const vocabMatch = focus.vocabThemes.some(v => syllabus.vocabThemes?.includes(v));
    // Check phoneme overlap
    const phonemeMatch = focus.phonemes.some(p => syllabus.phonemes?.includes(p));
    // Check CEFR level within range
    const cefrMatch = focus.cefrLevels.includes(syllabus.cefr);
    // At least one content match and CEFR match
    return (grammarMatch || vocabMatch || phonemeMatch) && cefrMatch;
}

/**
 * Load a syllabus via dynamic import from curriculum/{lang}/{cefr}.js
 * @param {string} lang - Language code (e.g., 'es', 'fr')
 * @param {string} cefr - CEFR level (e.g., 'A1', 'A2')
 * @returns {Promise<Object>} Syllabus object
 */
async function getCurriculum(lang, cefr) {
    // Normalize language code (e.g., "English" → "en")
    const normalizedLang = normalizeLangCode(lang);
    const cacheKey = `curriculum_${normalizedLang}_${cefr}`;
    // Check localStorage cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            // Invalid cache, continue to import
        }
    }
    try {
        // Correct relative path from src/data to src/curriculum (one level up)
        const module = await import(`../curriculum/${normalizedLang}/${cefr}.js`);
        const syllabus = module.default || module;
        // Cache in localStorage (limited to 1 day)
        localStorage.setItem(cacheKey, JSON.stringify(syllabus));
        localStorage.setItem(cacheKey + '_timestamp', Date.now().toString());
        return syllabus;
    } catch (importError) {
        console.warn(`Failed to load curriculum for ${normalizedLang}/${cefr}:`, importError);
        // Return a fallback empty syllabus
        return {
            grammar: [],
            vocabThemes: [],
            phonemes: [],
            cefr
        };
    }
}

/**
 * Filter curriculum syllabi by learning goal and user CEFR level.
 * @param {string} goalId - Learning goal ID
 * @param {string} lang - Target language code
 * @param {string} userCefrLevel - User's CEFR level (e.g., 'A2')
 * @returns {Promise<Array<{lang: string, cefr: string, syllabus: Object}>>} Matching syllabi
 */
export async function filterCurriculumByGoal(goalId, lang, userCefrLevel) {
    const goal = getGoalById(goalId);
    if (!goal) return [];
    // Normalize language code (e.g., "English" → "en")
    const normalizedLang = normalizeLangCode(lang);
    const { cefrLevels } = goal.curriculumFocus;
    // Determine which CEFR levels to load (those within goal's cefrLevels and not exceeding user level)
    const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userLevelIndex = cefrOrder.indexOf(userCefrLevel);
    const levelsToLoad = cefrLevels.filter(level => {
        const levelIndex = cefrOrder.indexOf(level);
        return levelIndex <= userLevelIndex;
    });
    if (levelsToLoad.length === 0) {
        console.warn(`No suitable CEFR levels for goal ${goalId} and user level ${userCefrLevel}`);
        return [];
    }
    const results = [];
    for (const cefr of levelsToLoad) {
        try {
            const syllabus = await getCurriculum(normalizedLang, cefr);
            if (isSyllabusRelevant(syllabus, goal)) {
                results.push({ lang: normalizedLang, cefr, syllabus });
            }
        } catch (error) {
            console.warn(`Skipping ${normalizedLang}/${cefr} due to error:`, error);
        }
    }
    return results;
}

/**
 * Get the most relevant syllabus for a goal.
 * @param {string} goalId - Learning goal ID
 * @param {string} lang - Target language code
 * @param {string} userCefrLevel - User's CEFR level
 * @returns {Promise<Object|null>} Most relevant syllabus object, or null if none
 */
export async function getCurriculumForGoal(goalId, lang, userCefrLevel) {
    // Normalize language code (e.g., "English" → "en")
    const normalizedLang = normalizeLangCode(lang);
    const matches = await filterCurriculumByGoal(goalId, normalizedLang, userCefrLevel);
    if (matches.length === 0) return null;
    // Prefer syllabus with highest CEFR level that matches user level
    const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    matches.sort((a, b) => cefrOrder.indexOf(b.cefr) - cefrOrder.indexOf(a.cefr));
    return matches[0].syllabus;
}

/**
 * Deprecated: Check if a scenario is relevant to a learning goal.
 * @deprecated Scenarios are replaced by curriculum syllabi
 * @param {string} scenarioId - Scenario ID
 * @param {string} goalId - Learning goal ID
 * @returns {boolean} Always false
 */
export function isScenarioInGoal(scenarioId, goalId) {
    console.warn('isScenarioInGoal is deprecated; curriculum system does not use scenarios');
    return false;
}

/**
 * Deprecated: Filter scenarios by learning goal and CEFR level.
 * @deprecated Use filterCurriculumByGoal instead
 * @param {Array} allScenarios - Complete scenarios array
 * @param {string} goalId - Learning goal ID
 * @param {string} userCefrLevel - User's CEFR level (e.g., 'A2')
 * @returns {Array} Filtered scenarios (empty array)
 */
export function filterScenariosByGoal(allScenarios, goalId, userCefrLevel) {
    console.warn('filterScenariosByGoal is deprecated; use filterCurriculumByGoal');
    return [];
}

/**
 * Get default learning goal (first one).
 * @returns {LearningGoal} Default goal
 */
export function getDefaultGoal() {
    return LEARNING_GOALS[0];
}