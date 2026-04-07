/**
 * Client-side weekly report generator with shareable progress cards
 * @module reportGenerator
 */

/**
 * Generate a weekly report from user profile and localStorage data
 * @param {object} userProfile - User profile object
 * @param {object} dateRange - {start: Date, end: Date}
 * @returns {object} Weekly report object
 */
export function generateWeeklyReport(userProfile = {}, dateRange = null) {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(now.getDate() - 7);

    const start = dateRange?.start || defaultStart;
    const end = dateRange?.end || now;

    // Format dates for display
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    });

    const dateRangeText = `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;

    // Extract data from localStorage (simulated - in real app would query actual data)
    const scenariosCompleted = getScenariosCompletedThisWeek(start, end);
    const wordsMastered = getWordsMasteredThisWeek(start, end);
    const phonemeImprovements = getPhonemeImprovements(userProfile, start, end);
    const xpEarned = getXpEarnedThisWeek(start, end);
    const streakDays = userProfile.streakDays || 0;
    const targetLanguage = userProfile.target_language || 'English';

    // Calculate totals
    const totalScenarios = 6; // Hardcoded for demo
    const totalWords = 42; // Hardcoded for demo
    const totalPhonemes = phonemeImprovements.length;

    return {
        dateRange: { start, end },
        dateRangeText,
        targetLanguage,
        scenariosCompleted: {
            count: scenariosCompleted,
            total: totalScenarios,
            percentage: Math.round((scenariosCompleted / totalScenarios) * 100) || 0
        },
        wordsMastered: {
            count: wordsMastered,
            total: totalWords,
            percentage: Math.round((wordsMastered / totalWords) * 100) || 0
        },
        phonemeImprovements,
        xpEarned,
        streakDays,
        generatedAt: now.toISOString()
    };
}

/**
 * Format report as plain text for sharing
 * @param {object} report - Weekly report object
 * @returns {string} Plain text shareable string
 */
export function formatReportForShare(report) {
    const { targetLanguage, dateRangeText, scenariosCompleted, wordsMastered, xpEarned, streakDays } = report;

    return `📊 My ${targetLanguage} Learning Report (${dateRangeText})

✅ Scenarios completed: ${scenariosCompleted.count}/${scenariosCompleted.total}
📚 Words mastered: ${wordsMastered.count}/${wordsMastered.total}
⭐ XP earned: ${xpEarned}
🔥 Streak: ${streakDays} days

Phoneme improvements:
${report.phonemeImprovements.map(p => `• ${p.phoneme}: +${p.improvement}%`).join('\n')}

Keep learning with Myno AI Tutor! 🚀
#MynoAI #LanguageLearning`;
}

/**
 * Generate a PNG image of the report using Canvas API
 * @param {object} report - Weekly report object
 * @returns {Promise<string>} Data URL of the generated image
 */
export async function generateReportImage(report) {
    return new Promise((resolve) => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Canvas dimensions
        canvas.width = 800;
        canvas.height = 600;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header gradient
        const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        headerGradient.addColorStop(0, '#4f46e5');
        headerGradient.addColorStop(1, '#7c3aed');

        ctx.fillStyle = headerGradient;
        ctx.fillRect(0, 0, canvas.width, 120);

        // Header text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`This Week in ${report.targetLanguage}`, canvas.width / 2, 50);

        ctx.font = '20px Arial';
        ctx.fillText(report.dateRangeText, canvas.width / 2, 85);

        // Stats grid
        const stats = [
            { label: 'Scenarios', value: report.scenariosCompleted.count, total: report.scenariosCompleted.total, color: '#10b981' },
            { label: 'Words', value: report.wordsMastered.count, total: report.wordsMastered.total, color: '#3b82f6' },
            { label: 'XP Earned', value: report.xpEarned, total: '', color: '#f59e0b' },
            { label: 'Streak', value: report.streakDays, total: 'days', color: '#ef4444' }
        ];

        // Draw stats cards
        const cardWidth = 180;
        const cardHeight = 100;
        const cardSpacing = 20;
        const startX = (canvas.width - (4 * cardWidth + 3 * cardSpacing)) / 2;

        stats.forEach((stat, index) => {
            const x = startX + index * (cardWidth + cardSpacing);
            const y = 150;

            // Card background
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.fillRect(x, y, cardWidth, cardHeight);
            ctx.strokeRect(x, y, cardWidth, cardHeight);

            // Stat value
            ctx.fillStyle = stat.color;
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stat.value.toString(), x + cardWidth / 2, y + 50);

            // Stat label
            ctx.fillStyle = '#64748b';
            ctx.font = '16px Arial';
            ctx.fillText(stat.label, x + cardWidth / 2, y + 75);

            // Total if available
            if (stat.total) {
                ctx.font = '14px Arial';
                ctx.fillText(`/ ${stat.total}`, x + cardWidth / 2, y + 95);
            }
        });

        // Phoneme improvements section
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Phoneme Improvements', 50, 300);

        // Draw progress bars
        const maxPhonemes = 5;
        const displayedPhonemes = report.phonemeImprovements.slice(0, maxPhonemes);

        displayedPhonemes.forEach((phoneme, index) => {
            const y = 340 + index * 40;

            // Phoneme name
            ctx.fillStyle = '#475569';
            ctx.font = '16px Arial';
            ctx.fillText(phoneme.phoneme, 50, y);

            // Improvement percentage
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`+${phoneme.improvement}%`, 300, y);

            // Progress bar background
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(320, y - 12, 400, 8);

            // Progress bar fill
            const progressWidth = (phoneme.improvement / 100) * 400;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(320, y - 12, progressWidth, 8);
        });

        // Footer
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Generated with Myno AI Tutor • myno.app', canvas.width / 2, canvas.height - 30);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
    });
}

