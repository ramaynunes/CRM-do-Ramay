import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Deal, EmailDraft, AIAnalysisResult } from "../types";

// Initialize Gemini
// NOTE: API Key must be provided in the environment or this will fail gracefully in the UI.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkApiKey = (): boolean => {
  return !!apiKey;
};

/**
 * Generates a professional email draft based on the context and user intent.
 */
export const generateSmartEmail = async (
  contact: Contact,
  deal: Deal | undefined,
  intent: string
): Promise<EmailDraft> => {
  if (!apiKey) throw new Error("API Key missing");

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert sales assistant at "Bora Soluções Esportivas". Write a professional, concise email in Portuguese (Brazil).
    
    To: ${contact.name} (${contact.role} at ${contact.company})
    Context: ${deal ? `Regarding deal "${deal.title}" valued at R$${deal.value}. Stage: ${deal.stage}.` : "General networking."}
    User Intent: ${intent}
    
    Return the response in JSON format with "subject" and "body" fields.
    The body should be plain text, ready to send.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
        },
        required: ["subject", "body"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    return JSON.parse(text) as EmailDraft;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("AI response was not valid JSON");
  }
};

/**
 * Analyzes a deal to provide risk assessment and next steps.
 */
export const analyzeDealHealth = async (deal: Deal, contact: Contact, notes: string): Promise<AIAnalysisResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze the following sales deal for Bora Soluções Esportivas and provide strategic insights.
    Output language: Portuguese (Brazil).
    
    Deal: ${deal.title} (R$${deal.value})
    Stage: ${deal.stage}
    Contact: ${contact.name} from ${contact.company}
    Recent Notes/Interaction History: "${notes}"
    
    Provide:
    1. Sentiment (Positive, Neutral, Negative)
    2. Risk Score (0-100, where 100 is high risk of losing)
    3. A brief 1-sentence summary of the status.
    4. Three concrete next steps to move the deal forward.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
          riskScore: { type: Type.INTEGER },
          summary: { type: Type.STRING },
          nextSteps: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: ["sentiment", "riskScore", "summary", "nextSteps"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as AIAnalysisResult;
};