
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XIcon, SendIcon, PaperclipIcon, SparklesIcon } from './IconComponents';
import { chatWithAssistant } from '../services/geminiService';
import type { ChatMessage } from '../types';

interface AssistantPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const AssistantMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={`flex flex-col gap-1 w-full max-w-[320px] leading-1.5 p-3 border-gray-200 rounded-xl ${isUser ? 'bg-primary-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 rounded-bl-none'}`}>
        {message.image && <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-h-40 object-cover" />}
        <p className="text-sm font-normal">{message.text}</p>
      </div>
    </div>
  );
};

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: "Hello! I'm your creative assistant. How can I help you brainstorm an amazing image prompt today?" }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if ((!input && !image) || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const responseText = await chatWithAssistant(input, image || undefined);
      const assistantMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, image, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isVisible) return null;

  return (
    <aside className="w-full sm:w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col absolute sm:relative h-full sm:h-auto right-0 z-20 animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">AI Assistant</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => <AssistantMessage key={msg.id} message={msg} />)}
        {isLoading && (
            <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {image && (
          <div className="relative mb-2">
            <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5"><XIcon className="w-3 h-3" /></button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for prompt ideas..."
            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-primary-500 focus:border-primary-500"
          />
          <button onClick={handleSend} disabled={(!input && !image) || isLoading} className="p-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-slate-400">
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
