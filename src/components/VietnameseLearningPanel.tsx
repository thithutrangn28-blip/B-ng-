import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, GraduationCap, Search, CheckCircle, HelpCircle, ChevronRight, ChevronLeft, FileText, Keyboard } from 'lucide-react';
import { VIETNAMESE_ALPHABET, GRAMMAR_RULES, EXERCISES, DICTIONARY, LEARNING_DOCUMENTS, AlphabetLetter, DictionaryEntry, LearningDocument } from './VietnameseLearningData';
import ReactMarkdown from 'react-markdown';

interface VietnameseLearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VietnameseLearningPanel: React.FC<VietnameseLearningPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'grammar' | 'exercises' | 'dictionary' | 'documents' | 'keyboard'>('alphabet');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<LearningDocument | null>(null);
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(null);

  // Filter dictionary
  const filteredDictionary = DICTIONARY.filter(entry => 
    entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExerciseAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(optionIndex);
    setShowExplanation(true);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < EXERCISES.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-[450px] bg-[#fffcfc] shadow-2xl z-50 flex flex-col border-l border-[#f0e6e6]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#f0e6e6] flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#8a7070]">Tiếng Việt</h3>
                <p className="text-xs text-[#b09595]">Học và thực hành</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#f5ebeb] rounded-full text-[#b09595] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-4 pt-2 gap-2 border-b border-[#f0e6e6] bg-white/30 overflow-x-auto no-scrollbar">
            {[
              { id: 'alphabet', label: 'Chữ Cái', icon: 'Aa' },
              { id: 'grammar', label: 'Chính Tả', icon: '¶' },
              { id: 'exercises', label: 'Bài Tập', icon: '?' },
              { id: 'dictionary', label: 'Từ Điển', icon: '📖' },
              { id: 'documents', label: 'Tài Liệu', icon: <FileText className="w-3 h-3" /> },
              { id: 'keyboard', label: 'Từ Vựng', icon: <Keyboard className="w-3 h-3" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-2 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-[#8a7070]' : 'text-[#d4c5c5] hover:text-[#b09595]'
                }`}
              >
                <span className="text-xs font-bold opacity-70">{typeof tab.icon === 'string' ? tab.icon : tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeLearningTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8a7070]" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#faf8f8]">
            
            {/* ALPHABET TAB */}
            {activeTab === 'alphabet' && (
              <div className="space-y-6">
                {selectedLetter ? (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <button 
                      onClick={() => setSelectedLetter(null)}
                      className="mb-4 text-sm text-[#b09595] hover:text-[#8a7070] flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Quay lại
                    </button>
                    <div className="text-center mb-6">
                      <h1 className="text-8xl font-serif text-[#8a7070] mb-2">{selectedLetter.char}</h1>
                      <p className="text-xl text-[#b09595] font-medium">{selectedLetter.name}</p>
                      <p className="text-sm text-[#d4c5c5]">Phát âm: /{selectedLetter.pronunciation}/</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#fff5f5] p-4 rounded-xl border border-red-50">
                        <h4 className="font-bold text-[#8a7070] mb-2 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" /> Cách dùng
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">{selectedLetter.usage}</p>
                      </div>
                      
                      {selectedLetter.story && (
                        <div className="bg-[#f0f9ff] p-4 rounded-xl border border-blue-50">
                          <h4 className="font-bold text-blue-700 mb-2 text-sm">Câu chuyện / Thơ</h4>
                          <p className="text-blue-900 text-sm whitespace-pre-line italic font-serif">
                            {selectedLetter.story}
                          </p>
                        </div>
                      )}

                      {selectedLetter.combinations && selectedLetter.combinations.length > 0 && (
                        <div className="bg-[#fcfdf5] p-4 rounded-xl border border-yellow-50">
                          <h4 className="font-bold text-yellow-700 mb-2 text-sm">Ghép vần</h4>
                          <ul className="list-disc list-inside text-sm text-stone-700 space-y-1">
                            {selectedLetter.combinations.map((combo, i) => (
                              <li key={i}>{combo}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-[#8a7070] mb-2 text-sm">Ví dụ:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLetter.examples.map((ex, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-600 text-sm">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {VIETNAMESE_ALPHABET.map((letter) => (
                      <button
                        key={letter.char}
                        onClick={() => setSelectedLetter(letter)}
                        className="aspect-square bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:border-[#e0caca] transition-all flex flex-col items-center justify-center group"
                      >
                        <span className="text-2xl font-serif font-bold text-stone-700 group-hover:text-[#8a7070]">{letter.char}</span>
                        <span className="text-[10px] text-[#d4c5c5] mt-1">{letter.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* GRAMMAR TAB */}
            {activeTab === 'grammar' && (
              <div className="space-y-4">
                {GRAMMAR_RULES.map((rule, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
                    <h3 className="font-bold text-[#8a7070] text-lg mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#fff5f5] rounded-full flex items-center justify-center text-xs text-[#e0caca]">{index + 1}</span>
                      {rule.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4 leading-relaxed">{rule.description}</p>
                    <div className="bg-[#faf8f8] p-3 rounded-lg border border-stone-100">
                      <p className="text-xs font-bold text-[#b09595] mb-1">Ví dụ:</p>
                      <div className="flex flex-wrap gap-2">
                        {rule.examples.map((ex, i) => (
                          <span key={i} className="text-sm text-stone-700 italic">"{ex}"</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXERCISES TAB */}
            {activeTab === 'exercises' && (
              <div className="h-full flex flex-col">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-[#b09595] uppercase tracking-wider">Câu hỏi {currentExerciseIndex + 1}/{EXERCISES.length}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={prevExercise} 
                        disabled={currentExerciseIndex === 0}
                        className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-600" />
                      </button>
                      <button 
                        onClick={nextExercise}
                        disabled={currentExerciseIndex === EXERCISES.length - 1}
                        className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30"
                      >
                        <ChevronRight className="w-5 h-5 text-stone-600" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-medium text-stone-800 mb-6 min-h-[60px]">
                    {EXERCISES[currentExerciseIndex].question}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {EXERCISES[currentExerciseIndex].options.map((option, index) => {
                      let btnClass = "w-full p-4 rounded-xl text-left border transition-all flex justify-between items-center ";
                      
                      if (selectedOption === null) {
                        btnClass += "bg-white border-stone-200 hover:border-[#8a7070] hover:bg-[#fffcfc] text-stone-700";
                      } else {
                        if (index === EXERCISES[currentExerciseIndex].correctAnswer) {
                          btnClass += "bg-green-50 border-green-200 text-green-800";
                        } else if (index === selectedOption) {
                          btnClass += "bg-red-50 border-red-200 text-red-800";
                        } else {
                          btnClass += "bg-stone-50 border-stone-100 text-stone-400";
                        }
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleExerciseAnswer(index)}
                          disabled={selectedOption !== null}
                          className={btnClass}
                        >
                          <span className="font-medium">{option}</span>
                          {selectedOption !== null && index === EXERCISES[currentExerciseIndex].correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-auto bg-[#fff5f5] p-4 rounded-xl border border-[#f0e6e6]"
                    >
                      <h4 className="font-bold text-[#8a7070] mb-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Giải thích:
                      </h4>
                      <p className="text-sm text-stone-700">
                        {EXERCISES[currentExerciseIndex].explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* DICTIONARY TAB */}
            {activeTab === 'dictionary' && (
              <div className="h-full flex flex-col">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4c5c5]" />
                  <input
                    type="text"
                    placeholder="Tra từ ngữ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#8a7070] focus:ring-1 focus:ring-[#8a7070] transition-all text-stone-700 placeholder-[#d4c5c5]"
                  />
                </div>

                <div className="space-y-4">
                  {filteredDictionary.length > 0 ? (
                    filteredDictionary.map((entry, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-[#8a7070] mb-1">{entry.word}</h3>
                        <p className="text-stone-600 text-sm mb-3 leading-relaxed">{entry.definition}</p>
                        <div className="bg-[#faf8f8] px-3 py-2 rounded-lg border border-stone-50 inline-block">
                          <p className="text-xs text-[#b09595] italic">Ví dụ: "{entry.context}"</p>
                        </div>
                        {entry.story && (
                          <div className="mt-3 pt-3 border-t border-stone-100">
                            <p className="text-xs text-stone-500 italic font-serif">"{entry.story}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-[#d4c5c5]">
                      <p>Không tìm thấy từ nào.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="h-full flex flex-col">
                {selectedDocument ? (
                  <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-stone-100 flex items-center gap-2 bg-stone-50">
                      <button 
                        onClick={() => setSelectedDocument(null)}
                        className="p-1 hover:bg-stone-200 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-600" />
                      </button>
                      <h3 className="font-bold text-stone-800 line-clamp-1">{selectedDocument.title}</h3>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                      <div className="prose prose-stone prose-sm max-w-none">
                        <p className="lead text-lg text-stone-600 mb-6 italic">{selectedDocument.content}</p>
                        {selectedDocument.chapters.map((chapter, idx) => (
                          <div key={idx} className="mb-8">
                            <h4 className="text-lg font-bold text-[#8a7070] mb-3 border-b border-[#f0e6e6] pb-2">
                              {idx + 1}. {chapter.title}
                            </h4>
                            <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                              {chapter.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {LEARNING_DOCUMENTS.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDocument(doc)}
                        className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-[#fff5f5] rounded-lg text-[#e0caca] group-hover:bg-[#ffebeb] group-hover:text-[#8a7070] transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-800 group-hover:text-[#8a7070] transition-colors mb-1">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-stone-500 line-clamp-2">
                              {doc.content}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#b09595]">
                              <span className="bg-stone-100 px-2 py-1 rounded-md text-stone-500">
                                {doc.chapters.length} chương
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* KEYBOARD / VOCABULARY TAB */}
            {activeTab === 'keyboard' && (
              <div className="h-full flex flex-col">
                {selectedWord ? (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-full flex flex-col">
                    <button 
                      onClick={() => setSelectedWord(null)}
                      className="mb-4 text-sm text-[#b09595] hover:text-[#8a7070] flex items-center gap-1 self-start"
                    >
                      <ChevronLeft className="w-4 h-4" /> Quay lại
                    </button>
                    
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-serif font-bold text-[#8a7070] mb-2">{selectedWord.word}</h2>
                    </div>

                    <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                      <div className="bg-[#fffcfc] p-5 rounded-xl border border-[#f0e6e6]">
                        <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                          <Book className="w-4 h-4 text-[#b09595]" /> Định nghĩa
                        </h4>
                        <p className="text-stone-700 text-lg leading-relaxed">{selectedWord.definition}</p>
                      </div>

                      <div className="bg-[#f0f9ff] p-5 rounded-xl border border-blue-50">
                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Câu chuyện / Ngữ cảnh
                        </h4>
                        {selectedWord.story ? (
                          <p className="text-blue-900 italic font-serif leading-relaxed">
                            "{selectedWord.story}"
                          </p>
                        ) : (
                          <p className="text-blue-900 italic">"{selectedWord.context}"</p>
                        )}
                      </div>

                      <div className="bg-[#fcfdf5] p-5 rounded-xl border border-yellow-50">
                        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" /> Bài tập thực hành
                        </h4>
                        <p className="text-sm text-stone-600 mb-3">Đặt câu với từ "{selectedWord.word}":</p>
                        <div className="bg-white p-3 rounded-lg border border-yellow-100 text-stone-400 italic text-sm">
                          (Chức năng đang phát triển...)
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4c5c5]" />
                      <input
                        type="text"
                        placeholder="Tìm từ vựng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#8a7070] focus:ring-1 focus:ring-[#8a7070] transition-all text-stone-700 placeholder-[#d4c5c5]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {filteredDictionary.map((entry, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedWord(entry)}
                          className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:border-[#e0caca] transition-all text-left group"
                        >
                          <span className="font-bold text-stone-700 group-hover:text-[#8a7070] block mb-1">{entry.word}</span>
                          <span className="text-xs text-[#d4c5c5] line-clamp-1">{entry.definition}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
