import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getWordsByLanguage } from '@/lib/vocabStore';
import { useNavigate } from 'react-router-dom';
import { ChartBarIcon, FireIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BottomNav from '@/components/myno/BottomNav';

export default function Progress() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ vocab: 0, learning: 0, mastered: 0, streak: 0, xp: 0 });
    const [loading, setLoading] = useState(true);

    const targetLanguage = profile?.target_language || 'en';

    useEffect(() => {
        async function loadStats() {
            try {
                const words = await getWordsByLanguage(targetLanguage);
                const streak = profile?.daily_streak || 0;
                const xp = profile?.total_xp || 0;
                setStats({
                    vocab: words.length,
                    learning: words.filter(w => w.status === 'learning').length,
                    mastered: words.filter(w => w.status === 'mastered').length,
                    streak,
                    xp
                });
            } catch (error) {
                console.error('Error loading progress stats:', error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, [targetLanguage, profile]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto pb-24">
            <div className="px-5 pt-10 pb-4">
                <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
                <p className="text-sm text-muted-foreground mt-1">Track your learning journey</p>
            </div>

            <div className="px-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
                        <FireIcon className="w-5 h-5 text-orange-500 mb-2" />
                        <p className="text-2xl font-bold text-orange-700">{stats.streak}</p>
                        <p className="text-xs text-orange-600">Day Streak</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                        <TrophyIcon className="w-5 h-5 text-blue-500 mb-2" />
                        <p className="text-2xl font-bold text-blue-700">{stats.xp}</p>
                        <p className="text-xs text-blue-600">Total XP</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                        <BookOpenIcon className="w-5 h-5 text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-green-700">{stats.vocab}</p>
                        <p className="text-xs text-green-600">Words Saved</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                        <ChartBarIcon className="w-5 h-5 text-purple-500 mb-2" />
                        <p className="text-2xl font-bold text-purple-700">{stats.mastered}</p>
                        <p className="text-xs text-purple-600">Mastered</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border">
                    <h2 className="font-semibold mb-3">Learning Progress</h2>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className="bg-primary h-3 rounded-full transition-all"
                            style={{ width: `${stats.vocab ? (stats.mastered / stats.vocab) * 100 : 0}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {stats.mastered} of {stats.vocab} words mastered
                    </p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
