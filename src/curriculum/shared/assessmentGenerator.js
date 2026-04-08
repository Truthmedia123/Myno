/**
 * Syllabus-aligned assessment generator for Myno AI Tutor.
 * Replaces generic 3-question quiz with CEFR-aligned competency check.
 * Generates grammar multiple choice, vocabulary translation, and phoneme recognition.
 * @module curriculum/shared/assessmentGenerator
 */

/**
 * @typedef {Object} Assessment
 * @property {Object} grammarQ - Grammar multiple choice question
 * @property {Object} vocabQ - Vocabulary translation question
 * @property {Object} phonemeQ - Phoneme recognition question
 * @property {Object} metadata - Assessment metadata
 * @property {string} metadata.cefr - CEFR level
 * @property {string} metadata.lang - Language code
 * @property {string[]} metadata.focusSkills - Skills being assessed
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} targetLanguage - User's target language
 * @property {string} nativeLanguage - User's native language
 * @property {string} cefrLevel - User's current CEFR level
 * @property {Object} [weakAreas] - User's weak areas (optional)
 */

/**
 * @typedef {Object} Syllabus
 * @property {string} level - CEFR level (e.g., 'A1')
 * @property {string} language - Language code (e.g., 'es')
 * @property {string[]} grammar - Array of grammar IDs
 * @property {Object[]} grammarDetails - Detailed grammar objects
 * @property {Object[]} vocab - Vocabulary items
 * @property {string[]} vocabThemes - Vocabulary themes
 * @property {string[]} phonemes - Phoneme IDs
 * @property {Object[]} phonemeDetails - Detailed phoneme objects
 * @property {string} pragmatics - Pragmatics description
 * @property {string|null} orthography - Orthography info
 */

/**
 * Generates a syllabus-aligned assessment.
 * Questions are deterministic based on syllabus data (no randomization).
 * @param {Syllabus} syllabus - The syllabus to generate assessment for
 * @param {UserProfile} userProfile - User profile for personalization
 * @returns {Assessment} Structured assessment object
 */
export function generateAssessment(syllabus, userProfile) {
    // Validate input
    if (!syllabus || !syllabus.level || !syllabus.language) {
        throw new Error('Invalid syllabus: missing required fields');
    }

    // Generate grammar question from first grammar point
    const grammarQ = generateGrammarQuestion(syllabus);

    // Generate vocabulary question from 2 high-frequency items
    const vocabQ = generateVocabularyQuestion(syllabus);

    // Generate phoneme question from first phoneme
    const phonemeQ = generatePhonemeQuestion(syllabus);

    // Determine focus skills
    const focusSkills = determineFocusSkills(syllabus);

    return {
        grammarQ,
        vocabQ,
        phonemeQ,
        metadata: {
            cefr: syllabus.level,
            lang: syllabus.language,
            focusSkills,
            generatedAt: new Date().toISOString(),
            syllabusVersion: '1.0'
        }
    };
}

/**
 * Generates a grammar multiple choice question.
 * Uses syllabus.grammar[0] as the focus point.
 * @param {Syllabus} syllabus
 * @returns {Object} Grammar question object
 */
function generateGrammarQuestion(syllabus) {
    if (!syllabus.grammarDetails || syllabus.grammarDetails.length === 0) {
        // Fallback if no grammar details
        return {
            type: 'multiple_choice',
            skill: 'grammar',
            question: 'Complete the sentence with the correct form.',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 0,
            explanation: 'Basic grammar assessment',
            grammarPoint: 'general'
        };
    }

    const grammarPoint = syllabus.grammarDetails[0];

    // Create deterministic question based on grammar point ID
    let question, options, correctIndex;

    switch (grammarPoint.id) {
        case 'present_indicative_regular':
            question = 'Complete: "Yo ______ (hablar) español."';
            options = ['hablo', 'hablas', 'habla', 'hablamos'];
            correctIndex = 0; // hablo
            break;
        case 'definite_articles':
            question = 'Choose the correct article: "______ casa" (feminine singular)';
            options = ['el', 'la', 'los', 'las'];
            correctIndex = 1; // la
            break;
        case 'ser_vs_estar':
            question = 'Choose the correct verb: "Él ______ médico." (permanent characteristic)';
            options = ['es', 'está', 'son', 'están'];
            correctIndex = 0; // es
            break;
        default:
            question = `Apply the rule: ${grammarPoint.name}`;
            options = ['Option A', 'Option B', 'Option C', 'Option D'];
            correctIndex = 0;
    }

    return {
        type: 'multiple_choice',
        skill: 'grammar',
        question,
        options,
        correctIndex,
        explanation: grammarPoint.tip,
        grammarPoint: grammarPoint.id
    };
}

