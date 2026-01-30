
import React, { useState, useEffect } from 'react';
import { StageData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, MessageCircle } from 'lucide-react';

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
  const isReady = data.text.length >= 100 && !data.locked;
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    if (data.text.length > 60) setCurrentPromptIndex(2);
    else if (data.text.length > 30) setCurrentPromptIndex(1);
    else setCurrentPromptIndex(0);
  }, [data.text]);

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
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Strategist</span>
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
                {data.id === 'problem' ? 'P1' : data.id === 'people' ? 'P2' : 'S3'}
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
                className="space-y-6"
              >
                <textarea
                  autoFocus
                  className="w-full h-48 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 focus:border-rose-300 focus:ring-0 text-slate-900 placeholder:text-slate-300 resize-none transition-all font-medium leading-relaxed text-lg"
                  placeholder="The best ideas start with clear writing..."
                  value={data.text}
                  onChange={(e) => onUpdate(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-40 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-rose-400 to-rose-600"
                        animate={{ width: `${Math.min(100, (data.text.length / 100) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {Math.max(0, 100 - data.text.length)} chars to unlock
                    </span>
                  </div>
                  {isReady && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReadyToLock();
                      }}
                      className="glow-button flex items-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(225,29,72,0.4)] transition-all"
                    >
                      Confirm Dimension <Lock size={16} strokeWidth={3} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : !data.locked && (
              <div className="text-slate-400 text-base font-medium line-clamp-1 italic px-2 opacity-60">
                {data.text || "Tap to articulate this stage..."}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
