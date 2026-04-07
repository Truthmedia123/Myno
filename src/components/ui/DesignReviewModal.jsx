/**
 * Design review modal for Myno design system
 * Provides design guidance, inspiration, and prompt generation
 * @module DesignReviewModal
 */

import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ClipboardDocumentIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DESIGN_SYSTEM_GUIDE, generateComponentPrompt, getDesignInspiration, saveDesignInspiration, deleteDesignInspiration } from '@/lib/designPrompts';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} DesignReviewModalProps
 * @property {boolean} isOpen - Whether modal is open
 * @property {Function} onClose - Callback to close modal
 */

/**
 * Design review modal component
 * @param {DesignReviewModalProps} props
 */
export default function DesignReviewModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('guide');
    const [inspirations, setInspirations] = useState([]);
    const [newInspiration, setNewInspiration] = useState({ title: '', url: '', notes: '' });
    const [promptData, setPromptData] = useState({ screenName: '', goal: '', constraints: '' });
    const [copied, setCopied] = useState(false);
    const modalRef = useRef(null);

    // Load inspirations on mount and when tab changes
    useEffect(() => {
        if (isOpen && activeTab === 'inspiration') {
            setInspirations(getDesignInspiration());
        }
    }, [isOpen, activeTab]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen, activeTab]);

    const handleSaveInspiration = () => {
        if (!newInspiration.title.trim()) return;

        const success = saveDesignInspiration(
            newInspiration.title,
            newInspiration.url,
            newInspiration.notes
        );

        if (success) {
            setInspirations(getDesignInspiration());
            setNewInspiration({ title: '', url: '', notes: '' });
        }
    };

    const handleDeleteInspiration = (id) => {
        const success = deleteDesignInspiration(id);
        if (success) {
            setInspirations(getDesignInspiration());
        }
    };

    const handleGeneratePrompt = () => {
        const prompt = generateComponentPrompt(
            promptData.screenName,
            promptData.goal,
            promptData.constraints
        );

        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const tabs = [
        { id: 'guide', label: 'Design Guide' },
        { id: 'inspiration', label: 'Inspiration' },
        { id: 'prompt', label: 'Prompt Builder' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="design-modal-title"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                    <div>
                        <h2 id="design-modal-title" className="text-2xl font-semibold text-gray-900">
                            Myno Design System
                        </h2>
                        <p className="text-gray-600">Maintain visual consistency across the app</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'px-4 py-3 font-medium text-sm transition-colors relative',
                                    activeTab === tab.id
                                        ? 'text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                                aria-selected={activeTab === tab.id}
                                role="tab"
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                    {/* Design Guide Tab */}
                    {activeTab === 'guide' && (
                        <div className="prose prose-indigo max-w-none">
                            <div dangerouslySetInnerHTML={{
                                __html: DESIGN_SYSTEM_GUIDE
                                    .replace(/\n/g, '<br>')
                                    .replace(/# (.*?)\n/g, '<h1>$1</h1>')
                                    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                                    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/`(.*?)`/g, '<code>$1</code>')
                                    .replace(/- (.*?)\n/g, '<li>$1</li>')
                            }} />
                        </div>
                    )}

                    {/* Inspiration Tab */}
                    {activeTab === 'inspiration' && (
                        <div className="space-y-6">
                            {/* Add New Inspiration */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Add New Inspiration</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Title (e.g., 'Onboarding Flow')"
                                        value={newInspiration.title}
                                        onChange={(e) => setNewInspiration({ ...newInspiration, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL (optional)"
                                        value={newInspiration.url}
                                        onChange={(e) => setNewInspiration({ ...newInspiration, url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <textarea
                                        placeholder="Notes (what you liked, ideas to adapt)"
                                        value={newInspiration.notes}
                                        onChange={(e) => setNewInspiration({ ...newInspiration, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleSaveInspiration}
                                        disabled={!newInspiration.title.trim()}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Save Inspiration
                                    </button>
                                </div>
                            </div>

                            {/* Inspiration List */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Saved Inspiration ({inspirations.length})</h3>
                                {inspirations.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No inspirations saved</p>
                                        <p className="text-sm">Add some above to build your design reference</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {inspirations.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                        {item.url && (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-indigo-600 hover:underline truncate block"
                                                            >
                                                                {item.url}
                                                            </a>
                                                        )}
                                                        {item.notes && (
                                                            <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Added {new Date(item.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteInspiration(item.id)}
                                                        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        aria-label="Delete inspiration"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Prompt Builder Tab */}
                    {activeTab === 'prompt' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                <h3 className="font-semibold text-gray-900 mb-2">AI Prompt Builder</h3>
                                <p className="text-sm text-gray-600">
                                    Generate consistent prompts for AI design tools (Figma, Midjourney, ChatGPT)
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Screen/Component Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 'Dashboard Stats Card', 'Onboarding Step 3'"
                                        value={promptData.screenName}
                                        onChange={(e) => setPromptData({ ...promptData, screenName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Design Goal
                                    </label>
                                    <textarea
                                        placeholder="What should this component achieve? e.g., 'Show progress metrics in an engaging way', 'Guide users through language selection'"
                                        value={promptData.goal}
                                        onChange={(e) => setPromptData({ ...promptData, goal: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Constraints (Optional)
                                    </label>
                                    <textarea
                                        placeholder="Any limitations? e.g., 'Must work on mobile', 'No more than 3 interactive elements', 'Include mascot integration'"
                                        value={promptData.constraints}
                                        onChange={(e) => setPromptData({ ...promptData, constraints: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        {copied && (
                                            <span className="text-sm text-green-600 flex items-center gap-1">
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                                Copied to clipboard!
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleGeneratePrompt}
                                        disabled={!promptData.screenName.trim() || !promptData.goal.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                        Generate & Copy Prompt
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mt-8">
                                <h4 className="font-medium text-gray-900 mb-2">Prompt Preview</h4>
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                    <pre>
                                        {promptData.screenName || promptData.goal
                                            ? generateComponentPrompt(
                                                promptData.screenName || '[Component Name]',
                                                promptData.goal || '[Design Goal]',
                                                promptData.constraints
                                            )
                                            : 'Fill in the fields above to see the generated prompt...'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>
                            Design System v1.0 •{' '}
                            <a
                                href="/public/design-inspiration.md"
                                target="_blank"
                                className="text-indigo-600 hover:underline"
                            >
                                View full inspiration guide
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('myno:designInspiration');
                                    setInspirations([]);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Clear All Inspiration
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}