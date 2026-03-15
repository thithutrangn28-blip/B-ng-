import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Type, Book, User, Sticker as StickerIcon, X, Trash2, Upload, MessageCircle, PenTool, Minus, Maximize2, Check, Layout, Keyboard } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { ImageUploader } from './ImageUploader';
import { Sticker } from './Sticker';
import { ChatEditor, ChatBlock } from './ChatEditor';
import { FRAME_TEMPLATES, KAOMOJIS } from './FrameTemplates';
import { VietnameseLearningPanel } from './VietnameseLearningPanel';
import { NoteApp } from './NoteApp';

// --- Constants ---

const PASTEL_PALETTE = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7',
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const NOTEBOOKS = Array.from({ length: 25 }, (_, i) => ({
  id: `nb-${i}`,
  title: `Notebook ${i + 1}`,
  color: PASTEL_PALETTE[i % PASTEL_PALETTE.length],
  coverPattern: i % 3 // 0: solid, 1: dots, 2: stripes (simulated)
}));

const STICKER_CATEGORIES = [
  { id: 'character', label: 'Character' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'animal', label: 'Animal' },
  { id: 'text', label: 'Text' },
  { id: 'decorative', label: 'Decorative' },
  { id: 'custom', label: 'My Photos' }
];

const STICKER_TEMPLATES = {
  character: ['char-1', 'char-2'],
  lifestyle: ['life-1', 'life-2'],
  animal: ['animal-1', 'animal-2'],
  text: ['text-1', 'text-2'],
  decorative: ['deco-1', 'deco-2']
};

// Generate 200 stickers
const ALL_STICKERS = Array.from({ length: 200 }, (_, i) => {
  const categoryIndex = Math.floor(i / 40); // 40 stickers per category to get 5 categories
  const category = STICKER_CATEGORIES[categoryIndex % 5];
  const templates = STICKER_TEMPLATES[category.id as keyof typeof STICKER_TEMPLATES];
  const template = templates[i % templates.length];
  
  return {
    id: `sticker-${i}`,
    type: template,
    category: category.id,
    label: `${category.label} ${i + 1}`
  };
});

// --- Types ---

interface PageStickerData {
  id: string;
  stickerId: string; // ID from ALL_STICKERS or custom URL
  type: string; // Template type or 'custom'
  x: number;
  y: number;
  scale: number;
  rotation: number;
  customUrl?: string;
}

interface JournalEntry {
  content: ChatBlock[]; // Unified content structure
  mode?: 'text' | 'chat';
  date: string;
  avatar?: string;
  stickers?: PageStickerData[];
}

interface JournalData {
  [notebookId: string]: {
    [pageIndex: number]: JournalEntry;
  };
}

// --- Helper: Remove Background (Corner Color Detection) ---
const removeBackground = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(imageSrc);
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Get background color from top-left pixel
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      
      // Tolerance for color matching (adjust as needed)
      const tolerance = 50; 

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate distance from background color
        const distance = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        if (distance < tolerance) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
};

// --- Component ---

