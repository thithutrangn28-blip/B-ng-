import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, Signal, Plane, Flashlight, Eye, Sun, Moon, 
  Volume2, Play, Pause, SkipForward, SkipBack, 
  Palette, Image as ImageIcon, X, ChevronDown, Music,
  Smartphone, Battery, Bluetooth
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUploader } from './ImageUploader';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  toggleEyeComfort: () => void;
  isEyeComfortEnabled: boolean;
}

const CC_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

export function ControlCenter({ isOpen, onClose, toggleEyeComfort, isEyeComfortEnabled }: ControlCenterProps) {
  const [bgType, setBgType] = useState<'color' | 'image'>('color');
  const [bgColor, setBgColor] = useState(CC_COLORS[0]);
  const [bgImage, setBgImage] = useState('');
  
  // Toggles State
  const [wifi, setWifi] = useState(true);
  const [data, setData] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [bluetooth, setBluetooth] = useState(true);
  
  // Sliders State
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);
  
  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Detail View State
  const [activeDetail, setActiveDetail] = useState<string | null>(null);

  // Flashlight Effect (Screen overlay)
  useEffect(() => {
    if (flashlight) {
      const div = document.createElement('div');
      div.id = 'flashlight-overlay';
      div.style.position = 'fixed';
      div.style.inset = '0';
      div.style.backgroundColor = 'white';
      div.style.zIndex = '9999';
      div.style.pointerEvents = 'none';
      div.style.mixBlendMode = 'overlay';
      div.style.opacity = '0.8';
      document.body.appendChild(div);
    } else {
      const div = document.getElementById('flashlight-overlay');
      if (div) div.remove();
    }
    return () => {
      const div = document.getElementById('flashlight-overlay');
      if (div) div.remove();
    };
  }, [flashlight]);

  const toggleFunction = (name: string) => {
    switch(name) {
      case 'wifi': setWifi(!wifi); break;
      case 'data': setData(!data); break;
      case 'airplane': setAirplane(!airplane); break;
      case 'flashlight': setFlashlight(!flashlight); break;
      case 'bluetooth': setBluetooth(!bluetooth); break;
      case 'eyeComfort': toggleEyeComfort(); break;
    }
  };

  const openDetail = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDetail(name);
  };

  const renderDetailModal = () => {
    if (!activeDetail) return null;

    let content = null;
    let title = '';
    let icon = null;

    switch(activeDetail) {
      case 'wifi':
        title = 'Wi-Fi';
        icon = <Wifi className="w-6 h-6" />;
        content = (
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <span>Wi-Fi</span>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${wifi ? 'bg-green-500' : 'bg-stone-300'}`}
                  onClick={() => setWifi(!wifi)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${wifi ? 'translate-x-6' : ''}`} />
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-stone-500 px-2">Networks</p>
                {['Home_Wifi_5G', 'Starbucks_Guest', 'iPhone Hotspot'].map(net => (
                  <div key={net} className="flex items-center p-3 bg-white/30 rounded-xl">
                    <Wifi className="w-4 h-4 mr-3" />
                    <span className="flex-1">{net}</span>
                    {wifi && net === 'Home_Wifi_5G' && <Signal className="w-4 h-4 text-green-600" />}
                  </div>
                ))}
             </div>
          </div>
        );
        break;
      case 'data':
        title = 'Mobile Data';
        icon = <Smartphone className="w-6 h-6" />;
        content = (
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <span>Mobile Data</span>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${data ? 'bg-green-500' : 'bg-stone-300'}`}
                  onClick={() => setData(!data)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${data ? 'translate-x-6' : ''}`} />
                </div>
             </div>
             <div className="p-4 bg-white/30 rounded-xl">
                <p className="text-sm text-stone-600 mb-1">Current Period</p>
                <p className="text-2xl font-bold">12.4 GB</p>
                <div className="w-full h-2 bg-stone-200 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-green-500 w-[65%]" />
                </div>
             </div>
          </div>
        );
        break;
      case 'music':
        title = 'Now Playing';
        icon = <Music className="w-6 h-6" />;
        content = (
          <div className="flex flex-col items-center space-y-6 py-4">
             <div className="w-48 h-48 bg-stone-200 rounded-2xl shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-stone-300 flex items-center justify-center">
                   <Music className="w-16 h-16 text-white/50" />
                </div>
             </div>
             <div className="text-center">
                <h3 className="text-xl font-bold text-stone-800">Lo-Fi Beats</h3>
                <p className="text-stone-500">Chill Vibes</p>
             </div>
             <div className="w-full space-y-2">
                <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                   <div className="h-full bg-stone-800 w-1/3" />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                   <span>1:23</span>
                   <span>3:45</span>
                </div>
             </div>
             <div className="flex items-center justify-center space-x-8">
                <SkipBack className="w-8 h-8 text-stone-800 cursor-pointer" />
                <div 
                  className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                   {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </div>
                <SkipForward className="w-8 h-8 text-stone-800 cursor-pointer" />
             </div>
          </div>
        );
        break;
      // Add other cases as needed
      default:
        content = (
          <div className="p-4 text-center text-stone-500">
            Feature details not available in preview.
          </div>
        );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm"
        onClick={() => setActiveDetail(null)}
      >
        <div 
          className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
           <div className="p-4 border-b border-stone-200/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 {icon}
                 <span className="font-bold text-lg">{title}</span>
              </div>
              <button onClick={() => setActiveDetail(null)} className="p-1 bg-stone-100 rounded-full">
                 <X className="w-5 h-5" />
              </button>
           </div>
           <div className="p-6">
              {content}
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-40 flex flex-col"
          style={{
            backgroundColor: bgType === 'color' ? bgColor : undefined,
            backgroundImage: bgType === 'image' && bgImage ? `url(${bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {bgType === 'image' && <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-0" />}
          
          {/* Header / Handle */}
          <div className="relative z-10 w-full pt-12 pb-4 px-6 flex justify-between items-center">
             <div className="text-sm font-medium opacity-70">Control Center</div>
             <button onClick={onClose} className="p-2 bg-black/10 rounded-full backdrop-blur-md">
                <ChevronDown className="w-6 h-6 rotate-180" />
             </button>
          </div>

          {/* Main Grid */}
          <div className="relative z-10 flex-1 px-6 overflow-y-auto pb-20">
             <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Connectivity Block */}
                <div className="col-span-1 bg-white/40 backdrop-blur-xl rounded-3xl p-4 grid grid-cols-2 gap-3">
                   <ControlTile 
                      icon={<Wifi />} 
                      label="Wi-Fi" 
                      active={wifi} 
                      onClick={() => openDetail('wifi', {} as any)} 
                      onToggle={() => setWifi(!wifi)}
                   />
                   <ControlTile 
                      icon={<Smartphone />} 
                      label="Data" 
                      active={data} 
                      onClick={() => openDetail('data', {} as any)} 
                      onToggle={() => setData(!data)}
                   />
                   <ControlTile 
                      icon={<Plane />} 
                      label="Airplane" 
                      active={airplane} 
                      onClick={() => setAirplane(!airplane)} 
                      color="bg-orange-500"
                   />
                   <ControlTile 
                      icon={<Bluetooth />} 
                      label="Bluetooth" 
                      active={bluetooth} 
                      onClick={() => setBluetooth(!bluetooth)} 
                      color="bg-blue-500"
                   />
                </div>

                {/* Music Block */}
                <div 
                  className="col-span-1 bg-white/40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
                  onClick={(e) => openDetail('music', e)}
                >
                   <div className="flex items-start justify-between">
                      <Music className="w-6 h-6 text-stone-700" />
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   </div>
                   <div className="mt-2">
                      <p className="font-bold text-stone-800 truncate">Lo-Fi Beats</p>
                      <p className="text-xs text-stone-600 truncate">Chill Vibes</p>
                   </div>
                   <div className="flex justify-between items-center mt-3">
                      <SkipBack className="w-5 h-5" />
                      <div onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                         {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      </div>
                      <SkipForward className="w-5 h-5" />
                   </div>
                </div>
             </div>

             {/* Sliders */}
             <div className="space-y-4 mb-6">
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 flex items-center space-x-4">
                   <Sun className="w-5 h-5 text-stone-600" />
                   <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={brightness} 
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-stone-300/50 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                   />
                </div>
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 flex items-center space-x-4">
                   <Volume2 className="w-5 h-5 text-stone-600" />
                   <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-stone-300/50 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                   />
                </div>
             </div>

             {/* Toggles Row */}
             <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center space-y-2">
                   <button 
                      onClick={() => setFlashlight(!flashlight)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${flashlight ? 'bg-white text-stone-900' : 'bg-stone-800/80 text-white'}`}
                   >
                      <Flashlight className={`w-6 h-6 ${flashlight ? 'fill-current' : ''}`} />
                   </button>
                   <span className="text-xs font-medium">Flashlight</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                   <button 
                      onClick={toggleEyeComfort}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isEyeComfortEnabled ? 'bg-amber-100 text-amber-600' : 'bg-stone-800/80 text-white'}`}
                   >
                      <Eye className="w-6 h-6" />
                   </button>
                   <span className="text-xs font-medium">Eye Care</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                   <button className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-stone-800/80 text-white">
                      <Battery className="w-6 h-6" />
                   </button>
                   <span className="text-xs font-medium">Power</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                   <button className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-stone-800/80 text-white">
                      <Moon className="w-6 h-6" />
                   </button>
                   <span className="text-xs font-medium">DND</span>
                </div>
             </div>

             {/* Customization Section */}
             <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-4">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-sm font-bold opacity-70 flex items-center">
                      <Palette className="w-4 h-4 mr-2" /> Theme
                   </h3>
                   <div className="flex space-x-2">
                      <button 
                        onClick={() => setBgType('color')}
                        className={`px-3 py-1 rounded-full text-xs ${bgType === 'color' ? 'bg-white shadow-sm' : 'opacity-50'}`}
                      >Color</button>
                      <button 
                        onClick={() => setBgType('image')}
                        className={`px-3 py-1 rounded-full text-xs ${bgType === 'image' ? 'bg-white shadow-sm' : 'opacity-50'}`}
                      >Image</button>
                   </div>
                </div>

                {bgType === 'color' ? (
                   <div className="grid grid-cols-5 gap-2">
                      {CC_COLORS.map(c => (
                         <button
                            key={c}
                            onClick={() => setBgColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${bgColor === c ? 'border-stone-800' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                         />
                      ))}
                   </div>
                ) : (
                   <div className="flex items-center space-x-3">
                      <ImageUploader onImageSelect={setBgImage} className="flex-1">
                         <div className="h-20 border-2 border-dashed border-stone-400/50 rounded-xl flex flex-col items-center justify-center text-stone-500 hover:bg-white/20 transition-colors cursor-pointer">
                            <ImageIcon className="w-5 h-5 mb-1" />
                            <span className="text-xs">Upload BG</span>
                         </div>
                      </ImageUploader>
                      {bgImage && (
                         <div className="w-20 h-20 rounded-xl bg-cover bg-center shadow-sm border border-white/50" style={{ backgroundImage: `url(${bgImage})` }} />
                      )}
                   </div>
                )}
             </div>
          </div>

          {renderDetailModal()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ControlTile({ icon, label, active, onClick, onToggle, color = 'bg-blue-500' }: any) {
   return (
      <div 
         className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${active ? color + ' text-white shadow-md' : 'bg-stone-200/50 text-stone-600'}`}
         onClick={onClick}
      >
         <div className="mb-1">{icon}</div>
      </div>
   );
}
