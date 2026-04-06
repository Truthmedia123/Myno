import { collection, addDoc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Store a user mistake in Firestore for future reference
 * @param {string} userId - The user's UID
 * @param {string} mistake - The incorrect phrase/sentence the user said
 * @param {string} correction - The correct version
 * @param {string} explanation - Brief explanation of the mistake
 * @param {string} language - Target language
 * @returns {Promise<string>} Document ID of the stored mistake
 */
export async function storeMistake(userId, mistake, correction, explanation, language) {
    try {
        const docRef = await addDoc(collection(db, "userMistakes"), {
            userId,
            mistake,
            correction,
            explanation,
            language,
            timestamp: new Date().toISOString(),
            reviewed: false,
            recurrenceCount: 0
        });
        console.log("Mistake stored with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error storing mistake:", error);
        throw error;
    }
}

/**
 * Retrieve recent mistakes for a user (last 7 days, max 10)
 * @param {string} userId - The user's UID
 * @param {string} language - Target language (optional filter)
 * @returns {Promise<Array>} Array of mistake objects
 */
export async function getRecentMistakes(userId, language = null) {
    try {
        let q = query(
            collection(db, "userMistakes"),
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(10)
        );

        if (language) {
            q = query(
                collection(db, "userMistakes"),
                where("userId", "==", userId),
                where("language", "==", language),
                orderBy("timestamp", "desc"),
                limit(10)
            );
        }

        const querySnapshot = await getDocs(q);
        const mistakes = [];
        querySnapshot.forEach((doc) => {
            mistakes.push({ id: doc.id, ...doc.data() });
        });
        return mistakes;
    } catch (error) {
        console.error("Error retrieving mistakes:", error);
        return [];
    }
}

/**
 * Mark a mistake as reviewed (user has practiced it)
 * @param {string} mistakeId - Document ID of the mistake
 * @param {boolean} correct - Whether the user got it right this time
 */
export async function markMistakeReviewed(mistakeId, correct = true) {
    // This would typically update the mistake document
    // For now, we'll just log it
    console.log(`Mistake ${mistakeId} marked as reviewed (correct: ${correct})`);
}

/**
 * Generate a memory context string for the AI system prompt
 * @param {Array} mistakes - Array of recent mistake objects
 * @returns {string} Formatted context string for the AI
 */
export function generateMemoryContext(mistakes) {
    if (!mistakes || mistakes.length === 0) {
        return "";
    }

    const recentMistakes = mistakes.slice(0, 5); // Take top 5 most recent
    let context = "\n\n## Past Mistakes to Remember:\n";

    recentMistakes.forEach((mistake, index) => {
        context += `${index + 1}. User often says: "${mistake.mistake}"\n`;
        context += `   Correct: "${mistake.correction}"\n`;
        context += `   Reason: ${mistake.explanation}\n\n`;
    });

    context += "Gently remind the user of these patterns if they make similar mistakes again.";
    return context;
}

/**
 * Extract mistake from AI correction message and store it
 * @param {string} userId - The user's UID
 * @param {string} userMessage - What the user said
 * @param {string} aiResponse - AI's response that contains correction
 * @param {string} language - Target language
 */
export async function extractAndStoreMistake(userId, userMessage, aiResponse, language) {
    // Simple heuristic: look for "Pro Tip" or correction patterns in AI response
    const proTipMatch = aiResponse.match(/Pro Tip[^:]*:\s*(.+)/i);
    if (proTipMatch) {
        const explanation = proTipMatch[1].trim();

        // Try to identify what was corrected (simplified logic)
        // In a real implementation, you'd want more sophisticated parsing
        const correctionMatch = aiResponse.match(/should be\s*["']([^"']+)["']/i) ||
            aiResponse.match(/correct.*["']([^"']+)["']/i);

        const correction = correctionMatch ? correctionMatch[1] : "See explanation above";

        await storeMistake(userId, userMessage, correction, explanation, language);
    }
}

/**
 * Update user memory with topics extracted from conversation using Groq
 * Language‑neutral: uses Groq to extract topics from any language
 * @param {object} db - Firestore database instance
 * @param {string} userId - User's UID
 * @param {string} aiResponse - Latest AI response
 * @param {Array} userMessagesThisSession - Array of user messages in this session
 * @param {string} targetLanguage - User's target language (e.g., "Spanish")
 * @param {string} nativeLanguage - User's native language (e.g., "English")
 */
export async function updateUserMemory(db, userId, aiResponse, userMessagesThisSession, targetLanguage, nativeLanguage) {
    try {
        // Combine recent user messages and AI response for context
        const recentText = userMessagesThisSession.slice(-3).join(" ") + " " + aiResponse;

        // Call Groq to extract topics in a language‑neutral way
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    {
                        role: "system",
                        content: `You are a topic extraction assistant. Analyze the following conversation snippet and extract 3‑5 main topics or themes that the user is practicing or discussing. Return ONLY a JSON array of topic strings, no other text. Example: ["greetings", "food vocabulary", "past tense"]`
                    },
                    {
                        role: "user",
                        content: `Conversation snippet: ${recentText}\n\nExtract topics:`
                    }
                ],
                temperature: 0.3,
                max_tokens: 100
            })
        });

        if (!groqResponse.ok) {
            console.warn("Groq topic extraction failed, falling back to simple detection");
            return await fallbackTopicDetection(db, userId, aiResponse, targetLanguage, nativeLanguage);
        }

        const data = await groqResponse.json();
        const topics = JSON.parse(data.choices[0].message.content);

        // Merge topics into userMemory document
        const { doc, getDoc, setDoc } = await import("firebase/firestore");
        const memoryRef = doc(db, "userMemory", userId);
        const memorySnap = await getDoc(memoryRef);

        const existing = memorySnap.exists() ? memorySnap.data() : {};
        const existingTopics = existing.topics || [];

        // Add new topics, avoid duplicates
        const updatedTopics = [...existingTopics];
        topics.forEach(topic => {
            if (!updatedTopics.includes(topic)) {
                updatedTopics.push(topic);
            }
        });

        // Keep only last 20 topics
        const trimmedTopics = updatedTopics.slice(-20);

        await setDoc(memoryRef, {
            topics: trimmedTopics,
            lastUpdated: new Date().toISOString(),
            targetLanguage,
            nativeLanguage
        }, { merge: true });

        console.log("User memory updated with topics:", trimmedTopics);
        return trimmedTopics;
    } catch (error) {
        console.error("Error updating user memory:", error);
        // Fallback to simple detection
        return await fallbackTopicDetection(db, userId, aiResponse, targetLanguage, nativeLanguage);
    }
}

