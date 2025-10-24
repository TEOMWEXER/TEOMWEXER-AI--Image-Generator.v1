import { GoogleGenAI, Modality } from "@google/genai";
import type { GeminiImageGenerationConfig, GeneratedImage } from '../types';

// FIX: Initialize the Gemini client strictly with the API key from environment variables, as per the coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

export const generateImages = async (prompt: string, config: GeminiImageGenerationConfig): Promise<GeneratedImage[]> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: config.numberOfImages,
          outputMimeType: 'image/png',
          aspectRatio: config.aspectRatio === '4:5' ? '3:4' : config.aspectRatio, // Map 4:5 to closest supported ratio
        },
    });

    return response.generatedImages.map((img, index) => ({
      id: `gen-${Date.now()}-${index}`,
      base64: `data:image/png;base64,${img.image.imageBytes}`,
    }));
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images with Gemini API.");
  }
};

export const editImage = async (base64Image: string, prompt: string): Promise<Omit<GeneratedImage, 'id'>> => {
    try {
        // FIX: Dynamically parse MIME type from data URL instead of hardcoding 'image/png'.
        const imageParts = base64Image.split(',');
        const base64Data = imageParts[1];
        const mimeType = imageParts[0].match(/:(.*?);/)?.[1] || 'image/png';
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // FIX: Use the actual MIME type from the response to construct the data URL.
                const responseMimeType = part.inlineData.mimeType;
                return { base64: `data:${responseMimeType};base64,${base64ImageBytes}`};
            }
        }
        throw new Error("No image data in response.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image with Gemini API.");
    }
};

export const getPromptSuggestion = async (prompt: string): Promise<string> => {
    try {
        const fullPrompt = `Based on the following user idea for an image, generate a highly detailed and creative prompt for an AI image generator. Enhance the original idea with vivid descriptions, artistic styles, and specific details about lighting, composition, and mood. Original idea: "${prompt}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting prompt suggestion:", error);
        throw new Error("Failed to get prompt suggestion from Gemini API.");
    }
};

export const chatWithAssistant = async (prompt: string, image?: string): Promise<string> => {
    try {
        let contents: any = { parts: [{ text: prompt }] };
        if (image) {
            // FIX: Dynamically parse MIME type from data URL instead of hardcoding 'image/jpeg'.
            const imageParts = image.split(',');
            const base64Data = imageParts[1];
            const mimeType = imageParts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
            contents.parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: "You are a helpful AI assistant for an image generation application. Your goal is to help users refine their prompts, suggest styles, and give feedback to create better images. Be concise and encouraging."
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error chatting with assistant:", error);
        throw new Error("Failed to chat with assistant.");
    }
};
