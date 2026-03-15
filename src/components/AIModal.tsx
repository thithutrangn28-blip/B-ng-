import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Loader2, Sparkles, Video, Image as ImageIcon, Edit, Eye, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage?: string; // Base64
  onImageGenerated: (base64: string) => void;
  onVideoGenerated: (url: string) => void;
  onAnalysisResult: (text: string) => void;
  onSearchResult: (text: string) => void;
}

export function AIModal({ isOpen, onClose, selectedImage, onImageGenerated, onVideoGenerated, onAnalysisResult, onSearchResult }: AIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'generate' | 'edit' | 'animate' | 'analyze' | 'search' | 'maps'>('generate');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

  if (!isOpen) return null;

  const handleAction = async () => {
    setLoading(true);
    try {
      if (mode === 'generate') {
        // Generate Image
        // "Use gemini-3-pro-image-preview"
        // "provide an affordance for the user to specify the aspect ratio"
        
        // Note: The SDK usage for image generation with specific config might vary.
        // Using generateContent with media response expectation.
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: prompt,
            config: {
                responseMimeType: 'image/jpeg',
                imageConfig: {
                    aspectRatio: aspectRatio as any // Cast to any if types are strict
                }
            }
        });
        
        // Find image part
        const candidates = response.candidates;
        if (candidates && candidates[0].content.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData) {
                    onImageGenerated(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
                    onClose();
                    return;
                }
            }
        }
      } 
      else if (mode === 'animate' && selectedImage) {
        // Veo Video Generation
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || "Animate this image",
            image: {
                imageBytes: base64Data,
                mimeType: mimeType
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            const vidRes = await fetch(videoUri, {
                headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! }
            });
            const blob = await vidRes.blob();
            const url = URL.createObjectURL(blob);
            onVideoGenerated(url);
            onClose();
        }
      }
      else if (mode === 'analyze' && selectedImage) {
          const base64Data = selectedImage.split(',')[1];
          const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];
          
          const response = await ai.models.generateContent({
              model: 'gemini-3.1-pro-preview',
              contents: [
                  {
                      inlineData: {
                          data: base64Data,
                          mimeType: mimeType
                      }
                  },
                  { text: prompt || "Analyze this image and describe it in detail." }
              ]
          });
          
          onAnalysisResult(response.text || "No analysis available.");
          onClose();
      }
      else if (mode === 'edit' && selectedImage) {
          const base64Data = selectedImage.split(',')[1];
          const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: [
                  {
                      inlineData: {
                          data: base64Data,
                          mimeType: mimeType
                      }
                  },
                  { text: prompt || "Edit this image" }
              ]
          });
          
            const candidates = response.candidates;
            if (candidates && candidates[0].content.parts) {
                for (const part of candidates[0].content.parts) {
                    if (part.inlineData) {
                        onImageGenerated(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
                        onClose();
                        return;
                    }
                }
            }
      }
      else if (mode === 'search') {
          // Google Search Grounding
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                  tools: [{ googleSearch: {} }]
              }
          });
          onSearchResult(response.text || "No results found.");
          onClose();
      }
      else if (mode === 'maps') {
          // Google Maps Grounding
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                  tools: [{ googleMaps: {} }]
              }
          });
          onSearchResult(response.text || "No results found.");
          onClose();
      }

    } catch (e) {
      console.error(e);
      alert("AI Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-serif text-lg">AI Studio</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        
        <div className="p-4 space-y-4">
            {/* Mode Selection */}
            <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                <button 
                    onClick={() => setMode('generate')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'generate' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                </button>
                <button 
                    onClick={() => setMode('search')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'search' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                </button>
                <button 
                    onClick={() => setMode('maps')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'maps' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                    <MapPin className="w-4 h-4" />
                    <span>Maps</span>
                </button>
                {selectedImage && (
                    <>
                        <button 
                            onClick={() => setMode('edit')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'edit' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                        <button 
                            onClick={() => setMode('animate')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'animate' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                        >
                            <Video className="w-4 h-4" />
                            <span>Animate</span>
                        </button>
                        <button 
                            onClick={() => setMode('analyze')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${mode === 'analyze' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                        >
                            <Eye className="w-4 h-4" />
                            <span>Analyze</span>
                        </button>
                    </>
                )}
            </div>

            {/* Aspect Ratio for Generate */}
            {mode === 'generate' && (
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Aspect Ratio</label>
                    <div className="flex flex-wrap gap-2">
                        {ASPECT_RATIOS.map(ratio => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-2 py-1 text-xs rounded-md border ${aspectRatio === ratio ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'}`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Prompt Input */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    {mode === 'generate' ? 'Describe the image you want' : 
                     mode === 'edit' ? 'How should I change this image?' :
                     mode === 'animate' ? 'Describe the motion' :
                     mode === 'search' ? 'What do you want to know?' :
                     mode === 'maps' ? 'What place are you looking for?' :
                     'What should I look for?'}
                </label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-stone-200 outline-none resize-none text-sm"
                    rows={3}
                    placeholder="Type here..."
                />
            </div>

            {/* Action Button */}
            <button 
                onClick={handleAction}
                disabled={loading || !prompt}
                className="w-full py-3 bg-stone-800 text-white rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 hover:bg-stone-700 transition-colors"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>{loading ? 'Processing...' : 'Do Magic'}</span>
            </button>
        </div>
      </div>
    </div>
  );
}
