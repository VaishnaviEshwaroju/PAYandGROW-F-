import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, RewardSuggestion } from '../types';

// Per coding guidelines, the API key is sourced directly from process.env and assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const rewardsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            vendor: {
                type: Type.STRING,
                description: "The name of the vendor or store where the transaction was made."
            },
            offer: {
                type: Type.STRING,
                description: "A short, catchy headline for the offer, e.g., '10% Cashback' or 'Free Coffee'."
            },
            details: {
                type: Type.STRING,
                description: "A one-sentence description of the offer and why it's relevant to the user's spending."
            }
        },
        required: ['vendor', 'offer', 'details']
    }
};

export const getRewardSuggestions = async (transactions: Transaction[]): Promise<RewardSuggestion[]> => {
    // We only need vendor names for this, and let's limit it to the last 10 unique vendors to keep the prompt concise.
    const recentVendors = [...new Set(transactions.filter(t => t.type === 'payment').map(t => t.vendor))].slice(0, 10);
    
    if (recentVendors.length === 0) {
        return [
            {
                vendor: "Local Cafe",
                offer: "10% Off",
                details: "Enjoy a discount on your next coffee as a new user!"
            },
            {
                vendor: "Online Shopping",
                offer: "Free Delivery",
                details: "Get free delivery on your first order from popular online stores."
            },
             {
                vendor: "Movie Tickets",
                offer: "Buy 1 Get 1",
                details: "A special offer for your next movie outing."
            }
        ];
    }

    const prompt = `Based on these recent purchases from a user in India (${recentVendors.join(', ')}), suggest exactly 3 personalized rewards or cashback offers that would be appealing. For each suggestion, provide the vendor, a short offer title, and a brief detail. The user is focused on saving money.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: rewardsSchema,
            },
        });

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText) as RewardSuggestion[];
        return suggestions;

    } catch (error) {
        console.error("Error fetching reward suggestions from Gemini API:", error);
        // Fallback or throw an error
        throw new Error("Failed to get reward suggestions.");
    }
};

export const getSavingsAnalysis = async (data: { date: string, savings: number }[]): Promise<string> => {
    const totalSavings = data.reduce((sum, day) => sum + day.savings, 0);
    const daysWithSavings = data.filter(day => day.savings > 0).length;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (totalSavings === 0) {
        return "You haven't saved anything in the last week. Make a few small payments to see how your savings can grow automatically!";
    }

    if (daysWithSavings >= 5) {
        return `Excellent consistency! You've saved on ${daysWithSavings} of the last 7 days. This regular habit is the best way to build your savings pot. Keep up the fantastic work!`;
    }
    
    if (totalSavings > 25) {
        return `Great job! You've had a strong week of savings. Even a few transactions can add up to a significant amount. Imagine what you could save with more consistency!`;
    }

    if (daysWithSavings > 0) {
        return `You're off to a good start with savings on ${daysWithSavings} day(s) this week! Every little bit counts. Try to make it a daily habit to see your savings grow even faster.`;
    }

    return "It's been a quiet week for savings. Remember that every transaction is an opportunity to grow your savings pot.";
};

export const getSavingsInsight = async (savingsAmount: number): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const amountStr = `₹${savingsAmount.toFixed(2)}`;
    const insights = [
        `Great job! You've tucked away ${amountStr}.`,
        `Consistency is key. Another ${amountStr} saved!`,
        `Your future self will thank you for saving ${amountStr}.`,
        `Every drop counts! You've just added ${amountStr} to your savings.`,
        `That's a smart move! ${amountStr} is now working for you.`,
        `Nice one! You just saved ${amountStr} without even trying.`,
    ];

    if (savingsAmount > 5) {
        insights.push(`That's a big one! ${amountStr} is a solid step towards your goals.`);
    }

    // Return a random insight
    return insights[Math.floor(Math.random() * insights.length)];
};