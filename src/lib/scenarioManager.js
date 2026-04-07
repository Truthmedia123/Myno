/**
 * Scenario manager for Myno AI Tutor.
 * Handles scenario unlocking, recommendations, and completion tracking.
 * Zero external dependencies, uses localStorage fallback.
 * @module scenarioManager
 */

import { SCENARIOS } from '../data/scenarios.js';

/**
 * Get user profile from localStorage if not provided.
 * @param {Object|null} userProfile - Current user profile (optional)
 * @returns {Object} User profile with defaults
 */
function ensureUserProfile(userProfile) {
    if (userProfile && typeof userProfile === 'object') {
        return userProfile;
    }

    try {
        const stored = localStorage.getItem('myno_user_profile');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to read user profile from localStorage:', e);
    }

    // Default profile
    return {
        completedScenarios: [],
        xp: 0,
        target_language: 'English',
        native_language: 'English',
        cefrLevel: 'A1'
    };
}

/**
 * Save user profile to localStorage.
 * @param {Object} profile - User profile to save
 */
function saveUserProfile(profile) {
    try {
        localStorage.setItem('myno_user_profile', JSON.stringify(profile));
    } catch (e) {
        console.warn('Failed to save user profile to localStorage:', e);
    }
}

/**
 * Get all scenarios available to the user based on completed prerequisites.
 * @param {Object|null} userProfile - User profile (optional, falls back to localStorage)
 * @returns {Array<Object>} Available scenarios
 */
export function getAvailableScenarios(userProfile = null) {
    const profile = ensureUserProfile(userProfile);
    const completed = profile.completedScenarios || [];

    return SCENARIOS.filter(scenario => {
        // Check all prerequisites are completed
        return scenario.prerequisites.every(prereq => completed.includes(prereq));
    });
}

/**
 * Get the next recommended scenario for the user (highest difficulty unlocked).
 * @param {Object|null} userProfile - User profile (optional)
 * @returns {Object|null} Recommended scenario or null if none available
 */
export function getNextRecommended(userProfile = null) {
    const available = getAvailableScenarios(userProfile);

    if (available.length === 0) {
        return null;
    }

    // Sort by difficulty descending, then by CEFR progression
    return available.sort((a, b) => {
        if (a.difficulty !== b.difficulty) {
            return b.difficulty - a.difficulty;
        }
        // Map CEFR to numeric value for sorting
        const cefrOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        return cefrOrder[a.cefr] - cefrOrder[b.cefr];
    })[0];
}

/**
 * Mark a scenario as complete and update user profile.
 * @param {string} scenarioId - ID of the completed scenario
 * @param {Object|null} userProfile - Current user profile (optional)
 * @returns {Object} Updated user profile with new completedScenarios and xpDelta
 */
export function markScenarioComplete(scenarioId, userProfile = null) {
    const profile = ensureUserProfile(userProfile);
    const scenario = SCENARIOS.find(s => s.id === scenarioId);

    if (!scenario) {
        console.error(`Scenario ${scenarioId} not found`);
        return profile;
    }

    // Check if already completed
    if (profile.completedScenarios.includes(scenarioId)) {
        console.warn(`Scenario ${scenarioId} already completed`);
        return profile;
    }

    // Check prerequisites
    const available = getAvailableScenarios(profile);
    if (!available.some(s => s.id === scenarioId)) {
        console.error(`Scenario ${scenarioId} not available (prerequisites not met)`);
        return profile;
    }

    // Calculate XP based on difficulty
    const xpDelta = scenario.difficulty * 10;
    const updatedProfile = {
        ...profile,
        completedScenarios: [...profile.completedScenarios, scenarioId],
        xp: (profile.xp || 0) + xpDelta
    };

    // Update CEFR level if appropriate
    const completedCount = updatedProfile.completedScenarios.length;
    if (completedCount >= 4 && updatedProfile.cefrLevel === 'A1') {
        updatedProfile.cefrLevel = 'A2';
    } else if (completedCount >= 6 && updatedProfile.cefrLevel === 'A2') {
        updatedProfile.cefrLevel = 'B1';
    }

    // Save to localStorage
    saveUserProfile(updatedProfile);

    return {
        ...updatedProfile,
        xpDelta,
        scenarioTitle: scenario.title
    };
}

/**
 * Get scenario by ID.
 * @param {string} scenarioId - Scenario identifier
 * @returns {Object|null} Scenario object or null if not found
 */
export function getScenarioById(scenarioId) {
    return SCENARIOS.find(s => s.id === scenarioId) || null;
}

/**
 * Get all scenarios grouped by CEFR level.
 * @returns {Object} Scenarios grouped by CEFR level
 */
export function getScenariosByCEFR() {
    const grouped = {};
    SCENARIOS.forEach(scenario => {
        if (!grouped[scenario.cefr]) {
            grouped[scenario.cefr] = [];
        }
        grouped[scenario.cefr].push(scenario);
    });
    return grouped;
}