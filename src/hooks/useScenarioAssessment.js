/**
 * Post-scenario assessment hook for comprehension checking and mastery sync.
 * Generates a 3-question quiz from conversation messages and updates user mastery.
 * @module useScenarioAssessment
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { scheduleVocabReview } from '../lib/memoryManager';

/**
 * @typedef {Object} QuizQuestion
 * @property {string} id - Unique identifier
 * @property {string} type - 'vocab' | 'comprehension' | 'phoneme'
 * @property {string} question - Question text
 * @property {string[]} options - Array of answer choices
 * @property {number} correctIndex - Index of correct answer in options
 * @property {string} explanation - Explanation for correct answer
 */

/**
 * @typedef {Object} AssessmentResults
 * @property {number} score - Percentage score (0-100)
 * @property {number} xpEarned - XP earned from assessment
 * @property {Object} masteryUpdates - Map of skill IDs to new mastery scores
 * @property {Array} missedWords - Words to schedule for review
 */

/**
 * @typedef {Object} AssessmentHookReturn
 * @property {QuizQuestion[]} quiz - Generated quiz questions
 * @property {boolean} isComplete - Whether assessment has been submitted
 * @property {function} submitAnswers - Function to submit answers and calculate results
 * @property {AssessmentResults|null} results - Assessment results after submission
 */

/**
 * Custom hook for post-scenario assessment
 * @param {Array} messages - Array of conversation messages from the scenario
 * @param {Object} userProfile - User profile with mastery scores
 * @param {Object} scenario - Scenario object with skills array
 * @returns {AssessmentHookReturn} Assessment hook state and functions
 */
export function useScenarioAssessment(messages = [], userProfile = null, scenario = null) {
    const [isComplete, setIsComplete] = useState(false);
    const [results, setResults] = useState(null);
    const [submittedAnswers, setSubmittedAnswers] = useState([]);

    // Generate quiz questions from messages
    const quiz = useMemo(() => {
        if (!messages || messages.length < 3) {
            // Fallback quiz if insufficient messages
            return generateFallbackQuiz(scenario);
        }

        const aiMessages = messages.filter(m => m.role === 'assistant' || m.role === 'ai');
        const userMessages = messages.filter(m => m.role === 'user');

        if (aiMessages.length === 0) {
            return generateFallbackQuiz(scenario);
        }

        const lastAIMessage = aiMessages[aiMessages.length - 1];
        const lastUserMessage = userMessages[userMessages.length - 1] || { content: '' };

        // Extract potential vocabulary words (simple heuristic)
        const words = extractVocabulary(lastAIMessage.content);
        const targetLanguage = userProfile?.target_language || 'English';
        const nativeLanguage = userProfile?.native_language || 'English';

        return [
            // Question 1: Vocabulary recall
            {
                id: 'vocab-1',
                type: 'vocab',
                question: `What does "${words[0] || 'important'}" mean in ${targetLanguage}?`,
                options: [
                    'A key concept from the conversation',
                    'Something unrelated',
                    'A greeting',
                    'A farewell'
                ],
                correctIndex: 0,
                explanation: `"${words[0] || 'important'}" was a key term used in the conversation.`
            },
            // Question 2: Comprehension
            {
                id: 'comprehension-1',
                type: 'comprehension',
                question: 'What was the main topic discussed?',
                options: [
                    extractMainTopic(lastAIMessage.content),
                    'Weather',
                    'Personal introductions',
                    'Food preferences'
                ],
                correctIndex: 0,
                explanation: 'The conversation focused on this topic based on the AI responses.'
            },
            // Question 3: Phoneme check
            {
                id: 'phoneme-1',
                type: 'phoneme',
                question: `Which pronunciation would be challenging for ${nativeLanguage} speakers learning ${targetLanguage}?`,
                options: [
                    getPhonemeChallenge(targetLanguage, nativeLanguage),
                    'The letter "A"',
                    'Silent letters',
                    'All vowels'
                ],
                correctIndex: 0,
                explanation: `This is a common pronunciation challenge for ${nativeLanguage} speakers.`
            }
        ];
    }, [messages, userProfile, scenario]);

    /**
     * Submit answers and calculate assessment results
     * @param {number[]} answers - Array of answer indices (0-3 for each question)
     * @returns {AssessmentResults} Assessment results
     */
    const submitAnswers = useCallback((answers) => {
        if (!answers || answers.length !== 3) {
            throw new Error('Answers array must contain exactly 3 indices');
        }

        // Calculate score
        let correctCount = 0;
        const questionResults = quiz.map((q, index) => {
            const isCorrect = answers[index] === q.correctIndex;
            if (isCorrect) correctCount++;
            return {
                questionId: q.id,
                isCorrect,
                selectedIndex: answers[index],
                correctIndex: q.correctIndex
            };
        });

        const score = Math.round((correctCount / 3) * 100);

        // Calculate XP (10 XP per correct answer + bonus for perfect score)
        const xpEarned = (correctCount * 10) + (score === 100 ? 20 : 0);

        // Determine mastery updates based on score and scenario skills
        const masteryUpdates = calculateMasteryUpdates(score, scenario, userProfile);

        // Identify missed words for review scheduling
        const missedWords = identifyMissedWords(questionResults, quiz, messages);

        // Schedule missed words for vocabulary review
        missedWords.forEach(word => {
            scheduleVocabReview(word, 1); // Rating 1 = hard/forgotten
        });

        // Store results
        const assessmentResults = {
            score,
            xpEarned,
            masteryUpdates,
            missedWords,
            questionResults,
            submittedAt: new Date().toISOString()
        };

        // Save to localStorage
        saveAssessmentResults(assessmentResults, scenario?.id);

        // Optional: Sync to Firestore (stub for future implementation)
        syncToFirestore(assessmentResults, userProfile?.uid);

        setSubmittedAnswers(answers);
        setResults(assessmentResults);
        setIsComplete(true);

        return assessmentResults;
    }, [quiz, scenario, userProfile, messages]);

    // Reset assessment if messages change
    useEffect(() => {
        if (messages.length > 0 && isComplete) {
            setIsComplete(false);
            setResults(null);
            setSubmittedAnswers([]);
        }
    }, [messages, isComplete]);

    return {
        quiz,
        isComplete,
        submitAnswers,
        results,
        submittedAnswers
    };
}

