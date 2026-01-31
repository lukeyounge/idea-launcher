
import { StageData, Instruction } from './types';

export const STAGE_CONFIG: Record<string, Omit<StageData, 'text' | 'locked'>> = {
  problem: {
    id: 'problem',
    label: 'The Struggle',
    prompts: [
      "What's the annoying thing you want to fix?",
      "Why is it actually a problem? What goes wrong because of it?",
      "Can you give a real example of when this happened?"
    ]
  },
  people: {
    id: 'people',
    label: 'The Crowd',
    prompts: [
      "Who actually deals with this? Describe them.",
      "What do they do right now to cope with it?",
      "If your app worked perfectly, what changes for them?"
    ]
  },
  solution: {
    id: 'solution',
    label: 'The Big Idea',
    prompts: [
      "What should your app actually do? (Think actions, not features)",
      "What's the ONE thing it has to do really well?",
      "What should it definitely NOT try to do?"
    ]
  }
};

// All spark bubbles are now problem-focused for groups
export const SPARK_PROBLEM_OPTIONS = [
  'losing focus when it matters most',
  'drowning in too many choices',
  'starting strong but fading halfway through',
  'forgetting the things we actually care about',
  'feeling scattered across too many apps',
  'wanting accountability but hating being nagged',
  'procrastinating on decisions until they make themselves',
  'knowing what to do but not doing it',
  'decision fatigue by lunchtime',
  'too many tabs, too many thoughts',
  'half-finished projects everywhere',
  'motivation that disappears after day one',
  'saying yes to everything, finishing nothing',
  'feeling behind even when we\'re not',
  'the guilt of an unused app library',
  'getting lost in planning instead of doing',
  'breaking promises we make to ourselves',
  'analysis paralysis on small things'
];

// Deprecated - now using only problems
export const SPARK_BUILD_OPTIONS = SPARK_PROBLEM_OPTIONS;

export const DEFAULT_INSTRUCTIONS: Omit<Instruction, 'id' | 'isApproved'>[] = [
  { category: 'design', text: 'Make it mobile-friendly and responsive' },
  { category: 'design', text: 'Use clear, simple language and typography' },
  { category: 'design', text: 'Apply a modern, minimalist color palette' },
  { category: 'design', text: 'Include intuitive navigation gestures' },

  { category: 'functionality', text: 'Prioritize fast loading times' },
  { category: 'functionality', text: 'Ensure core actions are reachable in one tap' },
  { category: 'functionality', text: 'Add helpful error messages and feedback' },
  { category: 'functionality', text: 'Keep state consistent across interactions' },
  { category: 'functionality', text: 'Include a simple onboarding sequence' },

  { category: 'users', text: 'Optimize for short, frequent usage sessions' },
  { category: 'users', text: 'Avoid technical jargon' },
  { category: 'users', text: 'Build with accessibility in mind' }
];