/**
 * Fallback topic detection using simple keyword matching (English‑centric)
 * Used when Groq fails
 */
async function fallbackTopicDetection(db, userId, aiResponse, targetLanguage, nativeLanguage) {
    const englishKeywords = {
        greetings: ["hello", "hi", "good morning", "hey", "greetings"],
        food: ["food", "restaurant", "eat", "drink", "menu", "hungry", "breakfast", "lunch", "dinner"],
        travel: ["travel", "airport", "hotel", "train", "bus", "taxi", "directions", "map"],
        shopping: ["shop", "buy", "price", "cost", "expensive", "cheap", "market", "store"],
        family: ["family", "mother", "father", "sister", "brother", "parents", "children"],
        work: ["work", "job", "office", "meeting", "colleague", "boss", "project"],
        time: ["time", "clock", "hour", "minute", "today", "tomorrow", "yesterday", "week", "month"]
    };

    const detectedTopics = [];
    const lowerResponse = aiResponse.toLowerCase();

    for (const [topic, keywords] of Object.entries(englishKeywords)) {
        if (keywords.some(keyword => lowerResponse.includes(keyword))) {
            detectedTopics.push(topic);
        }
    }

    if (detectedTopics.length === 0) {
        detectedTopics.push("general conversation");
    }

    // Save to Firestore
    const { doc, getDoc, setDoc } = await import("firebase/firestore");
    const memoryRef = doc(db, "userMemory", userId);
    const memorySnap = await getDoc(memoryRef);

    const existing = memorySnap.exists() ? memorySnap.data() : {};
    const existingTopics = existing.topics || [];
    const updatedTopics = [...existingTopics, ...detectedTopics].slice(-20);

    await setDoc(memoryRef, {
        topics: updatedTopics,
        lastUpdated: new Date().toISOString(),
        targetLanguage,
        nativeLanguage
    }, { merge: true });

    console.log("Fallback topics saved:", detectedTopics);
    return updatedTopics;
}

