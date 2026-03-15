import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Settings, Palette, Search, MoreVertical, Paperclip, Pin, Circle } from 'lucide-react';
import { CustomKeyboard } from './CustomKeyboard';

// --- Constants & Types ---

const MESSAGE_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7'
];

const TEMPLATE_COLORS = [
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const PATTERNS = [
  'solid', 'dots', 'grid', 'binder', 'pin', 'washi'
];

interface MessageNote {
  id: string;
  content: string;
  date: string;
  color: string;
  templateId: string; // ID referencing the style/pattern
}

interface MessageNoteAppProps {
  onBack: () => void;
}

export const MessageNoteApp: React.FC<MessageNoteAppProps> = ({ onBack }) => {
  const [notes, setNotes] = useState<MessageNote[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState(MESSAGE_COLORS[0]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTheme, setKeyboardTheme] = useState({ backgroundColor: '#faf2f0' });

  // Load notes
  useEffect(() => {
    const saved = localStorage.getItem('message_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem('message_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newNote: MessageNote = {
      id: Date.now().toString(),
      content: inputText,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: selectedColor,
      templateId: `tpl-${Math.floor(Math.random() * 300)}` // Simulate 300+ templates
    };

    setNotes([...notes, newNote]);
    setInputText('');
  };

  // Keyboard handlers
  const handleKeyPress = (key: string) => setInputText(prev => prev + key);
  const handleDelete = () => setInputText(prev => prev.slice(0, -1));
  const handleEnter = () => {
    setInputText(prev => prev + '\n');
    // Optional: Auto-send on enter? Maybe not for multi-line notes.
  };
  const handleSpace = () => setInputText(prev => prev + ' ');

  return (
    <div className="flex flex-col h-full bg-[#fdfbfb] relative overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-md border-b border-stone-100 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-stone-800">My Notes</h1>
            <span className="text-xs text-stone-400">{notes.length} messages</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#faf9f9]">
        {notes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-stone-300 space-y-4">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center">
              <Paperclip className="w-10 h-10 opacity-50" />
            </div>
            <p>No notes yet. Start typing!</p>
          </div>
        )}

        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-end"
          >
            <div 
              className="max-w-[85%] relative group"
              style={{ 
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.05))'
              }}
            >
              {/* Template Decoration (Simulated based on templateId) */}
              {/* Pin Effect */}
              {note.templateId.includes('1') && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm border border-white/50" />
                </div>
              )}
              
              {/* Binder Ring Effect */}
              {note.templateId.includes('2') && (
                <div className="absolute -left-3 top-4 flex flex-col gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-stone-300 bg-white" />
                  <div className="w-4 h-4 rounded-full border-2 border-stone-300 bg-white" />
                </div>
              )}

              <div 
                className={`p-4 rounded-2xl rounded-tr-sm text-stone-800 relative overflow-hidden ${note.templateId.includes('2') ? 'ml-2' : ''}`}
                style={{ 
                  backgroundColor: note.color,
                  backgroundImage: note.templateId.includes('3') ? 'radial-gradient(#00000010 1px, transparent 1px)' : 'none', // Polka dot simulation
                  backgroundSize: '10px 10px'
                }}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{note.content}</p>
                
                {/* Timestamp */}
                <div className="mt-2 flex justify-end items-center gap-1 opacity-50">
                   <span className="text-[10px] font-medium">{note.date}</span>
                   {/* Double check icon */}
                   <div className="flex -space-x-1">
                     <div className="w-1.5 h-3 border-r border-b border-stone-600 rotate-45 transform origin-center" />
                     <div className="w-1.5 h-3 border-r border-b border-stone-600 rotate-45 transform origin-center" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-stone-100 p-2 pb-safe">
        {/* Color Selector */}
        <div className="flex gap-2 px-2 pb-2 overflow-x-auto no-scrollbar">
          {MESSAGE_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? 'border-stone-400 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="w-px h-6 bg-stone-200 mx-1" />
           {TEMPLATE_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)} // Simplified: Template colors also selectable as note colors
              className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? 'border-stone-400 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex items-end gap-2 p-2 bg-stone-50 rounded-2xl">
          <button 
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-2 rounded-full transition-colors ${showKeyboard ? 'bg-stone-200 text-stone-800' : 'text-stone-400 hover:bg-stone-200'}`}
          >
            <Palette className="w-5 h-5" />
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a note..."
            className="flex-1 bg-transparent border-none outline-none resize-none py-2 max-h-32 text-stone-800 placeholder:text-stone-400"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2 bg-stone-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-90" /> {/* Send Icon */}
          </button>
        </div>

        {/* Custom Keyboard (Collapsible) */}
        <AnimatePresence>
          {showKeyboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CustomKeyboard
                onKeyPress={handleKeyPress}
                onDelete={handleDelete}
                onEnter={handleEnter}
                onSpace={handleSpace}
                theme={keyboardTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