/**
 * Download report image as PNG file
 * @param {string} dataUrl - Canvas data URL
 * @param {string} filename - Optional filename
 */
export function downloadReportImage(dataUrl, filename = 'myno-weekly-report.png') {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Share report using Web Share API or clipboard fallback
 * @param {object} report - Weekly report object
 * @returns {Promise<boolean>} Success status
 */
export async function shareReport(report) {
    const shareText = formatReportForShare(report);

    // Try Web Share API first
    if (navigator.share) {
        try {
            await navigator.share({
                title: `My ${report.targetLanguage} Learning Report`,
                text: shareText,
                url: 'https://myno.app'
            });
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.warn('Web Share failed, falling back to clipboard:', error);
            }
        }
    }

    // Fallback to clipboard
    try {
        await navigator.clipboard.writeText(shareText);
        alert('Report copied to clipboard! 📋');
        return true;
    } catch (error) {
        console.error('Clipboard write failed:', error);
        // Last resort: show text for manual copy
        prompt('Copy this text to share:', shareText);
        return false;
    }
}

// Helper functions (simulated data extraction)
function getScenariosCompletedThisWeek(start, end) {
    // In real app, query localStorage or Firestore
    const stored = localStorage.getItem('scenarioCompletions');
    if (!stored) return Math.floor(Math.random() * 6) + 1;

    try {
        const completions = JSON.parse(stored);
        return completions.filter(c => {
            const date = new Date(c.completedAt);
            return date >= start && date <= end;
        }).length;
    } catch {
        return Math.floor(Math.random() * 6) + 1;
    }
}

function getWordsMasteredThisWeek(start, end) {
    // In real app, query localStorage or Firestore
    const stored = localStorage.getItem('masteredWords');
    if (!stored) return Math.floor(Math.random() * 42) + 5;

    try {
        const words = JSON.parse(stored);
        return words.filter(w => {
            const date = new Date(w.masteredAt);
            return date >= start && date <= end;
        }).length;
    } catch {
        return Math.floor(Math.random() * 42) + 5;
    }
}

function getPhonemeImprovements(userProfile, start, end) {
    const { phonemeAccuracy = {} } = userProfile;
    const phonemes = Object.keys(phonemeAccuracy);

    if (phonemes.length === 0) {
        // Default improvements for demo
        return [
            { phoneme: "'th' sounds", improvement: 15 },
            { phoneme: "Rolled 'r'", improvement: 22 },
            { phoneme: "Nasal vowels", improvement: 8 },
            { phoneme: "Pitch accent", improvement: 18 },
            { phoneme: "Word stress", improvement: 12 }
        ];
    }

    // Calculate improvements (simulated)
    return phonemes.slice(0, 5).map(phoneme => ({
        phoneme,
        improvement: Math.floor(Math.random() * 30) + 5
    }));
}

function getXpEarnedThisWeek(start, end) {
    // In real app, sum XP from localStorage
    const stored = localStorage.getItem('xpHistory');
    if (!stored) return Math.floor(Math.random() * 500) + 100;

    try {
        const history = JSON.parse(stored);
        return history
            .filter(entry => {
                const date = new Date(entry.date);
                return date >= start && date <= end;
            })
            .reduce((sum, entry) => sum + entry.xp, 0);
    } catch {
        return Math.floor(Math.random() * 500) + 100;
    }
}