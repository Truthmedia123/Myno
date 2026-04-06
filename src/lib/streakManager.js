export async function updateDailyStreak(db, userId) {
    const { doc, getDoc, updateDoc } = await import("firebase/firestore");
    const ref = doc(db, "userProfiles", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();

    const today = new Date().toDateString();
    const lastSession = data.last_session_date
        ? new Date(data.last_session_date).toDateString()
        : null;

    if (lastSession === today) return; // Already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastSession === yesterday.toDateString();

    const newStreak = wasYesterday ? (data.daily_streak || 0) + 1 : 1;

    await updateDoc(ref, {
        daily_streak: newStreak,
        last_session_date: new Date().toISOString(),
        days_practiced: (data.days_practiced || 0) + 1,
    });

    return newStreak;
}