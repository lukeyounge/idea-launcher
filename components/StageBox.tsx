
import React, { useState, useEffect, useRef } from 'react';
import { StageData } from '../types';
import { STAGE_STARTERS, STAGE_FEEDBACK, STAGE_GUIDANCE } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Loader2, Sparkles, X, Lightbulb } from 'lucide-react';
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
  const [showGuidance, setShowGuidance] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const starter = STAGE_STARTERS[data.id] || '';

  // Scroll the box into view when it becomes active (helps on mobile with keyboard)
  useEffect(() => {
    if (isActive && boxRef.current) {
      // Small delay to let the expansion animation start
      setTimeout(() => {
        boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isActive]);
  const guidance = STAGE_GUIDANCE[data.id] || [];

  // Minimum character threshold before AI feedback button is available
  const MIN_CHAR_COUNT = 50;

  // Stage number for display
  const stageNumber = data.id === 'why' ? 1 : data.id === 'who' ? 2 : data.id === 'what' ? 3 : 4;

  // Stage descriptions
  const stageDescriptions: Record<string, string> = {
    why: 'Why does this app need to exist?',
    who: 'Who will use this app?',
    what: 'What does the app do?',
    how: 'How does it work?'
  };

  // Update prompt index based on text length
  useEffect(() => {
    if (data.text.length > 100) setCurrentPromptIndex(2);
    else if (data.text.length > 50) setCurrentPromptIndex(1);
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

  const dismissSuggestion = (index: number) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  const closeSuggestions = () => {
    setSuggestions([]);
  };

  const handleFocus = () => {
    setShowGuidance(true);
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
    if (e.key === 'Enter' && !e.shiftKey) {
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
    <div ref={boxRef} className="relative mb-6 last:mb-0">
      {/* Guidance panel - shows on left when active (desktop only) */}
      <AnimatePresence>
        {isActive && !data.locked && showGuidance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className="absolute -left-80 top-0 w-72 hidden xl:block pointer-events-none"
          >
            <div className="glass-card p-6 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(225,29,72,0.12)] border border-rose-100 relative">
              <div className="absolute top-10 -right-2 w-4 h-4 glass-card border-t border-r border-rose-100 rotate-45" />
              <div className="flex items-center gap-2 text-rose-500 mb-3">
                <Lightbulb size={18} className="shrink-0" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Think about</span>
              </div>
              <ul className="space-y-3">
                {guidance.map((prompt, index) => (
                  <li key={index} className="text-sm text-slate-700 leading-relaxed flex gap-2">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
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
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${data.locked ? 'bg-rose-100 text-rose-500' : 'bg-rose-100 text-rose-600'}`}>
                {stageNumber}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-black tracking-tight ${data.locked ? 'text-slate-400' : 'text-slate-900'}`}>
                  {data.label}
                </h3>
                <p className={`text-xs mt-1 ${data.locked ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stageDescriptions[data.id]}
                </p>
              </div>
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
                {/* Mobile guidance - shows above textarea on small screens */}
                {showGuidance && (
                  <div className="xl:hidden bg-rose-50 rounded-2xl p-4 border border-rose-100">
                    <div className="flex items-center gap-2 text-rose-600 mb-2">
                      <Lightbulb size={16} strokeWidth={2.5} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Think about</span>
                    </div>
                    <ul className="space-y-1.5">
                      {guidance.map((prompt, index) => (
                        <li key={index} className="text-xs text-slate-600 flex gap-2">
                          <span className="text-rose-400">•</span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <textarea
                  ref={textareaRef}
                  autoFocus
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  className="w-full h-40 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 focus:border-rose-300 focus:ring-0 text-slate-900 placeholder:text-slate-300 resize-none transition-all font-medium leading-relaxed text-base"
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
                      className="rounded-2xl px-5 py-3 text-sm font-semibold bg-rose-50 border border-rose-100 text-rose-700"
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
                        Looking good! Get AI feedback or lock it in
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
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      {isLoadingSuggestions ? (
                        <>
                          <Loader2 size={14} strokeWidth={3} className="animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} strokeWidth={3} />
                          Get AI Feedback
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                {/* AI Suggestions panel */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-rose-500" />
                          <h4 className="text-sm font-black text-rose-700 uppercase tracking-wide">
                            AI Suggestions
                          </h4>
                        </div>
                        <button
                          onClick={closeSuggestions}
                          className="text-rose-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 border border-rose-100 flex gap-3 items-start"
                          >
                            <span className="text-slate-700 text-sm leading-relaxed flex-1">
                              {suggestion}
                            </span>
                            <button
                              onClick={() => dismissSuggestion(index)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-lg transition-colors shrink-0"
                              title="Dismiss"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReadyToLock();
                  }}
                  className="glow-button w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(225,29,72,0.4)] transition-all"
                >
                  Lock it in <Lock size={16} strokeWidth={3} />
                </motion.button>
              </motion.div>
            ) : !data.locked && (
              <div className="text-slate-400 text-base font-medium line-clamp-2 italic px-2 opacity-60">
                {data.text || "Tap to start writing..."}
              </div>
            )}
          </AnimatePresence>

          {/* Show locked text */}
          {data.locked && (
            <div className="text-slate-600 text-base font-medium leading-relaxed italic">
              "{data.text}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
