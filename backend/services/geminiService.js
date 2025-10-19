import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const analyzeTicket = async (ticketText) => {
  try {
    const SystemPrompt = `
        You are an IT helpdesk assistant. Analyze the ticket and return ONLY valid JSON (no explanation).
        Fields:
        {
            "department": "Network|Hardware|Software|Database|Security|General",
            "priority": "Low|Medium|High",
            "summary": "short summary"
        }
        Ticket:
            """${ticketText}"""
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      prompt: SystemPrompt,
      temperature: 0.5,
      maxOutputTokens: 100,
      topP: 0.5,
      topK: 0.5,
    });

    const result = response.generations[0].text;
    const first = result.indexOf("{");
    const last = result.lastIndexOf("}");
    const trimmed = result.slice(first, last + 1);  

    return trimmed;
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      department: "General",
      priority: "Medium",
      summary: "",
    });
  }
};
