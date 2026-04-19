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

/**
 * Clean text for TTS by removing emojis, markdown, and special characters
 * that should not be spoken aloud.
 */
function cleanTextForTTS(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    // Remove emojis (covers most common emoji ranges)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{FE0F}]/gu, '')

    // Remove markdown formatting symbols
    .replace(/\*\*(.*?)\*\*/g, '$1')  // bold **text** -> text
    .replace(/__(.*?)__/g, '$1')      // bold __text__ -> text
    .replace(/\*(.*?)\*/g, '$1')      // italic *text* -> text
    .replace(/_(.*?)_/g, '$1')        // italic _text_ -> text
    .replace(/~~(.*?)~~/g, '$1')      // strikethrough

    // Remove placeholder markers
    .replace(/\[\.\.\.\]/g, '')       // [...] -> empty
    .replace(/\.\.\./g, '')           // ... -> empty (optional, keep if natural pause desired)

    // Remove backticks and code blocks
    .replace(/`{1,3}[^`]*`{1,3}/g, '')

    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakText(text, language = "English", { onStart, onEnd, rate = 0.9, pitch = 1.0, volume = 1.0 } = {}) {
  if (!window.speechSynthesis) return;

  // Clean the text before speaking
  const cleanText = cleanTextForTTS(text);

  if (!cleanText) {
    console.warn('[TTS] Empty text after cleaning, skipping speech');
    return;
  }

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
  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  const chunks = sentences.length > 3 ? sentences : [cleanText];

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
