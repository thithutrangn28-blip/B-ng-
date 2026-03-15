import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { PASTEL_COLORS } from '@/lib/constants';
import { ImageUploader } from './ImageUploader';
import { X, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CreateNotebookModalProps {
  onClose: () => void;
  onCreated: (notebookId: string) => void;
}

export function CreateNotebookModal({ onClose, onCreated }: CreateNotebookModalProps) {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState('');
  const [bgColor, setBgColor] = useState(PASTEL_COLORS[0]);

  const handleCreate = async () => {
    if (!title) return;
    
    const id = uuidv4();
    const notebook = {
      id,
      title,
      cover,
      bgColor,
      createdAt: new Date().toISOString(),
    };
    
    await db.saveNotebook(notebook);
    onCreated(id);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium font-serif">New Journal</h3>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Cover Image */}
          <div className="flex justify-center">
            <ImageUploader
              currentImage={cover}
              onImageSelect={setCover}
              className="w-32 h-40 overflow-hidden shadow-md bg-stone-100 rounded-r-lg rounded-l-[2px] border-l-4 border-stone-300"
            >
              {!cover && (
                <div className="flex flex-col items-center justify-center w-full h-full text-stone-400">
                  <span className="text-sm">Cover</span>
                </div>
              )}
            </ImageUploader>
          </div>

          {/* Title Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-stone-600">Journal Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-stone-50 border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400"
              placeholder="My Thoughts..."
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block mb-2 text-sm font-medium text-stone-600">Paper Color</label>
            <div className="flex flex-wrap gap-2">
              {PASTEL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded-full border ${
                    bgColor === color ? 'ring-2 ring-stone-400 border-transparent' : 'border-stone-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!title}
            className="flex items-center justify-center w-full py-3 space-x-2 text-white transition-colors bg-stone-800 rounded-xl hover:bg-stone-700 disabled:opacity-50"
          >
            <span>Create Journal</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
