import React from 'react';
import { motion } from 'framer-motion';

interface SparkBubbleProps {
  text: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const SparkBubble: React.FC<SparkBubbleProps> = ({ text, isSelected, onToggle }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`
        px-5 py-3 rounded-full font-semibold text-sm transition-all
        ${isSelected
          ? 'bg-rose-500 text-white border-2 border-rose-600 shadow-lg shadow-rose-500/30'
          : 'bg-white/70 text-slate-700 border-2 border-white/50 hover:bg-white/90 glass-card'
        }
      `}
    >
      {text}
    </motion.button>
  );
};
