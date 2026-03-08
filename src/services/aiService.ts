import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ModerationResult {
  status: 'safe' | 'warning' | 'blocked';
  reason?: string;
}

export interface SupportResult {
  message?: string;
}

export const moderateContent = async (content: string): Promise<ModerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following student post for toxicity, harassment, or harmful content. 
      Return a JSON object with "status" (either "safe", "warning", or "blocked") and "reason" (a brief explanation if not safe).
      
      Post: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['safe', 'warning', 'blocked'] },
            reason: { type: Type.STRING }
          },
          required: ['status']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as ModerationResult;
  } catch (error) {
    console.error("Moderation error:", error);
    return { status: 'safe' }; // Default to safe if AI fails
  }
};

export const generateSupportMessage = async (content: string): Promise<SupportResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The following is a post from a student who might be feeling stressed, anxious, or down. 
      Provide a very brief (1-2 sentences), supportive, and empathetic message or a helpful resource suggestion.
      If the post is not about mental health or stress, return an empty string.
      
      Post: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as SupportResult;
  } catch (error) {
    console.error("Support generation error:", error);
    return {};
  }
};
