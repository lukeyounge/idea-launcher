
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageId, AppState, Instruction, PowerSkillsApp } from './types';
import { STAGE_CONFIG, DEFAULT_INSTRUCTIONS } from './constants';
import { StageBox } from './components/StageBox';
import { InstructionChip } from './components/InstructionChip';
import { PowerSkillsPicker } from './components/PowerSkillsPicker';
import { ProgressVisual } from './components/ProgressVisual';
import { synthesizePrompt } from './services/geminiService';
import {
  RefreshCcw,
  Layout,
  Zap,
  Heart,
  Plus,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Copy,
  Loader2,
  Pencil,
  CheckCircle2,
  Layers
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'idea-launcher-power-skills-v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      stages: {
        why: { ...STAGE_CONFIG.why, text: '', locked: false },
        who: { ...STAGE_CONFIG.who, text: '', locked: false },
        what: { ...STAGE_CONFIG.what, text: '', locked: false },
        how: { ...STAGE_CONFIG.how, text: '', locked: false }
      },
      instructions: DEFAULT_INSTRUCTIONS.map((instr, idx) => ({
        ...instr,
        id: `default-${idx}`,
        isApproved: false
      })),
      hasLaunched: false,
      selectedApp: null,
      appName: ''
    };
  });

  const [view, setView] = useState<'picker' | 'workspace' | 'details' | 'final_review'>('picker');
  const [activeStageId, setActiveStageId] = useState<StageId | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [customInput, setCustomInput] = useState<Record<string, string>>({
    design: '',
    functionality: '',
    users: '',
    screens: ''
  });
  const [synthesizedPrompt, setSynthesizedPrompt] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [customIdeaText, setCustomIdeaText] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Synthesize prompt when entering final_review
  useEffect(() => {
    if (view === 'final_review' && !synthesizedPrompt && !isSynthesizing) {
      const triggerSynthesis = async () => {
        setIsSynthesizing(true);
        const approved = state.instructions.filter(i => i.isApproved);
        const designItems = approved.filter(i => i.category === 'design').map(i => i.text);
        const functionalityItems = approved.filter(i => i.category === 'functionality').map(i => i.text);
        const userItems = approved.filter(i => i.category === 'users').map(i => i.text);
        const screenItems = approved.filter(i => i.category === 'screens').map(i => i.text);

        const result = await synthesizePrompt(
          state.appName || state.selectedApp?.name || 'Power Skills App',
          state.stages.why.text,
          state.stages.who.text,
          state.stages.what.text,
          state.stages.how.text,
          designItems,
          functionalityItems,
          userItems,
          screenItems
        );
        setSynthesizedPrompt(result.prompt);
        setIsSynthesizing(false);
      };

      triggerSynthesis();
    }
  }, [view]);

  const updateStageText = (id: StageId, text: string) => {
    setState(prev => ({
      ...prev,
      stages: { ...prev.stages, [id]: { ...prev.stages[id], text } }
    }));
  };

  const lockStage = (id: StageId) => {
    setState(prev => ({
      ...prev,
      stages: { ...prev.stages, [id]: { ...prev.stages[id], locked: true } }
    }));
    setActiveStageId(null);
  };

  const toggleInstruction = (id: string) => {
    setState(prev => ({
      ...prev,
      instructions: prev.instructions.map(inst =>
        inst.id === id ? { ...inst, isApproved: !inst.isApproved } : inst
      )
    }));
  };

  const addCustomInstruction = (category: 'design' | 'functionality' | 'users') => {
    const text = customInput[category].trim();
    if (!text) return;
    const newInstruction: Instruction = {
      id: `custom-${Date.now()}`,
      category,
      text,
      isApproved: true,
      isCustom: true
    };
    setState(prev => ({ ...prev, instructions: [...prev.instructions, newInstruction] }));
    setCustomInput(prev => ({ ...prev, [category]: '' }));
  };

  const allStagesLocked = state.stages.why.locked && state.stages.who.locked && state.stages.what.locked && state.stages.how.locked;
  const approvedCount = state.instructions.filter(i => i.isApproved).length;
  const approvedByCategory = {
    design: state.instructions.some(i => i.isApproved && i.category === 'design'),
    functionality: state.instructions.some(i => i.isApproved && i.category === 'functionality'),
    users: state.instructions.some(i => i.isApproved && i.category === 'users'),
    screens: state.instructions.some(i => i.isApproved && i.category === 'screens'),
  };
  const allCategoriesCovered = approvedByCategory.design && approvedByCategory.functionality && approvedByCategory.users && approvedByCategory.screens;
  const canProgressToReview = allCategoriesCovered && state.appName.trim().length > 0;

  const handleReset = () => {
    setState({
      stages: {
        why: { ...STAGE_CONFIG.why, text: '', locked: false },
        who: { ...STAGE_CONFIG.who, text: '', locked: false },
        what: { ...STAGE_CONFIG.what, text: '', locked: false },
        how: { ...STAGE_CONFIG.how, text: '', locked: false }
      },
      instructions: DEFAULT_INSTRUCTIONS.map((instr, idx) => ({
        ...instr,
        id: `default-${idx}`,
        isApproved: false
      })),
      hasLaunched: false,
      selectedApp: null,
      appName: ''
    });
    setView('picker');
    setActiveStageId(null);
    setCustomInput({ design: '', functionality: '', users: '' });
    setSynthesizedPrompt(null);
    setIsSynthesizing(false);
    setCustomIdeaText('');
  };

  const handleAppSelect = (app: PowerSkillsApp | null, customIdea?: string) => {
    setState(prev => ({
      ...prev,
      selectedApp: app,
      appName: app?.name || ''
    }));
    if (customIdea) {
      setCustomIdeaText(customIdea);
    }
    setView('workspace');
  };

  const generatePromptText = () => {
    if (synthesizedPrompt) {
      return synthesizedPrompt;
    }
    return 'Generating prompt...';
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePromptText());
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

  const handleResynthesis = async () => {
    setSynthesizedPrompt(null);
    setIsSynthesizing(true);
    const approved = state.instructions.filter(i => i.isApproved);
    const designItems = approved.filter(i => i.category === 'design').map(i => i.text);
    const functionalityItems = approved.filter(i => i.category === 'functionality').map(i => i.text);
    const userItems = approved.filter(i => i.category === 'users').map(i => i.text);

    const result = await synthesizePrompt(
      state.appName || state.selectedApp?.name || 'Power Skills App',
      state.stages.why.text,
      state.stages.who.text,
      state.stages.what.text,
      state.stages.how.text,
      designItems,
      functionalityItems,
      userItems
    );
    setSynthesizedPrompt(result.prompt);
    setIsSynthesizing(false);
  };

  // Section headings for the details view
  const SECTION_CONFIG = [
    { id: 'design', label: "What should it look like?", icon: <Layout className="text-rose-600" size={24} />, description: 'The vibe, colours, and style of your app' },
    { id: 'functionality', label: "What should it do?", icon: <Zap className="text-slate-900" size={24} />, description: 'The features people will actually use' },
    { id: 'users', label: "How should it feel to use?", icon: <Heart className="text-rose-500" size={24} />, description: 'The experience someone has when they open it' },
    { id: 'screens', label: "What screens does it need?", icon: <Layers className="text-slate-700" size={24} />, description: 'The key pages or views your app has' }
  ];

  return (
    <>
      {view === 'picker' ? (
        <PowerSkillsPicker onSelect={handleAppSelect} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative overflow-visible">

          {/* Visual background glows */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200 radial-glow opacity-30" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 radial-glow opacity-30" />

          <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-[-0.05em] flex items-center gap-4 justify-center md:justify-start leading-none">
                  Idea<span className="red-gradient-text">Launcher</span>
                </h1>
                <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                  <div className="h-[2px] w-12 bg-rose-500 rounded-full" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">SBF Vibe Coding Workshop</p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="group text-slate-400 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 px-6 py-4 border border-slate-100 rounded-2xl hover:bg-rose-50/30 hover:border-rose-100"
                title="Start over"
              >
                <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Start Over
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {view === 'workspace' ? (
              <>
                {/* Selected app banner */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 w-full glass-card bg-white/80 backdrop-blur-md border border-rose-100/60 px-8 py-6 rounded-2xl shadow-lg"
                >
                  <p className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] mb-2">You've chosen to build:</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {state.selectedApp ? state.selectedApp.name : 'Your own Power Skills idea'}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {state.selectedApp ? state.selectedApp.description : customIdeaText || 'A custom app to help students develop their Power Skills'}
                  </p>
                </motion.div>

                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
                >
                  {/* Progress Visual */}
                  <div className="lg:col-span-4 flex justify-center order-2 lg:order-1">
                    <div className="sticky top-8">
                      <ProgressVisual
                        whyLocked={state.stages.why.locked}
                        whoLocked={state.stages.who.locked}
                        whatLocked={state.stages.what.locked}
                        howLocked={state.stages.how.locked}
                        onContinue={() => setView('details')}
                      />
                    </div>
                  </div>

                  {/* Stage Boxes */}
                  <div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
                    <StageBox
                      data={state.stages.why}
                      isActive={activeStageId === 'why'}
                      onActivate={() => setActiveStageId('why')}
                      onUpdate={(val) => updateStageText('why', val)}
                      onReadyToLock={() => lockStage('why')}
                    />
                    <StageBox
                      data={state.stages.who}
                      isActive={activeStageId === 'who'}
                      onActivate={() => setActiveStageId('who')}
                      onUpdate={(val) => updateStageText('who', val)}
                      onReadyToLock={() => lockStage('who')}
                    />
                    <StageBox
                      data={state.stages.what}
                      isActive={activeStageId === 'what'}
                      onActivate={() => setActiveStageId('what')}
                      onUpdate={(val) => updateStageText('what', val)}
                      onReadyToLock={() => lockStage('what')}
                    />
                    <StageBox
                      data={state.stages.how}
                      isActive={activeStageId === 'how'}
                      onActivate={() => setActiveStageId('how')}
                      onUpdate={(val) => updateStageText('how', val)}
                      onReadyToLock={() => lockStage('how')}
                    />
                  </div>
                </motion.div>
              </>
            ) : view === 'details' ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-12 max-w-5xl mx-auto"
              >
                <div className="flex items-end justify-between border-b border-slate-100 pb-8">
                  <button onClick={() => setView('workspace')} className="group flex items-center gap-4 text-slate-400 hover:text-rose-600 transition-all font-black uppercase tracking-[0.25em] text-[11px]">
                    <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-rose-50 transition-colors">
                      <ArrowLeft size={18} />
                    </div>
                    Back
                  </button>
                  <div className="text-right">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Make it yours</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Name it & pick the details</p>
                  </div>
                </div>

                {/* Locked Foundations Recap */}
                <section className="glass-card rounded-[2.5rem] p-6 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-4 px-4 pb-4">
                    <div className="p-3 bg-white shadow-lg rounded-2xl">
                      <CheckCircle2 className="text-emerald-500" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">Here's what you said</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Your locked-in ideas from before</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(['why', 'who', 'what', 'how'] as StageId[]).map(stageId => {
                      const stage = state.stages[stageId];
                      return (
                        <div key={stage.id} className="bg-white p-6 rounded-[2rem] shadow-[0_8px_24px_rgba(0,0,0,0.02)] flex flex-col">
                          <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] mb-2">{stage.label}</h4>
                          <p className="text-slate-700 text-sm font-medium leading-relaxed">"{stage.text}"</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* App Naming Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white shadow-lg rounded-2xl">
                      <Pencil className="text-rose-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">What's it called?</h3>
                      <p className="text-slate-500 text-sm">Give your app a name — something catchy works best</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={state.appName}
                    onChange={(e) => setState(prev => ({ ...prev, appName: e.target.value }))}
                    placeholder="e.g., SkillBoost, PowerUp, MySkills..."
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-rose-400 focus:ring-0 text-lg font-bold text-slate-900 placeholder:text-slate-300 transition-colors"
                  />
                </section>

                {/* Implementation Details */}
                <div className="space-y-12">
                  {SECTION_CONFIG.map(section => (
                    <section key={section.id} className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-2xl">{section.icon}</div>
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{section.label}</h3>
                        </div>
                        <p className="text-slate-500 text-sm font-medium ml-16 italic">{section.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {state.instructions.filter(i => i.category === section.id).map(instr => (
                          <InstructionChip
                            key={instr.id}
                            instruction={instr}
                            onToggle={() => toggleInstruction(instr.id)}
                            onDelete={() => setState(p => ({ ...p, instructions: p.instructions.filter(x => x.id !== instr.id) }))}
                          />
                        ))}
                        <div className="flex items-center gap-3 p-2 bg-white border-2 border-dashed border-slate-100 rounded-2xl group hover:border-rose-300 transition-all focus-within:border-rose-400 pr-4">
                          <input
                            className="flex-1 bg-transparent px-5 py-4 text-sm font-bold outline-none placeholder:text-slate-300"
                            placeholder="Add your own..."
                            value={customInput[section.id]}
                            onChange={(e) => setCustomInput(p => ({ ...p, [section.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomInstruction(section.id as any)}
                          />
                          <button onClick={() => addCustomInstruction(section.id as any)} className="bg-rose-50 p-3 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                            <Plus size={20} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {/* Ready to Synthesize Footer */}
                <div className="sticky bottom-8 left-0 right-0 flex justify-center z-50 px-6">
                  <motion.div
                    layout
                    className={`w-full max-w-2xl px-8 py-6 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(225,29,72,0.35)] flex items-center justify-between gap-6 border-4 border-white backdrop-blur-2xl ${canProgressToReview ? 'bg-rose-600 text-white' : 'bg-white/80 text-slate-400'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg ${canProgressToReview ? 'bg-rose-800' : 'bg-slate-100'}`}>
                        {approvedCount}
                      </div>
                      <div className="hidden sm:flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Details Selected</span>
                        <span className="text-sm font-black">
                          {!state.appName.trim() ? 'Add a name first' : canProgressToReview ? 'Ready to synthesize!' : `Pick from: ${[!approvedByCategory.design && 'Look', !approvedByCategory.functionality && 'Features', !approvedByCategory.users && 'Feel'].filter(Boolean).join(', ')}`}
                        </span>
                      </div>
                    </div>

                    {canProgressToReview ? (
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setView('final_review')}
                        className="glow-button bg-white text-rose-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.2)] uppercase tracking-[0.15em] text-[11px]"
                      >
                        Synthesize <ChevronRight size={18} strokeWidth={3} />
                      </motion.button>
                    ) : (
                      <div className="bg-slate-50/50 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest opacity-60">
                        Not ready yet
                      </div>
                    )}
                  </motion.div>
                </div>
                <div className="h-24" />
              </motion.div>
            ) : (
              <motion.div
                key="final_review"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 max-w-5xl mx-auto"
              >
                <div className="text-center">
                  <h2 className="text-5xl font-black text-slate-900 tracking-[-0.03em] leading-tight">Your Prompt is Ready!</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-4">Copy & paste into Google AI Studio</p>
                </div>

                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-rose-50 relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-200 rounded-t-[3rem]" />

                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-rose-50 rounded-2xl">
                      <FileText className="text-rose-600" size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Generated Prompt</h3>
                      <p className="text-slate-500 text-sm">For "{state.appName || state.selectedApp?.name || 'Your App'}"</p>
                    </div>
                  </div>

                  {isSynthesizing ? (
                    <div className="bg-slate-950 rounded-2xl p-10 text-rose-100 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner min-h-[400px] border border-slate-800 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                          <Loader2 size={32} className="text-rose-400" strokeWidth={2} />
                        </motion.div>
                        <p className="text-rose-400 font-black uppercase tracking-widest text-sm">Synthesizing your prompt...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 rounded-2xl p-8 text-rose-100 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner min-h-[400px] max-h-[500px] overflow-y-auto border border-slate-800">
                      {generatePromptText()}
                    </div>
                  )}

                  <div className="mt-10 flex flex-col items-center justify-center gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setView('details')}
                        className="bg-slate-50 text-slate-500 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-slate-100 transition-all border border-slate-100"
                      >
                        <ArrowLeft size={18} /> Back
                      </motion.button>
                      {synthesizedPrompt && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleResynthesis}
                          disabled={isSynthesizing}
                          className="bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-slate-200 transition-all border border-slate-200 disabled:opacity-50"
                        >
                          <Sparkles size={16} /> Regenerate
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyPrompt}
                        disabled={isSynthesizing}
                        className="glow-button bg-rose-600 text-white px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(225,29,72,0.3)] uppercase tracking-[0.2em] text-xs disabled:opacity-50 hover:bg-rose-700 transition-all"
                      >
                        {showCopySuccess ? (
                          <>Copied! <Sparkles size={18} strokeWidth={2.5} className="text-amber-300" /></>
                        ) : (
                          <>Copy to Clipboard <Copy size={18} strokeWidth={2.5} /></>
                        )}
                      </motion.button>
                    </div>
                    <p className="text-center text-slate-500 text-sm font-semibold max-w-md">
                      Paste this prompt into Google AI Studio to start building your Power Skills app!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer spacer */}
          <div className="h-24" />
        </div>
      )}
    </>
  );
};

export default App;
