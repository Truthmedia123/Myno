const LANG_MAP = {
  "English": "en-US",
  "Spanish": "es-ES",
  "French": "fr-FR",
  "German": "de-DE",
  "Italian": "it-IT",
  "Portuguese": "pt-BR",
  "Japanese": "ja-JP",
  "Korean": "ko-KR",
  "Chinese": "zh-CN",
  "Mandarin": "zh-CN",
  "Arabic": "ar-SA",
  "Hindi": "hi-IN",
  "Russian": "ru-RU",
  "Dutch": "nl-NL",
  "Turkish": "tr-TR",
  "Polish": "pl-PL",
  "Swedish": "sv-SE",
  "Norwegian": "nb-NO",
  "Danish": "da-DK",
  "Greek": "el-GR",
  "Hebrew": "he-IL",
  "Thai": "th-TH",
  "Vietnamese": "vi-VN",
  "Indonesian": "id-ID",
  "Malay": "ms-MY",
  "Ukrainian": "uk-UA",
  "Urdu": "ur-PK",
  "Tamil": "ta-IN",
  "Bengali": "bn-IN",
};

export function getBcp47Tag(language) {
  return LANG_MAP[language] || "en-US";
}

export function speakText(text, language = "English", { onStart, onEnd } = {}) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const langTag = getBcp47Tag(language);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langTag;
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to find the best voice for the language
  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer exact match, then language prefix match
    const exact = voices.find(v => v.lang === langTag);
    const prefix = voices.find(v => v.lang.startsWith(langTag.split("-")[0]));
    const natural = voices.find(v =>
      (v.lang === langTag || v.lang.startsWith(langTag.split("-")[0])) &&
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium"))
    );
    utterance.voice = natural || exact || prefix || null;
    if (onStart) onStart();
    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be loaded yet
  if (window.speechSynthesis.getVoices().length > 0) {
    selectVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = selectVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };
}

export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
