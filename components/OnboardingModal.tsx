
import React from 'react';
import { SparklesIcon } from './IconComponents';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-8 text-center transform transition-all">
        <SparklesIcon className="w-16 h-16 mx-auto text-primary-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome to TEOMWEXER AI!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Your new creative powerhouse. Here's a quick guide:</p>
        <ul className="text-left space-y-3 text-slate-600 dark:text-slate-300 mb-8">
          <li className="flex items-start gap-3">
            <span className="font-bold text-primary-500">1.</span>
            <span>
              <strong>Craft Your Vision:</strong> Use the left panel to type your prompt, choose styles, and set your desired output.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-primary-500">2.</span>
            <span>
              <strong>Generate Magic:</strong> Hit the "Generate" button and watch your ideas come to life in the main grid.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-primary-500">3.</span>
            <span>
              <strong>Get Help:</strong> Click the chat icon in the header to talk to our AI assistant for prompt ideas and inspiration.
            </span>
          </li>
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
        >
          Start Creating
        </button>
      </div>
    </div>
  );
};
