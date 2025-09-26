import { GoogleGenAI, Type } from "@google/genai";
import type { InvestmentSuggestion } from '../types';

// Per coding guidelines, the API key is sourced directly from process.env and assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const investmentSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'The name of the investment asset, e.g., "Nifty 50 Index Fund" or "Reliance Industries Stock".'
      },
      type: {
        type: Type.STRING,
        enum: ['Stock', 'Mutual Fund', 'ETF', 'Crypto'],
        description: 'The type of the investment asset.'
      },
      description: {
        type: Type.STRING,
        description: 'A brief, one-sentence description of the investment suitable for a beginner.'
      },
      riskLevel: {
        type: Type.STRING,
        enum: ['Low', 'Medium', 'High'],
        description: 'The general risk level associated with this investment.'
      }
    },
    required: ['name', 'type', 'description', 'riskLevel'],
  }
};

export const getInvestmentSuggestions = async (): Promise<InvestmentSuggestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Suggest exactly 3 diverse, beginner-friendly investment options for a small amount of money (around 100-500 rupees) saved from transaction round-ups. The target audience is new to investing.",
            config: {
                responseMimeType: "application/json",
                responseSchema: investmentSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText) as InvestmentSuggestion[];
        return suggestions;

    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        throw new Error("Failed to get investment suggestions from Gemini.");
    }
};