/**
 * Generate fallback quiz when messages are insufficient
 * @param {Object} scenario - Scenario object
 * @returns {QuizQuestion[]} Fallback quiz questions
 */
function generateFallbackQuiz(scenario) {
    const scenarioTitle = scenario?.title || 'the scenario';
    return [
        {
            id: 'fallback-vocab',
            type: 'vocab',
            question: 'What was the main vocabulary focus?',
            options: [
                'Key terms from the lesson',
                'Basic greetings',
                'Numbers',
                'Colors'
            ],
            correctIndex: 0,
            explanation: 'Each scenario focuses on specific vocabulary.'
        },
        {
            id: 'fallback-comprehension',
            type: 'comprehension',
            question: `What was the goal of ${scenarioTitle}?`,
            options: [
                'Practice conversational skills',
                'Learn grammar rules',
                'Memorize vocabulary',
                'Improve pronunciation'
            ],
            correctIndex: 0,
            explanation: 'Scenarios are designed for conversational practice.'
        },
        {
            id: 'fallback-phoneme',
            type: 'phoneme',
            question: 'Which pronunciation aspect was practiced?',
            options: [
                'Intonation and rhythm',
                'Alphabet sounds',
                'Tongue twisters',
                'All of the above'
            ],
            correctIndex: 0,
            explanation: 'Pronunciation practice focuses on natural speech patterns.'
        }
    ];
}

/**
 * Extract vocabulary words from text (simple implementation)
 * @param {string} text - Text to analyze
 * @returns {string[]} Array of potential vocabulary words
 */
function extractVocabulary(text) {
    if (!text) return ['important', 'practice', 'conversation'];

    // Simple heuristic: words longer than 5 characters that aren't common
    const commonWords = ['the', 'and', 'you', 'that', 'this', 'with', 'have', 'from'];
    const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
    const filtered = words.filter(w => !commonWords.includes(w));

    return filtered.length > 0 ? filtered.slice(0, 3) : ['important', 'practice', 'conversation'];
}

/**
 * Extract main topic from text (simple implementation)
 * @param {string} text - Text to analyze
 * @returns {string} Main topic
 */
