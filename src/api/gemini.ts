import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBRjyG_rm192CG_F8gR-ACZR03riYUMc-Q");

export async function getGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-latest" });
    const result = await model.generateContentStream(prompt);
    const response = await result.response;

    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error in getGemini:", error);
    throw new Error("Failed to generate content with Gemini model.");
  }
}
