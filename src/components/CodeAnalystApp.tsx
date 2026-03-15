import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Search, Trash2, Code, FileCode, Cpu, GitBranch, Eye, Image as ImageIcon, Loader2, Save, RefreshCw } from 'lucide-react';
import { db } from '@/lib/db';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { ImageUploader } from './ImageUploader';

interface CodeAnalysisEntry {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  analysis?: {
    format: string;
    dataFlow: string;
    purpose: string;
    structure: string;
  };
}

interface CodeAnalystAppProps {
  onBack: () => void;
}

export function CodeAnalystApp({ onBack }: CodeAnalystAppProps) {
  const [entries, setEntries] = useState<CodeAnalysisEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CodeAnalysisEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState<'list' | 'detail'>('list');

  // New Entry State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisEntry['analysis'] | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const list = await db.getCodeAnalyses();
      setEntries(list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to load entries:", error);
    }
  };

  const handleCreateNew = () => {
    setSelectedEntry(null);
    setNewTitle('');
    setNewContent('');
    setNewImage(null);
    setAnalysisResult(null);
    setView('detail');
  };

  const handleSelectEntry = (entry: CodeAnalysisEntry) => {
    setSelectedEntry(entry);
    setNewTitle(entry.title);
    setNewContent(entry.content);
    setNewImage(entry.imageUrl || null);
    setAnalysisResult(entry.analysis || null);
    setView('detail');
  };

  const handleDeleteEntry = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this analysis?')) {
      await db.deleteCodeAnalysis(id);
      loadEntries();
      if (selectedEntry?.id === id) {
        setView('list');
        setSelectedEntry(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!newContent && !newImage) return;

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = `Analyze the following code snippet or technical notes. 
      Please provide a detailed analysis with the following sections:
      1. **Format/Language**: Identify the programming language or file format.
      2. **Data Flow**: Analyze the data flow within the code.
      3. **Purpose**: Explain the purpose and functionality of the code.
      4. **Structure & Identification**: Analyze the code structure and explain how to identify this type of code accurately.
      
      Return the response as a JSON object with keys: "format", "dataFlow", "purpose", "structure".
      Ensure the values are in Markdown format.
      `;

      if (newContent) {
        prompt += `\n\nCode/Notes:\n${newContent}`;
      }

      const contents: any[] = [{ text: prompt }];
      let model = 'gemini-3-flash-preview'; // Default to faster text model

      if (newImage) {
        // Use multimodal model for images
        model = 'gemini-2.5-flash-latest';
        const base64Data = newImage.split(',')[1];
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg', // Assuming jpeg/png from uploader
            data: base64Data
          }
        });
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: model === 'gemini-3-flash-preview' ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
        }
      });

      const text = response.text;
      if (text) {
        const result = JSON.parse(text);
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!newTitle) {
      alert("Please enter a title.");
      return;
    }

    setIsSaving(true);
    try {
      const entry: CodeAnalysisEntry = {
        id: selectedEntry?.id || crypto.randomUUID(),
        title: newTitle,
        content: newContent,
        imageUrl: newImage || undefined,
        createdAt: selectedEntry?.createdAt || new Date().toISOString(),
        analysis: analysisResult || undefined,
      };

      await db.saveCodeAnalysis(entry);
      await loadEntries(); // Reload list
      setView('list');
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save analysis. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#faf0f0] relative overflow-hidden text-stone-800 font-sans">
      {/* Header */}
      <div className="relative shrink-0 z-10 bg-white/50 backdrop-blur-md border-b border-stone-200/50 pt-12 pb-4 px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'detail' ? (
              <button 
                onClick={() => setView('list')}
                className="p-2 -ml-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-stone-600" />
              </button>
            ) : (
              <button 
                onClick={onBack}
                className="p-2 -ml-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-stone-600" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center text-white shadow-md">
                <Code className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-800">Code Analyst</h1>
            </div>
          </div>
          
          {view === 'list' && (
            <button 
              onClick={handleCreateNew}
              className="p-2 bg-stone-800 text-white rounded-full shadow-md hover:bg-stone-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>

        {view === 'list' && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search analyses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 focus:ring-2 focus:ring-stone-800/20 outline-none transition-all placeholder-stone-400"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 grid gap-4"
            >
              {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                  <FileCode className="w-16 h-16 mb-4 opacity-20" />
                  <p>No analyses found.</p>
                  <button onClick={handleCreateNew} className="mt-4 text-stone-800 font-medium hover:underline">Start a new analysis</button>
                </div>
              ) : (
                filteredEntries.map(entry => (
                  <motion.div
                    key={entry.id}
                    layoutId={entry.id}
                    onClick={() => handleSelectEntry(entry)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.analysis ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                          {entry.imageUrl ? <ImageIcon className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-800 line-clamp-1">{entry.title}</h3>
                          <p className="text-xs text-stone-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteEntry(e, entry.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-600 line-clamp-2 mb-3 font-mono bg-stone-50 p-2 rounded-lg border border-stone-100">
                      {entry.content || (entry.imageUrl ? '[Image Analysis]' : 'No content')}
                    </p>
                    {entry.analysis && (
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
                          {entry.analysis.format}
                        </span>
                        <span className="text-[10px] px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium border border-purple-100">
                          Analyzed
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              {/* Title Input */}
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Analysis Title..."
                className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-stone-300 text-stone-800"
              />

              {/* Input Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                      <Code className="w-3 h-3" /> Code / Notes
                    </label>
                    <ImageUploader onImageSelect={setNewImage}>
                      <button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-blue-50 rounded-lg transition-colors">
                        <ImageIcon className="w-3 h-3" /> {newImage ? 'Change Image' : 'Add Image'}
                      </button>
                    </ImageUploader>
                  </div>
                  
                  {newImage && (
                    <div className="mb-4 relative group rounded-xl overflow-hidden border border-stone-200">
                      <img src={newImage} alt="Code" className="w-full max-h-60 object-contain bg-stone-50" />
                      <button 
                        onClick={() => setNewImage(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <TextareaAutosize
                    minRows={5}
                    placeholder="Paste code or write notes here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full font-mono text-sm bg-stone-50 p-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-0 outline-none resize-none text-stone-800"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!newContent && !newImage)}
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                    isAnalyzing || (!newContent && !newImage)
                      ? 'bg-stone-300 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-stone-900 hover:shadow-lg active:scale-[0.99]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5" /> Analyze Code
                    </>
                  )}
                </button>
              </div>

              {/* Results Section */}
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-stone-800 font-bold text-lg border-b border-stone-200 pb-2">
                    <GitBranch className="w-5 h-5" /> Analysis Results
                  </div>

                  <div className="grid gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Format / Language</h3>
                      <div className="text-stone-800 font-medium bg-stone-50 p-2 rounded-lg border border-stone-100 inline-block">
                        {analysisResult.format}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Data Flow</h3>
                      <div className="prose prose-sm max-w-none text-stone-700">
                        <ReactMarkdown>{analysisResult.dataFlow}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Purpose</h3>
                      <div className="prose prose-sm max-w-none text-stone-700">
                        <ReactMarkdown>{analysisResult.purpose}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Structure & Identification</h3>
                      <div className="prose prose-sm max-w-none text-stone-700">
                        <ReactMarkdown>{analysisResult.structure}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions (Detail View) */}
      {view === 'detail' && (
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 flex justify-end gap-3">
          <button
            onClick={() => setView('list')}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl font-medium text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-xl font-bold text-white bg-stone-800 hover:bg-stone-900 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Analysis
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
