const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

import { getAgentPrompt } from "@/lib/curriculum";

function extractWordsFromMessages(messages) {
  const words = new Set();
  for (const msg of messages) {
    if (msg.role === "assistant" && msg.content) {
      const match = msg.content.match(/WORD:\s*(.+)/i);
      if (match && match[1]) {
        const word = match[1].trim();
        if (word) {
          words.add(word);
        }
      }
    }
  }
  return Array.from(words);
}

export async function invokeGeminiChat(messages, targetLanguage = "English", nativeLanguage = "English", learningGoal = "General", userLevel = "beginner", memoryContext = "", personalityStyle = "", currentLevel = 1) {
  try {
    if (!API_KEY) {
      throw new Error("VITE_GROQ_API_KEY is not set in environment variables");
    }

    const safeTargetLanguage = targetLanguage || "English";
    const safeNativeLanguage = nativeLanguage || "English";
    const safeLearningGoal = learningGoal || "General";
    const safeUserLevel = userLevel || "beginner";

    const wordsIntroduced = extractWordsFromMessages(messages || []);

    const systemPrompt = getAgentPrompt(
      safeUserLevel,
      safeTargetLanguage,
      safeNativeLanguage,
      safeLearningGoal,
      wordsIntroduced,
      currentLevel
    );

    const personalityInstruction = personalityStyle ? `\n\nTUTOR PERSONALITY STYLE:\n${personalityStyle}` : "";
    const finalPrompt = `${systemPrompt}${personalityInstruction}${memoryContext}`;

    const formattedMessages = [
      { role: "system", content: finalPrompt },
      ...(messages || []).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m?.content || "")
      }))
    ];

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${err}`);
    }

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq API");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw error;
  }
}
