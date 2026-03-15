import React from 'react';
import { Delete, ArrowUp, Globe, Mic, CornerDownLeft } from 'lucide-react';

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onSpace: () => void;
  theme: {
    backgroundColor: string;
    backgroundImage?: string;
    keyColor?: string;
    textColor?: string;
  };
}

const KEYS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ 
  onKeyPress, 
  onDelete, 
  onEnter, 
  onSpace,
  theme 
}) => {
  const [isShift, setIsShift] = React.useState(false);

  const handleKeyClick = (key: string) => {
    onKeyPress(isShift ? key.toUpperCase() : key);
    if (isShift) setIsShift(false);
  };

  return (
    <div 
      className="w-full p-2 pb-6 flex flex-col gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 bg-cover bg-center"
      style={{ 
        backgroundColor: theme.backgroundImage ? 'transparent' : theme.backgroundColor,
        backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
      }}
    >
      {/* Toolbar / Suggestions (Visual only for now) */}
      <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar opacity-80">
        {['xin chào', 'cảm ơn', 'bạn', 'có', 'không'].map((word, i) => (
          <button 
            key={i} 
            onClick={() => word.split('').forEach(char => onKeyPress(char))}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-sm font-medium whitespace-nowrap hover:bg-white/80 transition-colors shadow-sm"
          >
            {word}
          </button>
        ))}
      </div>

      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {rowIndex === 2 && (
            <button 
              onClick={() => setIsShift(!isShift)}
              className={`min-w-[40px] h-[45px] flex items-center justify-center rounded-lg shadow-sm transition-all active:scale-95 ${
                isShift ? 'bg-white text-stone-900' : 'bg-white/30 text-stone-700'
              }`}
            >
              <ArrowUp className={`w-5 h-5 ${isShift ? 'fill-current' : ''}`} />
            </button>
          )}
          
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className="flex-1 max-w-[40px] h-[45px] bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.2)] flex items-center justify-center text-xl font-medium text-stone-800 active:bg-stone-200 active:scale-95 transition-all"
            >
              {isShift ? key.toUpperCase() : key}
            </button>
          ))}

          {rowIndex === 2 && (
            <button 
              onClick={onDelete}
              className="min-w-[40px] h-[45px] bg-stone-200/50 rounded-lg shadow-sm flex items-center justify-center active:bg-stone-300 active:scale-95 transition-all"
            >
              <Delete className="w-5 h-5 text-stone-700" />
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-center gap-1.5 mt-1">
        <button className="w-[40px] h-[45px] bg-stone-200/50 rounded-lg flex items-center justify-center text-stone-700 font-bold text-sm">
          ?123
        </button>
        <button className="w-[40px] h-[45px] bg-stone-200/50 rounded-lg flex items-center justify-center text-stone-700">
          <Globe className="w-5 h-5" />
        </button>
        <button 
          onClick={onSpace}
          className="flex-1 h-[45px] bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.2)] active:bg-stone-200 active:scale-95 transition-all text-stone-400 text-xs flex items-center justify-center"
        >
          Tiếng Việt
        </button>
        <button className="w-[40px] h-[45px] bg-stone-200/50 rounded-lg flex items-center justify-center text-stone-700">
          .
        </button>
        <button 
          onClick={onEnter}
          className="w-[40px] h-[45px] bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-sm active:bg-blue-600 active:scale-95 transition-all"
        >
          <CornerDownLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
