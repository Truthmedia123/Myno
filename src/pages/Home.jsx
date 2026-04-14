import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FireIcon, BookOpenIcon, SparklesIcon, TrophyIcon, TrophyIcon as CrownIcon, ChartBarIcon, FlagIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useFirebaseDatabase } from "@/hooks/useFirebaseDatabase";
import MynoBird from "@/components/myno/MynoBird";
import BottomNav from "@/components/myno/BottomNav";
import { checkPendingNotifications } from "@/lib/notifications";
import { getTodayMission } from "@/lib/curriculum";
import { getLevelFromXP } from "@/lib/xpSystem";
import { shareContent, getShareText } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ROADMAP = {
  Travel: {
    beginner: [
      { day: 1, task: "Say hello, goodbye and thank you", icon: "👋" },
      { day: 2, task: "Learn numbers 1–10 and basic prices", icon: "🔢" },
      { day: 3, task: "Ask for water, food and the bill", icon: "🍽️" },
      { day: 4, task: "Say where you are from", icon: "🌍" },
      { day: 5, task: "Ask how much something costs", icon: "💰" },
      { day: 6, task: "Ask for directions to the hotel", icon: "🗺️" },
      { day: 7, task: "Mini fluency check with Myno", icon: "🏆" },
    ],
    some: [
      { day: 1, task: "Introduce yourself at the airport", icon: "✈️" },
      { day: 2, task: "Order a full meal at a restaurant", icon: "🍽️" },
      { day: 3, task: "Check into a hotel and ask for help", icon: "🏨" },
      { day: 4, task: "Negotiate price at a local market", icon: "🛍️" },
      { day: 5, task: "Describe a travel emergency", icon: "🚨" },
      { day: 6, task: "Have a full travel day conversation", icon: "🌅" },
      { day: 7, task: "Fluency check — how far have you come?", icon: "🏆" },
    ],
    intermediate: [
      { day: 1, task: "Debate the best travel destinations", icon: "🌍" },
      { day: 2, task: "Discuss cultural differences with a local", icon: "🤝" },
      { day: 3, task: "Handle a travel complaint confidently", icon: "💬" },
      { day: 4, task: "Tell a story about your best trip", icon: "📖" },
      { day: 5, task: "Give detailed travel recommendations", icon: "⭐" },
      { day: 6, task: "Negotiate and persuade in the language", icon: "🎯" },
      { day: 7, task: "Full immersion fluency check", icon: "🏆" },
    ],
  },
  Business: {
    beginner: [
      { day: 1, task: "Say your name, job and company", icon: "👋" },
      { day: 2, task: "Learn yes, no, please, thank you formally", icon: "🤝" },
      { day: 3, task: "Say the days of the week and times", icon: "📅" },
      { day: 4, task: "Count and say basic prices", icon: "💰" },
      { day: 5, task: "Say I understand and I don't understand", icon: "💡" },
      { day: 6, task: "Ask to repeat and speak slowly", icon: "🔄" },
      { day: 7, task: "Mini fluency check with Myno", icon: "🏆" },
    ],
    some: [
      { day: 1, task: "Professional self-introduction", icon: "💼" },
      { day: 2, task: "Schedule and confirm a meeting", icon: "📅" },
      { day: 3, task: "Describe your company and role", icon: "🏢" },
      { day: 4, task: "Handle a basic client conversation", icon: "📞" },
      { day: 5, task: "Ask for and give feedback politely", icon: "📝" },
      { day: 6, task: "Write and read a business email", icon: "📧" },
      { day: 7, task: "Fluency check — how far have you come?", icon: "🏆" },
    ],
    intermediate: [
      { day: 1, task: "Lead a team meeting discussion", icon: "📊" },
      { day: 2, task: "Pitch a business idea confidently", icon: "💡" },
      { day: 3, task: "Negotiate contract terms", icon: "🤝" },
      { day: 4, task: "Handle a difficult client situation", icon: "⚡" },
      { day: 5, task: "Present quarterly results", icon: "📈" },
      { day: 6, task: "Debate strategy with your team", icon: "🎯" },
      { day: 7, task: "Full immersion fluency check", icon: "🏆" },
    ],
  },
  Social: {
    beginner: [
      { day: 1, task: "Say hello, how are you, I am fine", icon: "😊" },
      { day: 2, task: "Say your name, age and where you live", icon: "👤" },
      { day: 3, task: "Learn I like and I don't like", icon: "❤️" },
      { day: 4, task: "Name 5 foods and 5 colors", icon: "🎨" },
      { day: 5, task: "Say today, tomorrow and yesterday", icon: "📅" },
      { day: 6, task: "Ask someone's name and where they are from", icon: "🌍" },
      { day: 7, task: "Mini fluency check with Myno", icon: "🏆" },
    ],
    some: [
      { day: 1, task: "Start a conversation with a stranger", icon: "👋" },
      { day: 2, task: "Talk about your hobbies and free time", icon: "🎨" },
      { day: 3, task: "Describe your family and friends", icon: "👨‍👩‍👧" },
      { day: 4, task: "Discuss your favorite food and places", icon: "🍜" },
      { day: 5, task: "Make and accept an invitation", icon: "🎉" },
      { day: 6, task: "Have a 10-message casual conversation", icon: "💬" },
      { day: 7, task: "Fluency check — how far have you come?", icon: "🏆" },
    ],
    intermediate: [
      { day: 1, task: "Debate a current news topic", icon: "📰" },
      { day: 2, task: "Share your life goals and ambitions", icon: "🌟" },
      { day: 3, task: "Discuss your cultural background deeply", icon: "🌍" },
      { day: 4, task: "Tell a complex personal story", icon: "📖" },
      { day: 5, task: "Discuss a book or film in depth", icon: "🎬" },
      { day: 6, task: "Have a philosophical conversation", icon: "🧠" },
      { day: 7, task: "Full immersion fluency check", icon: "🏆" },
    ],
  },
  Fun: {
    beginner: [
      { day: 1, task: "Learn 5 cool greetings", icon: "😄" },
      { day: 2, task: "Count to 20 and say your age", icon: "🔢" },
      { day: 3, task: "Name 5 animals in the language", icon: "🐾" },
      { day: 4, task: "Say your favorite food and color", icon: "🍕" },
      { day: 5, task: "Learn yes, no, cool and awesome", icon: "😎" },
      { day: 6, task: "Sing or say a simple phrase from a song", icon: "🎵" },
      { day: 7, task: "Mini fluency check with Myno", icon: "🏆" },
    ],
    some: [
      { day: 1, task: "Describe your favorite movie", icon: "🎬" },
      { day: 2, task: "Talk about music you love", icon: "🎵" },
      { day: 3, task: "Learn 5 popular slang words", icon: "😎" },
      { day: 4, task: "Tell a short funny story", icon: "😂" },
      { day: 5, task: "Describe your dream life", icon: "🌟" },
      { day: 6, task: "Have a fun 10-message chat with Myno", icon: "🦜" },
      { day: 7, task: "Fluency check — how far have you come?", icon: "🏆" },
    ],
    intermediate: [
      { day: 1, task: "Debate the greatest musician of all time", icon: "🎸" },
      { day: 2, task: "Tell a funny story with a punchline", icon: "😂" },
      { day: 3, task: "Discuss the meaning behind a popular song", icon: "🎵" },
      { day: 4, task: "Create and describe a fictional country", icon: "🌍" },
      { day: 5, task: "Write a short poem in the language", icon: "✍️" },
      { day: 6, task: "Imitate a character from a movie", icon: "🎭" },
      { day: 7, task: "Full immersion fluency check", icon: "🏆" },
    ],
  },
};

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [userMemory, setUserMemory] = useState(null);
  const [weakPhonemes, setWeakPhonemes] = useState([]);
  const [weekReport, setWeekReport] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const previousLevelInfoRef = useRef(null);
  const { user } = useAuth();
  const dbActions = useFirebaseDatabase();
  const navigate = useNavigate();

  // Fetch weekly session data
  const fetchWeeklySessions = async (userId) => {
    if (!userId) return;
    setIsLoadingChart(true);
    try {
      // Generate last 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push({ date: dateStr, day: dayName, sessions: 0 });
      }

      // Query chatMessages for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "chatMessages"),
        where("userId", "==", userId),
        where("createdAt", ">=", sevenDaysAgo.toISOString())
      );
      const snapshot = await getDocs(q);

      // Group by date
      const sessionsByDate = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.createdAt) {
          const date = new Date(data.createdAt).toISOString().split('T')[0];
          sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
        }
      });

      // Merge with days array
      const result = days.map(day => ({
        ...day,
        sessions: sessionsByDate[day.date] || 0
      }));
      setWeeklyData(result);
    } catch (error) {
      console.error("Error fetching weekly sessions:", error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Function to generate weekly progress report
  const generateWeekReport = (weeklyData, savedWords, userProfile) => {
    const activeDays = weeklyData.filter(d => d.sessions > 0).length;
    const totalMessages = weeklyData.reduce((sum, d) => sum + d.sessions, 0);

    // Count saved words from this week
    const wordsThisWeek = savedWords.filter(w => {
      const savedDate = new Date(w.created_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return savedDate > weekAgo;
    }).length;

    const fluency = userProfile?.fluency_score || 0;
    const streak = userProfile?.daily_streak || 0;

    let performance = "Keep going!";
    if (activeDays >= 5) performance = "Outstanding week! 🏆";
    else if (activeDays >= 3) performance = "Great progress! 🌟";
    else if (activeDays >= 1) performance = "Good start! 💪";

    return { activeDays, totalMessages, wordsThisWeek, fluency, streak, performance };
  };

  // Function to fetch saved words count
  const fetchSavedWordsCount = async (userId) => {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, "savedWords"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const words = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedWords(words);
      return words;
    } catch (error) {
      console.error("Error fetching saved words:", error);
      return [];
    }
  };

  useEffect(() => {
    checkPendingNotifications();
    const init = async () => {
      if (!user) return;

      const p = await dbActions.getUserProfile();
      if (!p) {
        navigate("/onboarding");
        return;
      }
      if (!p.onboarding_complete) { navigate("/onboarding"); return; }

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      if (p.last_session_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const newStreak = p.last_session_date === yesterday ? (p.daily_streak || 0) + 1 : 1;
        await dbActions.updateUserProfile(p.id, { daily_streak: newStreak, last_session_date: today });
        setProfile({ ...p, daily_streak: newStreak });
      } else {
        setProfile(p);
      }

      // Check for level up
      const currentLevelInfo = getLevelFromXP(p.total_xp || 0);
      const previousLevelInfo = previousLevelInfoRef.current;

      if (previousLevelInfo !== null && currentLevelInfo.level > previousLevelInfo.level) {
        // Level increased!
        setLevelUpInfo({
          oldLevel: previousLevelInfo.level,
          newLevel: currentLevelInfo.level,
          oldTitle: previousLevelInfo.title,
          newTitle: currentLevelInfo.title
        });
        setShowLevelUp(true);
      }

      // Update previous level ref
      previousLevelInfoRef.current = currentLevelInfo;

      // Fetch weekly sessions data and saved words, then generate report
      if (user?.uid) {
        fetchWeeklySessions(user.uid);
        const savedWordsList = await fetchSavedWordsCount(user.uid);

        // Generate initial report after a short delay to allow weekly data to load
        setTimeout(() => {
          if (weeklyData.length > 0 && savedWordsList.length > 0) {
            const report = generateWeekReport(weeklyData, savedWordsList, p);
            setWeekReport(report);
          }
        }, 500);
      }

      // Fetch userMemory and extract weak phonemes
      if (user?.uid) {
        try {
          const memSnap = await getDoc(doc(db, "userMemory", user.uid));
          const memory = memSnap.exists() ? memSnap.data() : null;
          setUserMemory(memory);

          // Extract weak phonemes
          if (memory?.weakPhonemes && Array.isArray(memory.weakPhonemes)) {
            setWeakPhonemes(memory.weakPhonemes);
          } else {
            setWeakPhonemes([]);
          }
        } catch (error) {
          console.error("Error fetching userMemory:", error);
          setUserMemory(null);
          setWeakPhonemes([]);
        }
      }
    };
    init();
  }, [navigate, user, dbActions]);

  // Regenerate weekly report when weeklyData or savedWords change
  useEffect(() => {
    if (weeklyData.length > 0 && savedWords.length > 0 && profile) {
      const report = generateWeekReport(weeklyData, savedWords, profile);
      setWeekReport(report);
    }
  }, [weeklyData, savedWords, profile]);

  const streak = profile?.daily_streak || 0;
  const wordsMastered = profile?.words_mastered || 0;
  const totalXP = profile?.total_xp || 0;
  const levelInfo = getLevelFromXP(totalXP);
  const targetLang = profile?.target_language || "English";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = user?.full_name ? user.full_name.split(" ")[0] : "Learner";

  const goal = profile?.learning_goal || "Fun";
  const userLevel = profile?.user_level || "beginner";
  const targetLanguage = profile?.target_language || "English";
  const nativeLanguage = profile?.native_language || "English";
  const todayMission = getTodayMission(targetLanguage, userLevel, goal);

  // 7-day learning path roadmap
  const levelNames = { beginner: "Beginner 🌱", some: "Intermediate 🌿", intermediate: "Advanced 🌳" };
  const roadmap = ROADMAP[goal]?.[userLevel] || ROADMAP.Fun.beginner;
  const currentDay = Math.min(profile?.days_practiced || 1, 7);

  // Streak warning banner logic
  const now = new Date();
  const lastSession = profile?.last_session_date
    ? new Date(profile.last_session_date).toDateString()
    : null;
  const today = now.toDateString();
  const isAfter5pm = now.getHours() >= 17;
  const hasNotPracticedToday = lastSession !== today;
  const showStreakWarning = hasNotPracticedToday && isAfter5pm && profile?.daily_streak > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <div className="flex items-center gap-2 streak-bg streak-border border rounded-2xl px-3 py-1.5">
          <FireIcon className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-extrabold text-orange-500">{streak}</span>
          <button
            onClick={() => shareContent(getShareText("streak", { language: profile?.target_language, days: streak }))}
            className="text-xs text-muted-foreground hover:text-green-500 transition-colors"
            title="Share streak"
          >
            📲
          </button>
        </div>

        <Link to="/pro" className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-2xl px-3 py-1.5">
          <CrownIcon className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-secondary">Pro</span>
        </Link>

        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-2xl px-3 py-1.5">
          <BookOpenIcon className="w-4 h-4 text-secondary" />
          <span className="text-sm font-extrabold text-secondary">{wordsMastered}</span>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-4">
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground font-medium">
          {greeting}, {name} 👋
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="text-2xl font-extrabold text-foreground mt-0.5">
          Ready to practice<br /><span className="text-secondary">{targetLang}?</span>
        </motion.h1>
      </div>

      {/* Streak warning banner */}
      {showStreakWarning && (
        <div
          onClick={() => navigate("/chat")}
          className="mx-4 mb-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 cursor-pointer flex items-center gap-3"
        >
          <span className="text-2xl">🔥</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-600">Your streak is at risk!</p>
            <p className="text-xs text-muted-foreground">Practice for 2 minutes to keep your {profile.daily_streak}-day streak alive</p>
          </div>
          <span className="text-primary text-sm font-medium">→</span>
        </div>
      )}

      {/* Focus Area Card - Weak Phonemes */}
      {weakPhonemes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-4 mb-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FlagIcon className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-bold text-purple-700">Focus Area</p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="text-xs text-purple-600 underline underline-offset-2"
            >
              Practice Now →
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Based on your recent pronunciation, these sounds need extra attention:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakPhonemes.map((phoneme, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-700"
              >
                {phoneme}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Try the <span className="font-medium text-purple-600">Speaking Drills</span> mode in chat for targeted practice.
          </p>
        </motion.div>
      )}

      {/* Weekly Progress Chart */}
      {profile && weeklyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-4 mb-4 p-4 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-primary" />
              <p className="text-sm font-bold text-foreground">Weekly Progress</p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="text-xs text-primary underline underline-offset-2"
            >
              View Details →
            </button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  formatter={(value) => [`${value} sessions`, 'Sessions']}
                />
                <Bar
                  dataKey="sessions"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {weeklyData.reduce((sum, day) => sum + day.sessions, 0)} sessions this week
          </p>
        </motion.div>
      )}

      {/* Weekly Progress Report Card */}
      {weekReport && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mx-4 mb-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-green-600" />
              <p className="text-sm font-bold text-green-700">My Progress This Week</p>
            </div>
            <button
              onClick={() => shareContent(getShareText("weekly_report", {
                language: profile?.target_language,
                activeDays: weekReport.activeDays,
                totalMessages: weekReport.totalMessages,
                wordsThisWeek: weekReport.wordsThisWeek,
                performance: weekReport.performance
              }))}
              className="text-xs text-green-600 hover:text-green-700 transition-colors"
              title="Share weekly report"
            >
              📲
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/50 border border-green-500/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Active Days</p>
              <p className="text-xl font-bold text-green-700">{weekReport.activeDays}/7</p>
            </div>
            <div className="bg-white/50 border border-green-500/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Chat Sessions</p>
              <p className="text-xl font-bold text-green-700">{weekReport.totalMessages}</p>
            </div>
            <div className="bg-white/50 border border-green-500/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Words Saved</p>
              <p className="text-xl font-bold text-green-700">{weekReport.wordsThisWeek}</p>
            </div>
            <div className="bg-white/50 border border-green-500/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Fluency Score</p>
              <p className="text-xl font-bold text-green-700">{weekReport.fluency}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">{weekReport.performance}</p>
              <p className="text-[10px] text-muted-foreground">Keep up the great work!</p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              Practice More →
            </button>
          </div>
        </motion.div>
      )}

      {/* Mascot centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
          <MynoBird size="xl" />
        </motion.div>

        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 bg-card border border-border rounded-2xl px-5 py-3 text-center shadow-card max-w-xs mx-6"
          >
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-0.5">Your Baseline Fluency</p>
            <p className="text-2xl font-extrabold text-foreground">{profile.fluency_score || 0}%</p>
            <p className="text-[11px] text-muted-foreground">Keep chatting to improve your score!</p>
          </motion.div>
        )}
      </div>

      {/* Level badge */}
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-primary">{levelInfo.title}</span>
          <span className="text-xs text-muted-foreground">{totalXP} XP total</span>
        </div>
        {levelInfo.next && (
          <>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalXP / levelInfo.next) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{levelInfo.next - totalXP} XP to next level</p>
          </>
        )}
        <button
          onClick={() => shareContent(getShareText("level_up", { language: profile?.target_language, level: levelInfo?.title }))}
          className="text-xs text-muted-foreground hover:text-green-500 mt-1"
        >
          Share progress 📲
        </button>
      </div>

      {/* Today's Mission */}
      {todayMission && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-4 mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Today's Mission - {todayMission.day}</p>
          <p className="text-sm font-medium text-foreground mb-2">{todayMission.mission}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>⏱ {todayMission.duration}</span>
            <span>⭐ {todayMission.xp} XP</span>
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="mt-2 text-xs text-primary underline underline-offset-2"
          >
            Start with Myno →
          </button>
        </motion.div>
      )}

      {/* 7-Day Learning Path Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-4 mb-4"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold text-foreground">Your 7-Day Path</p>
          <p className="text-xs text-muted-foreground">Level: {levelNames[userLevel]}</p>
        </div>
        <div className="space-y-2">
          {roadmap.map((item) => {
            const isDone = item.day < currentDay;
            const isToday = item.day === currentDay;
            return (
              <div
                key={item.day}
                onClick={() => isToday && navigate("/chat")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isToday
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : isDone
                    ? "bg-muted/30 border-border/50"
                    : "bg-card border-border"
                  } ${isToday ? "hover:bg-primary/15" : ""}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${isToday ? "bg-primary text-white" : isDone ? "bg-muted text-muted-foreground" : "bg-muted/50 text-foreground"
                  }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Day {item.day}</span>
                    {isToday && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Today</span>
                    )}
                    {isDone && (
                      <span className="text-xs text-muted-foreground">✓ Done</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.task}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Complete today's task to unlock Day {currentDay + 1 > 7 ? 1 : currentDay + 1}
        </p>
      </motion.div>

      {/* Thumb-zone CTAs */}
      <div className="px-5 pb-6 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/chat")}
          className="thumb-cta w-full bg-secondary text-secondary-foreground shadow-sea flex items-center justify-center gap-3"
        >
          <SparklesIcon className="w-5 h-5" />
          Speak with Myno
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/vault")}
          className="w-full h-12 rounded-2xl border-2 border-border bg-card text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:border-primary transition-colors"
        >
          <BookOpenIcon className="w-4 h-4" />
          Review Word Vault ({wordsMastered} words)
        </motion.button>
      </div>

      {/* Level Up Celebration Modal */}
      {showLevelUp && levelUpInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          >
            {/* Confetti effect placeholder */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `confetti 1s ease-out ${i * 0.05}s forwards`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-extrabold text-foreground mb-2">You Leveled Up! 🎉</h3>
              <p className="text-muted-foreground mb-6">
                From <span className="font-bold text-primary">{levelUpInfo.oldTitle}</span> to{" "}
                <span className="font-bold text-secondary">{levelUpInfo.newTitle}</span>
              </p>

              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-bold text-foreground">
                    {levelUpInfo.oldLevel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Level {levelUpInfo.oldLevel}</p>
                </div>
                <div className="text-3xl text-primary">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary">
                    {levelUpInfo.newLevel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Level {levelUpInfo.newLevel}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Keep practicing to unlock more features and reach the next level!
              </p>

              <button
                onClick={() => setShowLevelUp(false)}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Awesome, let's go!
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
