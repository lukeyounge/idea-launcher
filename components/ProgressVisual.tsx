import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';

interface ProgressVisualProps {
  whyLocked: boolean;
  whoLocked: boolean;
  whatLocked: boolean;
  howLocked: boolean;
  onContinue?: () => void;
}

export const ProgressVisual: React.FC<ProgressVisualProps> = ({
  whyLocked,
  whoLocked,
  whatLocked,
  howLocked,
  onContinue
}) => {
  const allLocked = whyLocked && whoLocked && whatLocked && howLocked;
  const lockedCount = [whyLocked, whoLocked, whatLocked, howLocked].filter(Boolean).length;

  const blocks = [
    { id: 'why', label: 'WHY', locked: whyLocked, position: { x: 25, y: 25 }, delay: 0 },
    { id: 'who', label: 'WHO', locked: whoLocked, position: { x: 115, y: 25 }, delay: 0.05 },
    { id: 'what', label: 'WHAT', locked: whatLocked, position: { x: 25, y: 115 }, delay: 0.1 },
    { id: 'how', label: 'HOW', locked: howLocked, position: { x: 115, y: 115 }, delay: 0.15 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Backglow when all locked */}
      <AnimatePresence>
        {allLocked && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0.4 }}
            className="absolute w-80 h-80 bg-rose-400 rounded-full blur-3xl"
          />
        )}
      </AnimatePresence>

      {/* Building blocks visual */}
      <div className="relative">
        <svg viewBox="0 0 220 220" className="w-64 h-64 md:w-72 md:h-72">
          {/* Definitions for gradients */}
          <defs>
            <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="unlockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines (subtle) */}
          <motion.line
            x1="95" y1="60" x2="125" y2="60"
            stroke={whyLocked && whoLocked ? '#fb7185' : '#475569'}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: whyLocked && whoLocked ? 1 : 0.3 }}
          />
          <motion.line
            x1="95" y1="150" x2="125" y2="150"
            stroke={whatLocked && howLocked ? '#fb7185' : '#475569'}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: whatLocked && howLocked ? 1 : 0.3 }}
          />
          <motion.line
            x1="60" y1="95" x2="60" y2="125"
            stroke={whyLocked && whatLocked ? '#fb7185' : '#475569'}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: whyLocked && whatLocked ? 1 : 0.3 }}
          />
          <motion.line
            x1="150" y1="95" x2="150" y2="125"
            stroke={whoLocked && howLocked ? '#fb7185' : '#475569'}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: whoLocked && howLocked ? 1 : 0.3 }}
          />

          {/* Building blocks */}
          {blocks.map((block) => (
            <g key={block.id}>
              {/* Glow effect for locked blocks */}
              {block.locked && (
                <motion.rect
                  x={block.position.x - 5}
                  y={block.position.y - 5}
                  width="80"
                  height="80"
                  rx="16"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    strokeWidth: [2, 4, 2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: block.delay
                  }}
                  filter="url(#glow)"
                />
              )}

              {/* Main block */}
              <motion.rect
                x={block.position.x}
                y={block.position.y}
                width="70"
                height="70"
                rx="14"
                fill={block.locked ? 'url(#lockedGradient)' : 'url(#unlockedGradient)'}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{
                  scale: block.locked ? 1 : 0.9,
                  opacity: block.locked ? 1 : 0.4
                }}
                transition={{ duration: 0.5, delay: block.delay }}
                style={{ transformOrigin: `${block.position.x + 35}px ${block.position.y + 35}px` }}
              />

              {/* Block label */}
              <motion.text
                x={block.position.x + 35}
                y={block.position.y + 42}
                textAnchor="middle"
                fill={block.locked ? 'white' : '#64748b'}
                className="font-black text-sm"
                style={{ fontSize: '14px' }}
                animate={{ opacity: block.locked ? 1 : 0.5 }}
              >
                {block.label}
              </motion.text>

              {/* Checkmark when locked */}
              {block.locked && (
                <motion.circle
                  cx={block.position.x + 58}
                  cy={block.position.y + 12}
                  r="10"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.2 }}
                />
              )}
              {block.locked && (
                <motion.path
                  d={`M${block.position.x + 53} ${block.position.y + 12} L${block.position.x + 57} ${block.position.y + 16} L${block.position.x + 64} ${block.position.y + 8}`}
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                />
              )}
            </g>
          ))}

          {/* Center piece when all locked */}
          <AnimatePresence>
            {allLocked && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <circle cx="110" cy="110" r="25" fill="white" />
                <motion.circle
                  cx="110" cy="110" r="25"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  strokeDasharray="5 5"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Zap icon in center when all locked */}
        <AnimatePresence>
          {allLocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Zap className="text-rose-600" size={28} strokeWidth={2.5} fill="#e11d48" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress text */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-black text-slate-800 mb-2">
          {allLocked ? 'Your idea is ready!' : 'Building Your Idea'}
        </h3>
        <p className="text-slate-500 font-semibold">
          {allLocked
            ? 'All pieces locked in'
            : `${lockedCount}/4 pieces complete`}
        </p>
      </motion.div>

      {/* Continue button */}
      <AnimatePresence>
        {allLocked && onContinue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="mt-8 px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg shadow-rose-500/30 flex items-center gap-3 uppercase tracking-wider text-sm transition-colors"
          >
            Continue to Details
            <ChevronRight size={20} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
