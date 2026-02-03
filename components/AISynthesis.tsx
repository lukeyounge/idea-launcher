import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  oneLiner: string;
  problemAngle: string;
  targetAudience: string;
  coreFunction: string;
}

interface AISynthesisProps {
  selections: string[];
  onSelect: (concept: Concept) => void;
  onBack: () => void;
}

const MOCK_CONCEPTS: Concept[] = [
  {
    id: 'concept-1',
    title: 'Commitment Ring',
    oneLiner: 'Make promises visible to your group - what you commit to, everyone sees.',
    problemAngle: 'Breaking promises you make to yourself because no one else knows',
    targetAudience: 'Students who need accountability through visibility',
    coreFunction: 'Create shared commitments with simple yes/no check-ins that everyone can see',
  },
  {
    id: 'concept-2',
    title: 'The Clarity Mirror',
    oneLiner: 'Show you exactly where your time goes and where your focus breaks.',
    problemAngle: 'Feeling busy but never knowing what actually got done',
    targetAudience: 'People who lose track of what they accomplished',
    coreFunction: 'Track daily patterns and reflect them back without judgment',
  },
  {
    id: 'concept-3',
    title: 'The Right Nudge',
    oneLiner: 'Check-ins that feel human, not like notifications you ignore.',
    problemAngle: 'Getting so many reminders you ignore all of them',
    targetAudience: 'Groups that need gentle accountability without nagging',
    coreFunction: 'Send perfectly-timed, context-aware nudges that actually help',
  },
];

export const AISynthesis: React.FC<AISynthesisProps> = ({ selections, onSelect, onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (concept: Concept) => {
    setSelectedId(concept.id);
    setTimeout(() => {
      onSelect(concept);
    }, 600);
  };

  // Determine the theme from selections
  const hasAccountability = selections.some(s => 
    s.toLowerCase().includes('bet') || 
    s.toLowerCase().includes('promise') || 
    s.toLowerCase().includes('accountab') ||
    s.toLowerCase().includes('streak')
  );
  const hasFocus = selections.some(s => 
    s.toLowerCase().includes('focus') || 
    s.toLowerCase().includes('distract') || 
    s.toLowerCase().includes('timer') ||
    s.toLowerCase().includes('one thing')
  );
  const hasTracking = selections.some(s => 
    s.toLowerCase().includes('track') || 
    s.toLowerCase().includes('mirror') || 
    s.toLowerCase().includes('pattern') ||
    s.toLowerCase().includes('progress')
  );

  let themeInsight = 'Your group is drawn to ideas about focus, tracking, and commitment';
  if (hasAccountability && !hasFocus && !hasTracking) {
    themeInsight = 'Your group wants accountability - making promises real through visibility';
  } else if (hasFocus && !hasAccountability) {
    themeInsight = 'Your group is fighting distraction and wanting deeper focus';
  } else if (hasTracking) {
    themeInsight = 'Your group wants to see patterns - understanding where time and attention go';
  }

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
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={28} className="text-rose-400" />
            <h1 className="text-4xl font-black text-white tracking-tight">What Could These Become?</h1>
          </div>
        </motion.div>

        {/* Theme insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 to-rose-600/5 border border-rose-500/20 backdrop-blur-sm"
        >
          <p className="text-center text-rose-100 text-lg font-semibold">
            {themeInsight}
          </p>
        </motion.div>

        {/* Your selections summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.1em] mb-3">
            ✨ Ideas You Caught
          </p>
          <div className="flex flex-wrap gap-2">
            {selections.slice(0, 6).map((spark) => (
              <span
                key={spark}
                className="text-sm text-slate-200 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50"
              >
                {spark}
              </span>
            ))}
            {selections.length > 6 && (
              <span className="text-sm text-slate-400 px-3 py-1">
                + {selections.length - 6} more
              </span>
            )}
          </div>
        </motion.div>

        {/* Seed concepts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-[0.1em] mb-6 text-center">
            Here are three ways to build on your sparks:
          </p>
          <div className="space-y-4">
            {MOCK_CONCEPTS.map((concept, index) => (
              <motion.button
                key={concept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(concept)}
                className={`
                  relative w-full group text-left p-6 rounded-xl border-2 transition-all duration-300
                  ${
                    selectedId === concept.id
                      ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_40px_rgba(251,113,133,0.3)]'
                      : 'bg-slate-800/20 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/40'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-rose-300 transition-colors">
                      {concept.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {concept.oneLiner}
                    </p>
                  </div>
                  {selectedId === concept.id && (
                    <motion.div
                      layoutId="selectedConcept"
                      className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Custom option footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center pt-8 border-t border-slate-800"
        >
          <p className="text-slate-400 text-sm">
            These are sparks, not blueprints. Pick one to refine, or create your own in the workspace.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
