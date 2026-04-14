import { mistralChatCompletion } from './mistralClient.js';
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

    // Use the Mistral client
    const response = await mistralChatCompletion(messages, finalPrompt);
    return response;

  } catch (error) {
    console.error("Mistral API Error:", error.message);
    throw error;
  }
}
