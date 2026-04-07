import React, { useState, useCallback } from 'react';
import { submitUserScenario } from '../../lib/communityManager';

/**
 * User-submitted scenario form with validation
 * @component
 * @param {object} props
 * @param {object} props.userProfile - User profile with uid
 * @param {function} props.onSubmitSuccess - Callback when submission succeeds
 */
const SubmitScenarioForm = React.memo(function SubmitScenarioForm({
    userProfile = {},
    onSubmitSuccess
}) {
    const [formData, setFormData] = useState({
        title: '',
        cefr: 'A2',
        targetSkill: 'vocab',
        scenarioPrompt: '',
        vocab: [''],
        grammarTip: '',
        culturalTip: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    // Handle input changes
    const handleChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    // Handle vocabulary array changes
    const handleVocabChange = useCallback((index, value) => {
        const newVocab = [...formData.vocab];
        newVocab[index] = value;
        setFormData(prev => ({ ...prev, vocab: newVocab }));
    }, [formData.vocab]);

    const addVocabField = useCallback(() => {
        if (formData.vocab.length < 10) {
            setFormData(prev => ({ ...prev, vocab: [...prev.vocab, ''] }));
        }
    }, [formData.vocab.length]);

    const removeVocabField = useCallback((index) => {
        if (formData.vocab.length > 1) {
            const newVocab = formData.vocab.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, vocab: newVocab }));
        }
    }, [formData.vocab]);

    // Validate form
    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        } else if (formData.title.trim().length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (!formData.scenarioPrompt.trim()) {
            newErrors.scenarioPrompt = 'Scenario prompt is required';
        } else if (formData.scenarioPrompt.trim().length < 50) {
            newErrors.scenarioPrompt = 'Prompt must be at least 50 characters';
        } else if (formData.scenarioPrompt.trim().length > 2000) {
            newErrors.scenarioPrompt = 'Prompt must be less than 2000 characters';
        }

        // Validate vocabulary entries
        const validVocab = formData.vocab.filter(v => v.trim().length > 0);
        if (validVocab.length === 0) {
            newErrors.vocab = 'At least one vocabulary word is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            // Filter out empty vocabulary entries
            const filteredVocab = formData.vocab.filter(v => v.trim().length > 0);

            const result = await submitUserScenario(
                { ...formData, vocab: filteredVocab },
                userProfile
            );

            setSubmitResult(result);

            if (result.success) {
                // Reset form on success
                setFormData({
                    title: '',
                    cefr: 'A2',
                    targetSkill: 'vocab',
                    scenarioPrompt: '',
                    vocab: [''],
                    grammarTip: '',
                    culturalTip: ''
                });

                if (onSubmitSuccess) {
                    onSubmitSuccess(result.submissionId);
                }
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                error: error.message || 'Submission failed'
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, userProfile, validateForm, onSubmitSuccess]);

    // Character counters
    const titleLength = formData.title.length;
    const promptLength = formData.scenarioPrompt.length;
    const grammarTipLength = formData.grammarTip.length;
    const culturalTipLength = formData.culturalTip.length;

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Submit a Community Scenario
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Share your language learning scenario idea. If approved, it will be available for all Myno users!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scenario Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.title
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors`}
                        placeholder="e.g., Ordering Coffee in a Paris Café"
                        maxLength={100}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.title && (
                            <span className="text-sm text-red-600 dark:text-red-400">{errors.title}</span>
                        )}
                        <span className={`text-sm ml-auto ${titleLength > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {titleLength}/100
                        </span>
                    </div>
                </div>

                {/* CEFR Level & Target Skill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CEFR Level *
                        </label>
                        <select
                            value={formData.cefr}
                            onChange={(e) => handleChange('cefr', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="A1">A1 (Beginner)</option>
                            <option value="A2">A2 (Elementary)</option>
                            <option value="B1">B1 (Intermediate)</option>
                            <option value="B2">B2 (Upper Intermediate)</option>
                            <option value="C1">C1 (Advanced)</option>
                            <option value="C2">C2 (Proficient)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Skill *
                        </label>
                        <select
                            value={formData.targetSkill}
                            onChange={(e) => handleChange('targetSkill', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="vocab">Vocabulary</option>
                            <option value="grammar">Grammar</option>
                            <option value="phoneme">Pronunciation</option>
                            <option value="conversation">Conversation</option>
                        </select>
                    </div>
                </div>

                {/* Scenario Prompt */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scenario Prompt *
                        <span className="text-gray-500 text-xs ml-2">Describe the situation and what the user should do</span>
                    </label>
                    <textarea
                        value={formData.scenarioPrompt}
                        onChange={(e) => handleChange('scenarioPrompt', e.target.value)}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.scenarioPrompt
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none`}
                        placeholder="You are in a Paris café. Order a coffee and croissant, ask about WiFi, and respond to the barista's questions..."
                        maxLength={2000}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.scenarioPrompt && (
                            <span className="text-sm text-red-600 dark:text-red-400">{errors.scenarioPrompt}</span>
                        )}
                        <span className={`text-sm ml-auto ${promptLength > 1900 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {promptLength}/2000
                        </span>
                    </div>
                </div>

                {/* Vocabulary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key Vocabulary *
                        <span className="text-gray-500 text-xs ml-2">Words/phrases to learn in this scenario</span>
                    </label>
                    {formData.vocab.map((word, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => handleVocabChange(index, e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                                placeholder={`Vocabulary word ${index + 1}`}
                            />
                            {formData.vocab.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVocabField(index)}
                                    className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.vocab && (
                        <span className="text-sm text-red-600 dark:text-red-400">{errors.vocab}</span>
                    )}
                    <button
                        type="button"
                        onClick={addVocabField}
                        disabled={formData.vocab.length >= 10}
                        className="mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        + Add another vocabulary word
                    </button>
                </div>

                {/* Grammar Tip */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Grammar Tip (Optional)
                    </label>
                    <textarea
                        value={formData.grammarTip}
                        onChange={(e) => handleChange('grammarTip', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                        placeholder="e.g., Use 'je voudrais' (I would like) for polite requests"
                        maxLength={500}
                    />
                    <div className="text-right mt-1">
                        <span className={`text-sm ${grammarTipLength > 450 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {grammarTipLength}/500
                        </span>
                    </div>
                </div>

                {/* Cultural Tip */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cultural Tip (Optional)
                    </label>
                    <textarea
                        value={formData.culturalTip}
                        onChange={(e) => handleChange('culturalTip', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                        placeholder="e.g., In France, it's common to say 'bonjour' before ordering"
                        maxLength={500}
                    />
                    <div className="text-right mt-1">
                        <span className={`text-sm ${culturalTipLength > 450 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {culturalTipLength}/500
                        </span>
                    </div>
                </div>

                {/* Submission Result */}
                {submitResult && (
                    <div className={`p-4 rounded-xl ${submitResult.success ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-center">
                            <span className={`text-xl mr-3 ${submitResult.success ? 'text-emerald-600' : 'text-red-600'}`}>
                                {submitResult.success ? '✓' : '⚠'}
                            </span>
                            <div>
                                <p className={`font-medium ${submitResult.success ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                                    {submitResult.success ? 'Scenario submitted successfully!' : 'Submission failed'}
                                </p>
                                <p className="text-sm mt-1">
                                    {submitResult.message || submitResult.error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit for Moderation'
                        )}
                    </button>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                        <p>• Submissions are reviewed by moderators within 7 days</p>
                        <p>• Rate limit: 3 submissions per week per user</p>
                        <p>• Works offline (submissions saved locally until connection restored)</p>
                    </div>
                </div>
            </form>
        </div>
    );
});

export default SubmitScenarioForm;