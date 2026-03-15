import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Plus, MoreHorizontal, Music2 } from 'lucide-react';
import { db } from '@/lib/db';

interface TikTokNotesProps {
  onBack: () => void;
}

const NOTE_COLORS = [
  '#faf2f0',
  '#f9ebe7',
  '#f9e5df',
  '#faf0f0',
  '#f9e7e7',
  '#f9dfdf',
  '#faf0f2',
  '#f9e7eb',
  '#f9dfe5'
];

export function TikTokNotes({ onBack }: TikTokNotesProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [noteContent, setNoteContent] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const [userProfile, setUserProfile] = useState<any>({
    username: 'user_123456',
    handle: '@my_notes',
    following: 12,
    followers: 128,
    likes: 324,
    bio: 'Just writing my thoughts on paper ✨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    loadPosts();
    loadProfile();
  }, []);

  const loadPosts = async () => {
    const allEntries = await db.getAllEntries();
    const tiktokPosts = allEntries.filter((e: any) => e.notebookId === 'tiktok-notes');
    // Sort by date desc
    tiktokPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setPosts(tiktokPosts);
  };

  const loadProfile = async () => {
    const user = await db.getUser();
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        username: user.name || prev.username,
        avatar: user.avatar || prev.avatar
      }));
    }
  };

  const handleSavePost = async () => {
    if (!noteContent.trim()) return;

    const postToSave = {
      id: editingPostId || crypto.randomUUID(),
      notebookId: 'tiktok-notes',
      content: noteContent,
      bgColor: selectedColor,
      createdAt: editingPostId ? posts.find(p => p.id === editingPostId)?.createdAt : new Date().toISOString(),
      likes: editingPostId ? posts.find(p => p.id === editingPostId)?.likes : 0,
      comments: editingPostId ? posts.find(p => p.id === editingPostId)?.comments : 0
    };

    await db.saveEntry(postToSave);
    setNoteContent('');
    setShowEditor(false);
    setEditingPostId(null);
    setIsMinimized(false);
    loadPosts();
  };

  const openEditorForPost = (post: any) => {
    setEditingPostId(post.id);
    setNoteContent(post.content);
    setSelectedColor(post.bgColor || NOTE_COLORS[0]);
    setShowEditor(true);
    setIsMinimized(false);
  };

  const handleCreateNew = () => {
    setEditingPostId(null);
    setNoteContent('');
    setSelectedColor(NOTE_COLORS[0]);
    setShowEditor(true);
    setIsMinimized(false);
  };

  const handleDeletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      await db.deleteEntry(id);
      loadPosts();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-stone-100">
          <ArrowLeft className="w-6 h-6 text-stone-800" />
        </button>
        <div className="font-bold text-lg">{userProfile.username}</div>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-100">
          <MoreHorizontal className="w-6 h-6 text-stone-800" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-100 p-1">
              <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover bg-stone-50" />
            </div>
            <div className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full border-2 border-white">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-stone-900">{userProfile.handle}</h2>
          
          <div className="flex items-center gap-6 mt-4 mb-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-stone-900">{userProfile.following}</span>
              <span className="text-xs text-stone-500">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-stone-900">{userProfile.followers}</span>
              <span className="text-xs text-stone-500">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-stone-900">{userProfile.likes}</span>
              <span className="text-xs text-stone-500">Likes</span>
            </div>
          </div>

          <div className="px-8 text-center mb-4">
            <p className="text-sm text-stone-700 whitespace-pre-wrap">{userProfile.bio}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="px-8 py-2 bg-[#ff0050] text-white font-medium rounded-sm text-sm">
              Edit profile
            </button>
            <button className="p-2 border border-stone-200 rounded-sm">
              <Share2 className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 sticky top-0 bg-white z-10">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-center relative transition-colors ${activeTab === 'posts' ? 'text-stone-900 font-bold' : 'text-stone-400'}`}
            style={{ backgroundColor: activeTab === 'posts' ? '#f9ebe7' : 'transparent' }}
          >
            <span>Posts</span>
            {activeTab === 'posts' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 w-1/2 mx-auto" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 text-center relative transition-colors ${activeTab === 'likes' ? 'text-stone-900 font-bold' : 'text-stone-400'}`}
            style={{ backgroundColor: activeTab === 'likes' ? '#f9ebe7' : 'transparent' }}
          >
            <span>Likes</span>
            {activeTab === 'likes' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 w-1/2 mx-auto" />
            )}
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-3 gap-0.5 bg-white">
          {activeTab === 'posts' && posts.map((post) => (
            <motion.div 
              key={post.id}
              layoutId={`post-${post.id}`}
              className="aspect-[3/4] relative group cursor-pointer overflow-hidden"
              style={{ backgroundColor: post.bgColor }}
              onClick={() => openEditorForPost(post)}
            >
              <div className="absolute inset-0 p-3 flex flex-col">
                <p className="text-[10px] line-clamp-6 font-handwriting text-stone-800 leading-tight">
                  {post.content}
                </p>
              </div>
              <div className="absolute bottom-1 left-2 flex items-center gap-1 text-stone-600">
                 <Heart className="w-3 h-3" />
                 <span className="text-[10px] font-medium">{post.likes || 0}</span>
              </div>
              
              {/* Delete overlay */}
              <button 
                onClick={(e) => handleDeletePost(post.id, e)}
                className="absolute top-1 right-1 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-3 h-3 text-red-500">×</div>
              </button>
            </motion.div>
          ))}
          
          {activeTab === 'posts' && posts.length === 0 && (
            <div className="col-span-3 py-12 text-center text-stone-400">
              <p className="text-sm">No posts yet</p>
              <p className="text-xs mt-1">Tap + to create your first note</p>
            </div>
          )}

          {activeTab === 'likes' && (
             <div className="col-span-3 py-12 text-center text-stone-400">
               <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
               <p className="text-sm">Posts you liked will appear here</p>
             </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!showEditor && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <button 
            onClick={handleCreateNew}
            className="w-12 h-8 bg-black rounded-lg flex items-center justify-center pointer-events-auto shadow-lg active:scale-95 transition-transform"
          >
            <div className="w-8 h-6 bg-white rounded flex items-center justify-center relative">
               <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00f2ea] rounded-l-sm -z-10"></div>
               <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#ff0050] rounded-r-sm -z-10"></div>
               <Plus className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>
      )}

      {/* Editor Overlay */}
      <AnimatePresence>
        {showEditor && !isMinimized && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <button onClick={() => { setShowEditor(false); setEditingPostId(null); }} className="text-stone-500 font-medium">Cancel</button>
              <div className="font-bold">{editingPostId ? 'Edit Note' : 'New Note'}</div>
              <div className="flex items-center gap-2">
                {editingPostId && (
                  <button 
                    onClick={(e) => {
                      handleDeletePost(editingPostId, e as any);
                      setShowEditor(false);
                      setEditingPostId(null);
                    }}
                    className="p-2 rounded-full hover:bg-red-50 text-red-500"
                    title="Delete"
                  >
                    <div className="w-5 h-5 flex items-center justify-center font-bold">×</div>
                  </button>
                )}
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                  title="Minimize"
                >
                  <div className="w-4 h-0.5 bg-current rounded-full" />
                </button>
                <button 
                  onClick={handleSavePost}
                  disabled={!noteContent.trim()}
                  className="px-4 py-1.5 bg-[#ff0050] text-white rounded-full text-sm font-medium disabled:opacity-50"
                >
                  {editingPostId ? 'Save' : 'Post'}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col relative">
              <div 
                className="flex-1 p-6 outline-none font-handwriting leading-relaxed transition-colors duration-300 relative"
                style={{ backgroundColor: selectedColor }}
              >
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write something..."
                  className="w-full h-full bg-transparent resize-none outline-none placeholder:text-stone-400/50"
                  style={{ fontSize: `${fontSize}px` }}
                  autoFocus
                />

                {/* Font Size Control - Collapsible Heart */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center justify-end">
                  <AnimatePresence mode="wait">
                    {isSliderOpen ? (
                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-stone-100 overflow-hidden"
                      >
                        <span className="text-xs font-medium text-stone-500 w-4 text-center">{fontSize}</span>
                        <input 
                          type="range" 
                          min="12" 
                          max="48" 
                          value={fontSize} 
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          onMouseUp={() => {
                            setTimeout(() => setIsSliderOpen(false), 1500);
                          }}
                          onTouchEnd={() => {
                            setTimeout(() => setIsSliderOpen(false), 1500);
                          }}
                          className="w-32 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#ff0050]"
                        />
                        <button 
                          onClick={() => setIsSliderOpen(false)}
                          className="p-1 hover:bg-stone-100 rounded-full"
                        >
                          <div className="w-4 h-4 text-stone-400 flex items-center justify-center text-xs">✕</div>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => setIsSliderOpen(true)}
                        className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-stone-100 flex items-center justify-center text-[#ff0050] hover:scale-110 transition-transform"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Color Picker */}
              <div className="p-4 bg-white border-t border-stone-100">
                <div className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wider">Page Color</div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {NOTE_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border flex-shrink-0 transition-transform ${selectedColor === color ? 'scale-110 ring-2 ring-stone-900 ring-offset-2' : ''}`}
                      style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.1)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Editor Bubble */}
      <AnimatePresence>
        {showEditor && isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white relative overflow-hidden group"
              style={{ backgroundColor: selectedColor }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                 <div className="w-8 h-1 bg-stone-400/50 rounded-full mb-1" />
                 <div className="w-6 h-1 bg-stone-400/50 rounded-full" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