/**
 * Generates a vocabulary translation question.
 * Uses 2 high-frequency items from syllabus.vocab.
 * @param {Syllabus} syllabus
 * @returns {Object} Vocabulary question object
 */
function generateVocabularyQuestion(syllabus) {
    if (!syllabus.vocab || syllabus.vocab.length === 0) {
        // Fallback
        return {
            type: 'translation',
            skill: 'vocabulary',
            prompt: 'Translate the word: "hello"',
            targetWord: 'hello',
            expectedTranslation: 'hola',
            alternatives: ['hola', 'buenos días', 'saludos'],
            theme: 'greetings'
        };
    }

    // Get high-frequency items (freq === 'very high' or 'high')
    const highFreqItems = syllabus.vocab.filter(item =>
        item.freq === 'very high' || item.freq === 'high'
    );

    // Use first 2 items, or all available if less than 2
    const targetItems = highFreqItems.slice(0, 2);

    if (targetItems.length === 0) {
        // Fallback to first item
        targetItems.push(syllabus.vocab[0]);
    }

    // Create translation prompt
    const prompt = targetItems.length === 1
        ? `Translate: "${targetItems[0].word}"`
        : `Translate: "${targetItems[0].word}" and "${targetItems[1].word}"`;

    return {
        type: 'translation',
        skill: 'vocabulary',
        prompt,
        targetWords: targetItems.map(item => item.word),
        expectedTranslations: targetItems.map(item => item.translation),
        themes: [...new Set(targetItems.map(item => item.theme))],
        difficulty: targetItems.length === 1 ? 'single' : 'double'
    };
}

/**
 * Generates a phoneme recognition question.
 * Uses syllabus.phonemeDetails[0] as the focus phoneme.
 * @param {Syllabus} syllabus
 * @returns {Object} Phoneme question object
 */
function generatePhonemeQuestion(syllabus) {
    if (!syllabus.phonemeDetails || syllabus.phonemeDetails.length === 0) {
        // Fallback
        return {
            type: 'recognition',
            skill: 'phoneme',
            question: 'Which word contains the target sound?',
            options: ['Word A', 'Word B', 'Word C', 'Word D'],
            correctIndex: 0,
            targetSound: 'general'
        };
    }

    const phoneme = syllabus.phonemeDetails[0];

    // Create question based on phoneme
    const question = `Which word contains the "${phoneme.name}" sound?`;

    // Generate options deterministically based on phoneme char
    let options, correctIndex;

    switch (phoneme.char) {
        case 'r':
            options = ['perro', 'casa', 'mesa', 'libro'];
            correctIndex = 0; // perro has rolled r
            break;
        case 'ñ':
            options = ['niño', 'casa', 'mesa', 'libro'];
            correctIndex = 0; // niño has ñ
            break;
        case 'j':
            options = ['juego', 'casa', 'mesa', 'libro'];
            correctIndex = 0; // juego has j
            break;
        default:
            options = ['Option A', 'Option B', 'Option C', 'Option D'];
            correctIndex = 0;
    }

    return {
        type: 'recognition',
        skill: 'phoneme',
        question,
        options,
        correctIndex,
        targetSound: phoneme.char,
        practiceTip: phoneme.practice
    };
}

/**
 * Determines focus skills based on syllabus content.
 * @param {Syllabus} syllabus
 * @returns {string[]} Array of focus skill names
 */
function determineFocusSkills(syllabus) {
    const skills = [];

    if (syllabus.grammar && syllabus.grammar.length > 0) {
        skills.push('grammar');
    }

    if (syllabus.vocab && syllabus.vocab.length > 0) {
        skills.push('vocabulary');
    }

    if (syllabus.phonemes && syllabus.phonemes.length > 0) {
        skills.push('phoneme');
    }

    if (syllabus.pragmatics) {
        skills.push('pragmatics');
    }

    return skills;
}

/**
 * Validates user answers against the assessment.
 * @param {Object} answers - User's answers
 * @param {Syllabus} syllabus - The syllabus used for the assessment
 * @returns {Object} Validation results
 */
export function validateAssessment(answers, syllabus) {
    // Generate the assessment to compare against
    const assessment = generateAssessment(syllabus, {});

    let score = 0;
    const correctIds = [];
    const missedSkills = [];

    // Check grammar answer
    if (answers.grammarAnswer !== undefined) {
        if (answers.grammarAnswer === assessment.grammarQ.correctIndex) {
            score += 1;
            correctIds.push('grammar');
        } else {
            missedSkills.push('grammar');
        }
    }

    // Check vocabulary answer
    if (answers.vocabAnswer !== undefined) {
        const vocabCorrect = checkVocabularyAnswer(
            answers.vocabAnswer,
            assessment.vocabQ.expectedTranslations
        );
        if (vocabCorrect) {
            score += 1;
            correctIds.push('vocabulary');
        } else {
            missedSkills.push('vocabulary');
        }
    }

    // Check phoneme answer
    if (answers.phonemeAnswer !== undefined) {
        if (answers.phonemeAnswer === assessment.phonemeQ.correctIndex) {
            score += 1;
            correctIds.push('phoneme');
        } else {
            missedSkills.push('phoneme');
        }
    }

    // Calculate percentage
    const totalQuestions = 3; // grammar, vocab, phoneme
    const percentage = Math.round((score / totalQuestions) * 100);

    return {
        score,
        total: totalQuestions,
        percentage,
        correctIds,
        missedSkills,
        passed: percentage >= 70, // 70% passing threshold
        feedback: generateFeedback(score, missedSkills, syllabus)
    };
}

