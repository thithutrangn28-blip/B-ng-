import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, Palette, Save, Trash2, ChevronLeft, Settings } from 'lucide-react';
import { CustomKeyboard } from './CustomKeyboard';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  theme: string;
}

const KEYBOARD_PALETTE = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7',
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

interface NoteAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoteApp: React.FC<NoteAppProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [keyboardTheme, setKeyboardTheme] = useState({
    backgroundColor: '#faf2f0',
    backgroundImage: '',
  });
  const [showSettings, setShowSettings] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('custom_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    const savedTheme = localStorage.getItem('keyboard_theme');
    if (savedTheme) {
      setKeyboardTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('custom_notes', JSON.stringify(notes));
  }, [notes]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('keyboard_theme', JSON.stringify(keyboardTheme));
  }, [keyboardTheme]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Ghi chú mới',
      content: '',
      date: new Date().toLocaleDateString('vi-VN'),
      theme: '#ffffff'
    };
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
  };

  const handleUpdateNote = (content: string) => {
    if (!currentNote) return;
    
    const updatedNote = { ...currentNote, content };
    setCurrentNote(updatedNote);
    
    setNotes(prev => prev.map(n => n.id === currentNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKeyboardTheme(prev => ({ ...prev, backgroundImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    if (!currentNote) return;
    handleUpdateNote(currentNote.content + key);
  };

  const handleDelete = () => {
    if (!currentNote) return;
    handleUpdateNote(currentNote.content.slice(0, -1));
  };

  const handleEnter = () => {
    if (!currentNote) return;
    handleUpdateNote(currentNote.content + '\n');
  };

  const handleSpace = () => {
    if (!currentNote) return;
    handleUpdateNote(currentNote.content + ' ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md bg-[#fdfbfb] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] relative">
            
            {/* Header */}
            <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between shadow-sm z-10">
              {currentNote ? (
                <button onClick={() => setCurrentNote(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6 text-stone-600" />
                </button>
              ) : (
                <h2 className="text-xl font-bold text-stone-800 ml-2">Ghi Chú</h2>
              )}
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-stone-100 text-stone-800' : 'text-stone-400 hover:bg-stone-50'}`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border-b border-stone-100 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase mb-2">Màu nền bàn phím</h4>
                      <div className="flex flex-wrap gap-2">
                        {KEYBOARD_PALETTE.map((color) => (
                          <button
                            key={color}
                            onClick={() => setKeyboardTheme({ backgroundColor: color, backgroundImage: '' })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              keyboardTheme.backgroundColor === color && !keyboardTheme.backgroundImage 
                                ? 'border-stone-800 scale-110' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase mb-2">Ảnh nền bàn phím</h4>
                      <label className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors border border-stone-200 border-dashed">
                        <ImageIcon className="w-5 h-5 text-stone-500" />
                        <span className="text-sm text-stone-600 font-medium">Chọn ảnh từ thư viện</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#faf9f9]">
              {currentNote ? (
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={currentNote.content}
                    onChange={(e) => handleUpdateNote(e.target.value)}
                    placeholder="Viết ghi chú..."
                    className="flex-1 w-full p-6 bg-transparent resize-none outline-none text-stone-800 text-lg leading-relaxed font-sans placeholder:text-stone-300"
                    autoFocus
                  />
                  
                  {/* Custom Keyboard Area */}
                  <div className="border-t border-stone-100 bg-white">
                    <div className="px-4 py-2 flex justify-between items-center text-xs text-stone-400 border-b border-stone-50">
                      <span>Tiếng Việt (QWERTY)</span>
                      <button onClick={() => setShowSettings(true)} className="hover:text-stone-600">
                        <Palette className="w-4 h-4" />
                      </button>
                    </div>
                    <CustomKeyboard
                      onKeyPress={handleKeyPress}
                      onDelete={handleDelete}
                      onEnter={handleEnter}
                      onSpace={handleSpace}
                      theme={keyboardTheme}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <button
                    onClick={handleCreateNote}
                    className="w-full p-4 bg-white rounded-2xl border border-stone-200 border-dashed flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 hover:border-stone-300 hover:bg-stone-50 transition-all group"
                  >
                    <div className="p-2 bg-stone-100 rounded-full group-hover:bg-stone-200 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Tạo ghi chú mới</span>
                  </button>

                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setCurrentNote(note)}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-stone-200 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                          className="p-2 hover:bg-red-50 text-stone-300 hover:text-red-500 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-stone-800 mb-1 line-clamp-1">
                        {note.content.split('\n')[0] || 'Ghi chú trống'}
                      </h3>
                      <p className="text-sm text-stone-500 line-clamp-2 mb-3 h-10">
                        {note.content.split('\n').slice(1).join(' ') || '...'}
                      </p>
                      <span className="text-xs text-stone-300 font-medium bg-stone-50 px-2 py-1 rounded-md">
                        {note.date}
                      </span>
                    </div>
                  ))}

                  {notes.length === 0 && (
                    <div className="text-center py-10 text-stone-300">
                      <p>Chưa có ghi chú nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
