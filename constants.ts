
import { StageData, Instruction, PowerSkillsApp } from './types';

// Power Skills Apps - the 4 pre-built options
export const POWER_SKILLS_APPS: PowerSkillsApp[] = [
  {
    id: 'coach',
    name: 'Power Skills Coach',
    description: 'An interactive app that teaches one Power Skill at a time using lessons, tips, and mini-challenges to help you level up',
    icon: '🎯'
  },
  {
    id: 'quiz',
    name: 'Power Skills Profile Quiz',
    description: 'A fun quiz that reveals your Power Skills strengths and growth areas with a personalised profile you can share',
    icon: '📊'
  },
  {
    id: 'daily',
    name: 'Daily Power Challenge',
    description: 'A daily app that gives you a new real-world micro-challenge tied to a different Power Skill each day',
    icon: '⚡'
  },
  {
    id: 'scenarios',
    name: 'Power Skills Scenarios',
    description: 'A choose-your-own-adventure app where you face real-life situations and discover which Power Skills you use',
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
  why: "People would use this app because ",
  who: "The people who'd love this app are ",
  what: "This app helps people by ",
  how: "When you open the app, the first thing you do is "
};

// Hardwired guidance prompts (shown on focus, not AI-generated)
export const STAGE_GUIDANCE: Record<string, string[]> = {
  why: [
    "What would make someone want to open this app?",
    "Finish this sentence: 'I wish there was an app that...'",
    "Why would this be fun or useful for someone your age?"
  ],
  who: [
    "Think of one person you know who'd love this — what are they like?",
    "How old are they? What do they care about?",
    "When would they use this — at school, at home, on the bus?"
  ],
  what: [
    "If you had 10 seconds to explain this app to a friend, what would you say?",
    "What's the main thing someone actually does in your app?",
    "What does someone get out of using it?"
  ],
  how: [
    "What's the very first thing someone sees or does when they open it?",
    "What happens in the middle — do they choose something, answer something, get a tip?",
    "How does it finish — what does the app show them or give them at the end?"
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
  // Design - What should it look like?
  { category: 'design', text: 'Clean and modern looking' },
  { category: 'design', text: 'Fun colours and animations' },
  { category: 'design', text: 'Simple to navigate' },
  { category: 'design', text: 'Looks great on phones' },

  // Functionality - What should it be able to do?
  { category: 'functionality', text: 'Tells you how you\'re doing as you go' },
  { category: 'functionality', text: 'Changes based on your answers' },
  { category: 'functionality', text: 'Earns you points, badges, or streaks' },
  { category: 'functionality', text: 'Lets you share results with friends' },
  { category: 'functionality', text: 'Saves where you left off' },

  // Users - How should it feel to use?
  { category: 'users', text: 'Feels friendly and encouraging' },
  { category: 'users', text: 'Quick to use — not a big time commitment' },
  { category: 'users', text: 'Gives you real tips, not just info' },
  { category: 'users', text: 'Makes you want to come back' }
];
