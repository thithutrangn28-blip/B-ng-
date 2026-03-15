import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat2, 
  Plus, 
  Music2, 
  Search, 
  User, 
  Home, 
  ArrowLeft, 
  Settings, 
  Type,
  X,
  Send,
  Image as ImageIcon,
  Pin
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import TextareaAutosize from 'react-textarea-autosize';

// --- Types ---

interface NoteCard {
  id: string;
  text: string;
  color: string;
  timestamp: string;
  user: string;
  isPinned?: boolean;
}

interface VideoPost {
  id: string;
  url: string;
  user: string;
  description: string;
  likes: number;
  shares: number;
  song: string;
  isLiked: boolean;
  notes: NoteCard[]; // Comments/Notes are now specific to each video
}

// --- Constants ---

const PASTEL_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const INITIAL_VIDEOS: VideoPost[] = [
  {
    id: '1',
    url: 'https://i.postimg.cc/JhHkZQRf/7f6a6cd5f111f73b36f2c8b3d1418000.jpg',
    user: '@chill_vibes',
    description: 'Một ngày thật đẹp trời 🌸 #chill #vibe #daily',
    likes: 1200,
    shares: 12,
    song: 'Nhạc chill phết - Chillies',
    isLiked: false,
    notes: [
      { id: 'c1', text: 'Màu ảnh đẹp quá 😍', color: '#f9ebe7', timestamp: '2h ago', user: 'user1', isPinned: true },
      { id: 'c2', text: 'Xin công thức màu với ạ', color: '#faf0f2', timestamp: '1h ago', user: 'user2' }
    ]
  },
  {
    id: '2',
    url: 'https://i.postimg.cc/2y0Q28Mv/07e147d9f9de46267e6f9d3306fa23da.jpg',
    user: '@travel_lover',
    description: 'Đi trốn ở một nơi xa 🌊 #travel #beach #holiday',
    likes: 3400,
    shares: 89,
    song: 'Đưa nhau đi trốn - Đen Vâu',
    isLiked: false,
    notes: []
  },
  {
    id: '3',
    url: 'https://i.postimg.cc/qRLyvvk9/72d438a4258f64be0bb909b319f9744a.jpg',
    user: '@foodie_hanoi',
    description: 'Món ngon Hà Nội không thể bỏ qua 🍜 #food #hanoi #streetfood',
    likes: 890,
    shares: 5,
    song: 'Hà Nội mùa vắng những cơn mưa - Cẩm Vân',
    isLiked: false,
    notes: []
  }
];

const RUNNING_COMMENTS = [
  "Video hay quá 😍", "Xinh quá chị ơi", "Tuyệt vời 👏", "Màu đẹp thế", 
  "Review có tâm", "Hóng video sau", "Nhạc hay quá", "Chill phết 🍃",
  "Cho xin info nhạc đi ạ", "Quá đỉnh lun", "Yêu quá đi ❤️"
];

// --- Components ---

