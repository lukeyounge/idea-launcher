
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

export const SPARK_SOLUTION_SEEDS = [
  'A bet you make with friends',
  'A mirror that shows your patterns',
  'Reminders that actually work',
  'A no-judgment progress tracker',
  'A timer that knows when you\'re stuck',
  'Shared promises with real stakes',
  'A decision-maker that learns you',
  'The smallest possible to-do list',
  'A focus mode that locks distractions',
  'Accountability through visibility',
  'A streak tracker you can\'t ignore',
  'Group check-ins that feel human',
  'Morning intentions, evening reflections',
  'One thing at a time, enforced',
  'A clarity journal that asks questions',
  'The right nudge at the right time',
  'Progress bars for life goals',
  'A commitment ring for your team'
];

export const SPARK_BUILD_OPTIONS = SPARK_SOLUTION_SEEDS;

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
