
import React, { useState, useEffect, useRef } from 'react';
import { StageData } from '../types';
import { STAGE_STARTERS, STAGE_FEEDBACK } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, MessageCircle, Loader2, Sparkles, X } from 'lucide-react';
import { getSuggestions } from '../services/geminiService';

interface StageBoxProps {
  data: StageData;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (text: string) => void;
  onReadyToLock: () => void;
}

export const StageBox: React.FC<StageBoxProps> = ({
  data,
  isActive,
  onActivate,
  onUpdate,
  onReadyToLock
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const starter = STAGE_STARTERS[data.id] || '';

  // Minimum character threshold before suggestion button is available
  const MIN_CHAR_COUNT = 30;

  // Update prompt index based on text length
  useEffect(() => {
    if (data.text.length > 60) setCurrentPromptIndex(2);
    else if (data.text.length > 30) setCurrentPromptIndex(1);
    else setCurrentPromptIndex(0);
  }, [data.text]);

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const result = await getSuggestions(data.id, data.text);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions(['Unable to get suggestions. Please try again.']);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const closeSuggestions = () => {
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (data.text === '') {
      onUpdate(starter);
      setTimeout(() => {
        if (textareaRef.current) {
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const rules = STAGE_FEEDBACK[data.id]?.checks || [];
      const failedCheck = rules.find(rule => rule.test(data.text));
      if (failedCheck) {
        setFeedback(failedCheck.message);
        setFeedbackKey(k => k + 1);
      } else {
        setFeedback(null);
      }
    }
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback, feedbackKey]);

  return (
    <div className="relative mb-10 last:mb-0">
      <AnimatePresence>
        {isActive && !data.locked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className="absolute -left-80 top-0 w-72 hidden xl:block pointer-events-none"
          >
            <div className="glass-card p-6 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(225,29,72,0.12)] border border-rose-100 relative">
              <div className="absolute top-10 -right-2 w-4 h-4 glass-card border-t border-r border-rose-100 rotate-45" />
              <div className="flex items-center gap-2 text-rose-500 mb-2">
                <MessageCircle size={20} className="shrink-0" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Think about</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-semibold italic">
                "{data.prompts[currentPromptIndex]}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        onClick={!data.locked ? onActivate : undefined}
        className={`
          cursor-pointer rounded-[2.5rem] transition-all duration-700 border-2
          ${data.locked 
            ? 'bg-rose-50/20 border-rose-100/50 opacity-90' 
            : isActive 
              ? 'bg-white border-rose-500 shadow-[0_40px_80px_-15px_rgba(225,29,72,0.18)] ring-[12px] ring-rose-50/40' 
              : 'bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-rose-200'
          }
        `}
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-tighter ${data.locked ? 'bg-slate-100 text-slate-400' : 'bg-rose-100 text-rose-600'}`}>
                {data.id === 'problem' ? '1' : data.id === 'people' ? '2' : '3'}
              </div>
              <h3 className={`text-2xl font-black tracking-tight ${data.locked ? 'text-slate-400' : 'text-slate-900'}`}>
                {data.label}
              </h3>
            </div>
            {data.locked && <CheckCircle2 className="text-rose-500" size={32} strokeWidth={2.5} />}
          </div>

          <AnimatePresence mode="wait">
            {isActive && !data.locked ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <textarea
                  ref={textareaRef}
                  autoFocus
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  className="w-full h-48 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 focus:border-rose-300 focus:ring-0 text-slate-900 placeholder:text-slate-300 resize-none transition-all font-medium leading-relaxed text-lg"
                  placeholder={starter}
                  value={data.text}
                  onChange={(e) => onUpdate(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      key={feedbackKey}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold ${
                        feedback.startsWith('⚠️')
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-rose-50 border border-rose-100 text-rose-700'
                      }`}
                    >
                      {feedback}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {data.text.length < MIN_CHAR_COUNT ? (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {Math.max(0, MIN_CHAR_COUNT - data.text.length)} more characters
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Keep refining or get suggestions
                      </span>
                    )}
                  </div>
                  {data.text.length >= MIN_CHAR_COUNT && !data.locked && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetSuggestions();
                      }}
                      disabled={isLoadingSuggestions}
                      className="flex items-center gap-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(225,29,72,0.4)] transition-all"
                    >
                      {isLoadingSuggestions ? (
                        <>
                          <Loader2 size={16} strokeWidth={3} className="animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} strokeWidth={3} />
                          Suggestions
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-rose-700 uppercase tracking-wide">
                          Suggestions from Gemini
                        </h4>
                        <button
                          onClick={closeSuggestions}
                          className="text-rose-400 hover:text-rose-600 transition-colors"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-rose-500 font-bold shrink-0 text-sm">
                              {index + 1}.
                            </span>
                            <span className="text-slate-700 text-sm leading-relaxed">
                              {suggestion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReadyToLock();
                  }}
                  className="glow-button w-full flex items-center justify-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(225,29,72,0.4)] transition-all"
                >
                  Lock it in <Lock size={16} strokeWidth={3} />
                </motion.button>
              </motion.div>
            ) : !data.locked && (
              <div className="text-slate-400 text-base font-medium line-clamp-1 italic px-2 opacity-60">
                {data.text || "Tap to start writing..."}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
