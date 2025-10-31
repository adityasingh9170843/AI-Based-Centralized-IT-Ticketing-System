import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const parseChatMessageToTicket = async (chatText) => {
  try {
    const prompt = `
You are an intelligent IT helpdesk assistant that interprets chat messages.

Extract structured data for potential ticket creation. 
Return ONLY valid JSON — no extra text.

Format:
{
  "department": "Network|Hardware|Software|Database|Security|General",
            "priority": "Low|Medium|High",
            "summary": "short summary"
}

Determine intent as "create_ticket" if the user reports a problem, requests help, or explicitly asks to create a ticket.
Otherwise use "other".

Message:
"""${chatText}"""
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text;
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    const clean = text.slice(first, last + 1);

    return JSON.parse(clean);
  } catch (error) {
    console.error("Chatbot parse error:", error);
    return { intent: "other", title: "", description: chatText };
  }
};
