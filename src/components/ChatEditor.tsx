import React, { useState, useEffect, useRef } from 'react';
import { Trash2, MessageCircle, AlignLeft, User, Plus, X, Palette, PenTool } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const CHAT_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7',
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

export interface ChatBlock {
  id: string;
  type: 'narration' | 'message' | 'standard';
  sender?: 'me' | 'other';
  text: string;
  color?: string;
  fontFamily?: 'serif' | 'sans' | 'mono';
}

interface ChatEditorProps {
  blocks: ChatBlock[];
  onChange: (blocks: ChatBlock[]) => void;
  fontFamily: 'serif' | 'sans' | 'mono';
  fontSize: number;
  mode: 'chat' | 'text';
  children?: React.ReactNode;
  onBackgroundClick?: () => void;
}

export const ChatEditor: React.FC<ChatEditorProps> = ({ blocks, onChange, fontFamily, fontSize, mode, children, onBackgroundClick }) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when blocks change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [blocks.length]);

  const addBlock = (type: 'narration' | 'message' | 'standard', sender: 'me' | 'other' = 'me') => {
    const newBlock: ChatBlock = {
      id: Date.now().toString(),
      type,
      sender,
      text: '',
      color: type === 'message' ? CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)] : undefined
    };
    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ChatBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  // In Text Mode, automatically add a standard block if empty or if the last block isn't standard
  useEffect(() => {
    if (mode === 'text') {
      const lastBlock = blocks[blocks.length - 1];
      if (!lastBlock || lastBlock.type !== 'standard') {
        // addBlock('standard'); // This causes infinite loop if not careful.
        // Better to let user click to add, or just render a placeholder.
      }
    }
  }, [mode]);

  return (
    <div className="flex flex-col h-full relative">
      <div 
        className="flex-1 overflow-y-auto overscroll-contain" 
        ref={scrollRef} 
        onClick={(e) => { 
          e.stopPropagation(); 
          setActiveBlockId(null); 
          onBackgroundClick?.();
        }}
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="relative min-h-full p-4 space-y-4 pb-24">
          {children}
          {blocks.map(block => (
            <div 
              key={block.id} 
              className={`flex group ${
                block.type === 'message' 
                  ? (block.sender === 'me' ? 'justify-end' : 'justify-start') 
                  : 'justify-center'
              }`}
              onClick={(e) => { e.stopPropagation(); setActiveBlockId(block.id); }}
            >
              <div className={`relative ${
                block.type === 'message' ? 'max-w-[80%]' : 'w-full'
              }`}>
                
                {/* Controls for Active Block */}
                {activeBlockId === block.id && (
                  <div className={`absolute -top-8 ${block.sender === 'me' ? 'right-0' : 'left-0'} flex items-center gap-1 bg-white/90 shadow-sm rounded-full px-2 py-1 z-10`}>
                    {block.type === 'message' && (
                      <div className="flex gap-1 mr-2">
                        {CHAT_COLORS.slice(0, 5).map(c => (
                          <button
                            key={c}
                            className="w-4 h-4 rounded-full border border-stone-200"
                            style={{ backgroundColor: c }}
                            onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { color: c }); }}
                          />
                        ))}
                      </div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-1 hover:bg-red-50 rounded-full text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {block.type === 'narration' && (
                  <TextareaAutosize
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    placeholder="Write narration..."
                    className={`w-full bg-transparent text-center text-stone-500 italic outline-none resize-none ${
                      (block.fontFamily || fontFamily) === 'serif' ? 'font-serif' : 
                      (block.fontFamily || fontFamily) === 'mono' ? 'font-mono' : 'font-sans'
                    }`}
                    style={{ fontSize: `${fontSize * 0.9}px` }}
                  />
                )}

                {block.type === 'standard' && (
                  <TextareaAutosize
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    placeholder="Start writing..."
                    className={`w-full bg-transparent text-stone-800 outline-none resize-none leading-relaxed ${
                      (block.fontFamily || fontFamily) === 'serif' ? 'font-serif' : 
                      (block.fontFamily || fontFamily) === 'mono' ? 'font-mono' : 'font-sans'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  />
                )}

                {block.type === 'message' && (
                  <div 
                    className={`p-3 rounded-2xl shadow-sm border border-black/5 min-w-[60px] ${
                      block.sender === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={{ backgroundColor: block.color || '#fff' }}
                  >
                    <TextareaAutosize
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="..."
                      className={`w-full bg-transparent outline-none resize-none text-stone-800 ${
                        (block.fontFamily || fontFamily) === 'serif' ? 'font-serif' : 
                        (block.fontFamily || fontFamily) === 'mono' ? 'font-mono' : 'font-sans'
                      }`}
                      style={{ fontSize: `${fontSize}px` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {blocks.length === 0 && (
            <div className="text-center text-stone-400 mt-10 font-mono text-sm">
              {mode === 'chat' ? 'Start your chat story...' : 'Start writing...'}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-stone-100 p-2 flex justify-around items-center z-20">
        {mode === 'chat' ? (
          <>
            <button 
              onClick={() => addBlock('message', 'other')}
              className="flex flex-col items-center gap-1 p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-600"
            >
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold">THEM</span>
            </button>

            <button 
              onClick={() => addBlock('narration')}
              className="flex flex-col items-center gap-1 p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-600"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center">
                <AlignLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold">NARRATE</span>
            </button>

            <button 
              onClick={() => addBlock('message', 'me')}
              className="flex flex-col items-center gap-1 p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-600"
            >
              <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold">ME</span>
            </button>
          </>
        ) : (
          <button 
            onClick={() => addBlock('standard')}
            className="flex items-center gap-2 px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition-colors"
          >
            <PenTool className="w-4 h-4" />
            <span className="text-sm font-bold">Add New Paragraph</span>
          </button>
        )}
      </div>
    </div>
  );
};
