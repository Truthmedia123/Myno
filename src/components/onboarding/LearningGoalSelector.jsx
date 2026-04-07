import React, { memo } from 'react';
import { LEARNING_GOALS } from '@/data/learningGoals';

/**
 * Learning goal selection component for onboarding.
 * @param {Object} props
 * @param {string} props.selectedGoal - Currently selected goal ID
 * @param {function} props.onSelect - Callback when goal is selected (goalId)
 * @param {function} props.onNext - Callback when Next button is clicked
 * @returns {JSX.Element}
 */
const LearningGoalSelector = memo(function LearningGoalSelector({
    selectedGoal,
    onSelect,
    onNext
}) {
    const handleGoalClick = (goalId) => {
        onSelect(goalId);
    };

    const handleNextClick = () => {
        if (selectedGoal) {
            onNext();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                    What's your learning goal?
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Choose a focus to personalize your scenarios and curriculum.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {LEARNING_GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;

                    return (
                        <button
                            key={goal.id}
                            type="button"
                            onClick={() => handleGoalClick(goal.id)}
                            aria-selected={isSelected}
                            className={`
                                relative p-5 rounded-2xl text-left transition-all duration-300
                                ${isSelected
                                    ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-[1.02]'
                                    : 'border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:shadow-md'
                                }
                                backdrop-blur-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                active:scale-95
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-3xl" aria-hidden="true">
                                    {goal.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                        {goal.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {goal.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                                            CEFR {goal.cefrRange[0]}–{goal.cefrRange[1]}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                                            {goal.scenarioIds.length} scenarios
                                        </span>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute -inset-1 rounded-2xl border-2 border-blue-300/50 pointer-events-none animate-pulse-slow"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedGoal ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Goal selected: <span className="font-medium text-gray-700 dark:text-gray-300">
                                {LEARNING_GOALS.find(g => g.id === selectedGoal)?.label}
                            </span>
                        </span>
                    ) : (
                        'Select a goal to continue'
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleNextClick}
                    disabled={!selectedGoal}
                    className={`
                        px-6 py-3 rounded-xl font-semibold transition-all duration-300
                        ${selectedGoal
                            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    Continue to Scenarios
                    <span className="ml-2">→</span>
                </button>
            </div>

            {/* Accessibility instructions */}
            <div className="sr-only" aria-live="polite">
                {selectedGoal
                    ? `Selected learning goal: ${LEARNING_GOALS.find(g => g.id === selectedGoal)?.label}. Press Continue to proceed.`
                    : 'No learning goal selected. Use arrow keys or click to choose one.'
                }
            </div>
        </div>
    );
});

LearningGoalSelector.displayName = 'LearningGoalSelector';

export default LearningGoalSelector;