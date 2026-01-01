import { GoogleGenAI } from "@google/genai";
import { Company } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const enhanceCompanyProfile = async (company: Company): Promise<Partial<Company>> => {
  try {
    const ai = getAIClient();
    
    const prompt = `
      You are a professional copywriter for a home services directory.
      Create a compelling, SEO-friendly 'About Us' description (approx 100 words) and a list of 5 key selling points (services) for a gutter company based on this data:
      Name: ${company.name}
      City: ${company.city}
      State: ${company.state}
      Existing Services: ${company.services?.join(', ') || 'General Gutter Services'}
      
      Return the response in JSON format with keys: "description" (string) and "services" (array of strings).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return {};
    
    const data = JSON.parse(text);
    return {
      description: data.description,
      services: data.services
    };
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return {};
  }
};