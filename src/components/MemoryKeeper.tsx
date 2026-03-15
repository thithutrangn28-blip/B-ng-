import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Palette, Image as ImageIcon, User, Grid, List, Search, Settings, Check, Highlighter, X, Save, Trash2, Type, Plus } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageUploader } from './ImageUploader';
import TextareaAutosize from 'react-textarea-autosize';

const THEME_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const AVAILABLE_FONTS = [
  'Abel', 'Anton', 'Archivo', 'Arimo', 'Arvo', 'Asap', 'Assistant', 'Barlow', 'Bitter', 'Bree Serif', 
  'Cabin', 'Cairo', 'Catamaran', 'Cinzel', 'Copse', 'Courier Prime', 'Crimson Text', 'Cutive Mono', 
  'DM Sans', 'Dosis', 'EB Garamond', 'Exo 2', 'Fira Sans', 'Heebo', 'Hind', 'IBM Plex Sans', 
  'Inconsolata', 'Josefin Sans', 'Josefin Slab', 'Kanit', 'Karla', 'Lato', 'Libre Baskerville', 
  'Libre Franklin', 'Lora', 'Maven Pro', 'Merriweather', 'Merriweather Sans', 'Montserrat', 'Mukta', 
  'Muli', 'Noto Sans', 'Noto Serif', 'Nunito', 'Open Sans', 'Oswald', 'Oxygen', 'PT Sans', 'PT Serif', 
  'Playfair Display', 'Playfair Display SC', 'Poppins', 'Prompt', 'Questrial', 'Quicksand', 'Raleway', 
  'Rajdhani', 'Roboto', 'Roboto Mono', 'Roboto Slab', 'Rokkitt', 'Rubik', 'Share Tech Mono', 'Signika', 
  'Slabo 27px', 'Source Code Pro', 'Source Sans Pro', 'Space Mono', 'Teko', 'Titillium Web', 'Ubuntu', 
  'Varela Round', 'Work Sans', 'Zilla Slab'
].sort();

interface MemoryKeeperProps {
  onBack: () => void;
}

interface Note {
  id: string;
  content: string;
  htmlContent?: string;
  createdAt: string;
  notebookId: string;
  bgColor?: string;
  fontFamily?: string;
  fontSize?: number;
}

interface MemoryKeeperSettings {
  themeColor: string;
  backgroundImage?: string | null;
  coverImage: string | null;
  avatar: string | null;
}

