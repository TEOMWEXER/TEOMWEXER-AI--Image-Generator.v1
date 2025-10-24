
import React from 'react';
import { SunIcon, MoonIcon, MessageSquareIcon } from './IconComponents';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onToggleAssistant }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">
          TEOMWEXER AI
        </h1>
        <span className="text-sm sm:text-base font-light text-slate-500 dark:text-slate-400 hidden md:inline">Image Generator</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onToggleAssistant}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle Assistant"
        >
          <MessageSquareIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <MoonIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          ) : (
            <SunIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          )}
        </button>
      </div>
    </header>
  );
};