/**
 * Checks if vocabulary answer matches expected translation(s).
 * @param {string|string[]} userAnswer
 * @param {string|string[]} expected
 * @returns {boolean}
 */
function checkVocabularyAnswer(userAnswer, expected) {
    if (Array.isArray(userAnswer) && Array.isArray(expected)) {
        // Compare arrays (order matters for deterministic assessment)
        if (userAnswer.length !== expected.length) return false;
        return userAnswer.every((ans, i) =>
            ans.toLowerCase().trim() === expected[i].toLowerCase().trim()
        );
    } else if (!Array.isArray(userAnswer) && !Array.isArray(expected)) {
        // Single word comparison
        return userAnswer.toLowerCase().trim() === expected.toLowerCase().trim();
    }
    return false;
}

/**
 * Generates feedback based on assessment results.
 * @param {number} score
 * @param {string[]} missedSkills
 * @param {Syllabus} syllabus
 * @returns {string}
 */
function generateFeedback(score, missedSkills, syllabus) {
    if (score === 3) {
        return `Excellent! You've mastered all A1 skills in ${syllabus.language}.`;
    } else if (score === 2) {
        return `Good job! You're progressing well in ${syllabus.language}.`;
    } else if (score === 1) {
        return `Keep practicing! Focus on ${missedSkills.join(' and ')}.`;
    } else {
        return `Review the ${syllabus.level} syllabus and try again.`;
    }
}

/**
 * Gets an assessment template for pre-generation caching.
 * @param {string} lang - Language code (e.g., 'es')
 * @param {string} cefr - CEFR level (e.g., 'A1')
 * @returns {Object} Assessment template
 */
export function getAssessmentTemplate(lang, cefr) {
    // This is a template that can be cached and later hydrated with actual syllabus
    return {
        type: 'assessment_template',
        lang,
        cefr,
        structure: {
            grammarQ: {
                type: 'multiple_choice',
                skill: 'grammar',
                requires: ['grammarDetails']
            },
            vocabQ: {
                type: 'translation',
                skill: 'vocabulary',
                requires: ['vocab']
            },
            phonemeQ: {
                type: 'recognition',
                skill: 'phoneme',
                requires: ['phonemeDetails']
            }
        },
        metadata: {
            version: '1.0',
            deterministic: true,
            compatibleWith: ['learningGoals.js', 'useScenarioAssessment']
        }
    };
}

/**
 * Converts assessment to quiz format compatible with useScenarioAssessment hook.
 * @param {Assessment} assessment - Assessment object from generateAssessment
 * @returns {Array} Array of quiz questions in useScenarioAssessment format
 */
export function assessmentToQuiz(assessment) {
    const { grammarQ, vocabQ, phonemeQ, metadata } = assessment;

    return [
        {
            id: `grammar-${metadata.cefr}-${Date.now()}`,
            type: 'grammar',
            question: grammarQ.question,
            options: grammarQ.options,
            correctIndex: grammarQ.correctIndex,
            explanation: grammarQ.explanation || 'Grammar rule application'
        },
        {
            id: `vocab-${metadata.cefr}-${Date.now()}`,
            type: 'vocab',
            question: vocabQ.prompt || `Translate: ${vocabQ.targetWords?.join(' and ') || 'the vocabulary'}`,
            options: vocabQ.alternatives || [
                vocabQ.expectedTranslations?.[0] || 'Correct translation',
                'Incorrect option 1',
                'Incorrect option 2',
                'Incorrect option 3'
            ],
            correctIndex: 0,
            explanation: `Vocabulary translation practice for ${metadata.lang}`
        },
        {
            id: `phoneme-${metadata.cefr}-${Date.now()}`,
            type: 'phoneme',
            question: phonemeQ.question,
            options: phonemeQ.options,
            correctIndex: phonemeQ.correctIndex,
            explanation: phonemeQ.practiceTip || 'Phoneme recognition practice'
        }
    ];
}

/**
 * Example usage and export for testing.
 */
export default {
    generateAssessment,
    validateAssessment,
    getAssessmentTemplate,
    assessmentToQuiz
};