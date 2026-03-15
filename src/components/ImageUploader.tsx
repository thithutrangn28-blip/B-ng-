import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect: (base64: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect, className, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={() => inputRef.current?.click()}
    >
      {children ? children : (
        currentImage ? (
          <img 
            src={currentImage} 
            alt="Upload" 
            className="object-cover w-full h-full" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
        )
      )}
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </div>
  );
}
