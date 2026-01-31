
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

export const SPARK_BUILD_OPTIONS = [
  'a countdown timer for anything',
  'a random excuse generator',
  'a mood tracker that actually looks good',
  'a study buddy that keeps me honest',
  'a decision maker for when I can\'t choose',
  'a hype-up tool before big moments',
  'a playlist generator based on my vibe',
  'a habit streak tracker',
  'a "what should I eat" picker',
  'a daily challenge generator'
];

export const SPARK_PROBLEM_OPTIONS = [
  'forgetting stuff I need to do',
  'not being able to focus',
  'feeling bored with nothing to do',
  'making small decisions takes forever',
  'losing motivation halfway through',
  'explaining things to people who don\'t get it',
  'not knowing what to say in awkward moments',
  'never sticking to habits',
  'feeling overwhelmed by too many options'
];

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
