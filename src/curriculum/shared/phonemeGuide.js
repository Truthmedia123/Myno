/**
 * Phoneme articulation guide for AI feedback and TTS.
 * Maps phoneme keys to articulatory tips, minimal pairs, and TTS prompts.
 * Compatible with memoryManager.js phoneme matrix.
 * @module curriculum/shared/phonemeGuide
 */

/**
 * @typedef {Object} PhonemeGuideEntry
 * @property {string} description - Human-readable description of the phoneme
 * @property {string} articulation - Detailed articulatory instructions
 * @property {string[]} minimalPairs - Array of minimal pair examples
 * @property {string} ttsExample - Example phrase speakable by window.speechSynthesis
 * @property {Object.<string, string>} [languageVariants] - Language-specific tips
 */

/**
 * Phoneme guide database.
 * Keys match memoryManager.js phoneme matrix entries.
 * @type {Object.<string, PhonemeGuideEntry>}
 */
export const PHONEME_GUIDE = {
    // Spanish phonemes
    "Rolled 'r' and 'rr'": {
        description: "Alveolar trill (rolled r) and tap",
        articulation: "Place tongue tip against alveolar ridge (behind upper teeth). For single 'r' (tap), quickly flick tongue once. For 'rr' (trill), vibrate tongue with airflow.",
        minimalPairs: ["pero (but) vs perro (dog)", "caro (expensive) vs carro (cart)", "cero (zero) vs cerro (hill)"],
        ttsExample: "El perro corre rápido por el parque.",
        languageVariants: {
            es: "La lengua debe vibrar contra el paladar alveolar.",
            en: "Practice with 'butter' to feel the tongue tap position."
        }
    },
    "'ñ' sound (canyon)": {
        description: "Palatal nasal (similar to 'ny' in 'canyon')",
        articulation: "Place middle of tongue against hard palate. Let air flow through nose while saying 'ny' sound.",
        minimalPairs: ["año (year) vs ano (anus)", "caña (reed) vs cana (gray hair)", "uña (fingernail) vs una (one)"],
        ttsExample: "El niño tiene un año y medio.",
        languageVariants: {
            es: "Similar a 'ni' en 'niño', pero nasalizado.",
            en: "Like 'ny' in 'canyon' or 'onion'."
        }
    },
    "'j' (jota) sound": {
        description: "Voiceless velar fricative (harsh throat sound)",
        articulation: "Create friction deep in throat, similar to clearing throat gently. Not like English 'h' or 'j'.",
        minimalPairs: ["juego (game) vs huevo (egg)", "jirafa (giraffe) vs gira (turn)", "ojo (eye) vs oyo (I hear)"],
        ttsExample: "Juan y José juegan en el jardín.",
        languageVariants: {
            es: "Sonido gutural, como una 'j' fuerte.",
            en: "Similar to Scottish 'loch' or German 'Bach'."
        }
    },

    // French phonemes
    "Nasal vowels (on/an/in/un)": {
        description: "Nasalized vowel sounds",
        articulation: "Pronounce vowel while letting air escape through nose. Lower soft palate to open nasal passage.",
        minimalPairs: ["bon (good) vs beau (beautiful)", "vin (wine) vs vingt (twenty)", "un (one) vs une (a)"],
        ttsExample: "Un bon vin blanc dans le jardin.",
        languageVariants: {
            fr: "Les voyelles nasales sont typiques du français.",
            en: "Practice saying 'on' while pinching nose to feel nasal resonance."
        }
    },
    "Liaison (linking words)": {
        description: "Linking final consonant to following vowel",
        articulation: "Pronounce normally silent final consonant when next word begins with vowel.",
        minimalPairs: ["les amis (the friends) vs les z amis", "petit ami (boyfriend) vs petit t ami"],
        ttsExample: "Les enfants ont un petit animal.",
        languageVariants: {
            fr: "La liaison est obligatoire dans certains contextes.",
            en: "Link words like 'an apple' becomes 'a napple'."
        }
    },

    // German phonemes
    "'ch' sound (Bach/ich)": {
        description: "Voiceless velar/palatal fricative",
        articulation: "After back vowels (a, o, u): like Scottish 'loch'. After front vowels (e, i, ä, ö, ü): like 'h' in 'huge' with tongue raised.",
        minimalPairs: ["Bach (brook) vs back (bake)", "ich (I) vs isch (dialect)", "machen (make) vs mache (I make)"],
        ttsExample: "Ich möchte nach Bach fahren.",
        languageVariants: {
            de: "Ach-Laut und Ich-Laut unterscheiden.",
            en: "Practice with 'Bach' for back vowel, 'ich' for front vowel."
        }
    },
    "Umlauts (ü/ö/ä)": {
        description: "Front rounded vowels",
        articulation: "Pronounce 'ee' (ü), 'ay' (ä), or 'eh' (ö) while rounding lips as for 'oo'.",
        minimalPairs: ["Mütter (mothers) vs Mutter (mother)", "Hören (hear) vs Herren (gentlemen)", "Bären (bears) vs Beeren (berries)"],
        ttsExample: "Über die Brücke fährt ein grüner Zug.",
        languageVariants: {
            de: "Lippen runden wie bei 'u', aber Zunge vorn.",
            en: "Say 'ee' with lips rounded like 'oo'."
        }
    },

    // Japanese phonemes
    "Pitch accent patterns": {
        description: "High vs low pitch on syllables (not tone)",
        articulation: "Raise pitch on accented syllable; other syllables lower. Contrast is relative, not absolute.",
        minimalPairs: ["はし (hashi) - bridge (high-low) vs はし (hashi) - chopsticks (low-high)", "あめ (ame) - rain vs あめ (ame) - candy"],
        ttsExample: "はしでごはんをたべます。",
        languageVariants: {
            ja: "高低アクセントは単語の意味を変えます。",
            en: "Listen for melody: 'HA-shi' vs 'ha-SHI'."
        }
    },
    "'r' sound (between r and l)": {
        description: "Alveolar tap/flap (similar to Spanish single 'r')",
        articulation: "Light tap of tongue against alveolar ridge. Not rolled like Spanish 'rr', not lateral like English 'l'.",
        minimalPairs: ["らく (easy) vs ラク (comfort)", "りんご (apple) vs リンゴ (apple)", "ろく (six) vs ロク (record)"],
        ttsExample: "らりるれろをくりかえします。",
        languageVariants: {
            ja: "舌先を上歯茎に軽くたたきます。",
            en: "Similar to 'tt' in American 'butter'."
        }
    },

    // Chinese phonemes
    "Tones (4 tones + neutral)": {
        description: "Lexical tone contours",
        articulation: "1st: high level (mā). 2nd: rising (má). 3rd: dipping (mǎ). 4th: falling (mà). Neutral: light.",
        minimalPairs: ["mā (mother) vs má (hemp) vs mǎ (horse) vs mà (scold)", "tāng (soup) vs táng (sugar) vs tǎng (lie) vs tàng (scald)"],
        ttsExample: "妈妈骂马吗？",
        languageVariants: {
            zh: "一声平，二声扬，三声拐弯，四声降。",
            en: "Use hand gestures: flat, rising, dipping, falling."
        }
    },
    "Retroflex finals (-r)": {
        description: "Syllable‑final retroflexion (erhua)",
        articulation: "Curl tongue tip back slightly during final vowel, adding 'r'‑like coloration.",
        minimalPairs: ["huār (flower) vs huā (flower)", "nǎr (where) vs nǎ (which)", "yīdiǎnr (a bit) vs yīdiǎn (one point)"],
        ttsExample: "花儿为什么这样红？",
        languageVariants: {
            zh: "儿化音是北方方言的特点。",
            en: "Add a slight 'r' sound at end of syllable."
        }
    },

    // Arabic phonemes
    "Emphatic consonants (ص/ض/ط/ظ)": {
        description: "Pharyngealized consonants",
        articulation: "Pronounce consonant while constricting pharynx (back of throat). Creates 'dark' quality.",
        minimalPairs: ["صاد (truthful) vs ساد (dominated)", "ضرب (hit) vs درب (path)", "طالب (student) vs تالب (seeker)"],
        ttsExample: "الصَّباحُ جَمِيلٌ.",
        languageVariants: {
            ar: "الحروف المفخمة تخرج من أقصى الحلق.",
            en: "Say 't' while constricting throat as if gargling."
        }
    },
    "Guttural sounds (ع/غ/خ/ح)": {
        description: "Pharyngeal and uvular fricatives",
        articulation: "ع: voiced pharyngeal fricative (deep gargle). غ: voiced uvular fricative (French 'r'). خ: voiceless uvular (German 'ch'). ح: voiceless pharyngeal.",
        minimalPairs: ["عَين (eye) vs أين (where)", "غَريب (strange) vs قريب (relative)", "خُبز (bread) vs حُب (love)"],
        ttsExample: "عَليٌّ يَقرَأُ الكِتابَ.",
        languageVariants: {
            ar: "أصوات حلقية تخرج من الحنجرة والبلعوم.",
            en: "Practice 'a' while constricting throat muscles."
        }
    },

    // Hindi phonemes
    "Retroflex consonants (ट/ड/ण)": {
        description: "Consonants with tongue curled back",
        articulation: "Curl tongue tip back to touch roof of mouth (hard palate or alveolar ridge). Contrast with dental त/द/न.",
        minimalPairs: ["टमाटर (tomato) vs तमाटर (incorrect)", "डर (fear) vs दर (rate)", "ण (retroflex nasal) vs न (dental nasal)"],
        ttsExample: "टमाटर और डबल रोटी।",
        languageVariants: {
            hi: "मुर्दानी स्वरों में जीभ पीछे मुड़ती है।",
            en: "Say 't' with tongue tip curled back."
        }
    },
    "Aspirated sounds (ख/घ/छ/झ)": {
        description: "Consonants with strong breath release",
        articulation: "Pronounce consonant followed by strong puff of air. Contrast with unaspirated क/ग/च/ज.",
        minimalPairs: ["खाना (food) vs कान (ear)", "घर (house) vs गर (if)", "छत (roof) vs चत (clever)"],
        ttsExample: "ख़ुशी से घर छोड़ दो।",
        languageVariants: {
            hi: "वायु के साथ उच्चारण करें।",
            en: "Hold hand in front of mouth to feel puff of air."
        }
    },

    // Korean phonemes
    "Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)": {
        description: "Strongly aspirated stops",
        articulation: "Pronounce with strong burst of air. More aspiration than English 'p', 't', 'k', 'ch'.",
        minimalPairs: ["파다 (dig) vs 바다 (sea)", "타다 (ride) vs 다다 (arrive)", "카다 (powder) vs 가다 (go)"],
        ttsExample: "파티에 카드와 꽃을 가져왔어요.",
        languageVariants: {
            ko: "강한 숨을 내뿜으며 발음합니다.",
            en: "Like English 'p' in 'pie' but with more air."
        }
    },
    "Tense consonants (ㅃ/ㄸ/ㄲ/ㅆ/ㅉ)": {
        description: "Glottalized/fortis consonants",
        articulation: "Pronounce with tense vocal cords and no aspiration. Voice onset time is zero.",
        minimalPairs: ["빠다 (to dig) vs 바다 (sea)", "따다 (to pick) vs 다다 (to arrive)", "까다 (to peel) vs 가다 (to go)"],
        ttsExample: "빨리 꺼내서 써 보세요.",
        languageVariants: {
            ko: "목을 조이며 단단하게 발음합니다.",
            en: "Say consonant with throat tightened, no air release."
        }
    },

    // Russian phonemes
    "Soft consonants (palatalization)": {
        description: "Consonants with secondary palatal articulation",
        articulation: "Raise middle of tongue toward hard palate while pronouncing consonant. Adds 'y'‑like quality.",
        minimalPairs: ["мат (checkmate) vs мать (mother)", "брат (brother) vs брать (to take)", "угол (corner) vs уголь (coal)"],
        ttsExample: "Мать брала книгу в библиотеке.",
        languageVariants: {
            ru: "Мягкие согласные палатализованы.",
            en: "Add a 'y' sound after consonant (e.g., 'ny' in 'canyon')."
        }
    },
    "Rolling 'r'": {
        description: "Alveolar trill",
        articulation: "Vibrate tongue tip against alveolar ridge multiple times. Similar to Spanish 'rr'.",
        minimalPairs: ["рад (glad) vs ряд (row)", "горa (mountain) vs гора (pile)", "красный (red) vs крáсный (beautiful)"],
        ttsExample: "Рыжий рыцарь ревнует реку.",
        languageVariants: {
            ru: "Язык дрожит на альвеолах.",
            en: "Practice with 'drrr' motor sound."
        }
    },

    // English phonemes
    "'th' sounds (think/that)": {
        description: "Dental fricatives (voiceless /θ/ and voiced /ð/)",
        articulation: "Place tongue tip between upper and lower teeth. For 'think' (voiceless): blow air. For 'that' (voiced): vibrate vocal cords.",
        minimalPairs: ["think vs sink", "that vs dat", "three vs tree", "bath vs bass"],
        ttsExample: "The thoughtful thief thought through that thing.",
        languageVariants: {
            en: "Tongue between teeth, not behind teeth.",
            es: "La lengua entre los dientes, no detrás."
        }
    },
    "'v' vs 'w' (very/wary)": {
        description: "Labiodental fricative vs labio‑velar approximant",
        articulation: "'v': upper teeth on lower lip, friction. 'w': lips rounded, no teeth contact.",
        minimalPairs: ["very vs wary", "vine vs wine", "vest vs west", "vet vs wet"],
        ttsExample: "Very wary veterans wear vests west of the river.",
        languageVariants: {
            en: "'v' uses teeth, 'w' uses rounded lips.",
            hi: "'v' दांतों से, 'w' होंठ गोल करके।"
        }
    }
};

/**
 * Get phoneme tip for a specific phoneme key and language.
 * @param {string} phonemeKey - Phoneme key (must match PHONEME_GUIDE keys)
 * @param {string} [langCode='en'] - Language code for localized tip
 * @returns {string} Articulation tip (localized if available)
 */
export function getPhonemeTip(phonemeKey, langCode = 'en') {
    const entry = PHONEME_GUIDE[phonemeKey];
    if (!entry) {
        return `Focus on clear pronunciation of ${phonemeKey}.`;
    }
    // Return language-specific variant if available
    if (entry.languageVariants && entry.languageVariants[langCode]) {
        return entry.languageVariants[langCode];
    }
    // Fallback to English variant or generic articulation
    if (entry.languageVariants && entry.languageVariants.en) {
        return entry.languageVariants.en;
    }
    return entry.articulation;
}