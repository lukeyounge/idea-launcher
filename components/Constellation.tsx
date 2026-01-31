import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConstellationProps {
  selections: string[];
  onRemove: (item: string) => void;
}

export const Constellation: React.FC<ConstellationProps> = ({ selections, onRemove }) => {
  // Calculate positions for constellation points
  const positions = useMemo(() => {
    return selections.map((_, i) => {
      const angle = (i / selections.length) * Math.PI * 2;
      const radius = 60 + Math.random() * 20;
      return {
        x: Math.cos(angle) * radius + 100,
        y: Math.sin(angle) * radius + 60,
      };
    });
  }, [selections.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent backdrop-blur-md border-t border-white/10 p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Constellation Title */}
        <div className="text-center mb-6">
          <p className="text-slate-300 text-sm font-semibold uppercase tracking-[0.2em]">
            ✨ Your Constellation
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {selections.length} idea{selections.length !== 1 ? 's' : ''} captured
          </p>
        </div>

        {/* Constellation Visualization */}
        {selections.length > 0 && (
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative h-40 flex items-center justify-center"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 120"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Constellation lines */}
              {selections.length > 1 && (
                <g stroke="rgba(251, 113, 133, 0.2)" strokeWidth="1" fill="none">
                  {positions.map((pos, i) => {
                    const nextPos = positions[(i + 1) % positions.length];
                    return (
                      <line
                        key={`line-${i}`}
                        x1={pos.x}
                        y1={pos.y}
                        x2={nextPos.x}
                        y2={nextPos.y}
                      />
                    );
                  })}
                </g>
              )}

              {/* Constellation points */}
              {positions.map((pos, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill="rgba(251, 113, 133, 0.8)"
                  animate={{
                    r: [4, 6, 4],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </svg>

            {/* Interactive orbs */}
            <div className="absolute inset-0 flex items-center justify-center">
              {selections.map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => onRemove(item)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="absolute w-8 h-8 rounded-full bg-rose-500/40 border border-rose-400/60 hover:bg-rose-500/60 transition-colors cursor-pointer group"
                  style={{
                    left: `${(positions[i].x / 400) * 100}%`,
                    top: `${(positions[i].y / 120) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title="Click to remove"
                >
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white bg-slate-900/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions text */}
        {selections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-slate-400 mt-6"
          >
            {selections.length < 3 ? (
              <p>Select at least {3 - selections.length} more to explore →</p>
            ) : (
              <p className="text-rose-300 font-semibold">Ready to go deeper! ✨</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
