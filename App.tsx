
import React, { useState, useCallback, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageGrid } from './components/ImageGrid';
import { Header } from './components/Header';
import { AssistantPanel } from './components/AssistantPanel';
import { OnboardingModal } from './components/OnboardingModal';
import { generateImages, editImage, getPromptSuggestion } from './services/geminiService';
import type { GenerationSettings, GeneratedImage } from './types';
import { sampleImages } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [settings, setSettings] = useState<GenerationSettings>({
    prompt: '',
    negativePrompt: '',
    style: 'Photorealistic',
    numberOfImages: 4,
    quality: '4K',
    aspectRatio: '1:1',
  });
  const [images, setImages] = useState<GeneratedImage[]>(sampleImages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
    
    if (!localStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!settings.prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]); // Clear previous images

    try {
      const fullPrompt = `${settings.prompt}, ${settings.style}, ${settings.quality} quality${settings.negativePrompt ? `, avoiding ${settings.negativePrompt}` : ''}`;
      const generated = await generateImages(fullPrompt, {
        numberOfImages: settings.numberOfImages,
        aspectRatio: settings.aspectRatio,
      });
      setImages(generated);
    } catch (e) {
      console.error(e);
      setError('Failed to generate images. Please check your prompt or API key.');
      setImages(sampleImages); // Show sample images on error
    } finally {
      setIsLoading(false);
    }
  }, [settings, isLoading]);

  const handleEdit = useCallback(async (id: string, editPrompt: string) => {
    const imageToEdit = images.find(img => img.id === id);
    if (!imageToEdit || !editPrompt) return;

    setIsLoading(true); // Or a specific editing loader
    setError(null);
    
    try {
      const editedImage = await editImage(imageToEdit.base64, editPrompt);
      setImages(images.map(img => img.id === id ? { ...editedImage, id } : img));
    } catch (e) {
      console.error(e);
      setError('Failed to edit the image.');
    } finally {
      setIsLoading(false);
    }
  }, [images]);
  
  const handleEnhancePrompt = useCallback(async () => {
    if (!settings.prompt) return;
    try {
        const suggestion = await getPromptSuggestion(settings.prompt);
        setSettings(s => ({...s, prompt: suggestion}));
    } catch (e) {
        console.error(e);
        setError('Failed to get prompt suggestion.');
    }
  }, [settings.prompt]);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <Header theme={theme} onToggleTheme={handleThemeToggle} onToggleAssistant={() => setShowAssistant(!showAssistant)} />
      <div className="flex flex-1 overflow-hidden">
        <SettingsPanel 
          settings={settings} 
          setSettings={setSettings} 
          onGenerate={handleGenerate}
          onEnhancePrompt={handleEnhancePrompt}
          isLoading={isLoading} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
          <ImageGrid images={images} isLoading={isLoading} onEdit={handleEdit} loadingCount={settings.numberOfImages} />
        </main>
        <AssistantPanel isVisible={showAssistant} onClose={() => setShowAssistant(false)} />
      </div>
      {showOnboarding && <OnboardingModal onClose={() => {
        setShowOnboarding(false);
        localStorage.setItem('onboardingComplete', 'true');
      }} />}
    </div>
  );
};

export default App;