export function TikTokApp({ onBack }: { onBack: () => void }) {
  const [videos, setVideos] = useState<VideoPost[]>(INITIAL_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showTextSizeControl, setShowTextSizeControl] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedNoteColor, setSelectedNoteColor] = useState(PASTEL_COLORS[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState<string>('');

  // Scroll Handling
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = containerRef.current;
      const index = Math.round(scrollTop / clientHeight);
      if (index !== currentIndex && index >= 0 && index < videos.length) {
        setCurrentIndex(index);
      }
    }
  };

  const handleLike = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 } : v));
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    
    const newNote: NoteCard = {
      id: Date.now().toString(),
      text: newNoteText,
      color: selectedNoteColor,
      timestamp: 'Just now',
      user: '@me',
      isPinned: false
    };

    setVideos(videos.map((v, index) => {
      if (index === currentIndex) {
        return { ...v, notes: [newNote, ...v.notes] };
      }
      return v;
    }));
    
    setNewNoteText('');
  };

  const handlePinNote = (noteId: string) => {
    setVideos(videos.map((v, index) => {
      if (index === currentIndex) {
        const updatedNotes = v.notes.map(n => 
          n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
        );
        // Sort pinned notes to top
        updatedNotes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        return { ...v, notes: updatedNotes };
      }
      return v;
    }));
  };

  const handleUpload = (url: string) => {
    const newVideo: VideoPost = {
      id: Date.now().toString(),
      url: url,
      user: '@me',
      description: 'Video mới của tôi ✨ #new #upload',
      likes: 0,
      shares: 0,
      song: 'Original Sound - @me',
      isLiked: false,
      notes: []
    };
    // If user selected a custom avatar, we store it (in a real app, this would be part of the user profile)
    // For this demo, we'll attach it to the video object or just use it for rendering
    if (uploadAvatar) {
        (newVideo as any).userAvatar = uploadAvatar;
    }
    
    setVideos([newVideo, ...videos]);
    setShowUploadModal(false);
    setUploadAvatar(''); // Reset
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="h-full w-full bg-black text-white font-sans overflow-hidden relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-12 pb-4 bg-gradient-to-b from-black/40 to-transparent">
        <button onClick={onBack} className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex gap-4 font-bold text-lg text-white/80">
          <span className="opacity-60">Following</span>
          <span className="text-white border-b-2 border-white pb-1">For You</span>
        </div>
        <button onClick={() => setShowTextSizeControl(!showTextSizeControl)} className="p-2 bg-black/20 rounded-full backdrop-blur-sm relative">
          <Heart className={`w-6 h-6 ${showTextSizeControl ? 'text-pink-500 fill-pink-500' : 'text-white'}`} />
          {showTextSizeControl && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 mt-2 bg-white p-3 rounded-xl shadow-xl w-48 z-50 text-stone-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-bold">Cỡ chữ bình luận</span>
              </div>
              <input 
                type="range" 
                min="12" 
                max="24" 
                value={textSize} 
                onChange={(e) => setTextSize(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Nhỏ</span>
                <span>Lớn</span>
              </div>
            </motion.div>
          )}
        </button>
      </div>

      {/* Video Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-full w-full snap-start relative bg-stone-900 flex items-center justify-center overflow-hidden">
            {/* "Video" Image */}
            <img 
              src={video.url} 
              alt={video.description} 
              className="h-full w-full object-cover opacity-90"
            />

            {/* Running Comments Overlay (Marquee) */}
            <div className="absolute top-24 left-0 right-0 overflow-hidden pointer-events-none z-10 opacity-80">
              <div className="animate-marquee whitespace-nowrap flex gap-8">
                {[...RUNNING_COMMENTS, ...RUNNING_COMMENTS].map((comment, i) => (
                  <span 
                    key={i} 
                    className="text-white drop-shadow-md font-medium px-4 py-1 rounded-full bg-black/20 backdrop-blur-sm"
                    style={{ fontSize: `${textSize}px` }}
                  >
                    {comment}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Sidebar Actions */}
            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6 z-20">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-black">
                  <img 
                    src={(video as any).userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white">
                  <Plus className="w-3 h-3" />
                </div>
              </div>

              <button onClick={() => handleLike(video.id)} className="flex flex-col items-center gap-1">
                <div className={`p-2 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90 ${video.isLiked ? 'text-red-500' : 'text-white'}`}>
                  <Heart className={`w-8 h-8 ${video.isLiked ? 'fill-red-500' : 'fill-white/20'}`} />
                </div>
                <span className="text-xs font-bold shadow-black drop-shadow-md">{video.likes}</span>
              </button>

              <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90">
                  <MessageCircle className="w-8 h-8 text-white fill-white/20" />
                </div>
                <span className="text-xs font-bold shadow-black drop-shadow-md">{video.notes.length}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90">
                  <Share2 className="w-8 h-8 text-white fill-white/20" />
                </div>
                <span className="text-xs font-bold shadow-black drop-shadow-md">{video.shares}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90">
                  <Repeat2 className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold shadow-black drop-shadow-md">Repost</span>
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pb-8">
              <h3 className="font-bold text-lg text-white mb-2 shadow-black drop-shadow-md">{video.user}</h3>
              <p className="text-white/90 text-sm mb-3 line-clamp-2 shadow-black drop-shadow-md">{video.description}</p>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <Music2 className="w-4 h-4 animate-spin-slow" />
                <div className="overflow-hidden w-32">
                  <div className="animate-marquee whitespace-nowrap">{video.song}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-black border-t border-white/10 flex items-center justify-around px-2 z-20">
        <button className="flex flex-col items-center gap-1 p-2 text-white">
          <Home className="w-6 h-6" />
          <span className="text-[10px]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white/50 hover:text-white transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-[10px]">Discover</span>
        </button>
        
        {/* Add Button */}
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-12 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center relative mx-2 hover:scale-105 transition-transform"
        >
          <div className="w-10 h-7 bg-white rounded-[6px] flex items-center justify-center">
            <Plus className="w-5 h-5 text-black" />
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 p-2 text-white/50 hover:text-white transition-colors">
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px]">Inbox</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white/50 hover:text-white transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>

      {/* Comments / Notes Drawer */}
      <AnimatePresence>
        {showComments && currentVideo && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          >
            <div 
              className="bg-[#faf0f0] w-full h-[75%] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="w-8" />
                <h3 className="font-bold text-stone-800 text-sm">
                  {currentVideo.notes.length} ghi chú
                </h3>
                <button onClick={() => setShowComments(false)} className="p-1 hover:bg-black/5 rounded-full">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf0f0]">
                {currentVideo.notes.length === 0 ? (
                  <div className="text-center text-stone-400 py-8 text-sm">
                    Chưa có ghi chú nào. Hãy tạo ghi chú đầu tiên!
                  </div>
                ) : (
                  currentVideo.notes.map(note => (
                    <div 
                      key={note.id} 
                      className="flex gap-3 relative group"
                    >
                      <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0 overflow-hidden mt-1">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${note.user}`} alt="avatar" className="w-full h-full" />
                      </div>
                      <div 
                        className="flex-1 p-3 rounded-2xl shadow-sm relative"
                        style={{ backgroundColor: note.color }}
                      >
                        {note.isPinned && (
                          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-stone-100">
                            <Pin className="w-3 h-3 text-pink-500 fill-pink-500" />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold text-stone-600">{note.user}</p>
                          <span className="text-[10px] text-stone-400">{note.timestamp}</span>
                        </div>
                        <p className="text-sm text-stone-800 leading-relaxed font-medium" style={{ fontSize: `${textSize}px` }}>
                          {note.text}
                        </p>
                        
                        {/* Pin Action (Visible on Hover) */}
                        <button 
                          onClick={() => handlePinNote(note.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-full"
                        >
                          <Pin className={`w-3 h-3 ${note.isPinned ? 'text-pink-500 fill-pink-500' : 'text-stone-400'}`} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Note Input Area */}
              <div className="p-4 bg-white border-t border-stone-200">
                {/* Color Picker */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                  {PASTEL_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedNoteColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedNoteColor === color ? 'border-stone-400 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex items-end gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=@me`} alt="avatar" className="w-full h-full" />
                  </div>
                  <div 
                    className="flex-1 rounded-2xl flex items-center px-4 py-2 gap-2 transition-colors"
                    style={{ backgroundColor: selectedNoteColor }}
                  >
                    <TextareaAutosize 
                      placeholder="Viết ghi chú..."
                      className="bg-transparent w-full resize-none outline-none text-sm text-stone-800 placeholder:text-stone-500/50 py-1"
                      maxRows={4}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddNote();
                        }
                      }}
                    />
                    <button 
                      onClick={handleAddNote}
                      disabled={!newNoteText.trim()}
                      className="p-1.5 bg-stone-800 rounded-full text-white disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#faf0f0] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-stone-800 mb-2">Đăng tải Video mới</h3>
                <p className="text-sm text-stone-500 mb-6">Chọn ảnh từ thư viện của bạn để làm nền video</p>
                
                <div className="flex flex-col gap-4">
                    <ImageUploader onImageSelect={handleUpload}>
                    <button className="w-full py-4 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-pink-400 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                        <ImageIcon className="w-6 h-6 text-stone-400 group-hover:text-pink-500" />
                        </div>
                        <span className="text-sm font-medium text-stone-600 group-hover:text-pink-600">Chọn ảnh từ thư viện</span>
                    </button>
                    </ImageUploader>

                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-100">
                        <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden shrink-0">
                            {uploadAvatar ? (
                                <img src={uploadAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-stone-400 m-2.5" />
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-bold text-stone-700">Avatar của bạn</p>
                            <p className="text-[10px] text-stone-400">Chọn ảnh đại diện cho video này</p>
                        </div>
                        <ImageUploader onImageSelect={setUploadAvatar}>
                            <button className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-medium text-stone-600 transition-colors">
                                Chọn
                            </button>
                        </ImageUploader>
                    </div>
                </div>

                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="mt-6 text-sm font-medium text-stone-500 hover:text-stone-800"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