export function JournalApp({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'shelf' | 'journal'>('shelf');
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [journalData, setJournalData] = useState<JournalData>({});
  
  // Customization State
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [showFrameDrawer, setShowFrameDrawer] = useState(false);
  const [showLearningDrawer, setShowLearningDrawer] = useState(false);
  const [showNoteApp, setShowNoteApp] = useState(false);
  const [activeCategory, setActiveCategory] = useState('character');
  const [activeFrameCategory, setActiveFrameCategory] = useState<'frames' | 'kaomoji'>('frames');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  // Manage mutually exclusive panels
  useEffect(() => {
    if (showSettings) {
      setShowStickerDrawer(false);
      setShowFrameDrawer(false);
      setShowLearningDrawer(false);
      setShowNoteApp(false);
    }
  }, [showSettings]);

  useEffect(() => {
    if (showStickerDrawer) {
      setShowSettings(false);
      setShowFrameDrawer(false);
      setShowLearningDrawer(false);
      setShowNoteApp(false);
    }
  }, [showStickerDrawer]);

  useEffect(() => {
    if (showFrameDrawer) {
      setShowSettings(false);
      setShowStickerDrawer(false);
      setShowLearningDrawer(false);
      setShowNoteApp(false);
    }
  }, [showFrameDrawer]);

  useEffect(() => {
    if (showLearningDrawer) {
      setShowSettings(false);
      setShowStickerDrawer(false);
      setShowFrameDrawer(false);
      setShowNoteApp(false);
    }
  }, [showLearningDrawer]);

  useEffect(() => {
    if (showNoteApp) {
      setShowSettings(false);
      setShowStickerDrawer(false);
      setShowFrameDrawer(false);
      setShowLearningDrawer(false);
    }
  }, [showNoteApp]);

  // Custom Stickers State
  const [customStickers, setCustomStickers] = useState<{id: string, url: string}[]>([]);

  // Animation State
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(1);

  // Load Data
  useEffect(() => {
    const savedData = localStorage.getItem('journal_app_data');
    if (savedData) {
      setJournalData(JSON.parse(savedData));
    }
    
    const savedSettings = localStorage.getItem('journal_app_settings');
    if (savedSettings) {
      const { font, size } = JSON.parse(savedSettings);
      if (font) setFontFamily(font);
      if (size) setFontSize(size);
    }

    const savedCustomStickers = localStorage.getItem('journal_app_custom_stickers');
    if (savedCustomStickers) {
      setCustomStickers(JSON.parse(savedCustomStickers));
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (Object.keys(journalData).length > 0) {
      localStorage.setItem('journal_app_data', JSON.stringify(journalData));
    }
  }, [journalData]);

  // Save Settings
  useEffect(() => {
    localStorage.setItem('journal_app_settings', JSON.stringify({ font: fontFamily, size: fontSize }));
  }, [fontFamily, fontSize]);

  // Save Custom Stickers
  useEffect(() => {
    if (customStickers.length > 0) {
      localStorage.setItem('journal_app_custom_stickers', JSON.stringify(customStickers));
    }
  }, [customStickers]);

  const handleOpenNotebook = (id: string) => {
    setSelectedNotebookId(id);
    setCurrentPage(0);
    setView('journal');
  };

  const handleBackToShelf = () => {
    setView('shelf');
    setSelectedNotebookId(null);
  };

  const handlePageChange = (newIndex: number) => {
    if (newIndex < 0 || isFlipping) return;
    
    setDirection(newIndex > currentPage ? 1 : -1);
    setIsFlipping(true);
    setCurrentPage(newIndex);
    
    setTimeout(() => setIsFlipping(false), 600);
  };

  const updateContent = (blocks: ChatBlock[]) => {
    if (!selectedNotebookId) return;

    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage] || { date: new Date().toLocaleDateString() };
      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            content: blocks,
          }
        }
      };
    });
  };

  const toggleMode = () => {
    if (!selectedNotebookId) return;
    
    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage] || { content: [], date: new Date().toLocaleDateString(), stickers: [] };
      const newMode = currentEntry.mode === 'chat' ? 'text' : 'chat';
      
      // Ensure content is array (migration)
      let currentContent = Array.isArray(currentEntry.content) ? currentEntry.content : (currentEntry.content ? [{ id: 'legacy', type: 'standard', text: currentEntry.content as unknown as string } as ChatBlock] : []);

      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            mode: newMode,
            content: currentContent
          }
        }
      };
    });
  };

  const updateAvatar = (url: string) => {
    if (!selectedNotebookId) return;

    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage] || { content: [], date: new Date().toLocaleDateString(), stickers: [] };
      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            content: Array.isArray(currentEntry.content) ? currentEntry.content : (currentEntry.content ? [{ id: 'legacy', type: 'standard', text: currentEntry.content as unknown as string } as ChatBlock] : []),
            avatar: url
          }
        }
      };
    });
  };

  const addSticker = (stickerTemplate: any) => {
    if (!selectedNotebookId) return;

    const newSticker: PageStickerData = {
      id: Date.now().toString(),
      stickerId: stickerTemplate.id,
      type: stickerTemplate.type,
      x: Math.random() * 200 + 50, // Random position
      y: Math.random() * 300 + 100,
      scale: 1,
      rotation: (Math.random() - 0.5) * 20,
      customUrl: stickerTemplate.customUrl
    };

    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage] || { content: [], date: new Date().toLocaleDateString(), stickers: [] };
      const currentStickers = currentEntry.stickers || [];
      
      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            content: Array.isArray(currentEntry.content) ? currentEntry.content : (currentEntry.content ? [{ id: 'legacy', type: 'standard', text: currentEntry.content as unknown as string } as ChatBlock] : []),
            stickers: [...currentStickers, newSticker]
          }
        }
      };
    });
    
    // Close drawer on mobile after adding? Maybe keep open for multiple adds.
  };

  const deleteSticker = (stickerId: string) => {
    if (!selectedNotebookId) return;
    
    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage];
      if (!currentEntry || !currentEntry.stickers) return prev;

      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            stickers: currentEntry.stickers.filter(s => s.id !== stickerId)
          }
        }
      };
    });
    setSelectedStickerId(null);
  };

  const handleCustomStickerUpload = async (base64: string) => {
    const processedImage = await removeBackground(base64);
    const newCustomSticker = {
      id: `custom-${Date.now()}`,
      url: processedImage
    };
    setCustomStickers(prev => [...prev, newCustomSticker]);
    
    // Auto-add to page
    addSticker({
      id: newCustomSticker.id,
      type: 'custom',
      customUrl: newCustomSticker.url
    });
  };

  const updateStickerPosition = (stickerId: string, x: number, y: number) => {
    if (!selectedNotebookId) return;
    
    setJournalData(prev => {
      const notebookEntries = prev[selectedNotebookId] || {};
      const currentEntry = notebookEntries[currentPage];
      if (!currentEntry || !currentEntry.stickers) return prev;

      const updatedStickers = currentEntry.stickers.map(s => 
        s.id === stickerId ? { ...s, x, y } : s
      );

      return {
        ...prev,
        [selectedNotebookId]: {
          ...notebookEntries,
          [currentPage]: {
            ...currentEntry,
            stickers: updatedStickers
          }
        }
      };
    });
  };

  const getCurrentEntry = () => {
    if (!selectedNotebookId) return { content: [], date: new Date().toLocaleDateString() };
    const entry = journalData[selectedNotebookId]?.[currentPage] || { content: [], date: new Date().toLocaleDateString() };
    
    // Ensure content is always an array for the renderer
    if (typeof entry.content === 'string') {
        return { ...entry, content: entry.content ? [{ id: 'legacy', type: 'standard', text: entry.content } as ChatBlock] : [] };
    }
    return entry as JournalEntry;
  };

  const addFrame = (frameText: string) => {
    const currentContent = getCurrentEntry().content;
    const newBlock: ChatBlock = {
      id: Date.now().toString(),
      type: 'standard',
      text: frameText,
      fontFamily: 'mono'
    } as ChatBlock;
    updateContent([...currentContent, newBlock]);
    setShowFrameDrawer(false);
  };

  const activeNotebook = NOTEBOOKS.find(nb => nb.id === selectedNotebookId);
  const currentEntry = getCurrentEntry();

  // --- Render Shelf View ---
  if (view === 'shelf') {
    return (
      <div className="h-full w-full bg-[#f5f5f5] flex flex-col relative overflow-hidden">
        <div className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between shadow-sm z-20">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </button>
          <h2 className="font-serif text-lg font-bold text-stone-700">My Bookshelf</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-8 gap-8 snap-x snap-mandatory no-scrollbar">
          {NOTEBOOKS.map((notebook) => (
            <motion.div
              key={notebook.id}
              className="snap-center shrink-0"
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenNotebook(notebook.id)}
            >
              <div 
                className="w-48 h-64 rounded-r-xl rounded-l-sm shadow-xl relative cursor-pointer flex flex-col justify-between p-4 transform transition-transform hover:shadow-2xl"
                style={{ backgroundColor: notebook.color }}
              >
                {/* Spine */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-sm" />
                
                {/* Pattern Overlay */}
                {notebook.coverPattern === 1 && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                )}
                {notebook.coverPattern === 2 && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
                )}

                <div className="ml-4 mt-4">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                    <Book className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-800/80 leading-tight">{notebook.title}</h3>
                </div>
                
                <div className="ml-4 text-xs font-mono text-stone-600/60">
                  {Object.keys(journalData[notebook.id] || {}).length} entries
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Spacer for end of list */}
          <div className="w-8 shrink-0" />
        </div>

        <div className="p-6 text-center text-stone-400 text-sm font-mono">
          Swipe to browse • Tap to open
        </div>
      </div>
    );
  }

  // --- Render Journal View ---
  return (
    <div className="h-full w-full bg-[#f5f5f5] flex flex-col relative overflow-hidden">
      {/* Header - Floating */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-50 pointer-events-none">
        <button onClick={handleBackToShelf} className="p-2 bg-white/50 backdrop-blur-md hover:bg-white/80 rounded-full transition-colors pointer-events-auto shadow-sm">
          <ArrowLeft className="w-6 h-6 text-stone-600" />
        </button>
        
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Collapse/Expand Button */}
          {!isToolbarCollapsed && (
             <div className="flex gap-2 bg-white/30 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-white/20">
              <button 
                onClick={toggleMode} 
                className={`p-2 rounded-full transition-colors ${currentEntry.mode === 'chat' ? 'bg-stone-800 text-white' : 'hover:bg-white/50 text-stone-600'}`}
                title={currentEntry.mode === 'chat' ? "Switch to Writing" : "Switch to Chat"}
              >
                {currentEntry.mode === 'chat' ? <PenTool className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowStickerDrawer(!showStickerDrawer)} 
                className={`p-2 rounded-full transition-colors ${showStickerDrawer ? 'bg-stone-100 text-stone-800' : 'hover:bg-white/50 text-stone-600'}`}
                title="Stickers"
              >
                <StickerIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowFrameDrawer(!showFrameDrawer)} 
                className={`p-2 rounded-full transition-colors ${showFrameDrawer ? 'bg-stone-100 text-stone-800' : 'hover:bg-white/50 text-stone-600'}`}
                title="Frames"
              >
                <Layout className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowLearningDrawer(!showLearningDrawer)} 
                className={`p-2 rounded-full transition-colors ${showLearningDrawer ? 'bg-stone-100 text-stone-800' : 'hover:bg-white/50 text-stone-600'}`}
                title="Vietnamese Learning"
              >
                <Book className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowNoteApp(!showNoteApp)} 
                className={`p-2 rounded-full transition-colors ${showNoteApp ? 'bg-stone-100 text-stone-800' : 'hover:bg-white/50 text-stone-600'}`}
                title="Notes & Keyboard"
              >
                <Keyboard className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-stone-100 text-stone-800' : 'hover:bg-white/50 text-stone-600'}`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-px bg-stone-300/50 mx-1" />
              <button 
                onClick={() => setIsToolbarCollapsed(true)}
                className="p-2 rounded-full hover:bg-white/50 text-stone-500"
                title="Hide Toolbar"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          )}

          {isToolbarCollapsed && (
            <button 
              onClick={() => setIsToolbarCollapsed(false)}
              className="p-2 bg-white/50 backdrop-blur-md hover:bg-white/80 rounded-full transition-colors shadow-sm text-stone-600"
              title="Show Toolbar"
            >
              <Maximize2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-16 right-4 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-50"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Font Style
                </span>
                <div className="flex bg-stone-100 rounded-lg p-1">
                  <button 
                    onClick={() => setFontFamily('serif')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${fontFamily === 'serif' ? 'bg-white shadow-sm text-stone-800 font-serif' : 'text-stone-500'}`}
                  >
                    Serif
                  </button>
                  <button 
                    onClick={() => setFontFamily('sans')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${fontFamily === 'sans' ? 'bg-white shadow-sm text-stone-800 font-sans' : 'text-stone-500'}`}
                  >
                    Sans
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Font Size ({fontSize}px)</span>
                <input 
                  type="range" 
                  min="12" 
                  max="32" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-24 accent-stone-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note App Overlay */}
      <NoteApp isOpen={showNoteApp} onClose={() => setShowNoteApp(false)} />

      {/* Sticker Drawer */}
      <AnimatePresence>
        {showStickerDrawer && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/50"
          >
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-700">Stickers</h3>
              <button onClick={() => setShowStickerDrawer(false)} className="p-1 hover:bg-stone-100 rounded-full">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            
            {/* Categories */}
            <div className="flex overflow-x-auto p-2 gap-2 no-scrollbar border-b border-stone-100">
              {STICKER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id 
                      ? 'bg-stone-800 text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeCategory === 'custom' ? (
                <div className="flex flex-col items-center gap-4">
                  <ImageUploader 
                    onImageSelect={handleCustomStickerUpload}
                    className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-sm text-stone-500 font-medium">Upload Photo</span>
                    <span className="text-xs text-stone-400 mt-1">Background will be removed</span>
                  </ImageUploader>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {customStickers.map(sticker => (
                      <div 
                        key={sticker.id} 
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => addSticker({ id: sticker.id, type: 'custom', customUrl: sticker.url })}
                      >
                        <div className="w-[100px] h-[100px] rounded-full bg-white shadow-sm border border-stone-100 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                          <img src={sticker.url} alt="Custom" className="w-full h-full object-contain p-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {ALL_STICKERS.filter(s => s.category === activeCategory).map(sticker => (
                    <div 
                      key={sticker.id} 
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => addSticker(sticker)}
                    >
                      <div className="w-[100px] h-[100px] rounded-full bg-white shadow-sm border border-stone-100 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                        <div className="w-[70px] h-[70px]">
                          <Sticker type={sticker.type} className="w-full h-full" />
                        </div>
                      </div>
                      <span className="mt-3 text-[13px] text-[#c7a7a7] font-medium text-center leading-tight">
                        {sticker.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame Drawer */}
      <AnimatePresence>
        {showFrameDrawer && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-[#fffcfc] shadow-2xl z-40 flex flex-col border-l border-[#f0e6e6]"
          >
            <div className="p-6 border-b border-[#f0e6e6] flex items-center justify-between bg-white/50 backdrop-blur-sm">
              <h3 className="font-serif text-xl font-bold text-[#8a7070]">Frames & Emojis</h3>
              <button onClick={() => setShowFrameDrawer(false)} className="p-2 hover:bg-[#f5ebeb] rounded-full text-[#b09595] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-4 gap-4 border-b border-[#f0e6e6] bg-white/30">
              <button
                onClick={() => setActiveFrameCategory('frames')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeFrameCategory === 'frames' ? 'text-[#8a7070]' : 'text-[#d4c5c5] hover:text-[#b09595]'
                }`}
              >
                Frames
                {activeFrameCategory === 'frames' && (
                  <motion.div layoutId="activeFrameTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8a7070]" />
                )}
              </button>
              <button
                onClick={() => setActiveFrameCategory('kaomoji')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeFrameCategory === 'kaomoji' ? 'text-[#8a7070]' : 'text-[#d4c5c5] hover:text-[#b09595]'
                }`}
              >
                Kaomoji & Symbols
                {activeFrameCategory === 'kaomoji' && (
                  <motion.div layoutId="activeFrameTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8a7070]" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeFrameCategory === 'frames' ? (
                <div className="grid grid-cols-1 gap-6">
                  {FRAME_TEMPLATES.map((frame, index) => (
                    <div 
                      key={index}
                      className="cursor-pointer group relative"
                      onClick={() => addFrame(frame)}
                    >
                      <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm group-hover:shadow-md transition-all group-hover:border-stone-200">
                        <pre className="font-mono text-xs text-stone-600 whitespace-pre-wrap overflow-hidden leading-tight">
                          {frame}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {KAOMOJIS.map((kaomoji, index) => (
                    <button
                      key={index}
                      onClick={() => addFrame(kaomoji)}
                      className="bg-white p-3 rounded-lg border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-stone-200 text-stone-700 font-medium text-sm text-center"
                    >
                      {kaomoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vietnamese Learning Drawer */}
      <VietnameseLearningPanel 
        isOpen={showLearningDrawer} 
        onClose={() => setShowLearningDrawer(false)} 
      />

      {/* Book Container - Full Screen */}
      <div className="w-full h-full perspective-1000">
        <div className="relative w-full h-full">
          {/* Navigation Buttons - Visible Chevrons */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-30 hover:bg-white text-stone-600 disabled:opacity-0 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-30 hover:bg-white text-stone-600 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Page Flip Animation */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{ 
                rotateY: direction === 1 ? -180 : 180, 
                opacity: 0,
                zIndex: 0
              }}
              animate={{ 
                rotateY: 0, 
                opacity: 1,
                zIndex: 1
              }}
              exit={{ 
                rotateY: direction === 1 ? 180 : -180, 
                opacity: 0,
                zIndex: 0
              }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="absolute inset-0 w-full h-full origin-left"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* The Page Itself - Full Screen */}
              <div 
                className="w-full h-full shadow-2xl overflow-hidden flex flex-col relative"
                style={{ 
                  backgroundColor: activeNotebook?.color || '#fff',
                }}
              >
                {/* Polka Dot Pattern Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Binding/Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-10" />

                {/* Page Content */}
                <div className="flex-1 pt-20 px-6 pb-8 pl-12 relative z-0 flex flex-col min-h-0">
                  <div className="flex justify-between items-start mb-6 border-b border-stone-400/20 pb-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-stone-500 font-bold mb-1">PAGE {currentPage + 1}</span>
                      <span className="font-serif text-lg text-stone-800 italic">{currentEntry.date}</span>
                    </div>
                    
                    {/* Avatar Uploader */}
                    <ImageUploader 
                      onImageSelect={updateAvatar}
                      className="relative group cursor-pointer z-40"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:bg-white/80 transition-colors">
                        {currentEntry.avatar ? (
                          <img src={currentEntry.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-stone-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <Settings className="w-3 h-3" />
                      </div>
                    </ImageUploader>
                  </div>

                  <div className="flex-1 relative flex flex-col min-h-0" onClick={() => setSelectedStickerId(null)}>
                    {/* Lined Paper Lines */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'linear-gradient(transparent 23px, #00000010 24px)',
                        backgroundSize: '100% 24px',
                        marginTop: '6px'
                      }}
                    />
                    
                    {/* Unified Content Editor */}
                    <div className="flex-1 relative z-10 min-h-0">
                      <ChatEditor 
                        blocks={currentEntry.content}
                        onChange={(blocks) => updateContent(blocks)}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        mode={currentEntry.mode || 'text'}
                        onBackgroundClick={() => setSelectedStickerId(null)}
                      >
                        {currentEntry.stickers?.map(sticker => (
                          <motion.div
                            key={sticker.id}
                            drag
                            dragMomentum={false}
                            onDragEnd={(_, info) => {
                              const newX = sticker.x + info.offset.x;
                              const newY = sticker.y + info.offset.y;
                              updateStickerPosition(sticker.id, newX, newY);
                            }}
                            onClick={(e) => { e.stopPropagation(); setSelectedStickerId(sticker.id); }}
                            initial={false}
                            animate={{ x: sticker.x, y: sticker.y, rotate: sticker.rotation, scale: sticker.scale }}
                            className={`absolute w-24 h-24 z-20 cursor-move ${selectedStickerId === sticker.id ? 'ring-2 ring-stone-400 rounded-full bg-white/20' : ''}`}
                            style={{ 
                              left: 0, 
                              top: 0,
                            }}
                          >
                             {selectedStickerId === sticker.id && (
                               <>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); deleteSticker(sticker.id); }}
                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-30 hover:bg-red-600"
                                 >
                                   <X className="w-3 h-3" />
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setSelectedStickerId(null); }}
                                   className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1 shadow-md z-30 hover:bg-green-600"
                                 >
                                   <Check className="w-3 h-3" />
                                 </button>
                               </>
                             )}
                             {sticker.type === 'custom' && sticker.customUrl ? (
                               <img src={sticker.customUrl} alt="Custom Sticker" className="w-full h-full object-contain drop-shadow-sm pointer-events-none" />
                             ) : (
                               <Sticker type={sticker.type} className="w-full h-full drop-shadow-sm pointer-events-none" />
                             )}
                          </motion.div>
                        ))}
                      </ChatEditor>
                    </div>
                  </div>
                </div>
                
                {/* Page Corner Fold Effect (Visual) */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
