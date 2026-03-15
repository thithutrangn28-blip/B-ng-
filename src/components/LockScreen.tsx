import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCK_SCREEN_BG } from '@/lib/constants';
import { Lock, Unlock } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState(false);
  const CORRECT_PASS = '1234';

  useEffect(() => {
    if (input.length === 4) {
      if (input === CORRECT_PASS) {
        setTimeout(onUnlock, 300);
      } else {
        setError(true);
        setTimeout(() => {
          setInput('');
          setError(false);
        }, 500);
      }
    }
  }, [input, onUnlock]);

  const handlePress = (num: string) => {
    if (input.length < 4) {
      setInput((prev) => prev + num);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between pb-20 text-white bg-black"
      style={{
        backgroundImage: `url(${LOCK_SCREEN_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      <div className="relative z-10 flex flex-col items-center w-full pt-24 space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Lock className="w-8 h-8 opacity-80" />
          <h2 className="text-xl font-light tracking-widest">ENTER PASSCODE</h2>
        </div>

        <div className="flex space-x-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border border-white transition-all duration-200 ${
                input.length > i ? 'bg-white' : 'bg-transparent'
              } ${error ? 'animate-shake border-red-500 bg-red-500' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-x-8 gap-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(num.toString())}
            className="flex items-center justify-center w-20 h-20 text-3xl font-light transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handlePress('0')}
          className="flex items-center justify-center w-20 h-20 text-3xl font-light transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:bg-white/30"
        >
          0
        </button>
        <div />
      </div>
    </motion.div>
  );
}
