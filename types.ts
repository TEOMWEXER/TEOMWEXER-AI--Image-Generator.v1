
export interface GenerationSettings {
  prompt: string;
  negativePrompt: string;
  style: string;
  numberOfImages: number;
  quality: '2K' | '4K' | '8K';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' | '3:4' | '4:3';
}

export interface GeneratedImage {
  id: string;
  base64: string;
}

export interface GeminiImageGenerationConfig {
  numberOfImages: number;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' | '3:4' | '4:3';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    image?: string; // base64
}
