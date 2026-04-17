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
    "Uvular r (French r)": {
        description: "Uvular trill/fricative",
        articulation: "Produced by vibrating the uvula (back of throat). Not a rolled tongue tip. Similar to gargling sound.",
        minimalPairs: ["rouge (red) vs rouge (no minimal pair)", "Paris vs pari (bet)", "rare vs raire (to bray)"],
        ttsExample: "Le rouge rend rare le rire à Paris.",
        languageVariants: {
            fr: "Le 'r' français est uvulaire, pas alvéolaire.",
            en: "Practice gargling gently to feel the uvula vibration."
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

    // Italian phonemes
    "Geminates (doubled consonants)": {
        description: "Long (geminate) consonants",
        articulation: "Hold consonant sound longer with more muscular tension. Distinguishes meaning in Italian.",
        minimalPairs: ["casa (house) vs cassa (cash register)", "pala (shovel) vs palla (ball)", "note (notes) vs notte (night)"],
        ttsExample: "La palla è nella cassa della casa.",
        languageVariants: {
            it: "Le consonanti doppie si pronunciano più lunghe.",
            en: "Hold the consonant longer, like 'bookkeeper' with double k."
        }
    },
    "'gli' sound": {
        description: "Palatal lateral approximant",
        articulation: "Place tongue against hard palate, let air flow around sides. Similar to 'lli' in 'million'.",
        minimalPairs: ["figlio (son) vs filo (thread)", "aglio (garlic) vs alio (I nourish)", "meglio (better) vs melio (honey)"],
        ttsExample: "Il figlio mangia l'aglio con il meglio.",
        languageVariants: {
            it: "La lingua tocca il palato, l'aria esce dai lati.",
            en: "Like 'lli' in 'million' or 'brilliant'."
        }
    },
    "Open/Closed vowels": {
        description: "Contrast between open and closed e/o",
        articulation: "Open è/ò: jaw lower, mouth more open. Closed é/ó: jaw higher, mouth less open.",
        minimalPairs: ["pesca (peach) vs pesca (fishing)", "corso (course) vs corso (run)", "vento (wind) vs vento (I sell)"],
        ttsExample: "È un bel corso di corsa con la pesca.",
        languageVariants: {
            it: "È aperta, é chiusa; ò aperta, ó chiusa.",
            en: "Open e as in 'bet', closed e as in 'bay'; open o as in 'law', closed o as in 'go'."
        }
    },

    // Portuguese phonemes
    "Nasal vowels (ão/õe)": {
        description: "Nasalized vowel sounds",
        articulation: "Air flows through nose and mouth simultaneously. Lower velum to allow nasal resonance.",
        minimalPairs: ["pão (bread) vs pau (stick)", "mão (hand) vs mau (bad)", "não (no) vs nau (ship)"],
        ttsExample: "O pão na mão não é mau.",
        languageVariants: {
            pt: "O ar sai pelo nariz e boca ao mesmo tempo.",
            en: "Pinch nose to feel vibration; like 'on' in French 'bon'."
        }
    },
    "'lh' sound": {
        description: "Palatal lateral approximant",
        articulation: "Similar to Italian 'gli'. Tongue against hard palate, air flows around sides.",
        minimalPairs: ["filho (son) vs fio (thread)", "mulher (woman) vs muer (they die)", "trabalho (work) vs trabalho (I work)"],
        ttsExample: "O filho da mulher faz trabalho.",
        languageVariants: {
            pt: "Língua no palato, ar pelos lados.",
            en: "Like 'lli' in 'million' or Spanish 'll' in some dialects."
        }
    },
    "'r' sound (gutural)": {
        description: "Uvular/guttural r",
        articulation: "Produced in back of throat (uvular). Stronger at word beginning, softer between vowels.",
        minimalPairs: ["rato (mouse) vs gato (cat)", "carro (car) vs caro (expensive)", "porta (door) vs posta (mail)"],
        ttsExample: "O rato corre no carro pela porta.",
        languageVariants: {
            pt: "Som gutural, na parte de trás da garganta.",
            en: "Similar to French r but less fricative."
        }
    },

    // Russian phonemes
    "Palatalization (soft signs)": {
        description: "Soft (palatalized) consonants",
        articulation: "Raise middle of tongue toward hard palate while pronouncing consonant. Indicated by soft sign (ь) or vowel letters.",
        minimalPairs: ["мат (checkmate) vs мать (mother)", "брат (brother) vs брать (to take)", "угол (corner) vs уголь (coal)"],
        ttsExample: "Мать брала уголь в углу.",
        languageVariants: {
            ru: "Мягкие согласные палатализованы.",
            en: "Add a 'y' sound after consonant (e.g., 'ny' in 'canyon')."
        }
    },
    "Vowel reduction": {
        description: "Reduction of unstressed vowels",
        articulation: "Unstressed 'o' becomes [a]-like, 'e' becomes [i]-like. Reduces vowel quality in non‑stressed syllables.",
        minimalPairs: ["молоко (milk) pronounced малако", "телефон (telephone) pronounced тилифон", "хорошо (good) pronounced харашо"],
        ttsExample: "Молоко и телефон хорошо.",
        languageVariants: {
            ru: "Безударные гласные редуцируются.",
            en: "Unstressed vowels become more central/schwa‑like."
        }
    },

    // Korean phonemes
    "'r/l' sound": {
        description: "Alveolar flap / lateral approximant",
        articulation: "Between vowels: tongue taps alveolar ridge (flap). At syllable end: tongue tip to alveolar ridge, air flows sides (lateral).",
        minimalPairs: ["라디오 (radio) vs 다디오", "말 (word) vs 발 (foot)", "갈 (go) vs 갓 (hat)"],
        ttsExample: "라디오에서 말을 갈라.",
        languageVariants: {
            ko: "모음 사이에서는 'ㄹ'이 탄음, 끝에서는 설측음.",
            en: "Between vowels like Spanish single r; syllable‑final like light l."
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
    },

    // English phonemes (additional)
    "r vs l": {
        description: "Alveolar approximant vs lateral approximant",
        articulation: "R: tongue curls back but doesn't touch roof. L: tongue tip touches alveolar ridge.",
        minimalPairs: ["right vs light", "red vs led", "fry vs fly", "grass vs glass"],
        ttsExample: "The red light led right to the glass.",
        languageVariants: {
            en: "R: tongue back, L: tongue tip up.",
            ja: "Rは舌を後ろに、Lは舌先を歯茎に。"
        }
    },
    "short/long vowels (ship/sheep)": {
        description: "Short I (ɪ) vs long E (iː)",
        articulation: "Short I (ɪ): tongue slightly lower and more central. Long E (iː): tongue higher and front, held longer.",
        minimalPairs: ["ship vs sheep", "bit vs beat", "fit vs feet", "sit vs seat"],
        ttsExample: "The sheep on the ship beat the seat.",
        languageVariants: {
            en: "Hold the long vowel longer.",
            es: "Mantenga la vocal larga más tiempo."
        }
    },

    // Dutch phonemes
    "guttural g": {
        description: "Voiced velar fricative",
        articulation: "Produced in the back of the throat. In northern Dutch it's harder (like clearing throat), in southern softer.",
        minimalPairs: ["goed (good) vs koet", "geen (none) vs keen", "graag (gladly) vs kraag"],
        ttsExample: "Goed geen graag.",
        languageVariants: {
            nl: "Harde g in het noorden, zachte g in het zuiden.",
            en: "Like clearing throat gently."
        }
    },
    "ui/ij diphthongs": {
        description: "Unique Dutch diphthongs",
        articulation: "UI: start with 'a' as in 'cat', glide to 'ee' with rounded lips. IJ: similar to 'eye' but shorter.",
        minimalPairs: ["huis (house) vs haas", "muis (mouse) vs maas", "bruin (brown) vs braun"],
        ttsExample: "Een bruine muis in het huis.",
        languageVariants: {
            nl: "UI: a+ie met ronde lippen.",
            en: "Not found in English."
        }
    },
    "schwa reduction": {
        description: "Reduction of unstressed vowels to schwa",
        articulation: "Unstressed vowels often reduce to schwa (ə), a neutral mid-central vowel.",
        minimalPairs: ["de (the) vs da", "een (a) vs aan", "werken (to work) vs warken"],
        ttsExample: "De een werkt.",
        languageVariants: {
            nl: "Onbeklemtoonde klinkers worden vaak ə.",
            en: "Like the 'a' in 'about'."
        }
    },

    // Turkish phonemes
    "vowel harmony (front/back)": {
        description: "Vowel harmony rules",
        articulation: "Turkish has 8 vowels. Front: e, i, ö, ü. Back: a, ı, o, u. Suffixes change according to vowel harmony.",
        minimalPairs: ["ev (house) vs eve", "okul (school) vs okula", "elma (apple) vs elmalar"],
        ttsExample: "Evde okula gidiyor.",
        languageVariants: {
            tr: "Ön ve arka ünlü uyumu.",
            en: "Suffix vowels match preceding vowel."
        }
    },
    "soft ğ (yumuşak ge)": {
        description: "Silent letter that lengthens preceding vowel",
        articulation: "Between vowels it creates a glide. At word end it lengthens preceding vowel.",
        minimalPairs: ["dağ (mountain) vs da", "ağaç (tree) vs açaç", "yoğurt (yogurt) vs yort"],
        ttsExample: "Dağdaki ağaç yoğurt.",
        languageVariants: {
            tr: "Ğ sesi uzatır.",
            en: "Silent, lengthens vowel."
        }
    },
    "dotted/dotless i": {
        description: "Dotted i (i) vs dotless ı (ı)",
        articulation: "Dotted i (i) is like English 'ee'. Dotless ı (ı) is a close back unrounded vowel.",
        minimalPairs: ["kız (girl) vs kiz", "ışık (light) vs işik", "sıcak (hot) vs sicak"],
        ttsExample: "Kız ışık sıcak.",
        languageVariants: {
            tr: "Noktalı i ve noktasız ı.",
            en: "Dotless i is like 'e' in 'roses'."
        }
    },

    // Swedish phonemes
    "pitch accent (accent 1/2)": {
        description: "Swedish pitch accent distinction",
        articulation: "Accent 1: falling pitch on first syllable. Accent 2: falling‑rising pitch, often with two peaks.",
        minimalPairs: ["anden (the duck) vs anden (the spirit)", "tomten (the plot) vs tomten (Santa)"],
        ttsExample: "Anden i tomten.",
        languageVariants: {
            sv: "Accent 1 och accent 2.",
            en: "Changes meaning."
        }
    },
    "sj sound (retroflex fricative)": {
        description: "Unique Swedish retroflex fricative",
        articulation: "Like 'sh' but with tongue curled back. Varies by dialect.",
        minimalPairs: ["sjuk (sick) vs shuk", "skjorta (shirt) vs skorta", "stjärna (star) vs stjarna"],
        ttsExample: "Sjuk skjorta på stjärna.",
        languageVariants: {
            sv: "Sj‑ljudet är retroflext.",
            en: "Tongue curled back."
        }
    },
    "vowel length": {
        description: "Short vs long vowels",
        articulation: "Swedish distinguishes short and long vowels. Long vowels are held longer and affect consonant length.",
        minimalPairs: ["tak (roof) vs tack (thanks)", "vit (white) vs vitt (white neuter)", "mus (mouse) vs muss (mussel)"],
        ttsExample: "Tak tack vit vitt mus muss.",
        languageVariants: {
            sv: "Korta och långa vokaler.",
            en: "Vowel length changes meaning."
        }
    },

    // Greek phonemes
    "Greek consonants (γ/χ/ξ/ψ)": {
        description: "Greek gamma, chi, xi, psi",
        articulation: "Gamma (γ) is voiced velar fricative. Chi (χ) is voiceless velar fricative. Xi (ξ) = ks, Psi (ψ) = ps.",
        minimalPairs: ["γάλα (milk) vs κάλα", "χέρι (hand) vs κέρι", "ξένος (foreigner) vs σένος"],
        ttsExample: "Γάλα χέρι ξένος ψωμί.",
        languageVariants: {
            el: "Γάμμα, χι, ξι, ψι.",
            en: "Gamma like Spanish 'g' in 'lago'."
        }
    },
    "double consonants": {
        description: "Geminate consonants",
        articulation: "Double consonants are pronounced longer and with more tension. Distinguish meaning.",
        minimalPairs: ["παπάς (priest) vs παππάς (priest with double p)", "νόμος (law) vs νομός (prefecture)"],
        ttsExample: "Παπάς νόμος.",
        languageVariants: {
            el: "Διπλά σύμφωνα.",
            en: "Hold consonant longer."
        }
    },
    "stress marks": {
        description: "Acute accent marks stress",
        articulation: "Greek uses acute accent (΄) to mark stressed syllable. Stress can change meaning.",
        minimalPairs: ["πολύ (much) vs πολύ (very)", "παπάς (priest) vs παππάς (priest with double p)"],
        ttsExample: "Πολύ παπάς.",
        languageVariants: {
            el: "Τόνος.",
            en: "Stress indicated by accent mark."
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