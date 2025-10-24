
import type { GeneratedImage } from './types';

export const STYLE_OPTIONS = {
    'Realistic & Photography': ['Realistic', 'Hyper-Realistic', 'Photorealistic', 'Cinematic', 'HDR', 'Portrait', 'Macro', 'Street', 'Studio Lighting'],
    'Artistic & Painting': ['Digital Painting', 'Oil Painting', 'Watercolor', 'Ink Drawing', 'Sketch', 'Acrylic', 'Pastel Art'],
    'Cartoon & Animation': ['Cartoon', 'Comic', 'Anime', 'Manga', 'Chibi', 'Pixar Style', 'Disney Style', '2D Animation', 'Cel Shaded'],
    'Fantasy & Sci-Fi': ['Fantasy', 'Sci-Fi', 'Futuristic', 'Cyberpunk', 'Steampunk', 'Space / Galaxy'],
    'Mood & Lighting': ['Golden Hour', 'Moody', 'Dark', 'Soft Light', 'Vibrant', 'Colorful', 'Monochrome', 'Black & White', 'Neon', 'Glowing'],
    'Design & Conceptual': ['Minimalist', 'Abstract', 'Surreal', 'Concept Art', 'Pop Art', 'Vector Art'],
};

export const sampleImages: GeneratedImage[] = [
    { id: 'sample-1', base64: 'https://picsum.photos/seed/a/1024/1024' },
    { id: 'sample-2', base64: 'https://picsum.photos/seed/b/1024/1024' },
    { id: 'sample-3', base64: 'https://picsum.photos/seed/c/1024/1024' },
    { id: 'sample-4', base64: 'https://picsum.photos/seed/d/1024/1024' },
];
