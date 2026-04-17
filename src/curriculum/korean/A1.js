/**
 * Korean A1 syllabus for Myno AI Tutor.
 * Contains grammar, vocabulary, phonemes, and pragmatics for beginner level.
 * @module curriculum/korean/A1
 */

/** @type {import('../../data/learningGoals.js').CurriculumFocus} */
const KOREAN_A1 = {
    "level": "A1",
    "language": "ko",
    "cefr": "A1",
    "grammar": [
        "particles_eun_neun",
        "copula_ieyo",
        "honorifics_intro"
    ],
    "grammarDetails": [
        {
            "id": "particles_eun_neun",
            "name": "Topic/Subject Particles (은/는, 이/가)",
            "tip": "Use 은/는 after consonant-ending nouns, 는 after vowel-ending nouns for topic. Use 이/가 for subject. 은/는 emphasizes topic or contrast, 이/가 marks neutral subject."
        },
        {
            "id": "copula_ieyo",
            "name": "Copula 이에요/예요 (To Be)",
            "tip": "Add 이에요 after consonant-ending nouns, 예요 after vowel-ending nouns. Means \"is/am/are\". Example: 학생이에요 (I am a student), 의사예요 (He is a doctor)."
        },
        {
            "id": "honorifics_intro",
            "name": "Honorifics Introduction",
            "tip": "Use 요-ending for polite speech. Add 시 to verb stem for honorific: 가다 (to go) -> 가세요. Use formal titles: 선생님 (teacher), 사장님 (boss)."
        }
    ],
    "vocab": [
        {
            "word": "안녕",
            "translation": "hello",
            "freq": "very high",
            "theme": "greetings"
        },
        {
            "word": "감사합니다",
            "translation": "thank you",
            "freq": "very high",
            "theme": "politeness"
        },
        {
            "word": "네",
            "translation": "yes",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "아니요",
            "translation": "no",
            "freq": "very high",
            "theme": "basics"
        },
        {
            "word": "물",
            "translation": "water",
            "freq": "high",
            "theme": "food_drink"
        },
        {
            "word": "빵",
            "translation": "bread",
            "freq": "high",
            "theme": "food_drink"
        },
        {
            "word": "집",
            "translation": "house",
            "freq": "high",
            "theme": "home"
        },
        {
            "word": "친구",
            "translation": "friend",
            "freq": "high",
            "theme": "people"
        }
    ],
    "vocabThemes": [
        "greetings",
        "politeness",
        "basics",
        "food_drink",
        "home",
        "people"
    ],
    "phonemes": [
        "Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)",
        "Tense consonants (ㅃ/ㄸ/ㄲ/ㅆ/ㅉ)",
        "'r/l' sound"
    ],
    "phonemeDetails": [
        {
            "char": "ㅍ/ㅌ/ㅋ/ㅊ",
            "name": "Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)",
            "tip": "Pronounced with strong puff of air. Contrast with plain counterparts: 파 (pa) vs 바 (ba), 타 (ta) vs 다 (da).",
            "practice": "Hold hand in front of mouth to feel air for ㅍ (p), ㅌ (t), ㅋ (k), ㅊ (ch)."
        },
        {
            "char": "ㅃ/ㄸ/ㄲ/ㅆ/ㅉ",
            "name": "Tense consonants (ㅃ/ㄸ/ㄲ/ㅆ/ㅉ)",
            "tip": "Pronounced with glottal tension, no aspiration. Voice is creaky or pressed. Longer and stronger than plain consonants.",
            "practice": "Say 빠 (ppa), 따 (tta), 까 (kka), 싸 (ssa), 짜 (jja) with throat tension."
        },
        {
            "char": "ㄹ",
            "name": "'r/l' sound",
            "tip": "Between vowels: flap similar to Spanish single r. At syllable end: lateral l. Not like English r or l.",
            "practice": "Practice \"라디오\" (radio) - flap, \"말\" (word) - lateral l."
        }
    ],
    "pragmatics": "Use honorific -세요 endings and formal speech with elders, strangers, superiors. Informal -아/어 endings with close friends and younger people. Bow slightly when greeting.",
    "orthography": "Hangul alphabet",
    "version": "2.0"
};

export default KOREAN_A1;