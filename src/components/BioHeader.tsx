import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { db } from '@/lib/db';
import { Plus, Edit2 } from 'lucide-react';

export function BioHeader() {
  const [profile, setProfile] = useState({
    avatar: '',
    name: 'Your Name',
    quote: 'Write your favorite quote here...',
    highlights: [null, null, null, null] as (string | null)[],
  });

  useEffect(() => {
    db.getUser().then((user) => {
      if (user) setProfile(user);
    });
  }, []);

  const updateProfile = (updates: Partial<typeof profile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    db.updateUser(newProfile);
  };

  const handleHighlightUpload = (index: number, image: string) => {
    const newHighlights = [...profile.highlights];
    newHighlights[index] = image;
    updateProfile({ highlights: newHighlights });
  };

  return (
    <div className="flex flex-col w-full px-6 pt-8 pb-4">
      {/* Header / Identity */}
      <div className="flex items-start mb-4 space-x-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <ImageUploader
            currentImage={profile.avatar}
            onImageSelect={(img) => updateProfile({ avatar: img })}
            className="overflow-hidden bg-gray-200 rounded-full w-[96px] h-[96px] ring-[6px] ring-[#fafafa] shadow-sm"
          >
            {!profile.avatar && (
               <div className="flex items-center justify-center w-full h-full text-2xl text-gray-400 bg-gray-100">
                 <span className="font-serif italic">img</span>
               </div>
            )}
            {profile.avatar && <img src={profile.avatar} className="object-cover w-full h-full" />}
          </ImageUploader>
        </div>

        {/* Quote */}
        <div className="flex-1 pt-4">
          <div 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateProfile({ quote: e.currentTarget.textContent || '' })}
            className="text-[18px] font-light leading-[1.4] text-stone-700 outline-none max-w-[240px]"
          >
            {profile.quote}
          </div>
          <div className="flex mt-2 space-x-2 opacity-50">
            <span className="text-xs">+</span>
            <span className="text-xs">♡</span>
            <span className="text-xs">✝</span>
          </div>
        </div>
      </div>

      {/* Username Line */}
      <div className="flex items-center mt-2 mb-8 space-x-2">
        <div 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateProfile({ name: e.currentTarget.textContent || '' })}
          className="text-[20px] tracking-[0.1em] text-stone-800 outline-none font-medium"
        >
          {profile.name}
        </div>
        <span className="text-sm text-stone-400 font-mono">~ * .</span>
      </div>

      {/* Highlight Cards */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar">
        {profile.highlights.map((img, idx) => (
          <ImageUploader
            key={idx}
            onImageSelect={(newImg) => handleHighlightUpload(idx, newImg)}
            className="shrink-0 w-[58px] h-[100px] rounded-[14px] overflow-hidden bg-stone-200 relative group"
          >
            {img ? (
              <>
                <img src={img} className="object-cover w-full h-full opacity-80" />
                <div className="absolute inset-0 bg-white/20" />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full transition-colors bg-stone-100 group-hover:bg-stone-200">
                <Plus className="w-4 h-4 text-stone-400" />
              </div>
            )}
          </ImageUploader>
        ))}
      </div>
    </div>
  );
}
