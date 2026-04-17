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

export function speakText(text, language = "English", { onStart, onEnd, rate = 0.9, pitch = 1.0, volume = 1.0 } = {}) {
  if (!window.speechSynthesis) return;

  // 1. Pre‑flight check: kill any stuck speech
  window.speechSynthesis.cancel();

  // 2. Voice ready check – ensure voices are loaded
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // If voices aren't ready, wait for them and retry
    const onVoicesReady = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
      speakText(text, language, { onStart, onEnd, rate, pitch, volume });
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesReady);
    return;
  }

  const langTag = getBcp47Tag(language);

  // 3. Chunk long text into sentences to reduce processing lag
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = sentences.length > 3 ? sentences : [text];

  // 4. Voice selection – prefer high‑quality local voice
  const exactVoice = voices.find(v => v.lang === langTag);
  const prefixVoice = voices.find(v => v.lang.startsWith(langTag.split('-')[0]));
  const naturalVoice = voices.find(v =>
    (v.lang === langTag || v.lang.startsWith(langTag.split('-')[0])) &&
    (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
  );
  const selectedVoice = naturalVoice || exactVoice || prefixVoice || voices[0];

  let currentChunk = 0;
  const speakNextChunk = () => {
    if (currentChunk >= chunks.length) {
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[currentChunk];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.voice = selectedVoice;
    utterance.lang = langTag;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Immediate feedback when first chunk starts
    if (currentChunk === 0 && onStart) onStart();

    utterance.onend = speakNextChunk;
    utterance.onerror = speakNextChunk;

    window.speechSynthesis.speak(utterance);
    currentChunk++;
  };

  speakNextChunk();
}

export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
