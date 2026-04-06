export const XP_VALUES = {
    MESSAGE_SENT: 5,
    WORD_SAVED: 10,
    SESSION_COMPLETED: 25,
    STREAK_DAY: 50,
    LEVEL_UP: 100,
    SCENARIO_COMPLETED: 30,
    VOCAB_REVIEWED: 8,
};

export function getLevelFromXP(xp) {
    if (xp < 100) return { level: 1, title: "Beginner 🌱", next: 100 };
    if (xp < 300) return { level: 2, title: "Explorer 🌿", next: 300 };
    if (xp < 600) return { level: 3, title: "Speaker 💬", next: 600 };
    if (xp < 1000) return { level: 4, title: "Conversationalist 🗣️", next: 1000 };
    if (xp < 1500) return { level: 5, title: "Fluent 🌟", next: 1500 };
    if (xp < 2500) return { level: 6, title: "Advanced 🏆", next: 2500 };
    return { level: 7, title: "Master 👑", next: null };
}

export async function addXP(db, userId, amount, reason) {
    if (!userId || !amount) return;
    const { doc, updateDoc, increment, getDoc, setDoc } = await import("firebase/firestore");
    const ref = doc(db, "userProfiles", userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        await updateDoc(ref, { total_xp: increment(amount) });
    } else {
        await setDoc(ref, { total_xp: amount }, { merge: true });
    }
    console.log(`+${amount} XP — ${reason}`);
}