export function MemoryKeeper({ onBack }: MemoryKeeperProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<MemoryKeeperSettings>({
    themeColor: THEME_COLORS[0],
    backgroundImage: null,
    coverImage: null,
    avatar: null,
  });
  
  // View State
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Tool State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTypographyPicker, setShowTypographyPicker] = useState(false);
  const [activeHighlightColor, setActiveHighlightColor] = useState(THEME_COLORS[2]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  
  // Detail View State
  const [detailContent, setDetailContent] = useState('');
  const [detailBgColor, setDetailBgColor] = useState('');
  const [detailFontFamily, setDetailFontFamily] = useState('Inter');
  const [detailFontSize, setDetailFontSize] = useState(18);
  const contentRef = useRef<HTMLDivElement>(null);

  // Set initial content once when selectedNote changes to avoid cursor jumping
  useEffect(() => {
    if (contentRef.current && selectedNote) {
      contentRef.current.innerHTML = selectedNote.htmlContent || selectedNote.content || '';
    }
  }, [selectedNote?.id]);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-save detail content when it changes
  useEffect(() => {
    if (selectedNote && (
        detailContent !== selectedNote.htmlContent || 
        detailBgColor !== selectedNote.bgColor ||
        detailFontFamily !== (selectedNote.fontFamily || 'Inter') ||
        detailFontSize !== (selectedNote.fontSize || 18)
    )) {
        const timer = setTimeout(() => {
            handleSaveNote();
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [detailContent, detailBgColor, detailFontFamily, detailFontSize]);

  const loadData = async () => {
    const allEntries = await db.getAllEntries();
    // Sort by date descending
    const sortedEntries = allEntries.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotes(sortedEntries);

    const user = await db.getUser();
    if (user && user.memoryKeeperSettings) {
      setSettings(user.memoryKeeperSettings);
    }
  };

  const updateSettings = async (newSettings: Partial<MemoryKeeperSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    const user = await db.getUser() || { id: 'profile' };
    await db.updateUser({ ...user, memoryKeeperSettings: updatedSettings });
  };

  const handleCreateNote = async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '',
      htmlContent: '',
      createdAt: new Date().toISOString(),
      notebookId: 'memory-keeper', // Or whatever default is appropriate
      bgColor: THEME_COLORS[0],
      fontFamily: 'Inter',
      fontSize: 18
    };
    
    await db.saveEntry(newNote);
    setNotes(prev => [newNote, ...prev]);
    handleNoteClick(newNote);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setDetailContent(note.htmlContent || note.content); // Fallback to content if htmlContent missing
    setDetailBgColor(note.bgColor || THEME_COLORS[0]);
    setDetailFontFamily(note.fontFamily || 'Inter');
    setDetailFontSize(note.fontSize || 18);
    setIsHighlightMode(false);
  };

  const handleBackToGrid = () => {
    handleSaveNote(); // Ensure save on exit
    setSelectedNote(null);
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    
    const updatedNote = {
        ...selectedNote,
        htmlContent: detailContent,
        bgColor: detailBgColor,
        fontFamily: detailFontFamily,
        fontSize: detailFontSize
    };

    // Update local state
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    
    // Update DB
    await db.saveEntry(updatedNote);
  };

  const handleDeleteNote = async (id: string) => {
      if (confirm('Are you sure you want to delete this memory?')) {
          await db.deleteEntry(id);
          setNotes(prev => prev.filter(n => n.id !== id));
          if (selectedNote?.id === id) setSelectedNote(null);
      }
  };

  const handleHighlightSelection = () => {
    if (!isHighlightMode) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check if selection is inside the content area
    if (!contentRef.current?.contains(selection.anchorNode)) return;

    // Use execCommand for better compatibility with rich text editing
    // 'hiliteColor' is the standard command for background color
    if (!document.queryCommandState('styleWithCSS')) {
        document.execCommand('styleWithCSS', false, 'true');
    }
    document.execCommand('hiliteColor', false, activeHighlightColor);
    
    // Update content state
    if (contentRef.current) {
        setDetailContent(contentRef.current.innerHTML);
    }
    
    selection.removeAllRanges();
  };

  // Handle "Touch on line" / Selection change
  useEffect(() => {
    const handleSelectionChange = () => {
        if (isHighlightMode && selectedNote) {
            // We can't easily detect "end of selection" reliably on all devices with just selectionchange
            // So we rely on mouseup/touchend on the container, but we can check if there IS a selection here
        }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isHighlightMode, selectedNote]);


  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- DETAIL VIEW ---
  if (selectedNote) {
    return (
        <div 
            className="h-full flex flex-col relative overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: detailBgColor }}
        >
            {/* Detail Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-white/40 backdrop-blur-md border-b border-white/20 z-50">
                <button onClick={handleBackToGrid} className="p-2 transition-colors rounded-full hover:bg-white/50">
                    <ArrowLeft className="w-6 h-6 text-stone-700" />
                </button>
                
                <div className="flex space-x-2">
                    {/* Background Color Picker */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowHighlightPicker(false); setShowColorPicker(!showColorPicker); }}
                            className={`p-2 rounded-full transition-colors ${showColorPicker ? 'bg-stone-800 text-white' : 'hover:bg-white/50 text-stone-600'}`}
                            title="Page Color"
                        >
                            <Palette className="w-5 h-5" />
                        </button>
                        {showColorPicker && (
                            <div className="absolute right-0 top-full mt-2 p-3 bg-white shadow-xl rounded-xl grid grid-cols-3 gap-2 w-48 z-50 border border-stone-100">
                                {THEME_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => { setDetailBgColor(c); setShowColorPicker(false); }}
                                        className="w-10 h-10 rounded-full border border-stone-200 hover:scale-110 transition-transform relative"
                                        style={{ backgroundColor: c }}
                                    >
                                        {detailBgColor === c && <Check className="w-4 h-4 text-stone-600 mx-auto" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Typography Settings */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowColorPicker(false); setShowHighlightPicker(false); setShowTypographyPicker(!showTypographyPicker); }}
                            className={`p-2 rounded-full transition-colors ${showTypographyPicker ? 'bg-stone-800 text-white' : 'hover:bg-white/50 text-stone-600'}`}
                            title="Typography"
                        >
                            <Type className="w-5 h-5" />
                        </button>
                        {showTypographyPicker && (
                            <div className="absolute right-0 top-full mt-2 p-4 bg-white shadow-xl rounded-xl w-72 z-50 border border-stone-100 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Typography</span>
                                    <button onClick={() => setShowTypographyPicker(false)}><X className="w-3 h-3 text-stone-400" /></button>
                                </div>
                                
                                {/* Font Size Slider */}
                                <div>
                                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                                        <span>Size</span>
                                        <span>{detailFontSize}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="12" 
                                        max="48" 
                                        value={detailFontSize} 
                                        onChange={(e) => setDetailFontSize(parseInt(e.target.value))}
                                        className="w-full accent-stone-800 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Font Family Dropdown */}
                                <div>
                                    <div className="text-xs text-stone-500 mb-1">Font Family</div>
                                    <select 
                                        value={detailFontFamily}
                                        onChange={(e) => setDetailFontFamily(e.target.value)}
                                        className="w-full p-2 text-sm border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none max-h-40"
                                        style={{ fontFamily: detailFontFamily }}
                                    >
                                        <option value="Inter">Default (Inter)</option>
                                        {AVAILABLE_FONTS.map(font => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>
                                                {font}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Highlighter Tool */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowColorPicker(false); setShowTypographyPicker(false); setShowHighlightPicker(!showHighlightPicker); }}
                            className={`p-2 rounded-full transition-colors ${isHighlightMode ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'hover:bg-white/50 text-stone-600'}`}
                            title="Highlighter"
                        >
                            <Highlighter className="w-5 h-5" />
                        </button>
                        {showHighlightPicker && (
                            <div className="absolute right-0 top-full mt-2 p-4 bg-white shadow-xl rounded-xl w-64 z-50 border border-stone-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Highlighter Color</span>
                                    <button onClick={() => setShowHighlightPicker(false)}><X className="w-3 h-3 text-stone-400" /></button>
                                </div>
                                <div className="grid grid-cols-5 gap-2 mb-4">
                                    {THEME_COLORS.map(c => (
                                        <button 
                                            key={c} 
                                            onClick={() => { setActiveHighlightColor(c); setIsHighlightMode(true); }}
                                            className={`w-8 h-8 rounded-full border transition-transform hover:scale-110 ${activeHighlightColor === c ? 'ring-2 ring-offset-1 ring-stone-800 border-transparent' : 'border-stone-200'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                                    <span className="text-xs text-stone-500">Highlight Mode</span>
                                    <button 
                                        onClick={() => setIsHighlightMode(!isHighlightMode)}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${isHighlightMode ? 'bg-green-500' : 'bg-stone-300'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isHighlightMode ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-stone-400 mt-2 text-center">
                                    {isHighlightMode ? "Select text to highlight automatically" : "Turn on to highlight"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Delete Button */}
                    <button 
                        onClick={() => handleDeleteNote(selectedNote.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors"
                        title="Delete Memory"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm min-h-[80vh] p-8 rounded-2xl shadow-sm border border-white/40">
                    <div className="text-xs text-stone-400 mb-6 font-medium uppercase tracking-wider text-center">
                        {new Date(selectedNote.createdAt).toLocaleDateString()} • {new Date(selectedNote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    <div
                        ref={contentRef}
                        className="prose prose-stone max-w-none focus:outline-none leading-relaxed"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setDetailContent(e.currentTarget.innerHTML)}
                        onMouseUp={handleHighlightSelection}
                        onTouchEnd={handleHighlightSelection}
                        style={{ 
                            minHeight: '60vh',
                            fontFamily: detailFontFamily,
                            fontSize: `${detailFontSize}px`
                        }}
                    />
                </div>
            </div>
        </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div 
      className="h-full flex flex-col relative overflow-hidden transition-colors duration-500"
      style={{ 
        backgroundColor: !settings.backgroundImage ? settings.themeColor : undefined,
        backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {settings.backgroundImage && <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />}

      {/* Header / Cover Area */}
      <div className="relative shrink-0 z-10">
        <div className="h-48 md:h-64 relative group">
          {settings.coverImage ? (
            <img src={settings.coverImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/20">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ImageUploader onImageSelect={(url) => updateSettings({ coverImage: url })} className="cursor-pointer">
              <button className="bg-white/90 text-black px-4 py-2 rounded-full shadow-lg text-sm font-medium backdrop-blur-sm hover:bg-white transition-colors">
                Change Cover
              </button>
            </ImageUploader>
          </div>

          {/* Back Button */}
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-stone-800 transition-colors z-20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

           {/* App Background Settings */}
           <div className="absolute top-4 right-4 z-20">
             <div className="relative">
                <button 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full text-stone-800 transition-colors shadow-sm border border-white/20"
                    title="App Settings"
                >
                    <Settings className="w-6 h-6" />
                </button>
                {showColorPicker && (
                    <div className="absolute right-0 top-full mt-2 p-4 bg-white shadow-2xl rounded-2xl w-72 z-50 border border-stone-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">App Appearance</span>
                            <button onClick={() => setShowColorPicker(false)}><X className="w-4 h-4 text-stone-400" /></button>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3 mb-5">
                            {THEME_COLORS.map(c => (
                            <button 
                                key={c} 
                                onClick={() => { updateSettings({ themeColor: c, backgroundImage: null }); }}
                                className={`w-10 h-10 rounded-full border transition-transform hover:scale-110 ${settings.themeColor === c && !settings.backgroundImage ? 'ring-2 ring-offset-2 ring-stone-800 border-transparent' : 'border-stone-200'}`}
                                style={{ backgroundColor: c }}
                            />
                            ))}
                        </div>
                        
                        <div className="border-t border-stone-100 pt-4">
                            <ImageUploader onImageSelect={(img) => { updateSettings({ backgroundImage: img }); setShowColorPicker(false); }} className="w-full py-3 text-sm font-medium text-center border-2 border-dashed rounded-xl border-stone-200 hover:border-stone-400 hover:bg-stone-50 cursor-pointer text-stone-500 transition-colors">
                                Upload Background Image
                            </ImageUploader>
                        </div>
                    </div>
                )}
             </div>
           </div>
        </div>

        {/* Avatar & Title */}
        <div className="absolute -bottom-10 left-8 flex items-end space-x-4 z-10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-stone-200">
              {settings.avatar ? (
                <img src={settings.avatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity cursor-pointer">
              <ImageUploader onImageSelect={(url) => updateSettings({ avatar: url })} className="w-full h-full absolute inset-0" />
            </div>
          </div>
          <div className="pb-12">
            <h1 className="text-2xl font-serif font-bold text-stone-800 drop-shadow-sm">Memory Keeper</h1>
            <p className="text-sm text-stone-600 font-medium opacity-80">{notes.length} memories collected</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-12 px-6 pb-4 flex items-center justify-between gap-4 relative z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search memories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-stone-400/20 placeholder-stone-400 text-stone-700 transition-all backdrop-blur-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCreateNote}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white transition-colors shadow-sm"
            title="New Memory"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-600 transition-colors backdrop-blur-sm"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar relative z-10">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <p>No memories found.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layoutId={`note-${note.id}`}
                onClick={() => handleNoteClick(note)}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-white/50 flex flex-col cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: note.bgColor ? note.bgColor : 'rgba(255,255,255,0.8)' }}
              >
                <div className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wider flex justify-between">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-stone-800 leading-relaxed whitespace-pre-wrap line-clamp-[10] pointer-events-none" style={{ fontFamily: note.fontFamily || 'Inter', fontSize: note.fontSize ? `${note.fontSize}px` : '18px' }} dangerouslySetInnerHTML={{ __html: note.htmlContent || note.content }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
