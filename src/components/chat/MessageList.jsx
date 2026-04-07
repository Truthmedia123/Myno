/**
 * Renders the list of chat messages with animations and interactive features.
 * Memoized to prevent unnecessary re-renders.
 * @module MessageList
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import MynoAvatar from '../ui/MynoAvatar';

/**
 * @typedef {Object} Message
 * @property {string} role - 'user' | 'assistant'
 * @property {string} content - Message text
 * @property {Object} [parsed] - Parsed agent response
 * @property {string} [id] - Unique identifier
 * @property {boolean} [isCorrection] - Whether message contains a correction
 * @property {boolean} [isCelebration] - Whether message contains celebration
 */

/**
 * @typedef {Object} PronunciationResult
 * @property {string} label - Quality label
 * @property {string} color - Tailwind text color class
 * @property {string} bg - Tailwind background color class
 * @property {string} emoji - Emoji representation
 * @property {number} confidence - Confidence score (0-1)
 */

/**
 * Determine mascot state based on message metadata
 * @param {Message} message - Message object
 * @returns {keyof import('../../data/mynoMascot').MYNO_STATES}
 */
function getMascotState(message) {
    if (message.isCelebration) return 'celebrating';
    if (message.isCorrection) return 'correcting';
    if (message.role === 'assistant') return 'thinking';
    return 'encouraging';
}

/**
 * @param {Object} props
 * @param {Message[]} props.messages - Array of messages to display
 * @param {boolean} props.isLoading - Whether AI is generating a response
 * @param {PronunciationResult|null} props.pronunciationResult - Pronunciation feedback
 * @param {number} props.sessionMessages - Total messages in session
 * @param {Object} [props.profile] - User profile
 * @param {Function} props.speak - Function to speak text aloud
 * @param {Function} props.shareContent - Function to trigger sharing
 * @param {Function} props.getShareText - Function to generate share text
 */
const MessageList = memo(function MessageList({
    messages,
    isLoading,
    pronunciationResult,
    sessionMessages,
    profile,
    speak,
    shareContent,
    getShareText
}) {
    const targetLanguage = profile?.target_language || 'English';

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth" id="message-list">
            <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={msg.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            'flex items-start gap-3',
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {/* Mascot avatar for AI messages */}
                        {msg.role === 'assistant' && (
                            <div className="flex-shrink-0 mt-1" aria-hidden="true">
                                <MynoAvatar
                                    state={getMascotState(msg)}
                                    targetLanguage={targetLanguage}
                                    size="sm"
                                />
                            </div>
                        )}

                        <div
                            className={cn(
                                'max-w-[85%] rounded-3xl px-4 py-3',
                                msg.role === 'user'
                                    ? 'bg-secondary text-secondary-foreground rounded-br-sm'
                                    : 'bg-card border border-border rounded-bl-sm'
                            )}
                        >
                            {msg.parsed ? (
                                <>
                                    {/* Word highlight */}
                                    {msg.parsed.word && (
                                        <div className="mb-2">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                <span className="text-lg">📘</span>
                                                WORD: {msg.parsed.word}
                                            </div>
                                        </div>
                                    )}
                                    {/* Pro Tip */}
                                    {msg.parsed.proTip && (
                                        <div className="mb-2">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                                                <span className="text-lg">💡</span>
                                                Pro Tip: {msg.parsed.proTip}
                                            </div>
                                        </div>
                                    )}
                                    {/* Prompt */}
                                    {msg.parsed.prompt && (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap mt-3">
                                            {msg.parsed.prompt}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    {msg.role === 'assistant' && (
                                        <button
                                            onClick={() => speak(msg.content)}
                                            className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary transition-colors"
                                        >
                                            <SpeakerWaveIcon className="w-3 h-3" />
                                            Play
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Empty space for user messages to maintain alignment */}
                        {msg.role === 'user' && <div className="w-12 flex-shrink-0" />}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* WhatsApp Share Nudge after every 10th message */}
            {sessionMessages > 0 && sessionMessages % 10 === 0 && (
                <div className="flex justify-center my-2">
                    <button
                        onClick={() => shareContent(getShareText('default', { language: profile?.target_language }))}
                        className="text-xs text-muted-foreground hover:text-green-500 flex items-center gap-1 transition-colors"
                    >
                        Enjoying Myno? Share with friends 📲
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-start items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                        <MynoAvatar
                            state="thinking"
                            targetLanguage={targetLanguage}
                            size="sm"
                        />
                    </div>
                    <div className="bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1.5 items-center">
                            <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                                style={{ animationDelay: '0ms' }}
                            />
                            <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                                style={{ animationDelay: '160ms' }}
                            />
                            <div
                                className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                                style={{ animationDelay: '320ms' }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default MessageList;