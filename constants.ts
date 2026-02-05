
import { StageData, Instruction, PowerSkillsApp } from './types';

// Power Skills Apps - the 4 pre-built options
export const POWER_SKILLS_APPS: PowerSkillsApp[] = [
  {
    id: 'coach',
    name: 'Power Skills Coach',
    description: 'An interactive app that teaches one Power Skill at a time using quizzes, examples, and challenges',
    icon: '🎯'
  },
  {
    id: 'self-check',
    name: 'Power Skills Self-Check',
    description: 'A quick tool that helps you reflect on your skills today and gives you personalised feedback',
    icon: '🪞'
  },
  {
    id: 'snapshot',
    name: 'Power Skills Snapshot Quiz',
    description: 'Answer questions and get a "Power Skills profile" with strengths and growth areas',
    icon: '📊'
  },
  {
    id: 'journey',
    name: 'Power Skills Story Journey',
    description: 'Explore Power Skills through interactive stories and decision-making scenarios',
    icon: '📖'
  }
];

export const STAGE_CONFIG: Record<string, Omit<StageData, 'text' | 'locked'>> = {
  why: {
    id: 'why',
    label: 'WHY',
    prompts: [
      "Why does this app need to exist?",
      "What problem are you solving for students?",
      "Why would someone use this instead of something else?"
    ]
  },
  who: {
    id: 'who',
    label: 'WHO',
    prompts: [
      "Who exactly will use this app?",
      "What do they care about most?",
      "What are their biggest challenges with Power Skills?"
    ]
  },
  what: {
    id: 'what',
    label: 'WHAT',
    prompts: [
      "What does the app actually do?",
      "What's the main thing users see and interact with?",
      "What makes this different or special?"
    ]
  },
  how: {
    id: 'how',
    label: 'HOW',
    prompts: [
      "How does it teach or develop Power Skills?",
      "How do users track their progress?",
      "How does it feel to use this app?"
    ]
  }
};

// Sentence starters for each stage box
export const STAGE_STARTERS: Record<string, string> = {
  why: "This app exists because ",
  who: "The people who need this are ",
  what: "The app helps by ",
  how: "It works by "
};

// Hardwired guidance prompts (shown on focus, not AI-generated)
export const STAGE_GUIDANCE: Record<string, string[]> = {
  why: [
    "Think about a moment when you or someone struggled with a Power Skill",
    "What would be different if this problem was solved?",
    "Why haven't existing tools fixed this?"
  ],
  who: [
    "Picture one specific person who would love this",
    "What's their daily life like?",
    "What frustrates them most about developing skills?"
  ],
  what: [
    "Describe the first thing users see when they open the app",
    "What's the ONE main action they take?",
    "What do they get out of it?"
  ],
  how: [
    "Walk through a typical use session step by step",
    "How does it connect to real Power Skills?",
    "What keeps users coming back?"
  ]
};

// Smart feedback rules for each stage - triggered when user hits enter
export const STAGE_FEEDBACK: Record<string, { checks: { test: (text: string) => boolean; message: string }[] }> = {
  why: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 Say a bit more - why is this important?" },
      { test: (t) => !t.includes(' ') || t.split(' ').length < 5, message: "💭 Try to explain it in a full sentence" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 Can you give an example of when this matters?" },
    ]
  },
  who: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 Who exactly? Be specific about your audience" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 What do they struggle with most?" },
    ]
  },
  what: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 What does it actually do? Describe the main thing" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 What's the ONE thing it does really well?" },
    ]
  },
  how: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 How does it work? Walk through the experience" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 How does it connect to the Power Skills?" },
    ]
  }
};

export const DEFAULT_INSTRUCTIONS: Omit<Instruction, 'id' | 'isApproved'>[] = [
  // Design - Let's think about how it looks
  { category: 'design', text: 'Clean, modern look that feels professional' },
  { category: 'design', text: 'Fun colours and friendly animations' },
  { category: 'design', text: 'Easy to navigate with clear buttons' },
  { category: 'design', text: 'Mobile-first design that works on phones' },

  // Functionality - What should it be able to do?
  { category: 'functionality', text: 'Quick progress feedback after each action' },
  { category: 'functionality', text: 'Personalised experience based on user input' },
  { category: 'functionality', text: 'Gamification elements (points, badges, streaks)' },
  { category: 'functionality', text: 'Share results with friends or mentors' },
  { category: 'functionality', text: 'Save progress and pick up later' },

  // Users - How should it make people feel?
  { category: 'users', text: 'Feels encouraging, not judgmental' },
  { category: 'users', text: 'Quick sessions (5-10 minutes max)' },
  { category: 'users', text: 'Gives actionable advice, not just theory' },
  { category: 'users', text: 'Celebrates small wins and progress' }
];
