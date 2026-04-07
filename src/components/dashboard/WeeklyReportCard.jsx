import React, { useState, useCallback, useMemo } from 'react';
import { generateReportImage, downloadReportImage, shareReport } from '../../lib/reportGenerator';

/**
 * Weekly report card component with shareable progress
 * @component
 * @param {object} props
 * @param {object} props.report - Weekly report object from generateWeeklyReport()
 * @param {function} props.onShare - Callback when share is initiated
 * @param {function} props.onDownload - Callback when download is initiated
 */
const WeeklyReportCard = React.memo(function WeeklyReportCard({
    report,
    onShare,
    onDownload
}) {
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Default report if none provided
    const safeReport = useMemo(() => {
        if (!report) {
            const now = new Date();
            const start = new Date(now);
            start.setDate(now.getDate() - 7);

            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            });

            return {
                dateRangeText: `${dateFormatter.format(start)} - ${dateFormatter.format(now)}`,
                targetLanguage: 'English',
                scenariosCompleted: { count: 0, total: 6, percentage: 0 },
                wordsMastered: { count: 0, total: 42, percentage: 0 },
                phonemeImprovements: [],
                xpEarned: 0,
                streakDays: 0
            };
        }
        return report;
    }, [report]);

    // Handle share button click
    const handleShare = useCallback(async () => {
        if (!safeReport || isSharing) return;

        setIsSharing(true);
        if (onShare) onShare();

        try {
            await shareReport(safeReport);
        } catch (error) {
            console.error('Share failed:', error);
        } finally {
            setIsSharing(false);
        }
    }, [safeReport, onShare, isSharing]);

    // Handle download button click
    const handleDownload = useCallback(async () => {
        if (!safeReport || isGeneratingImage) return;

        setIsGeneratingImage(true);
        if (onDownload) onDownload();

        try {
            const dataUrl = await generateReportImage(safeReport);
            downloadReportImage(dataUrl, `myno-weekly-${new Date().toISOString().slice(0, 10)}.png`);
        } catch (error) {
            console.error('Image generation failed:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsGeneratingImage(false);
        }
    }, [safeReport, onDownload, isGeneratingImage]);

    // Stats grid items
    const statCards = useMemo(() => [
        {
            label: 'Scenarios',
            value: safeReport.scenariosCompleted.count,
            total: safeReport.scenariosCompleted.total,
            color: 'emerald',
            icon: '✅'
        },
        {
            label: 'Words',
            value: safeReport.wordsMastered.count,
            total: safeReport.wordsMastered.total,
            color: 'blue',
            icon: '📚'
        },
        {
            label: 'XP Earned',
            value: safeReport.xpEarned,
            total: '',
            color: 'amber',
            icon: '⭐'
        },
        {
            label: 'Streak',
            value: safeReport.streakDays,
            total: 'days',
            color: 'rose',
            icon: '🔥'
        }
    ], [safeReport]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                    This Week in {safeReport.targetLanguage}
                </h1>
                <p className="text-indigo-100 text-center mt-2">
                    {safeReport.dateRangeText}
                </p>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-${stat.color}-50 dark:bg-gray-700 rounded-xl p-4 border border-${stat.color}-200 dark:border-gray-600`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-${stat.color}-700 dark:text-${stat.color}-300 font-bold text-2xl`}>
                                    {stat.value}
                                </span>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-${stat.color}-800 dark:text-${stat.color}-200 font-medium`}>
                                    {stat.label}
                                </span>
                                {stat.total && (
                                    <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm`}>
                                        / {stat.total}
                                    </span>
                                )}
                            </div>
                            {stat.total && typeof stat.total === 'number' && stat.total > 0 && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-500`}
                                            style={{ width: `${Math.min(100, (stat.value / stat.total) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Phoneme Improvements */}
                {safeReport.phonemeImprovements.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Phoneme Improvements
                        </h2>
                        <div className="space-y-3">
                            {safeReport.phonemeImprovements.slice(0, 5).map((phoneme, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-40 md:w-48">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                            {phoneme.phoneme}
                                        </span>
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700"
                                                style={{ width: `${Math.min(100, phoneme.improvement)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-16 text-right">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                            +{phoneme.improvement}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state for phonemes */}
                {safeReport.phonemeImprovements.length === 0 && (
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            No phoneme data recorded this week. Practice pronunciation to see improvements!
                        </p>
                    </div>
                )}

                {/* Share Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Share Your Progress
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70"
                        >
                            <span className="text-xl">📤</span>
                            <span>{isSharing ? 'Sharing...' : 'Share Progress'}</span>
                        </button>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            disabled={isGeneratingImage}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70"
                        >
                            <span className="text-xl">📥</span>
                            <span>{isGeneratingImage ? 'Generating...' : 'Download PNG'}</span>
                        </button>
                    </div>

                    {/* Help text */}
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            • Share: Uses Web Share API or copies to clipboard
                            <br />
                            • Download: Generates a PNG image using Canvas API (works offline)
                        </p>
                    </div>
                </div>

                {/* Print-friendly note */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">💡</span>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            This report is generated client-side using your local data. No data is sent to servers.
                            Press Ctrl+P to print a clean version.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Generated with Myno AI Tutor
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default WeeklyReportCard;