
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageId, AppState, Instruction } from './types';
import { STAGE_CONFIG, DEFAULT_INSTRUCTIONS } from './constants';
import { StageBox } from './components/StageBox';
import { InstructionChip } from './components/InstructionChip';
import { SparkMode } from './components/SparkMode';
import { RocketShip } from './components/RocketShip';
import { 
  Rocket, 
  Lock, 
  RefreshCcw, 
  Layout, 
  Zap, 
  Users, 
  ClipboardCheck, 
  Copy,
  Plus,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  FileText,
  ThumbsUp,
  Clock,
  Settings2,
  Bell,
  Eye,
  ZapIcon
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'idea-launcher-state-red-v5';
const STAGE_TIMER_SECONDS = 20;

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
        problem: { ...STAGE_CONFIG.problem, label: 'The Struggle', text: '', locked: false },
        people: { ...STAGE_CONFIG.people, label: 'The Crowd', text: '', locked: false },
        solution: { ...STAGE_CONFIG.solution, label: 'The Big Idea', text: '', locked: false }
      },
      instructions: DEFAULT_INSTRUCTIONS.map((instr, idx) => ({
        ...instr,
        id: `default-${idx}`,
        isApproved: false
      })),
      hasLaunched: false,
      sparkSelections: []
    };
  });

  const [view, setView] = useState<'spark' | 'workspace' | 'approval' | 'final_review'>('spark');
  const [activeStageId, setActiveStageId] = useState<StageId | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isPromptApproved, setIsPromptApproved] = useState(false);
  const [customInput, setCustomInput] = useState<Record<string, string>>({
    design: '',
    functionality: '',
    users: ''
  });

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Nudge logic
  useEffect(() => {
    if (!isTimerActive) return;
    
    if (timerSeconds === STAGE_TIMER_SECONDS) {
      setNudge("Struggle defined? Let's talk about The Crowd next!");
    } else if (timerSeconds === STAGE_TIMER_SECONDS * 2) {
      setNudge("Almost done? Time to lock in The Big Idea!");
    } else if (timerSeconds === STAGE_TIMER_SECONDS * 3) {
      setNudge("Wrapping up! Let's move to the Launcher Circle.");
    }

    if (nudge) {
      const timer = setTimeout(() => setNudge(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [timerSeconds, isTimerActive]);

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
    setIsPromptApproved(false);
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
    setIsPromptApproved(false);
  };

  const allStagesLocked = (Object.values(state.stages) as import('./types').StageData[]).every(s => s.locked);
  const approvedCount = state.instructions.filter(i => i.isApproved).length;
  const canProgressToReview = approvedCount >= 5;

  const handleReset = () => {
    setState({
      stages: {
        problem: { ...STAGE_CONFIG.problem, label: 'The Struggle', text: '', locked: false },
        people: { ...STAGE_CONFIG.people, label: 'The Crowd', text: '', locked: false },
        solution: { ...STAGE_CONFIG.solution, label: 'The Big Idea', text: '', locked: false }
      },
      instructions: DEFAULT_INSTRUCTIONS.map((instr, idx) => ({
        ...instr,
        id: `default-${idx}`,
        isApproved: false
      })),
      hasLaunched: false,
      sparkSelections: []
    });
    setView('spark');
    setActiveStageId(null);
    setIsTimerActive(false);
    setTimerSeconds(0);
    setNudge(null);
    setIsPromptApproved(false);
    setCustomInput({ design: '', functionality: '', users: '' });
  };

  const handleSparkSelect = (idea: string) => {
    setState(prev => ({ ...prev, sparkSelections: [idea] }));
    setView('workspace');
  };

  const generatePromptText = () => {
    const approved = state.instructions.filter(i => i.isApproved);
    const design = approved.filter(i => i.category === 'design').map(i => `- ${i.text}`).join('\n');
    const func = approved.filter(i => i.category === 'functionality').map(i => `- ${i.text}`).join('\n');
    const users = approved.filter(i => i.category === 'users').map(i => `- ${i.text}`).join('\n');

    return `I want to build an app that fixes this struggle: "${state.stages.problem.text}"
For this crowd: "${state.stages.people.text}"
The big fix: "${state.stages.solution.text}"

VISUAL VIBE:
${design || "- Premium, clean aesthetic"}

HOW IT WORKS:
${func || "- Smooth, interactive features"}

USER FEELINGS:
${users || "- Designed specifically for the crowd mentioned above"}

Build this using React and Tailwind CSS. Make it look high-class and vibe-code ready.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePromptText());
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

  return (
    <>
      {view === 'spark' ? (
        <SparkMode
          onSelect={handleSparkSelect}
        />
      ) : (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative overflow-visible">
      
      {/* Visual background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200 radial-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 radial-glow" />

      {/* Workshop Timer Pill */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
        <AnimatePresence>
          {!isTimerActive ? (
            <motion.button 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => { setIsTimerActive(true); setTimerSeconds(0); }}
              className="flex items-center gap-3 glass-card text-slate-600 px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-white transition-all border-rose-50/50"
            >
              <Clock size={14} strokeWidth={2.5} className="text-rose-500" /> Start Session
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed left-12 top-32 z-50 flex flex-col items-center gap-3"
            >
              <div className="flex flex-col items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/30 px-6 py-5 rounded-full shadow-xl hover:bg-slate-900/90 transition-colors">
                <span className="text-white font-black font-mono text-3xl tracking-widest">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => setIsTimerActive(false)}
                className="text-white/50 hover:text-rose-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                title="Stop timer"
              >
                <Settings2 size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-32 gap-12">
        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-[-0.05em] flex items-center gap-6 justify-center md:justify-start leading-none">
              Idea<span className="red-gradient-text">Launcher</span>
            </h1>
            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
              <div className="h-[2px] w-12 bg-rose-500 rounded-full" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[11px]">You've got the spark. Now make it specific enough to build.</p>
            </div>
          </motion.div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="group text-slate-400 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 px-6 py-4 border border-slate-100 rounded-2xl hover:bg-rose-50/30 hover:border-rose-100"
            title="Clear all progress and start over"
          >
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Reset Space
          </button>
        </div>
      </header>

      {/* Nudge Notification */}
      <AnimatePresence>
        {nudge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] bg-slate-700/70 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-full shadow-xl flex items-center gap-3 max-w-md"
          >
            <Bell size={18} className="text-rose-400 flex-shrink-0 animate-pulse" strokeWidth={2} />
            <p className="text-sm font-semibold tracking-tight">{nudge}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'workspace' ? (
          <>
            {/* Persistent context banner */}
            {(state.sparkSelections.length > 0 || state.synthesisConceptTitle) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 mb-8 w-full glass-card bg-white/60 backdrop-blur-md border border-rose-100/60 px-8 py-5 rounded-2xl shadow-lg"
              >
                {state.synthesisConceptTitle && (
                  <div className="mb-4 pb-4 border-b border-rose-100/50">
                    <p className="text-xs font-black text-rose-600 uppercase tracking-[0.15em] mb-1">🚀 Building From Your Sparks:</p>
                    <p className="text-lg font-black text-slate-900">{state.synthesisConceptTitle}</p>
                  </div>
                )}
                {state.sparkSelections.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] mb-3">Ideas you caught:</p>
                    <div className="flex flex-wrap gap-2">
                      {state.sparkSelections.slice(0, 5).map((item) => (
                        <span key={item} className="text-xs bg-rose-100/70 text-rose-900 font-semibold px-3 py-1.5 rounded-full">
                          {item}
                        </span>
                      ))}
                      {state.sparkSelections.length > 5 && (
                        <span className="text-xs text-slate-500 px-3 py-1.5 font-semibold">
                          +{state.sparkSelections.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center"
            >
              <div className="lg:col-span-5 flex justify-center order-2 lg:order-1 relative">
              {/* Backglow for the circle */}
              <AnimatePresence>
                {allStagesLocked && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.4 }}
                    className="absolute inset-0 bg-rose-300 radial-glow z-0"
                  />
                )}
              </AnimatePresence>

              <div className="relative w-full h-[600px] z-10 flex items-center justify-center">
                <RocketShip
                  problemLocked={state.stages.problem.locked}
                  peopleLocked={state.stages.people.locked}
                  solutionLocked={state.stages.solution.locked}
                  onLaunch={() => setView('approval')}
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <StageBox data={state.stages.problem} isActive={activeStageId === 'problem'} onActivate={() => setActiveStageId('problem')} onUpdate={(val) => updateStageText('problem', val)} onReadyToLock={() => lockStage('problem')} />
              <StageBox data={state.stages.people} isActive={activeStageId === 'people'} onActivate={() => setActiveStageId('people')} onUpdate={(val) => updateStageText('people', val)} onReadyToLock={() => lockStage('people')} />
              <StageBox data={state.stages.solution} isActive={activeStageId === 'solution'} onActivate={() => setActiveStageId('solution')} onUpdate={(val) => updateStageText('solution', val)} onReadyToLock={() => lockStage('solution')} />
            </div>
            </motion.div>
            </>
        ) : view === 'approval' ? (
          <motion.div 
            key="approval"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-20 max-w-6xl mx-auto"
          >
            <div className="flex items-end justify-between border-b border-slate-100 pb-12">
              <button onClick={() => setView('workspace')} className="group flex items-center gap-4 text-slate-400 hover:text-rose-600 transition-all font-black uppercase tracking-[0.25em] text-[11px]">
                <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-rose-50 transition-colors">
                  <ArrowLeft size={18} />
                </div>
                Back to Synthesis
              </button>
              <div className="text-right">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Vibe Logic</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Picking The Implementation Nodes</p>
              </div>
            </div>

            {/* Premium Strategy Recap */}
            <section className="glass-card rounded-[3.5rem] p-2 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
               <div className="flex items-center gap-4 px-10 py-6">
                 <div className="w-2 h-2 rounded-full bg-rose-500" />
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Locked Foundations</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 {[state.stages.problem, state.stages.people, state.stages.solution].map(stage => (
                   <div key={stage.id} className="bg-white p-10 rounded-[3rem] shadow-[0_8px_24px_rgba(0,0,0,0.02)] flex flex-col min-h-[180px]">
                     <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] mb-4">{stage.label}</h4>
                     <p className="text-slate-800 text-base font-semibold leading-relaxed italic">"{stage.text}"</p>
                   </div>
                 ))}
               </div>
            </section>

            <div className="space-y-16">
              {[
                { id: 'design', label: 'Visual Language', icon: <Layout className="text-rose-600" /> },
                { id: 'functionality', label: 'Engine Capabilities', icon: <Zap className="text-slate-900" /> },
                { id: 'users', label: 'Human Experience', icon: <Users className="text-rose-500" /> }
              ].map(cat => (
                <section key={cat.id} className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="p-5 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.05)] rounded-[1.5rem]">{cat.icon}</div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{cat.label}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {state.instructions.filter(i => i.category === cat.id).map(instr => (
                      <InstructionChip key={instr.id} instruction={instr} onToggle={() => toggleInstruction(instr.id)} onDelete={() => setState(p => ({ ...p, instructions: p.instructions.filter(x => x.id !== instr.id) }))} />
                    ))}
                    <div className="flex items-center gap-3 p-2 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] group hover:border-rose-300 transition-all focus-within:border-rose-400 pr-4">
                      <input 
                        className="flex-1 bg-transparent px-6 py-5 text-sm font-bold outline-none placeholder:text-slate-300" 
                        placeholder="Add nuance..." 
                        value={customInput[cat.id]}
                        onChange={(e) => setCustomInput(p => ({ ...p, [cat.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomInstruction(cat.id as any)}
                      />
                      <button onClick={() => addCustomInstruction(cat.id as any)} className="bg-rose-50 p-4 rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <Plus size={24} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Sync Prompt Footer */}
            <div className="sticky bottom-12 left-0 right-0 flex justify-center z-50 px-6">
              <motion.div layout className={`w-full max-w-2xl px-10 py-7 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(225,29,72,0.35)] flex items-center justify-between gap-8 border-4 border-white backdrop-blur-2xl ${canProgressToReview ? 'bg-rose-600 text-white' : 'bg-white/80 text-slate-400'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-lg ${canProgressToReview ? 'bg-rose-800' : 'bg-slate-100'}`}>
                    {approvedCount}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Nodes Locked</span>
                    <span className="text-base font-black">{canProgressToReview ? 'System Ready' : `${5 - approvedCount} pending selection`}</span>
                  </div>
                </div>

                {canProgressToReview ? (
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setView('final_review')} 
                    className="glow-button bg-white text-rose-600 px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.2)] uppercase tracking-[0.15em] text-[11px]"
                  >
                    Sync Brief <ChevronRight size={20} strokeWidth={3} />
                  </motion.button>
                ) : (
                  <div className="bg-slate-50/50 px-8 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest opacity-60">
                    Awaiting Sync
                  </div>
                )}
              </motion.div>
            </div>
            <div className="h-32" />
          </motion.div>
        ) : (
          <motion.div 
            key="final_review"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 max-w-5xl mx-auto"
          >
            <div className="text-center">
              <h2 className="text-6xl font-black text-slate-900 tracking-[-0.03em] leading-tight">Master Selection</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-4">Verification & Activation</p>
            </div>

            <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-rose-50 relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-200" />
              
              <div className="flex items-center gap-5 mb-12">
                <div className="p-4 bg-rose-50 rounded-3xl">
                  <FileText className="text-rose-600" size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Constructed Prompt</h3>
              </div>
              
              <div className="bg-slate-950 rounded-[2.5rem] p-10 text-rose-100 font-mono text-base leading-relaxed whitespace-pre-wrap shadow-inner min-h-[450px] border border-slate-800">
                {generatePromptText()}
              </div>

              <div className="mt-12 flex flex-col items-center justify-center gap-8">
                {!isPromptApproved ? (
                  <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setView('approval')}
                      className="bg-slate-50 text-slate-500 px-12 py-6 rounded-[2.25rem] font-black flex items-center justify-center gap-4 uppercase tracking-widest text-xs hover:bg-slate-100 transition-all border border-slate-100"
                    >
                      Refine Details <ArrowLeft size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPromptApproved(true)}
                      className="glow-button bg-rose-600 text-white px-16 py-6 rounded-[2.25rem] font-black flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(225,29,72,0.3)] uppercase tracking-[0.2em] text-xs"
                    >
                      Confirm Build <ThumbsUp size={20} strokeWidth={3} />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-8 w-full">
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-[0.2em] text-sm"
                    >
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <CheckCircle size={22} strokeWidth={3} />
                      </div>
                      System Validated
                    </motion.div>
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsPromptApproved(false)}
                        className="bg-white border-2 border-slate-100 text-slate-400 px-12 py-6 rounded-[2.25rem] font-black uppercase tracking-widest text-xs hover:border-slate-300 transition-all"
                      >
                        Roll Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyPrompt}
                        className="glow-button bg-slate-900 text-white px-20 py-7 rounded-[2.25rem] font-black flex items-center justify-center gap-5 shadow-[0_30px_60px_rgba(0,0,0,0.3)] uppercase tracking-[0.3em] text-lg hover:bg-black transition-all"
                      >
                        {showCopySuccess ? (
                          <>Brief Secured! <Sparkles className="text-amber-400" /></>
                        ) : (
                          <>Extract Prompt <Copy size={28} strokeWidth={2.5} /></>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-slate-300 text-[11px] font-black uppercase tracking-[0.3em] px-12 leading-relaxed max-w-lg">
                Activate the sync to push your strategy into Google AI Studio. 
                Your architectural journey begins now.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer spacer */}
      <div className="h-40" />
      </div>
      )}
    </>
  );
};

export default App;
