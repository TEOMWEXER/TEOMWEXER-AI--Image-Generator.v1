import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
// FIX: Import the SparklesIcon component.
import { DownloadIcon, EditIcon, ShareIcon, SparklesIcon } from './IconComponents';

interface ImageCardProps {
  image: GeneratedImage;
  onEdit: (id: string, editPrompt: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.base64;
        link.download = `teomwexer-ai-${image.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(image.id, editPrompt);
        setIsEditing(false);
    }
    
    return (
        <div className="group relative aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-fade-in">
            <img src={image.base64} alt={`Generated art ${image.id}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="flex items-center gap-3">
                    <button onClick={handleDownload} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-colors" title="Download PNG"><DownloadIcon className="w-5 h-5" /></button>
                    <button onClick={() => setIsEditing(true)} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-colors" title="Edit with Prompt"><EditIcon className="w-5 h-5" /></button>
                    <button className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-colors" title="Share (Coming Soon)"><ShareIcon className="w-5 h-5" /></button>
                </div>
            </div>
            {isEditing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col p-4 justify-center items-center z-10 animate-fade-in">
                    <h4 className="text-white font-semibold mb-2">Edit Image</h4>
                    <form onSubmit={handleEditSubmit} className="w-full flex flex-col gap-2">
                        <input 
                            type="text"
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g., add sunglasses"
                            className="w-full p-2 rounded-md bg-slate-700 text-white border border-slate-500 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-primary-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-primary-700">Apply</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-500 text-white py-1.5 px-3 rounded-md text-sm hover:bg-slate-600">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};


const SkeletonCard: React.FC = () => (
    <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse-fast"></div>
);

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onEdit: (id: string, editPrompt: string) => void;
  loadingCount?: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, onEdit, loadingCount = 4 }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: loadingCount }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                <SparklesIcon className="w-16 h-16 mb-4 text-primary-400" />
                <h2 className="text-2xl font-semibold">Start Your Creation</h2>
                <p className="mt-2 max-w-md">Use the panel on the left to describe the image you want to create. Let your imagination run wild!</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {images.map(image => (
                <ImageCard key={image.id} image={image} onEdit={onEdit} />
            ))}
        </div>
    );
};
