import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POWER_SKILLS_APPS } from '../constants';
import { PowerSkillsApp } from '../types';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface PowerSkillsPickerProps {
  onSelect: (app: PowerSkillsApp | null, customIdea?: string) => void;
}

interface PhoneMockupCardProps {
  app: PowerSkillsApp;
  index: number;
  onSelect: () => void;
}

const PhoneMockupCard: React.FC<PhoneMockupCardProps> = ({ app, index, onSelect }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-[2rem] p-6 border border-slate-700/50 hover:border-rose-500/50 transition-all duration-300 shadow-xl hover:shadow-rose-500/10"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:to-rose-500/10 transition-all duration-300" />

      {/* Phone frame */}
      <div className="relative mx-auto w-36 aspect-[9/16] bg-slate-950 rounded-2xl border-4 border-slate-700 overflow-hidden mb-5 shadow-inner">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-slate-700 rounded-b-xl" />

        {/* App preview content */}
        <div className="pt-8 px-3 h-full flex flex-col">
          {/* App icon */}
          <div className="text-4xl mb-2">{app.icon}</div>

          {/* Mini app title */}
          <div className="text-white/90 text-[10px] font-bold leading-tight mb-2">
            {app.name}
          </div>

          {/* Fake UI elements */}
          <div className="space-y-1.5 mt-auto mb-4">
            <div className="h-2 bg-rose-500/40 rounded-full w-full" />
            <div className="h-2 bg-slate-700 rounded-full w-3/4" />
            <div className="h-2 bg-slate-700 rounded-full w-1/2" />
          </div>

          {/* Fake button */}
          <div className="bg-rose-500/60 rounded-lg py-1.5 mb-3">
            <div className="text-[8px] text-white font-bold text-center">START</div>
          </div>
        </div>
      </div>

      {/* App details */}
      <div className="relative text-center">
        <h3 className="text-lg font-black text-white mb-2 group-hover:text-rose-300 transition-colors">
          {app.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
          {app.description}
        </p>
      </div>

      {/* Select indicator */}
      <motion.div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
      >
        <div className="bg-rose-500 text-white p-2 rounded-full">
          <ArrowRight size={16} strokeWidth={3} />
        </div>
      </motion.div>
    </motion.button>
  );
};

export const PowerSkillsPicker: React.FC<PowerSkillsPickerProps> = ({ onSelect }) => {
  const [showOwnIdeaInput, setShowOwnIdeaInput] = useState(false);
  const [ownIdea, setOwnIdea] = useState('');

  const handleOwnIdeaSubmit = () => {
    if (ownIdea.trim().length > 0) {
      onSelect(null, ownIdea.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-[-0.05em] flex items-center gap-2 justify-center leading-none mb-2">
              Idea<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">Launcher</span>
            </h1>
            <div className="flex items-center gap-4 justify-center">
              <div className="h-[2px] w-12 bg-rose-500 rounded-full" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">SBF Vibe Coding Workshop</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Let's make something cool around the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
              Power Skills!
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Here are 4 apps you can vibe code with no coding experience
          </p>
        </motion.header>

        {/* App cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {POWER_SKILLS_APPS.map((app, index) => (
            <PhoneMockupCard
              key={app.id}
              app={app}
              index={index}
              onSelect={() => onSelect(app)}
            />
          ))}
        </div>

        {/* Footer instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-400 text-base font-semibold mt-12 mb-8"
        >
          Choose one, or build your own idea based on the SBF Power Skills
        </motion.p>

        {/* Build your own option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOwnIdeaInput(true)}
            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wide transition-all"
          >
            <Lightbulb size={16} strokeWidth={2.5} />
            Build your own idea
          </motion.button>
        </motion.div>
      </div>

      {/* Own idea modal */}
      <AnimatePresence>
        {showOwnIdeaInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Lightbulb className="text-amber-400" size={24} />
                </div>
                <h2 className="text-2xl font-black text-white">Your own idea</h2>
              </div>

              <p className="text-slate-400 text-sm mb-6 ml-12">
                Describe your Power Skills app idea in a sentence or two. Remember, it should help students develop their Power Skills!
              </p>

              <textarea
                autoFocus
                className="w-full h-36 p-5 bg-slate-800 border border-slate-600 focus:border-rose-500 rounded-2xl text-white placeholder:text-slate-500 resize-none outline-none text-base leading-relaxed transition-colors"
                placeholder="e.g. An app that helps friends challenge each other to practice their Power Skills daily..."
                value={ownIdea}
                onChange={(e) => setOwnIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleOwnIdeaSubmit();
                  }
                }}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowOwnIdeaInput(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-sm font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleOwnIdeaSubmit}
                  disabled={ownIdea.trim().length === 0}
                  className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black text-sm disabled:opacity-40 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
                >
                  Let's build it <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
