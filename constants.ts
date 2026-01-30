
import { StageData, Instruction } from './types';

export const STAGE_CONFIG: Record<string, Omit<StageData, 'text' | 'locked'>> = {
  problem: {
    id: 'problem',
    label: 'The Problem',
    prompts: [
      "What problem or challenge are you trying to address?",
      "Why does this problem matter? What happens if nothing changes?",
      "Can you give a specific example of this problem in action?"
    ]
  },
  people: {
    id: 'people',
    label: 'The People',
    prompts: [
      "Who specifically experiences this problem? Describe them.",
      "What do these people currently do to cope with this problem?",
      "If your solution worked perfectly, what would change in their daily life?"
    ]
  },
  solution: {
    id: 'solution',
    label: 'The Solution',
    prompts: [
      "What should your app or tool actually DO? (Focus on actions, not features)",
      "What's the ONE thing it must do really well?",
      "What should it NOT try to do? (What's out of scope?)"
    ]
  }
};

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
