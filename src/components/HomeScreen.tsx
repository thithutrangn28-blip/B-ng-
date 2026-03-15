import React, { useState, useEffect, useRef } from 'react';
import { BioHeader } from './BioHeader';
import { db } from '@/lib/db';
import { Plus, Trash2, Clock, Archive, Camera, Map as MapIcon, Github, Music2, Book, MessageCircle } from 'lucide-react';
import { CreateNotebookModal } from './CreateNotebookModal';
import { motion } from 'framer-motion';
import { ImageUploader } from './ImageUploader';
import { ControlCenter } from './ControlCenter';

interface HomeScreenProps {
  onOpenNotebook: (id: string) => void;
  onOpenMemoryKeeper: () => void;
  onOpenTikTokNotes: () => void;
  onOpenInstagramKeeper: () => void;
  onOpenMindmap: () => void;
  onOpenCodeAnalyst: () => void;
  onOpenGitKeeper: () => void;
  onOpenTikTokApp: () => void;
  onOpenJournalApp: () => void;
  onOpenMessageNoteApp: () => void;
  isEyeComfortEnabled?: boolean;
  toggleEyeComfort?: () => void;
}

export function HomeScreen({ onOpenNotebook, onOpenMemoryKeeper, onOpenTikTokNotes, onOpenInstagramKeeper, onOpenMindmap, onOpenCodeAnalyst, onOpenGitKeeper, onOpenTikTokApp, onOpenJournalApp, onOpenMessageNoteApp, isEyeComfortEnabled = false, toggleEyeComfort = () => {} }: HomeScreenProps) {

  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [homeBg, setHomeBg] = useState('');
  const [showControlCenter, setShowControlCenter] = useState(false);
  
  // Swipe Gesture State
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const [memoryKeeperSettings, setMemoryKeeperSettings] = useState<any>(null);
  const [instagramKeeperSettings, setInstagramKeeperSettings] = useState<any>(null);

  useEffect(() => {
    loadNotebooks();
    loadHomeSettings();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadNotebooks = async () => {
    const list = await db.getNotebooks();
    setNotebooks(list || []);
  };

  const loadHomeSettings = async () => {
    const user = await db.getUser();
    if (user) {
      if (user.homeBg) setHomeBg(user.homeBg);
      if (user.memoryKeeperSettings) setMemoryKeeperSettings(user.memoryKeeperSettings);
      if (user.instagramKeeperSettings) setInstagramKeeperSettings(user.instagramKeeperSettings);
    }
  };

  const saveHomeBg = async (url: string) => {
    setHomeBg(url);
    const user = await db.getUser() || { id: 'profile' };
    await db.updateUser({ ...user, homeBg: url });
  };

  const handleDeleteNotebook = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this journal?')) {
      await db.deleteNotebook(id);
      loadNotebooks();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    
    // Check if swipe started from top area (top 100px)
    if (touchStartY.current < 100) {
      const diffY = touchY - touchStartY.current;
      const diffX = Math.abs(touchX - touchStartX.current);
      
      // If swipe down is significant and vertical enough
      if (diffY > 50 && diffX < 30) {
        setShowControlCenter(true);
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-full overflow-y-auto bg-[#faf0f0] relative"
      style={{
        backgroundImage: homeBg ? `url(${homeBg})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <ControlCenter 
        isOpen={showControlCenter} 
        onClose={() => setShowControlCenter(false)}
        isEyeComfortEnabled={isEyeComfortEnabled}
        toggleEyeComfort={toggleEyeComfort}
      />
      
      {homeBg && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0" />}
      
      <div className="relative z-10 w-full">
        {/* Clock Section */}
        <div className="pt-8 pb-4 text-center">
          <div className="text-6xl font-thin tracking-tighter" style={{ color: '#faf2f0' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-sm font-medium uppercase tracking-widest mt-1" style={{ color: '#faf2f0', opacity: 0.8 }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <BioHeader />
        
        {/* Background Image Toggle/Upload (Hidden feature or subtle button) */}
        <div className="absolute top-4 right-4">
           <ImageUploader onImageSelect={saveHomeBg} className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-colors text-white">
              <Clock className="w-4 h-4" /> {/* Using Clock icon as a placeholder for settings/bg change */}
           </ImageUploader>
        </div>
      </div>
      
      <div className="relative z-10 flex-1 px-6 pb-20 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium font-serif" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>My Journals</h3>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md"
          >
            <Plus className="w-5 h-5" style={{ color: homeBg ? '#faf2f0' : '#292524' }} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Memory Keeper App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenMemoryKeeper}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div 
                className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center border border-white/50"
                style={{ 
                    backgroundColor: memoryKeeperSettings?.themeColor || '#f9ebe7',
                    backgroundImage: memoryKeeperSettings?.coverImage ? `url(${memoryKeeperSettings.coverImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
               {memoryKeeperSettings?.coverImage && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />}
               
               <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10 shadow-sm">
                  {memoryKeeperSettings?.avatar ? (
                      <img src={memoryKeeperSettings.avatar} className="w-full h-full rounded-full object-cover" />
                  ) : (
                      <Archive className="w-5 h-5 text-stone-700" />
                  )}
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>Keep Ghi Chú</h4>
            </div>
          </motion.div>

          {/* TikTok Notes App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenTikTokNotes}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div 
              className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center border border-white/50"
              style={{ backgroundColor: '#faf2f0' }}
            >
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center relative shadow-sm">
                 <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00f2ea] rounded-l-sm -z-10 opacity-80"></div>
                 <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#ff0050] rounded-r-sm -z-10 opacity-80"></div>
                 <div className="text-white font-bold text-lg italic font-serif">T</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>TikTok Notes</h4>
            </div>
          </motion.div>

          {/* Instagram Keeper App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenInstagramKeeper}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div 
                className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center border border-white/50"
                style={{ 
                    backgroundColor: instagramKeeperSettings?.themeColor || '#f9ebe7',
                    backgroundImage: instagramKeeperSettings?.coverImage ? `url(${instagramKeeperSettings.coverImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
               {instagramKeeperSettings?.coverImage && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />}
               
               <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10 shadow-sm p-[2px]">
                  <div className="w-full h-full bg-white/90 rounded-full flex items-center justify-center">
                    {instagramKeeperSettings?.avatar ? (
                        <img src={instagramKeeperSettings.avatar} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <Camera className="w-5 h-5 text-stone-700" />
                    )}
                  </div>
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>Keep Instagram</h4>
            </div>
          </motion.div>

          {/* Mindmap App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenMindmap}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div className="relative w-20 h-20 rounded-[2rem] shadow-lg overflow-hidden flex items-center justify-center border border-white/80 bg-gradient-to-br from-[#fff5f7] to-[#ffe4e8]">
               <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10 shadow-sm">
                  <MapIcon className="w-6 h-6 text-[#ff8fa3]" />
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>Sweet Mind</h4>
            </div>
          </motion.div>

          {/* Code Analyst App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCodeAnalyst}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div className="relative w-20 h-20 rounded-[2rem] shadow-lg overflow-hidden flex items-center justify-center border border-white/80 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
               <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10 shadow-sm">
                  <div className="text-stone-700 font-mono font-bold text-lg">{'</>'}</div>
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>Code Analyst</h4>
            </div>
          </motion.div>

          {/* GitKeeper App Icon */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenGitKeeper}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div className="relative w-20 h-20 rounded-[2rem] shadow-lg overflow-hidden flex items-center justify-center border border-white/80 bg-gradient-to-br from-[#FBEBF9] to-[#F9E0EA]">
               <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10 shadow-sm">
                  <Github className="w-6 h-6 text-[#9d4edd]" />
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>GitKeeper</h4>
            </div>
          </motion.div>

          {/* TikTok App Icon (New) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenTikTokApp}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div className="relative w-20 h-20 rounded-[2rem] shadow-lg overflow-hidden flex items-center justify-center border border-white/80 bg-black">
               <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center relative z-10 shadow-sm border border-white/20">
                  <Music2 className="w-6 h-6 text-white" />
                  <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00f2ea] rounded-l-sm -z-10 opacity-80 blur-[1px]"></div>
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#ff0050] rounded-r-sm -z-10 opacity-80 blur-[1px]"></div>
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>TikTok</h4>
            </div>
          </motion.div>

          {/* Journal App Icon (New) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenJournalApp}
            className="flex flex-col items-center cursor-pointer group relative"
          >
            <div className="relative w-20 h-20 rounded-[2rem] shadow-lg overflow-hidden flex items-center justify-center border border-white/80 bg-[#f5f5f5]">
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center relative z-10 shadow-sm border border-stone-100">
                  <Book className="w-6 h-6 text-stone-600" />
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
               </div>
            </div>
            <div className="mt-2 text-center">
              <h4 className="font-medium text-xs" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>Journal</h4>
            </div>
          </motion.div>

          {notebooks.map((nb) => (
            <motion.div
              key={nb.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenNotebook(nb.id)}
              className="flex flex-col cursor-pointer group relative"
            >
              <div 
                className="relative w-full aspect-[3/4] rounded-r-xl rounded-l-[4px] shadow-lg overflow-hidden border-l-4 border-stone-300/50 bg-white transform transition-transform origin-left hover:-rotate-y-12 perspective-1000"
                style={{ backgroundColor: nb.bgColor }}
              >
                {nb.cover && (
                  <img src={nb.cover} className="object-cover w-full h-full" />
                )}
                <div className="absolute inset-0 transition-opacity opacity-0 bg-black/10 group-hover:opacity-100" />
                
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteNotebook(e, nb.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3">
                <h4 className="font-medium truncate" style={{ color: homeBg ? '#faf2f0' : '#292524' }}>{nb.title}</h4>
                <p className="text-xs" style={{ color: homeBg ? '#faf2f0' : '#78716c', opacity: 0.8 }}>{new Date(nb.createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
          
          <button
            onClick={() => setShowCreateModal(true)}
            className={`flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border-2 border-dashed transition-colors ${homeBg ? 'border-white/30 text-white/50 hover:border-white/50 hover:text-white/80' : 'border-stone-300 text-stone-400 hover:border-stone-400 hover:text-stone-500'}`}
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm">New Journal</span>
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateNotebookModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={(id) => {
            setShowCreateModal(false);
            loadNotebooks();
            onOpenNotebook(id);
          }}
        />
      )}
    </div>
  );
}
