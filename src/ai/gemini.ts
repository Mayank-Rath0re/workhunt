// src/ai/gemini.ts
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Modify to accept API key as a parameter
export async function generateGeminiResponse(history: any[], message: string, apiKey: string) {
  console.log("Generating Gemini response using API...");
  console.log("History:", history);
  console.log("Message:", message);
  console.log(`Using API key: ${apiKey ? '******' + apiKey.slice(-4) : 'Not set'}`);


  try {
    // Use the provided API key to initialize GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
      safetySettings: [{
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      }, ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    console.log("Gemini API response received.", text);
    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
