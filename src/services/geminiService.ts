import { GoogleGenAI } from "@google/genai";

export async function getCalculatorInsights(calculatorName: string, result: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("Gemini API key is missing or placeholder. AI insights disabled.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief, helpful insight about the result of a ${calculatorName}. The result is: ${JSON.stringify(result)}. Use Google Search to provide context if needed (e.g., if it's a BMI result, what are the health implications based on current standards). Keep it under 100 words.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || null;
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Unable to generate AI insights at this moment. Please try again later.";
  }
}
