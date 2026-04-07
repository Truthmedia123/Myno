/**
 * Input bar with voice control, text input, and send button.
 * Memoized to prevent unnecessary re-renders.
 * @module InputBar
 */

import React, { memo } from 'react';
import { MicrophoneIcon, StopIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} PronunciationResult
 * @property {string} label - Quality label
 * @property {string} color - Tailwind text color class
 * @property {string} bg - Tailwind background color class
 * @property {string} emoji - Emoji representation
 * @property {number} confidence - Confidence score (0-1)
 */

/**
 * @param {Object} props
 * @param {string} props.input - Current input value
 * @param {Function} props.setInput - Setter for input
 * @param {Function} props.sendMessage - Function to send message
 * @param {boolean} props.isLoading - Whether AI is generating
 * @param {boolean} props.isListening - Whether voice input is active
 * @param {Function} props.startVoiceInput - Start voice recording
 * @param {Function} props.stopVoice - Stop voice recording
 * @param {PronunciationResult|null} props.pronunciationResult - Pronunciation feedback
 * @param {string[]} props.suggestedReplies - Suggested reply chips
 * @param {Function} props.setSuggestedReplies - Setter for suggested replies
 */
const InputBar = memo(function InputBar({
    input,
    setInput,
    sendMessage,
    isLoading,
    isListening,
    startVoiceInput,
    stopVoice,
    pronunciationResult,
    suggestedReplies,
    setSuggestedReplies
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <div className="glass border-t px-4 py-3">
            {/* Big mic button */}
            <div className="flex justify-center mb-3">
                <button
                    onClick={isListening ? stopVoice : startVoiceInput}
                    className={cn(
                        'relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all scale-on-press',
                        isListening ? 'bg-destructive shadow-red-300' : 'bg-secondary shadow-sea'
                    )}
                >
                    {isListening && (
                        <div
                            className="absolute inset-0 rounded-full border-4 border-primary/60 animate-pulse-ring"
                            style={{ borderColor: '#98FFD8' }}
                        />
                    )}
                    {isListening ? (
                        <StopIcon className="w-6 h-6 text-white" />
                    ) : (
                        <MicrophoneIcon className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Pronunciation quality label */}
            {pronunciationResult && (
                <div className="text-center mb-1">
                    <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${pronunciationResult.bg} ${pronunciationResult.color}`}
                    >
                        {pronunciationResult.emoji} {pronunciationResult.label}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        Confidence: {Math.round(pronunciationResult.confidence * 100)}%
                    </p>
                </div>
            )}

            {/* Suggested reply chips */}
            {suggestedReplies.length > 0 && !isLoading && (
                <div className="flex gap-2 flex-wrap px-4 pb-2">
                    {suggestedReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => {
                                setInput(reply);
                                setSuggestedReplies([]);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            {/* Text input row */}
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Or type a message..."
                    className="flex-1 h-11 rounded-2xl border-2 border-border bg-background px-4 text-sm font-medium outline-none focus:border-secondary transition-colors"
                />
                <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="w-11 h-11 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:bg-secondary/90"
                >
                    {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    ) : (
                        <PaperAirplaneIcon className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
});

export default InputBar;