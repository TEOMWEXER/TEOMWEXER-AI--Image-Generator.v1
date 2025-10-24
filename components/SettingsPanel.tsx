
import React, { memo } from 'react';
import type { GenerationSettings } from '../types';
import { STYLE_OPTIONS } from '../constants';
import { SparklesIcon, WandIcon } from './IconComponents';

interface SettingsPanelProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onGenerate: () => void;
  onEnhancePrompt: () => void;
  isLoading: boolean;
}

const CustomSelect: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({label, value, onChange, children}) => (
    <div className="relative">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none">
            {children}
        </select>
    </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = memo(({ settings, setSettings, onGenerate, onEnhancePrompt, isLoading }) => {
  const handleSettingsChange = <K extends keyof GenerationSettings,>(key: K, value: GenerationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-80 md:w-96 p-6 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto hidden lg:flex flex-col">
      <div className="flex-1 space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Your Prompt</label>
          <div className="mt-1 relative">
            <textarea
              id="prompt"
              rows={5}
              value={settings.prompt}
              onChange={(e) => handleSettingsChange('prompt', e.target.value)}
              placeholder="A hyper-realistic cat astronaut on Mars..."
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 dark:bg-slate-700"
            />
            <button
                onClick={onEnhancePrompt}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={!settings.prompt}
                aria-label="Enhance Prompt"
                title="Enhance Prompt with AI"
            >
                <WandIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
            <label htmlFor="negative-prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Negative Prompt</label>
            <input
            id="negative-prompt"
            type="text"
            value={settings.negativePrompt}
            onChange={(e) => handleSettingsChange('negativePrompt', e.target.value)}
            placeholder="e.g., blurry, text, watermark"
            className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 dark:bg-slate-700"
            />
        </div>

        <CustomSelect label="Artistic Style" value={settings.style} onChange={(e) => handleSettingsChange('style', e.target.value)}>
            {Object.entries(STYLE_OPTIONS).map(([group, options]) => (
                <optgroup label={group} key={group}>
                    {options.map(option => <option key={option} value={option}>{option}</option>)}
                </optgroup>
            ))}
        </CustomSelect>

        <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Generation Settings</h3>
        
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Number of Images: {settings.numberOfImages}</label>
              <input
                type="range"
                min="1"
                max="8"
                value={settings.numberOfImages}
                onChange={(e) => handleSettingsChange('numberOfImages', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomSelect label="Quality" value={settings.quality} onChange={(e) => handleSettingsChange('quality', e.target.value as GenerationSettings['quality'])}>
                    <option value="2K">2K</option>
                    <option value="4K">4K</option>
                    <option value="8K">8K</option>
                </CustomSelect>
                <CustomSelect label="Aspect Ratio" value={settings.aspectRatio} onChange={(e) => handleSettingsChange('aspectRatio', e.target.value as GenerationSettings['aspectRatio'])}>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="4:5">4:5 (Portrait)</option>
                    <option value="4:3">4:3 (Landscape)</option>
                </CustomSelect>
            </div>
        </div>
      </div>

      <div className="mt-8 sticky bottom-0 py-4 bg-white dark:bg-slate-800">
        <button
          onClick={onGenerate}
          disabled={isLoading || !settings.prompt}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate
            </>
          )}
        </button>
      </div>
    </aside>
  );
});
