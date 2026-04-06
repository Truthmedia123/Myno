import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function parseAgentResponse(rawText) {
  if (!rawText) return { reaction: "", word: "", meaning: "", prompt: "" };
  
  const lines = rawText.split('\n');
  const result = { reaction: "", word: "", meaning: "", prompt: "" };
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('REACTION:')) {
      result.reaction = trimmed.substring('REACTION:'.length).trim();
    } else if (trimmed.startsWith('WORD:')) {
      result.word = trimmed.substring('WORD:'.length).trim();
    } else if (trimmed.startsWith('MEANING:')) {
      result.meaning = trimmed.substring('MEANING:'.length).trim();
    } else if (trimmed.startsWith('PROMPT:')) {
      result.prompt = trimmed.substring('PROMPT:'.length).trim();
    }
  }
  
  return result;
}

export const isIframe = window.self !== window.top;

// Universal Multi-Platform Sharing System
export function shareContent(text, title = "Myno - AI Language Coach") {
  // Use native Web Share API if available (works on mobile browsers, iOS, Android)
  if (navigator.share) {
    navigator.share({ title, text, url: "https://myno.app" }).catch(() => { });
    return;
  }
  // Fallback: show share modal
  showShareModal(text, title);
}

export function showShareModal(text, title) {
  // Dispatch a custom event that the ShareModal component will listen to
  window.dispatchEvent(new CustomEvent("myno_share", { detail: { text, title } }));
}

export function getShareLinks(text) {
  const encoded = encodeURIComponent(text);
  const url = encodeURIComponent("https://myno.app");
  return [
    { name: "WhatsApp", icon: "💬", color: "bg-green-500", url: `https://wa.me/?text=${encoded}` },
    { name: "Instagram", icon: "📸", color: "bg-gradient-to-br from-purple-500 to-pink-500", url: null, action: "copy" }, // Instagram doesn't support direct share links — copy text instead
    { name: "X / Twitter", icon: "🐦", color: "bg-black", url: `https://twitter.com/intent/tweet?text=${encoded}` },
    { name: "Facebook", icon: "📘", color: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}` },
    { name: "Telegram", icon: "✈️", color: "bg-sky-500", url: `https://t.me/share/url?url=${url}&text=${encoded}` },
    { name: "LinkedIn", icon: "💼", color: "bg-blue-700", url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encoded}` },
    { name: "Copy Text", icon: "📋", color: "bg-muted", url: null, action: "copy" },
  ];
}

export function getShareText(type, data) {
  const appUrl = "https://myno.app";
  switch (type) {
    case "streak":
      return `🔥 I've been practicing ${data.language} for ${data.days} days in a row on Myno! My streak is on fire! Start your language journey free: ${appUrl}`;
    case "level_up":
      return `🎉 I just reached ${data.level} in ${data.language} on Myno! AI language coaching that actually works. Try it free: ${appUrl}`;
    case "word_vault":
      return `📚 I've saved ${data.count} ${data.language} words in my Myno Word Vault! Building vocabulary one conversation at a time. Try it: ${appUrl}`;
    case "fluency":
      return `🗣️ My ${data.language} fluency score on Myno is ${data.score}%! Getting better every day with AI coaching. Join me: ${appUrl}`;
    case "week_complete":
      return `🏆 I just completed Week 1 of my ${data.language} learning journey on Myno! ${data.words} words learned, ${data.sessions} sessions done. Start free: ${appUrl}`;
    case "weekly_report":
      return `📊 My weekly ${data.language} progress on Myno: ${data.activeDays} active days, ${data.totalMessages} chat sessions, ${data.wordsThisWeek} new words saved! ${data.performance} Track your progress: ${appUrl}`;
    default:
      return `I'm learning ${data.language} with Myno — the AI language coach! Try it free: ${appUrl}`;
  }
}
