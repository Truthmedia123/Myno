/**
 * Speaking drill panel for pronunciation practice.
 * Memoized to prevent unnecessary re-renders.
 * @module DrillPanel
 */

import React, { memo } from 'react';
import { SpeakerWaveIcon, MicrophoneIcon, CheckIcon } from '@heroicons/react/24/outline';

/**
 * @typedef {Object} DrillItem
 * @property {string} phrase - Phrase to pronounce
 * @property {string} [romanization] - Romanized version
 * @property {string} [meaning] - Meaning in native language
 * @property {string} [tip] - Pronunciation tip
 */

/**
 * @typedef {Object} DrillResult
 * @property {string} label - Quality label
 * @property {string} bg - Tailwind background class
 * @property {string} emoji - Emoji representation
 * @property {number} score - Confidence score (0-100)
 */

/**
 * @param {Object} props
 * @param {boolean} props.drillMode - Whether drill mode is active
 * @param {DrillItem[]|string[]} props.currentDrill - Array of drill items
 * @param {number} props.drillIndex - Current drill index
 * @param {DrillResult[]} props.drillResults - Array of results per drill
 * @param {Function} props.setDrillMode - Setter for drill mode
 * @param {Function} props.setDrillIndex - Setter for drill index
 * @param {Function} props.setDrillResults - Setter for drill results
 * @param {Function} props.getPronunciationLabel - Function to get label from confidence
 */
const DrillPanel = memo(function DrillPanel({
    drillMode,
    currentDrill,
    drillIndex,
    drillResults,
    setDrillMode,
    setDrillIndex,
    setDrillResults,
    getPronunciationLabel
}) {
    if (!drillMode || !currentDrill) return null;

    const handleSpeak = () => {
        const textToSpeak = typeof currentDrill[drillIndex] === 'string'
            ? currentDrill[drillIndex]
            : currentDrill[drillIndex].phrase;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleRecord = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Use Chrome for voice drills');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();
        recognition.onresult = (event) => {
            const confidence = event.results[0][0].confidence;
            const result = getPronunciationLabel(confidence);
            const newResults = [...drillResults];
            newResults[drillIndex] = {
                ...result,
                score: Math.round(confidence * 100)
            };
            setDrillResults(newResults);

            setTimeout(() => {
                if (drillIndex < currentDrill.length - 1) {
                    setDrillIndex(prev => prev + 1);
                } else {
                    // All drills done
                    setDrillMode(false);
                }
            }, 1500);
        };
        recognition.onerror = () => {
            alert('Voice recognition failed. Try again.');
        };
    };

    const drillItem = currentDrill[drillIndex];
    const isString = typeof drillItem === 'string';

    return (
        <div className="fixed inset-0 bg-background z-40 flex flex-col">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setDrillMode(false)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Exit drill
                    </button>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Pronunciation Drill</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 flex gap-1">
                                {currentDrill.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-1.5 rounded-full ${i < drillIndex ? 'bg-primary' : i === drillIndex ? 'bg-primary/50' : 'bg-muted'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {drillIndex + 1} of {currentDrill.length}
                            </p>
                        </div>
                    </div>
                    <div className="w-10" /> {/* spacer */}
                </div>
            </div>

            {/* Current drill phrase */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <p className="text-xs text-primary uppercase tracking-wide mb-4 font-semibold">
                    Read this aloud
                </p>
                {isString ? (
                    <p className="text-2xl font-bold text-foreground mb-2 leading-relaxed">
                        {drillItem}
                    </p>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-foreground mb-2 leading-relaxed">
                            {drillItem.phrase}
                            {drillItem.romanization && (
                                <span className="text-muted-foreground text-lg ml-2">
                                    ({drillItem.romanization})
                                </span>
                            )}
                        </p>
                        {drillItem.meaning && (
                            <p className="text-sm text-muted-foreground mb-2">
                                — {drillItem.meaning}
                            </p>
                        )}
                        {drillItem.tip && (
                            <p className="text-xs text-muted-foreground italic">
                                {drillItem.tip}
                            </p>
                        )}
                    </>
                )}

                {/* Listen button */}
                <button
                    onClick={handleSpeak}
                    className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-border bg-card hover:bg-accent transition-colors"
                >
                    <SpeakerWaveIcon className="w-5 h-5" />
                    <span className="font-medium">Listen</span>
                </button>

                {/* Last drill result */}
                {drillResults[drillIndex] && (
                    <div
                        className={`mt-4 px-4 py-2 rounded-xl border text-sm font-medium ${drillResults[drillIndex].bg}`}
                    >
                        {drillResults[drillIndex].emoji} {drillResults[drillIndex].label} — {drillResults[drillIndex].score}%
                    </div>
                )}
            </div>

            {/* Record button */}
            <div className="px-8 pb-10 pt-4">
                <button
                    onClick={handleRecord}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <MicrophoneIcon className="w-5 h-5" />
                    Record my pronunciation
                </button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    Speak clearly after pressing the button
                </p>
            </div>
        </div>
    );
});

export default DrillPanel;