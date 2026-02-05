import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPARK_BUBBLES } from '@/constants';
import { FloatingBubble } from './FloatingBubble';
import { ParticleField } from './ParticleField';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

interface SparkModeProps {
  onSelect: (idea: string) => void;
}

const OWN_IDEA_BUBBLE = { text: '✨ Got my own idea', emoji: '💡' };

export const SparkMode: React.FC<SparkModeProps> = ({ onSelect }) => {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [showOwnIdeaInput, setShowOwnIdeaInput] = useState(false);
  const [ownIdea, setOwnIdea] = useState('');

  const allBubbles = useMemo(() => {
    const cols = 3;
    const rows = 4;
    const padX = 120;
    const padY = 140;
    const colW = (window.innerWidth - padX * 2) / cols;
    const rowH = (window.innerHeight - padY * 2) / rows;

    return SPARK_BUBBLES.map((bubble, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      // Offset every other row a bit for a more natural look
      const offsetX = row % 2 === 1 ? colW * 0.3 : 0;
      return {
        ...bubble,
        id: `bubble-${i}`,
        size: 100 + (i % 3) * 15,
        x: padX + col * colW + offsetX + (Math.random() - 0.5) * 30,
        y: padY + row * rowH + (Math.random() - 0.5) * 20,
      };
    });
  }, []);

  const handleSelect = (text: string) => {
    if (text === OWN_IDEA_BUBBLE.text) {
      setShowOwnIdeaInput(true);
      return;
    }
    setSelectedBubble(text);
    setTimeout(() => {
      onSelect(text);
    }, 600);
  };

  const handleOwnIdeaSubmit = () => {
    if (ownIdea.trim().length > 0) {
      setSelectedBubble(ownIdea.trim());
      setTimeout(() => {
        onSelect(ownIdea.trim());
      }, 600);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <ParticleField />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pointer-events-none" />

      {/* Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {allBubbles.map((bubble) => (
          <div key={bubble.id} className="pointer-events-auto">
            <FloatingBubble
              id={bubble.id}
              text={`${bubble.emoji} ${bubble.text}`}
              colorClass="from-rose-400 to-pink-400"
              glowColor="rgba(251, 113, 133, 1)"
              isSelected={selectedBubble === bubble.text}
              onSelect={() => handleSelect(bubble.text)}
              position={{ x: bubble.x, y: bubble.y }}
              size={bubble.size}
            />
          </div>
        ))}

        {/* Own idea bubble - different colour (amber/gold) */}
        {!showOwnIdeaInput && !selectedBubble && (
          <div className="pointer-events-auto">
            <FloatingBubble
              id="own-idea-bubble"
              text={OWN_IDEA_BUBBLE.text}
              colorClass="from-amber-400 to-yellow-500"
              glowColor="rgba(251, 191, 36, 1)"
              isSelected={false}
              onSelect={() => handleSelect(OWN_IDEA_BUBBLE.text)}
              position={{ x: window.innerWidth * 0.75, y: window.innerHeight * 0.7 }}
              size={120}
            />
          </div>
        )}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 right-8 z-30 flex items-start justify-between"
      >
        <div className="flex items-center gap-3">
          <Sparkles size={32} className="text-rose-400" />
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Pick your spark</h1>
            <p className="text-slate-400 text-sm mt-1">What sounds fun to build?</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('')}
          className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all font-semibold text-sm backdrop-blur-sm"
        >
          Skip <ChevronRight size={18} strokeWidth={2.5} />
        </motion.button>
      </motion.div>

      {/* Own idea input modal */}
      <AnimatePresence>
        {showOwnIdeaInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-black text-white mb-2">What's your idea?</h2>
              <p className="text-slate-400 text-sm mb-6">Describe the app you want to build in a sentence or two.</p>
              <textarea
                autoFocus
                className="w-full h-32 p-4 bg-slate-800 border border-slate-600 focus:border-rose-500 rounded-2xl text-white placeholder:text-slate-500 resize-none outline-none text-base leading-relaxed"
                placeholder="e.g. A app that helps friends hold each other accountable..."
                value={ownIdea}
                onChange={(e) => setOwnIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleOwnIdeaSubmit();
                  }
                }}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowOwnIdeaInput(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border border-slate-600 text-slate-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleOwnIdeaSubmit}
                  disabled={ownIdea.trim().length === 0}
                  className="flex-1 px-6 py-3 rounded-2xl bg-rose-600 text-white font-black text-sm disabled:opacity-40 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
                >
                  Let's go <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected bubble confirmation - shows briefly before transitioning */}
      <AnimatePresence>
        {selectedBubble && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-0 right-0 z-40 flex justify-center"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4 shadow-xl">
              <p className="text-white text-center font-semibold">
                Nice! You want to build: <span className="text-rose-300 font-black">"{selectedBubble}"</span>
              </p>
              <p className="text-slate-400 text-xs text-center mt-1">Taking you there...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
