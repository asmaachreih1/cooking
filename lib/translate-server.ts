import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getTranslation(text: string, targetLang: 'ar' | 'en' = 'ar') {
  if (!text) return "";
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not found");
    return "";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. 
    Provide ONLY the translation, no explanations, no quotes unless they are in the source.
    If the input is an array (JSON), translate each element and return a JSON array.
    If the input is a single string, return just the translated string.
    
    Text to translate:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    // Try to parse as JSON if it looks like one
    if (translatedText.startsWith('[') || translatedText.startsWith('{')) {
      try {
        return JSON.parse(translatedText);
      } catch (e) {
        return translatedText;
      }
    }

    return translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return "";
  }
}
