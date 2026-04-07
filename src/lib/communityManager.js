/**
 * Community scenario submission and moderation manager
 * @module communityManager
 */

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, serverTimestamp } from 'firebase/firestore';

/**
 * Submit a user-created scenario for moderation
 * @param {object} scenarioData - Scenario form data
 * @param {object} userProfile - User profile with uid
 * @returns {Promise<object>} Result with success status and submission ID
 */
export async function submitUserScenario(scenarioData, userProfile) {
    try {
        const uid = userProfile?.uid;
        if (!uid) {
            throw new Error('User not authenticated');
        }

        // Client-side rate limiting
        if (!canUserSubmit(uid)) {
            throw new Error('Rate limit exceeded: Maximum 3 submissions per week');
        }

        // Client-side validation
        validateScenarioData(scenarioData);

        // Prepare submission document
        const submission = {
            uid,
            title: scenarioData.title.trim(),
            cefr: scenarioData.cefr,
            targetSkill: scenarioData.targetSkill,
            scenarioPrompt: scenarioData.scenarioPrompt.trim(),
            microLesson: {
                vocab: scenarioData.vocab || [],
                grammarTip: scenarioData.grammarTip?.trim() || '',
                culturalTip: scenarioData.culturalTip?.trim() || ''
            },
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userDisplayName: userProfile.displayName || 'Anonymous',
            userTargetLanguage: userProfile.target_language || 'English',
            userNativeLanguage: userProfile.native_language || 'English'
        };

        let submissionId;

        // Try Firestore first
        try {
            const docRef = await addDoc(collection(db, 'userScenarios', uid, 'submissions'), submission);
            submissionId = docRef.id;

            // Update rate limiting tracker
            recordSubmission(uid);

            console.log('Scenario submitted to Firestore:', submissionId);
        } catch (firestoreError) {
            console.warn('Firestore submission failed, falling back to localStorage:', firestoreError);

            // Fallback to localStorage
            submissionId = fallbackLocalStorageSubmission(uid, submission);
        }

        return {
            success: true,
            submissionId,
            message: 'Scenario submitted for moderation. Thank you!'
        };
    } catch (error) {
        console.error('Scenario submission failed:', error);
        return {
            success: false,
            error: error.message,
            submissionId: null
        };
    }
}

/**
 * Get user's own scenario submissions
 * @param {string} uid - User ID
 * @returns {Promise<array>} Array of user submissions
 */
