/**
 * Scenario selection header for starting conversation scenarios.
 * Memoized to prevent unnecessary re-renders.
 * @module ScenarioHeader
 */

import React, { memo } from 'react';

/**
 * @typedef {Object} Scenario
 * @property {string} id - Unique identifier
 * @property {string} label - Display name
 * @property {string} icon - Emoji icon
 * @property {string} prompt - AI prompt for this scenario
 */

/**
 * @param {Object} props
 * @param {Scenario[]} props.scenarios - Array of scenario objects
 * @param {boolean} props.showScenarios - Whether to show the component
 * @param {Function} props.setShowScenarios - Setter for visibility
 * @param {Function} props.sendMessage - Function to send scenario prompt
 * @param {Object} [props.profile] - User profile for language personalization
 */
const ScenarioHeader = memo(function ScenarioHeader({
    scenarios,
    showScenarios,
    setShowScenarios,
    sendMessage,
    profile
}) {
    if (!showScenarios) return null;

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between px-4 mb-2">
                <p className="text-sm font-medium text-foreground">Start a scenario</p>
                <button
                    onClick={() => setShowScenarios(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    Hide
                </button>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {scenarios.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => sendMessage(scenario.prompt)}
                        className="flex-shrink-0 w-32 h-28 rounded-2xl border border-border bg-card p-3 flex flex-col items-center justify-center text-center hover:bg-accent transition-colors"
                    >
                        <span className="text-2xl mb-2">{scenario.icon}</span>
                        <span className="text-xs font-medium text-foreground">{scenario.label}</span>
                        <span className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                            {scenario.prompt.substring(0, 40)}...
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default ScenarioHeader;