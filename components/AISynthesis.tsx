import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  description: string;
  problemAngle: string;
  targetAudience: string;
  coreFunction: string;
}

interface AISynthesisProps {
  selections: string[];
  onSelect: (concept: Concept) => void;
  onBack: () => void;
}

// Mock concepts based on common patterns in selections
const MOCK_CONCEPTS: Concept[] = [
  {
    id: 'concept-1',
    title: 'ChooseMate',
    description: 'A "just pick for me" app that ends choice paralysis with confident suggestions',
    problemAngle: 'Decision fatigue and analysis paralysis when faced with too many options',
    targetAudience: 'Students and professionals who struggle with decision-making',
    coreFunction: 'Give users one smart, curated option and remove the burden of choice',
  },
  {
    id: 'concept-2',
    title: 'StreakKeeper',
    description: 'A streak-based accountability partner that makes consistency feel like a game',
    problemAngle: 'Losing motivation halfway through and struggling to stick to habits',
    targetAudience: 'Anyone trying to build lasting habits but lacking accountability',
    coreFunction: 'Gamify habit tracking with visual streaks and gentle nudges',
  },
  {
    id: 'concept-3',
    title: 'FocusFlow',
    description: 'A study buddy that holds you accountable with gentle, honest check-ins',
    problemAngle: 'Not being able to focus and feeling bored with nothing structured to do',
    targetAudience: 'Students and learners seeking an accountability partner',
    coreFunction: 'Create a judgment-free check-in system that keeps users on track',
  },
];

export const AISynthesis: React.FC<AISynthesisProps> = ({ selections, onSelect, onBack }) => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const handleSelect = (concept: Concept) => {
    setSelectedConcept(concept.id);
    setTimeout(() => {
      onSelect(concept);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-rose-300 transition-colors font-semibold uppercase text-xs tracking-[0.1em] px-4 py-2 rounded-full border border-slate-700 hover:border-rose-500/50"
          >
            <ArrowLeft size={16} /> Back to Sparks
          </button>
        </motion.div>

        {/* Title and intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} className="text-rose-400" />
            <h1 className="text-5xl font-black text-white tracking-tight">What Your Stars Say</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Based on your constellation of choices, here are three app concepts that match your creative direction.
          </p>
        </motion.div>

        {/* Your selections summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.1em] mb-3">
            ✨ Your Captured Sparks
          </p>
          <div className="flex flex-wrap gap-2">
            {selections.slice(0, 5).map((spark) => (
              <span
                key={spark}
                className="text-sm text-slate-200 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50"
              >
                {spark}
              </span>
            ))}
            {selections.length > 5 && (
              <span className="text-sm text-slate-400 px-3 py-1">
                + {selections.length - 5} more
              </span>
            )}
          </div>
        </motion.div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {MOCK_CONCEPTS.map((concept, index) => (
            <motion.button
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(concept)}
              className={`
                relative group text-left p-8 rounded-2xl border-2 transition-all duration-300
                ${
                  selectedConcept === concept.id
                    ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_40px_rgba(251,113,133,0.3)]'
                    : 'bg-slate-800/20 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/40'
                }
              `}
            >
              {/* Selection indicator */}
              {selectedConcept === concept.id && (
                <motion.div
                  layoutId="selectedConcept"
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm"
                >
                  ✓
                </motion.div>
              )}

              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-rose-300 transition-colors">
                {concept.title}
              </h3>

              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {concept.description}
              </p>

              <div className="space-y-3 text-xs text-slate-400">
                <div>
                  <p className="font-semibold text-slate-300 mb-1">The Problem</p>
                  <p>{concept.problemAngle}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-1">For Whom</p>
                  <p>{concept.targetAudience}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-1">Core Function</p>
                  <p>{concept.coreFunction}</p>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 text-xs font-semibold text-slate-400 group-hover:text-rose-300 transition-colors">
                Click to select →
              </div>
            </motion.button>
          ))}
        </div>

        {/* Custom option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            None of these feel right? You can write your own idea when you get to the workspace.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
