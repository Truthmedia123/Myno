// Web-based notification utility (mirrors Expo Push Notifications)
// Uses the Web Notifications API + localStorage scheduling

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function schedulePaywallDrip() {
  // Schedule 24h drip notification
  const fireAt = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem("myno_paywall_drip", String(fireAt));
  localStorage.setItem("myno_paywall_msg", "🔥 Get 50% off MYNO Pro today — unlock unlimited voice coaching!");
}

export function scheduleStreakReminder() {
  const now = new Date();
  const target = new Date();
  target.setHours(18, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  localStorage.setItem("myno_streak_remind", String(target.getTime()));
}

export function checkPendingNotifications() {
  const now = Date.now();
  const drip = localStorage.getItem("myno_paywall_drip");
  const msg = localStorage.getItem("myno_paywall_msg");
  if (drip && parseInt(drip) <= now && msg && Notification.permission === "granted") {
    new Notification("MYNO 🐦", { body: msg, icon: "/favicon.ico" });
    localStorage.removeItem("myno_paywall_drip");
    localStorage.removeItem("myno_paywall_msg");
  }
  const streak = localStorage.getItem("myno_streak_remind");
  if (streak && parseInt(streak) <= now && Notification.permission === "granted") {
    new Notification("MYNO 🔥", { body: "Your streak is at risk! Chat with Myno for 2 minutes to keep your fire alive." });
    localStorage.removeItem("myno_streak_remind");
    scheduleStreakReminder(); // reschedule for tomorrow
  }
}
