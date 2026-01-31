import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SPARK_BUILD_OPTIONS, SPARK_PROBLEM_OPTIONS } from '@/constants';
import { FloatingBubble } from './FloatingBubble';
import { ParticleField } from './ParticleField';
import { Constellation } from './Constellation';
import { Sparkles, ArrowRight, SkipForward } from 'lucide-react';

interface SparkModeProps {
  selections: string[];
  onSelectionsChange: (selections: string[]) => void;
  onProceed: () => void;
}

const BUBBLE_COLORS = {
  build: { glow: 'rgba(251, 113, 133, 1)', class: 'from-rose-400 to-pink-400' },
  problem: { glow: 'rgba(59, 130, 246, 1)', class: 'from-blue-400 to-cyan-400' },
};

export const SparkMode: React.FC<SparkModeProps> = ({ selections, onSelectionsChange, onProceed }) => {
  const [bubblePositions, setBubblePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Combine all options with categories
  const allBubbles = useMemo(() => {
    return [
      ...SPARK_BUILD_OPTIONS.map((text, i) => ({
        id: `build-${i}`,
        text,
        category: 'build' as const,
        size: 70 + Math.random() * 20,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight * 0.6),
      })),
      ...SPARK_PROBLEM_OPTIONS.map((text, i) => ({
        id: `problem-${i}`,
        text,
        category: 'problem' as const,
        size: 70 + Math.random() * 20,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight * 0.6),
      })),
    ];
  }, []);

  const toggleSelection = (text: string) => {
    if (selections.includes(text)) {
      onSelectionsChange(selections.filter(s => s !== text));
    } else {
      onSelectionsChange([...selections, text]);
    }
  };

  const canProceed = selections.length >= 3;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Particle field background */}
      <ParticleField />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pointer-events-none" />

      {/* Floating bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {allBubbles.map((bubble) => {
          const colorConfig = bubble.category === 'build' ? BUBBLE_COLORS.build : BUBBLE_COLORS.problem;
          return (
            <div key={bubble.id} className="pointer-events-auto">
              <FloatingBubble
                id={bubble.id}
                text={bubble.text}
                colorClass={colorConfig.class}
                glowColor={colorConfig.glow}
                isSelected={selections.includes(bubble.text)}
                onSelect={() => toggleSelection(bubble.text)}
                position={{ x: bubble.x, y: bubble.y }}
                size={bubble.size}
              />
            </div>
          );
        })}
      </div>

      {/* Header overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 right-8 z-30 pointer-events-none"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={32} className="text-rose-400" />
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Spark Mode</h1>
              <p className="text-slate-400 text-sm mt-1">Catch the ideas that resonate with you</p>
            </div>
          </div>
          <motion.button
            onClick={onProceed}
            whileHover={{ scale: 1.05 }}
            className="pointer-events-auto flex items-center gap-2 text-slate-300 hover:text-rose-300 transition-colors text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-full border border-slate-700 hover:border-rose-500/50"
          >
            Skip <SkipForward size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* Constellation at bottom */}
      <Constellation
        selections={selections}
        onRemove={(item) => toggleSelection(item)}
      />

      {/* Proceed button - floating */}
      {canProceed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-48 right-8 z-40 pointer-events-auto"
        >
          <motion.button
            onClick={onProceed}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-sm bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_0_40px_rgba(251,113,133,0.4)] hover:shadow-[0_0_60px_rgba(251,113,133,0.6)] transition-all"
          >
            Ready to explore <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
