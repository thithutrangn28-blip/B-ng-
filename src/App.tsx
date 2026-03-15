/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LockScreen } from '@/components/LockScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { NotebookEditor } from '@/components/NotebookEditor';
import { MemoryKeeper } from '@/components/MemoryKeeper';
import { TikTokNotes } from '@/components/TikTokNotes';
import { InstagramKeeper } from '@/components/InstagramKeeper';
import { MindmapApp } from '@/components/MindmapApp';
import { CodeAnalystApp } from '@/components/CodeAnalystApp';
import { GitKeeperApp } from '@/components/GitKeeperApp';
import { TikTokApp } from '@/components/TikTokApp';
import { JournalApp } from '@/components/JournalApp';
import { MessageNoteApp } from '@/components/MessageNoteApp';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'editor' | 'memory-keeper' | 'tiktok-notes' | 'instagram-keeper' | 'mindmap' | 'code-analyst' | 'git-keeper' | 'tiktok-app' | 'journal-app' | 'message-note-app'>('home');
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isEyeComfortEnabled, setIsEyeComfortEnabled] = useState(false);

  const handleOpenNotebook = (id: string) => {
    setActiveNotebookId(id);
    setCurrentView('editor');
  };

  const handleOpenMemoryKeeper = () => {
    setCurrentView('memory-keeper');
  };

  const handleOpenTikTokNotes = () => {
    setCurrentView('tiktok-notes');
  };

  const handleOpenInstagramKeeper = () => {
    setCurrentView('instagram-keeper');
  };

  const handleOpenMindmap = () => {
    setCurrentView('mindmap');
  };

  const handleOpenCodeAnalyst = () => {
    setCurrentView('code-analyst');
  };

  const handleOpenGitKeeper = () => {
    setCurrentView('git-keeper');
  };

  const handleOpenTikTokApp = () => {
    setCurrentView('tiktok-app');
  };

  const handleOpenJournalApp = () => {
    setCurrentView('journal-app');
  };

  const handleOpenMessageNoteApp = () => {
    setCurrentView('message-note-app');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setActiveNotebookId(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fdf2f2]">
      {/* Eye Comfort Overlay */}
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-500 mix-blend-multiply"
        style={{ 
          backgroundColor: isEyeComfortEnabled ? '#f5e6d3' : 'transparent',
          opacity: isEyeComfortEnabled ? 0.3 : 0 
        }}
      />

      {/* iPhone Frame Simulation (Optional, but helps visualize the "phone" aspect on desktop) */}
      <div className="w-full h-full mx-auto bg-[#faf0f0] sm:max-w-[390px] sm:h-[844px] sm:rounded-[40px] sm:my-8 sm:border-[8px] sm:border-stone-900 overflow-hidden relative shadow-2xl">
        <AnimatePresence mode="wait">
          {isLocked && (
            <LockScreen key="lock" onUnlock={() => setIsLocked(false)} />
          )}
          
          {!isLocked && currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <HomeScreen 
                onOpenNotebook={handleOpenNotebook} 
                onOpenMemoryKeeper={handleOpenMemoryKeeper}
                onOpenTikTokNotes={handleOpenTikTokNotes}
                onOpenInstagramKeeper={handleOpenInstagramKeeper}
                onOpenMindmap={handleOpenMindmap}
                onOpenCodeAnalyst={handleOpenCodeAnalyst}
                onOpenGitKeeper={handleOpenGitKeeper}
                onOpenTikTokApp={handleOpenTikTokApp}
                onOpenJournalApp={handleOpenJournalApp}
                onOpenMessageNoteApp={handleOpenMessageNoteApp}
                isEyeComfortEnabled={isEyeComfortEnabled}
                toggleEyeComfort={() => setIsEyeComfortEnabled(!isEyeComfortEnabled)}
              />
            </motion.div>
          )}

          {!isLocked && currentView === 'editor' && activeNotebookId && (
            <motion.div
              key="editor"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <NotebookEditor 
                notebookId={activeNotebookId} 
                onBack={handleBackToHome}
                onOpenMemoryKeeper={handleOpenMemoryKeeper}
              />
            </motion.div>
          )}

          {!isLocked && currentView === 'memory-keeper' && (
            <motion.div
              key="memory-keeper"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <MemoryKeeper onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'tiktok-notes' && (
            <motion.div
              key="tiktok-notes"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <TikTokNotes onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'instagram-keeper' && (
            <motion.div
              key="instagram-keeper"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <InstagramKeeper onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'mindmap' && (
            <motion.div
              key="mindmap"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <MindmapApp onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'code-analyst' && (
            <motion.div
              key="code-analyst"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <CodeAnalystApp onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'git-keeper' && (
            <motion.div
              key="git-keeper"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#faf0f0]"
            >
              <GitKeeperApp onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'tiktok-app' && (
            <motion.div
              key="tiktok-app"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-black"
            >
              <TikTokApp onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'journal-app' && (
            <motion.div
              key="journal-app"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#f5f5f5]"
            >
              <JournalApp onBack={handleBackToHome} />
            </motion.div>
          )}

          {!isLocked && currentView === 'message-note-app' && (
            <motion.div
              key="message-note-app"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-20 h-full bg-[#fdfbfb]"
            >
              <MessageNoteApp onBack={handleBackToHome} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Indicator - Clickable to go Home */}
        <div 
          onClick={handleBackToHome}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-stone-900/20 rounded-full z-[100] cursor-pointer hover:bg-stone-900/40 transition-colors active:scale-95" 
        />
      </div>
    </div>
  );
}