function extractMainTopic(text) {
    if (!text) return 'Language learning';

    const topics = ['greetings', 'introductions', 'food', 'travel', 'shopping', 'work', 'hobbies'];
    const lowerText = text.toLowerCase();

    for (const topic of topics) {
        if (lowerText.includes(topic)) {
            return topic.charAt(0).toUpperCase() + topic.slice(1);
        }
    }

    return 'Conversational practice';
}

/**
 * Get phoneme challenge for language pair
 * @param {string} targetLang - Target language
 * @param {string} nativeLang - Native language
 * @returns {string} Phoneme challenge description
 */
function getPhonemeChallenge(targetLang, nativeLang) {
    const challenges = {
        'English-Spanish': 'The "th" sound (as in "think")',
        'Spanish-English': 'The short "i" sound (as in "bit")',
        'English-French': 'The French "r" (guttural sound)',
        'French-English': 'The "th" sounds',
        'English-Japanese': 'The "r/l" distinction',
        'Japanese-English': 'The "v" and "th" sounds',
        'English-Chinese': 'Tone pronunciation',
        'Chinese-English': 'Articles (a, an, the)'
    };

    const key = `${targetLang}-${nativeLang}`;
    return challenges[key] || 'Vowel sounds and intonation';
}

/**
 * Calculate mastery updates based on assessment score
 * @param {number} score - Assessment score (0-100)
 * @param {Object} scenario - Scenario object with skills
 * @param {Object} userProfile - User profile
 * @returns {Object} Mastery updates map
 */
function calculateMasteryUpdates(score, scenario, userProfile) {
    const updates = {};
    const currentMastery = userProfile?.masteryScores || {};

    if (!scenario?.skills) {
        return updates;
    }

    // Each skill gets a boost based on score
    scenario.skills.forEach(skillId => {
        const current = currentMastery[skillId] || 0;
        // Score of 100% gives +20, 66% gives +10, 33% gives +5, 0% gives 0
        const boost = score >= 90 ? 20 : score >= 60 ? 10 : score >= 30 ? 5 : 0;
        const newMastery = Math.min(current + boost, 100); // Cap at 100
        updates[skillId] = newMastery;
    });

    return updates;
}

/**
 * Identify missed words from assessment
 * @param {Array} questionResults - Question results
 * @param {QuizQuestion[]} quiz - Quiz questions
 * @param {Array} messages - Conversation messages
 * @returns {string[]} Array of missed words
 */
function identifyMissedWords(questionResults, quiz, messages) {
    const missedWords = [];

    // Check vocabulary question
    const vocabResult = questionResults.find(r => r.questionId.includes('vocab'));
    if (vocabResult && !vocabResult.isCorrect) {
        // Extract vocabulary from messages for review
        const aiMessages = messages.filter(m => m.role === 'assistant' || m.role === 'ai');
        if (aiMessages.length > 0) {
            const words = extractVocabulary(aiMessages[0].content);
            if (words.length > 0) {
                missedWords.push(words[0]);
            }
        }
    }

    return missedWords;
}

/**
 * Save assessment results to localStorage
 * @param {AssessmentResults} results - Assessment results
 * @param {string} scenarioId - Scenario ID
 */
function saveAssessmentResults(results, scenarioId) {
    try {
        const key = `myno_assessment_${scenarioId || 'general'}_${Date.now()}`;
        const data = {
            ...results,
            scenarioId,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));

        // Also update user's overall assessment history
        const history = JSON.parse(localStorage.getItem('myno_assessment_history') || '[]');
        history.push({
            scenarioId,
            score: results.score,
            xpEarned: results.xpEarned,
            date: new Date().toISOString()
        });
        localStorage.setItem('myno_assessment_history', JSON.stringify(history.slice(-50))); // Keep last 50
    } catch (error) {
        console.warn('Failed to save assessment results to localStorage:', error);
    }
}

/**
 * Stub function for Firestore sync (future implementation)
 * @param {AssessmentResults} results - Assessment results
 * @param {string} userId - User ID
 */
function syncToFirestore(results, userId) {
    if (!userId) return;

    // This is a stub for future Firestore integration
    // In a real implementation, this would call:
    // await addDoc(collection(db, 'userAssessments'), { userId, ...results });

    console.log('[Firestore sync stub] Assessment results ready for sync:', {
        userId,
        score: results.score,
        xpEarned: results.xpEarned
    });
}