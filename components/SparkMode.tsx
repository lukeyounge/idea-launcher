import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPARK_BUILD_OPTIONS, SPARK_PROBLEM_OPTIONS } from '@/constants';
import { SparkBubble } from './SparkBubble';
import { Sparkles, ArrowRight, SkipForward } from 'lucide-react';

interface SparkModeProps {
  selections: string[];
  onSelectionsChange: (selections: string[]) => void;
  onProceed: () => void;
}

export const SparkMode: React.FC<SparkModeProps> = ({ selections, onSelectionsChange, onProceed }) => {
  const [activeTab, setActiveTab] = useState<'build' | 'fix'>('build');

  const toggleSelection = (item: string) => {
    if (selections.includes(item)) {
      onSelectionsChange(selections.filter(s => s !== item));
    } else {
      onSelectionsChange([...selections, item]);
    }
  };

  const canProceed = selections.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-white via-rose-50/30 to-white px-6 py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <Sparkles size={32} className="text-rose-500" />
            <h1 className="text-5xl md:text-6xl font-black text-slate-900">Spark Mode</h1>
          </motion.div>
          <p className="text-slate-500 text-lg max-w-xl">
            Tap the ideas that resonate with you. This helps us understand what excites you.
          </p>
        </div>

        {/* Skip Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onProceed}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-sm font-semibold uppercase tracking-[0.1em]"
          >
            I already know what I want <SkipForward size={16} />
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Build Track */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Things I'd want to build</h2>
            <div className="space-y-3 flex flex-wrap gap-3">
              {SPARK_BUILD_OPTIONS.map((item) => (
                <SparkBubble
                  key={item}
                  text={item}
                  isSelected={selections.includes(item)}
                  onToggle={() => toggleSelection(item)}
                />
              ))}
            </div>
          </motion.div>

          {/* Fix Track */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Things that bug me</h2>
            <div className="space-y-3 flex flex-wrap gap-3">
              {SPARK_PROBLEM_OPTIONS.map((item) => (
                <SparkBubble
                  key={item}
                  text={item}
                  isSelected={selections.includes(item)}
                  onToggle={() => toggleSelection(item)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Selection Counter and Proceed Button */}
        <div className="flex flex-col items-center gap-6 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4">
          <motion.div
            animate={{ scale: selections.length > 0 ? 1 : 0.95 }}
            className="text-center"
          >
            <p className="text-slate-600 font-semibold mb-2">
              {selections.length} spark{selections.length !== 1 ? 's' : ''} collected
            </p>
            <AnimatePresence>
              {selections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-slate-500 max-w-md"
                >
                  <p className="line-clamp-2">{selections.join(', ')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{
              opacity: canProceed ? 1 : 0.5,
              scale: canProceed ? 1 : 0.95
            }}
            whileHover={canProceed ? { scale: 1.05 } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
            onClick={onProceed}
            disabled={!canProceed}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-[0.1em] text-sm
              transition-all
              ${canProceed
                ? 'bg-rose-500 text-white shadow-lg hover:shadow-xl cursor-pointer'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            Ready to explore <ArrowRight size={18} />
          </motion.button>

          {!canProceed && (
            <p className="text-slate-400 text-sm">Select at least 3 sparks to continue</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