/**
 * Detect weak phonemes based on language and native language
 * @param {string} language - Target language
 * @param {Array} lowScoreTranscripts - Array of transcripts with low pronunciation scores
 * @param {string} nativeLanguage - User's native language (optional)
 * @returns {Array} Array of weak phoneme descriptions
 */
export function detectWeakPhonemes(targetLanguage, nativeLanguage) {
    const PHONEME_ISSUES = {
        English: {
            Hindi: ["'th' sounds (think/that)", "'v' vs 'w' (very/wary)", "Short vowels (bit vs beat)", "Silent letters (know/write)"],
            Marathi: ["'th' sounds", "'v' vs 'w'", "Final consonant clusters", "Stress patterns"],
            Tamil: ["'th' sounds", "Retroflex vs dental sounds", "Short vs long vowels", "Word stress"],
            Telugu: ["'th' sounds", "'f' sound (often becomes 'p')", "Short vowel length", "Consonant clusters"],
            Kannada: ["'th' sounds", "'z' sound", "Short vowels", "Stress patterns"],
            Chinese: ["'th' sounds", "'r' sound", "Final consonants (lost/last)", "Short vs long vowels"],
            Japanese: ["'r' vs 'l' (road/load)", "'v' sound", "Consonant clusters", "Word-final consonants"],
            Korean: ["'f' vs 'p'", "'r' vs 'l'", "Consonant clusters at end of words", "'v' sound"],
            Arabic: ["'p' sound (often becomes 'b')", "Short vowels", "'g' sound", "Consonant clusters"],
            Russian: ["'w' sound (often becomes 'v')", "'th' sounds", "Stress patterns", "Short vowels"],
            Spanish: ["'th' sounds", "Silent 'h'", "'b' vs 'v' distinction", "Short vowel length"],
            French: ["'th' sounds", "'h' aspiration", "English stress patterns", "Short vowels"],
            German: ["'th' sounds", "'w' sound (often 'v')", "English word stress", "Short vowels"],
            Italian: ["'th' sounds", "Double consonants", "Word stress", "Short vowels"],
            Portuguese: ["'th' sounds", "Nasal vowels", "Word stress", "Short vs long vowels"],
            default: ["'th' sounds", "Word stress patterns", "Short vowel distinctions", "Final consonants"],
        },
        Spanish: {
            English: ["Rolled 'r' and 'rr'", "'ñ' sound (canyon)", "'j' (jota) sound", "Vowel purity (no diphthongs)"],
            Hindi: ["Rolled 'r'", "'b' vs 'v' (both same in Spanish)", "Gender agreement", "Vowel purity"],
            Japanese: ["Rolled 'r'", "Syllable stress", "Gender agreement", "Vowel purity"],
            Chinese: ["Rolled 'r'", "Gender agreement", "Syllable stress", "Linking words in speech"],
            default: ["Rolled 'r' and 'rr'", "'ñ' sound", "'j' (jota) guttural sound", "Pure vowel sounds"],
        },
        French: {
            English: ["Nasal vowels (on/an/in/un)", "Silent letters", "Liaison (linking words)", "French 'r' (guttural)"],
            Hindi: ["Nasal vowels", "French 'r'", "Silent final consonants", "Liaison rules"],
            Spanish: ["Nasal vowels", "Silent letters", "French 'r'", "Vowel sounds (u/eu)"],
            default: ["Nasal vowels", "Silent letters and liaison", "French 'r' sound", "'u' and 'eu' vowels"],
        },
        German: {
            English: ["'ch' sound (Bach/ich)", "Umlauts (ü/ö/ä)", "Final devoicing (d→t)", "Long vs short vowels"],
            Hindi: ["'ch' sound", "Umlauts", "Consonant clusters", "Word stress (first syllable)"],
            default: ["'ch' sounds (hard/soft)", "Umlauts ü/ö/ä", "Final consonant devoicing", "Long vs short vowels"],
        },
        Japanese: {
            English: ["Long vs short vowels (おじさん vs おじいさん)", "'r' sound (between r and l)", "Pitch accent", "Moraic rhythm"],
            Hindi: ["Pitch accent", "Long vs short vowels", "Moraic rhythm (equal syllable length)", "'tsu' and 'tsu' sounds"],
            Chinese: ["Pitch accent (not tones)", "Long vowels", "Moraic rhythm", "Particle pronunciation"],
            default: ["Pitch accent patterns", "Long vs short vowels", "Moraic rhythm", "The 'r/l' hybrid sound"],
        },
        Korean: {
            English: ["Aspirated consonants (ㅍ/ㅌ/ㅋ/ㅊ)", "Tense consonants (ㅃ/ㄸ/ㄲ/ㅆ/ㅉ)", "Vowel ㅡ (no English equivalent)", "Final consonants"],
            Hindi: ["Aspirated consonants", "Tense consonants", "Vowel ㅡ", "Syllable block rhythm"],
            Japanese: ["Tense consonants", "Vowel ㅡ", "Consonant clusters", "Word-final nasals"],
            default: ["Aspirated vs tense consonants", "Vowel ㅡ sound", "Final consonant rules", "Vowel harmony"],
        },
        Hindi: {
            English: ["Retroflex consonants (ट/ड/ण)", "Aspirated sounds (ख/घ/छ/झ)", "Nasalized vowels (ँ)", "Short 'a' (अ) sound"],
            Spanish: ["Retroflex consonants", "Aspirated consonants", "Nasalized vowels", "Short 'a' sound"],
            Chinese: ["Retroflex consonants", "Aspirated consonants", "Nasalized vowels", "Cerebral sounds"],
            default: ["Retroflex consonants (ट/ड)", "Aspirated consonants (ख/घ)", "Nasalized vowels", "Tone-neutral speech"],
        },
        Chinese: {
            English: ["Tones (4 tones + neutral)", "Pinyin 'x', 'q', 'zh', 'ch', 'sh'", "'ü' sound", "Retroflex finals (-r)"],
            Hindi: ["Tones", "Pinyin initials (zh/ch/sh/r)", "'ü' sound", "Retroflex finals"],
            Japanese: ["Tones (Japanese has no tones)", "Pinyin initials", "Short vowel sounds", "Retroflex finals"],
            default: ["All 4 tones", "Pinyin 'x', 'q' initials", "Retroflex sounds (zh/ch/sh)", "'ü' vowel"],
        },
        Arabic: {
            English: ["Emphatic consonants (ص/ض/ط/ظ)", "Guttural sounds (ع/غ/خ/ح)", "Long vs short vowels", "Glottal stop (ء)"],
            Hindi: ["Guttural sounds (ع/خ/ح)", "Emphatic consonants", "Long vs short vowels", "Glottal stop"],
            default: ["Guttural sounds (ع/غ/خ/ح)", "Emphatic consonants (ص/ض/ط)", "Long vs short vowels", "Glottal stop ء"],
        },
        Russian: {
            English: ["Soft consonants (palatalization)", "Rolling 'r'", "Vowel reduction (unstressed)", "Clusters like 'str', 'vzg'"],
            Hindi: ["Palatalized consonants", "Rolling 'r'", "Vowel reduction", "Hard vs soft signs (ъ/ь)"],
            default: ["Palatalized (soft) consonants", "Rolling 'r'", "Vowel reduction", "Hard/soft consonant pairs"],
        },
        Portuguese: {
            English: ["Nasal vowels (ão/ã/em/im)", "'lh' and 'nh' sounds", "Vowel reduction (unstressed)", "European vs Brazilian accent"],
            Spanish: ["Nasal vowels", "'lh' digraph", "Vowel reduction", "Unstressed vowel dropping"],
            default: ["Nasal vowels (ão/em/in)", "'lh' and 'nh' digraphs", "Unstressed vowel reduction", "Word stress patterns"],
        },
        Italian: {
            English: ["Double consonants (fatto vs fato)", "Open vs closed vowels (è/é)", "Rolling 'r'", "Geminates rhythm"],
            Spanish: ["Double consonants", "Open vs closed vowels", "'gli' and 'gn' sounds", "Stress patterns"],
            default: ["Double (geminate) consonants", "Open vs closed vowels", "Rolling 'r'", "'gli' and 'gn' digraphs"],
        },
        Dutch: {
            English: ["Guttural 'g' and 'ch' sounds", "Long vs short vowels", "Diphthongs (ij/ei/ui/ou)", "Final devoicing"],
            German: ["Guttural 'g' (softer than German)", "Diphthongs", "Final devoicing", "'w' sound"],
            default: ["Guttural 'g' sound", "Diphthongs (ij/ui/ou)", "Final devoicing", "Long vs short vowel pairs"],
        },
        Turkish: {
            English: ["Vowel harmony system", "Undotted 'ı' vowel", "Soft 'ğ' (yumuşak g)", "Agglutinative rhythm"],
            Arabic: ["Vowel harmony", "Undotted 'ı'", "Soft 'ğ'", "Lack of pharyngeals"],
            default: ["Vowel harmony rules", "Undotted 'ı' vowel", "Soft 'ğ' sound", "Agglutinative word rhythm"],
        },
        Swedish: {
            English: ["Pitch accent (acute vs grave)", "'sj' sound (unique to Swedish)", "Long vs short vowels", "Rounded vowels (ö/ü/y)"],
            default: ["Pitch accent (word melody)", "'sj' and 'tj' sounds", "Rounded front vowels (ö/y)", "Long vs short vowel pairs"],
        },
        Greek: {
            English: ["'γ' (gamma) guttural sound", "Double vowel sounds (αι/οι/ει)", "Stress accent system", "'θ' and 'δ' sounds"],
            default: ["Guttural 'γ' sound", "Vowel combinations (αι/οι/ει)", "Stress accent patterns", "Voiced 'δ' vs 'θ' sounds"],
        },
    };

    const langMap = PHONEME_ISSUES[targetLanguage];
    if (!langMap) return ["Pronunciation accuracy", "Word stress", "Vowel clarity", "Consonant precision"];
    return langMap[nativeLanguage] || langMap.default || ["Pronunciation accuracy", "Word stress", "Vowel clarity"];
}

/**
 * Retrieve user memory (topics and weak phonemes) from Firestore
 * @param {object} db - Firestore database instance
 * @param {string} userId - User's UID
 * @returns {Promise<object>} User memory object with topics, weakPhonemes, etc.
 */
export async function getUserMemory(db, userId) {
    try {
        const { doc, getDoc } = await import("firebase/firestore");
        const memoryRef = doc(db, "userMemory", userId);
        const memorySnap = await getDoc(memoryRef);

        if (memorySnap.exists()) {
            return memorySnap.data();
        } else {
            return { topics: [], weakPhonemes: [], lastUpdated: null };
        }
    } catch (error) {
        console.error("Error retrieving user memory:", error);
        return { topics: [], weakPhonemes: [], lastUpdated: null };
    }
}

/**
 * Save weak phonemes to userMemory collection in Firestore
 * @param {object} db - Firestore database instance
 * @param {string} userId - User's UID
 * @param {Array} phonemes - Array of weak phoneme descriptions
 */
export async function saveWeakPhonemes(db, userId, phonemes) {
    const { doc, setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, "userMemory", userId), { weakPhonemes: phonemes }, { merge: true });
}