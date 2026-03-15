import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, RotateCw, ArrowLeft, Camera, User, Trash2, Palette, Check } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { v4 as uuidv4 } from 'uuid';
import TextareaAutosize from 'react-textarea-autosize';

// Pastel colors for cards
const CARD_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

export interface PhotoCard {
  id: string;
  frontImage: string;
  backText: string;
  createdAt: string;
  backgroundColor: string;
}

interface PhotoAlbumProps {
  isOpen: boolean;
  onClose: () => void;
  cards: PhotoCard[];
  onUpdateCards: (cards: PhotoCard[]) => void;
  albumCover: string;
  onUpdateCover: (url: string) => void;
  albumAvatar: string;
  onUpdateAvatar: (url: string) => void;
}

export function PhotoAlbum({ 
  isOpen, 
  onClose, 
  cards, 
  onUpdateCards,
  albumCover,
  onUpdateCover,
  albumAvatar,
  onUpdateAvatar
}: PhotoAlbumProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isOpen) return null;

  const handleAddCard = (url: string) => {
    const newCard: PhotoCard = {
      id: uuidv4(),
      frontImage: url,
      backText: '',
      createdAt: new Date().toISOString(),
      backgroundColor: CARD_COLORS[0]
    };
    onUpdateCards([...cards, newCard]);
    setActiveCardId(newCard.id);
    setIsFlipped(false);
  };

  const updateCardText = (id: string, text: string) => {
    onUpdateCards(cards.map(c => c.id === id ? { ...c, backText: text } : c));
  };

  const updateCardColor = (id: string, color: string) => {
    onUpdateCards(cards.map(c => c.id === id ? { ...c, backgroundColor: color } : c));
  };

  const deleteCard = (id: string) => {
    if (confirm('Delete this memory card?')) {
      onUpdateCards(cards.filter(c => c.id !== id));
      if (activeCardId === id) setActiveCardId(null);
    }
  };

  const activeCard = cards.find(c => c.id === activeCardId);

  return (
    <div className="fixed inset-0 z-[60] bg-stone-100 flex flex-col overflow-hidden">
      {/* Album Header */}
      <div className="relative h-48 md:h-64 bg-stone-200 shrink-0">
        <ImageUploader onImageSelect={onUpdateCover} className="w-full h-full cursor-pointer group">
            {albumCover ? (
                <img src={albumCover} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-200 group-hover:bg-stone-300 transition-colors">
                    <Camera className="w-8 h-8 mr-2" />
                    <span>Add Album Cover</span>
                </div>
            )}
        </ImageUploader>
        
        <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors z-20"
        >
            <X className="w-6 h-6" />
        </button>

        {/* Avatar */}
        <div className="absolute -bottom-10 left-8 z-10">
            <ImageUploader onImageSelect={onUpdateAvatar} className="cursor-pointer group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-stone-100 bg-stone-300 overflow-hidden shadow-lg relative">
                    {albumAvatar ? (
                        <img src={albumAvatar} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-500">
                            <User className="w-10 h-10" />
                        </div>
                    )}
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>
            </ImageUploader>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pt-16 px-4 pb-8 bg-stone-100">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-stone-800 mb-6 px-2">Photo Memories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Add New Card Button */}
                <ImageUploader onImageSelect={handleAddCard} className="aspect-[3/4] rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 hover:bg-stone-200/50 transition-all cursor-pointer">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Add Photo Card</span>
                </ImageUploader>

                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        onClick={() => { setActiveCardId(card.id); setIsFlipped(false); }}
                        className="aspect-[3/4] rounded-xl bg-white shadow-md overflow-hidden cursor-pointer relative group hover:shadow-xl transition-shadow"
                    >
                        <img src={card.frontImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      {/* Full Screen Card Overlay */}
      <AnimatePresence>
        {activeCardId && activeCard && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-stone-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                onClick={() => setActiveCardId(null)}
            >
                    <div 
                        className={`relative flex flex-col transition-all duration-500 ${isFlipped ? 'fixed inset-0 w-full h-full z-[80] bg-stone-100' : 'w-full max-w-2xl h-full max-h-[90vh]'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Controls */}
                        <div className={`flex items-center justify-between p-4 md:p-6 z-20 ${isFlipped ? 'text-stone-800' : 'text-white'}`}>
                            <button 
                                onClick={() => setActiveCardId(null)}
                                className="flex items-center hover:opacity-70 transition-opacity"
                            >
                                <ArrowLeft className="w-5 h-5 mr-1" />
                                Back
                            </button>
                            
                            <div className="flex items-center space-x-4">
                                 {/* Flip Toggle (Visible when flipped) */}
                                 {isFlipped && (
                                     <button 
                                         onClick={() => setIsFlipped(false)}
                                         className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                         title="Flip back to photo"
                                     >
                                         <RotateCw className="w-5 h-5" />
                                     </button>
                                 )}

                                 {/* Color Picker Toggle */}
                                 <div className="relative">
                                    <button 
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className={`p-2 rounded-full transition-colors ${showColorPicker ? 'bg-white text-stone-900 shadow-sm' : 'hover:bg-black/5'}`}
                                    >
                                        <Palette className="w-5 h-5" />
                                    </button>
                                    {showColorPicker && (
                                        <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-xl grid grid-cols-3 gap-2 w-48 z-50 border border-stone-100">
                                            {CARD_COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => { updateCardColor(activeCard.id, c); setShowColorPicker(false); }}
                                                    className="w-10 h-10 rounded-full border border-stone-200 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: c }}
                                                >
                                                    {activeCard.backgroundColor === c && <Check className="w-4 h-4 text-stone-600 mx-auto" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                 </div>

                                <button 
                                    onClick={() => deleteCard(activeCard.id)}
                                    className="p-2 hover:bg-red-50 text-current hover:text-red-500 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 3D Flip Container */}
                        <div className="flex-1 relative perspective-1000 min-h-0">
                            <motion.div
                                layoutId={`card-${activeCard.id}`}
                                className="w-full h-full relative preserve-3d transition-all duration-700"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front Side (Image) */}
                                <div 
                                    className={`absolute inset-0 w-full h-full backface-hidden shadow-2xl overflow-hidden bg-black cursor-pointer ${isFlipped ? 'rounded-none' : 'rounded-2xl'}`}
                                    style={{ backfaceVisibility: 'hidden' }}
                                    onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                                >
                                    <img src={activeCard.frontImage} className="w-full h-full object-contain bg-black" />
                                </div>

                                {/* Back Side (Writing Area) */}
                                <div 
                                    className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden flex flex-col ${isFlipped ? 'rounded-none' : 'rounded-2xl'}`}
                                    style={{ 
                                        backfaceVisibility: 'hidden', 
                                        transform: 'rotateY(180deg)',
                                        backgroundColor: activeCard.backgroundColor || CARD_COLORS[0]
                                    }}
                                >
                                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                                        <TextareaAutosize
                                            value={activeCard.backText}
                                            onChange={(e) => updateCardText(activeCard.id, e.target.value)}
                                            placeholder="Write your story here..."
                                            className="w-full min-h-full bg-transparent border-none resize-none focus:ring-0 text-stone-800 font-handwriting text-xl md:text-2xl leading-loose"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
