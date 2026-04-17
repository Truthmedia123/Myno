// src/pages/Vocabulary.jsx
import React, { useState, useEffect } from 'react';
import { getWordsByLanguage, updateWordStatus, deleteWord, getWordsDueForReview } from '../lib/vocabStore';
import { useAuth } from '../lib/AuthContext';

export default function Vocabulary() {
    const { profile } = useAuth();
    const [words, setWords] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedWord, setSelectedWord] = useState(null);
    const [loading, setLoading] = useState(true);

    const targetLanguage = profile?.target_language || 'en';

    useEffect(() => {
        loadWords();
    }, [targetLanguage, filter]);

    async function loadWords() {
        setLoading(true);
        const status = filter === 'all' ? null : filter;
        const loaded = await getWordsByLanguage(targetLanguage, status);
        setWords(loaded.sort((a, b) => b.firstSeen - a.firstSeen));
        setLoading(false);
    }

    async function handleReview(id, performance) {
        const status = performance === 'good' ? 'learning' : 'learning';
        await updateWordStatus(id, status, performance);
        loadWords();
    }

    async function handleMaster(id) {
        await updateWordStatus(id, 'mastered', 'good');
        loadWords();
    }

    async function handleDelete(id) {
        await deleteWord(id);
        loadWords();
        setSelectedWord(null);
    }

    async function handleReviewDue() {
        const due = await getWordsDueForReview(targetLanguage);
        if (due.length === 0) {
            alert('No words due for review! 🎉');
        } else {
            alert(`${due.length} word(s) ready for review. Switch to "Learning" filter to see them.`);
        }
    }

    const statusCounts = {
        all: words.length,
        new: words.filter(w => w.status === 'new').length,
        learning: words.filter(w => w.status === 'learning').length,
        mastered: words.filter(w => w.status === 'mastered').length
    };

    return (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            <h1 className="text-2xl font-bold mb-4">📚 My Vocabulary</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['all', 'new', 'learning', 'mastered'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
                    </button>
                ))}
            </div>

            {/* Review Due Button */}
            <button
                onClick={handleReviewDue}
                className="w-full mb-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
            >
                🔄 Review Due Words
            </button>

            {/* Word List */}
            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : words.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No words yet. Save words from conversations!
                </div>
            ) : (
                <div className="grid gap-3">
                    {words.map(word => (
                        <div
                            key={word.id}
                            onClick={() => setSelectedWord(word)}
                            className={`p-4 rounded-lg border cursor-pointer transition ${word.status === 'mastered'
                                    ? 'bg-green-50 border-green-200'
                                    : word.status === 'learning'
                                        ? 'bg-yellow-50 border-yellow-200'
                                        : 'bg-white border-gray-200'
                                } hover:shadow-md`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{word.word}</h3>
                                    <p className="text-gray-600">{word.translation}</p>
                                    {word.context && (
                                        <p className="text-sm text-gray-400 mt-1 italic">"{word.context}"</p>
                                    )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${word.status === 'mastered' ? 'bg-green-200 text-green-800' :
                                        word.status === 'learning' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-blue-200 text-blue-800'
                                    }`}>
                                    {word.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Word Detail Modal */}
            {selectedWord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50" onClick={() => setSelectedWord(null)}>
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-2">{selectedWord.word}</h2>
                        <p className="text-lg text-gray-700 mb-2">{selectedWord.translation}</p>
                        {selectedWord.context && (
                            <p className="text-gray-500 italic mb-4">"{selectedWord.context}"</p>
                        )}

                        <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-500">
                                Status: <span className="font-medium">{selectedWord.status}</span> •
                                Reviews: {selectedWord.reviewCount}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {selectedWord.status !== 'mastered' && (
                                <>
                                    <button onClick={() => { handleReview(selectedWord.id, 'again'); setSelectedWord(null); }} className="flex-1 py-2 bg-red-500 text-white rounded-lg">😓 Again</button>
                                    <button onClick={() => { handleReview(selectedWord.id, 'good'); setSelectedWord(null); }} className="flex-1 py-2 bg-blue-500 text-white rounded-lg">👍 Good</button>
                                </>
                            )}
                            {selectedWord.status === 'learning' && (
                                <button onClick={() => { handleMaster(selectedWord.id); setSelectedWord(null); }} className="flex-1 py-2 bg-green-500 text-white rounded-lg">✅ Mastered</button>
                            )}
                            <button onClick={() => { handleDelete(selectedWord.id); }} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg">🗑️ Delete</button>
                        </div>

                        <button onClick={() => setSelectedWord(null)} className="w-full mt-3 py-2 text-gray-500">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}