export async function getUserSubmissions(uid) {
    if (!uid) return [];

    try {
        // Try Firestore first
        const q = query(
            collection(db, 'userScenarios', uid, 'submissions'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        const submissions = [];

        querySnapshot.forEach(doc => {
            submissions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return submissions;
    } catch (error) {
        console.warn('Firestore query failed, falling back to localStorage:', error);

        // Fallback to localStorage
        return getLocalStorageSubmissions(uid);
    }
}

/**
 * Get approved scenarios for public use
 * @param {string} cefrFilter - Optional CEFR level filter (A1, A2, B1, etc.)
 * @returns {Promise<array>} Array of approved scenarios
 */
export async function getApprovedScenarios(cefrFilter = null) {
    try {
        // Note: In production, this would query a public collection
        // For MVP, we'll simulate with localStorage fallback

        const approvedScenarios = getLocalStorageApprovedScenarios();

        if (cefrFilter) {
            return approvedScenarios.filter(scenario => scenario.cefr === cefrFilter);
        }

        return approvedScenarios;
    } catch (error) {
        console.error('Failed to get approved scenarios:', error);
        return [];
    }
}

/**
 * Check if user can submit (rate limiting: max 3 per week)
 * @param {string} uid - User ID
 * @returns {boolean} True if user can submit
 */
function canUserSubmit(uid) {
    const key = `submission_history_${uid}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');

    // Filter submissions from the last 7 days
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentSubmissions = history.filter(timestamp => timestamp > oneWeekAgo);

    return recentSubmissions.length < 3;
}

/**
 * Record a submission for rate limiting
 * @param {string} uid - User ID
 */
function recordSubmission(uid) {
    const key = `submission_history_${uid}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');

    history.push(Date.now());

    // Keep only last 10 submissions to prevent storage bloat
    const trimmedHistory = history.slice(-10);
    localStorage.setItem(key, JSON.stringify(trimmedHistory));
}

/**
 * Validate scenario data client-side
 * @param {object} data - Scenario form data
 * @throws {Error} If validation fails
 */
function validateScenarioData(data) {
    const errors = [];

    if (!data.title?.trim()) {
        errors.push('Title is required');
    } else if (data.title.trim().length < 5) {
        errors.push('Title must be at least 5 characters');
    } else if (data.title.trim().length > 100) {
        errors.push('Title must be less than 100 characters');
    }

    const validCefr = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validCefr.includes(data.cefr)) {
        errors.push('Invalid CEFR level');
    }

    const validSkills = ['vocab', 'grammar', 'phoneme', 'conversation'];
    if (!validSkills.includes(data.targetSkill)) {
        errors.push('Invalid target skill');
    }

    if (!data.scenarioPrompt?.trim()) {
        errors.push('Scenario prompt is required');
    } else if (data.scenarioPrompt.trim().length < 50) {
        errors.push('Scenario prompt must be at least 50 characters');
    } else if (data.scenarioPrompt.trim().length > 2000) {
        errors.push('Scenario prompt must be less than 2000 characters');
    }

    if (data.vocab && !Array.isArray(data.vocab)) {
        errors.push('Vocabulary must be an array');
    }

    if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
}

/**
 * Fallback submission to localStorage when Firestore is unavailable
 * @param {string} uid - User ID
 * @param {object} submission - Submission data
 * @returns {string} Generated submission ID
 */
function fallbackLocalStorageSubmission(uid, submission) {
    const key = `local_submissions_${uid}`;
    const submissions = JSON.parse(localStorage.getItem(key) || '[]');

    const submissionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    submissions.push({
        id: submissionId,
        ...submission,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocal: true
    });

    localStorage.setItem(key, JSON.stringify(submissions));
    recordSubmission(uid);

    return submissionId;
}

/**
 * Get submissions from localStorage fallback
 * @param {string} uid - User ID
 * @returns {array} Array of submissions
 */
function getLocalStorageSubmissions(uid) {
    const key = `local_submissions_${uid}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

/**
 * Get approved scenarios from localStorage (simulated for MVP)
 * @returns {array} Array of approved scenarios
 */
function getLocalStorageApprovedScenarios() {
    // This would be populated by admin moderation in production
    // For MVP, return some example approved scenarios
    return [
        {
            id: 'community_1',
            title: 'Ordering Coffee in a Paris Café',
            cefr: 'A2',
            targetSkill: 'conversation',
            scenarioPrompt: 'You are in a Paris café. Order a coffee and croissant, ask about WiFi, and respond to the barista\'s questions.',
            microLesson: {
                vocab: ['café', 'croissant', 'WiFi', 's\'il vous plaît', 'merci'],
                grammarTip: 'Use "je voudrais" (I would like) for polite requests',
                culturalTip: 'In France, it\'s common to say "bonjour" before ordering'
            },
            submittedBy: 'Community User',
            approvedAt: '2024-01-15'
        },
        {
            id: 'community_2',
            title: 'Japanese Train Station Directions',
            cefr: 'B1',
            targetSkill: 'vocab',
            scenarioPrompt: 'Ask for directions to Shinjuku Station, understand the response, and confirm the platform number.',
            microLesson: {
                vocab: ['eki (station)', 'ikura (how much)', 'nanban (what number)', 'migi (right)', 'hidari (left)'],
                grammarTip: 'Use "~wa doko desu ka?" to ask where something is',
                culturalTip: 'Pointing with fingers is considered rude, use open hand gestures'
            },
            submittedBy: 'Community User',
            approvedAt: '2024-01-20'
        }
    ];
}

/**
 * Get user's submission statistics
 * @param {string} uid - User ID
 * @returns {Promise<object>} Submission stats
 */
export async function getUserSubmissionStats(uid) {
    const submissions = await getUserSubmissions(uid);

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length
    };

    return stats;
}

/*
FIREBASE FIRESTORE SECURITY RULES STUB
=======================================
Deploy these rules via Firebase console for production:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can read/write their own submissions
    match /userScenarios/{userId}/submissions/{submissionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public can read approved scenarios (stored in separate collection)
    match /approvedScenarios/{scenarioId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.moderator == true;
    }
    
    // Admins can moderate submissions
    match /moderationQueue/{submissionId} {
      allow read: if request.auth != null && 
        request.auth.token.moderator == true;
      allow write: if request.auth != null && 
        request.auth.token.moderator == true;
    }
    
    // Rate limiting: users can create max 3 submissions per week
    // (Implemented via Firestore Functions in production)
  }
}

Note: These rules assume:
1. User authentication is enabled
2. Moderator role is set via custom claims
3. approvedScenarios collection exists for public consumption
4. moderationQueue collection for pending submissions
*/