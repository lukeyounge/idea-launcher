
import { StageData, Instruction } from './types';

export const STAGE_CONFIG: Record<string, Omit<StageData, 'text' | 'locked'>> = {
  problem: {
    id: 'problem',
    label: 'The Problem',
    prompts: [
      "What's actually bugging you or your mates about this?",
      "Like, when does this actually happen? Give me an example.",
      "Why does nobody just... fix this already?"
    ]
  },
  people: {
    id: 'people',
    label: 'The People',
    prompts: [
      "Who actually needs this? Be specific - a student? A teacher? Your friend group?",
      "What do they do RIGHT NOW to deal with this problem?",
      "If your app actually worked, what changes for them day to day?"
    ]
  },
  solution: {
    id: 'solution',
    label: 'The App',
    prompts: [
      "So what does your app actually DO? Like, the main thing.",
      "If it could only do ONE thing really well, what would that be?",
      "What should it definitely NOT try to do? (keep it simple!)"
    ]
  }
};

// Sentence starters for each stage box
export const STAGE_STARTERS: Record<string, string> = {
  problem: "Something that bugs me is ",
  people: "The people who'd use this are ",
  solution: "My app would "
};

// Smart feedback rules for each stage - triggered when user hits enter
export const STAGE_FEEDBACK: Record<string, { checks: { test: (text: string) => boolean; message: string }[] }> = {
  problem: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 Say a bit more - what actually happens because of this?" },
      { test: (t) => !t.includes(' ') || t.split(' ').length < 5, message: "💭 Try to explain it in a full sentence - what goes wrong?" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 Can you give an example of when this actually happens?" },
      { test: (t) => t.length >= 60 && !t.toLowerCase().includes('because') && !t.toLowerCase().includes('when') && !t.toLowerCase().includes('every'), message: "💭 Nice! Try adding when this happens or why it's annoying." },
    ]
  },
  people: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 Who exactly? A student like you? Someone younger? A group?" },
      { test: (t) => !t.toLowerCase().includes('student') && !t.toLowerCase().includes('friend') && !t.toLowerCase().includes('kid') && !t.toLowerCase().includes('people') && !t.toLowerCase().includes('person') && !t.toLowerCase().includes('someone') && !t.toLowerCase().includes('group') && !t.toLowerCase().includes('team'), message: "💭 Who are these people? Try to describe them a bit more." },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 What do they actually do right now about this problem?" },
      { test: (t) => t.length >= 60 && t.split('\n').length < 2, message: "💭 Great detail! What would change for them if your app existed?" },
    ]
  },
  solution: {
    checks: [
      { test: (t) => t.trim().length < 30, message: "💭 What does it actually do? Like the main thing it helps with?" },
      { test: (t) => t.toLowerCase().includes('notification') || t.toLowerCase().includes('sms') || t.toLowerCase().includes('text message') || t.toLowerCase().includes('phone call'), message: "⚠️ Heads up - sending real notifications needs phone access. Think of something that works inside the app!" },
      { test: (t) => t.toLowerCase().includes('facebook') || t.toLowerCase().includes('instagram') || t.toLowerCase().includes('twitter') || t.toLowerCase().includes('social media api'), message: "⚠️ Connecting to social media apps is tricky. What if it worked just inside your app?" },
      { test: (t) => t.split('\n').length < 2 && t.length < 60, message: "💭 What's the ONE thing it does really well? Keep it simple!" },
      { test: (t) => t.length >= 60 && t.split('\n').length < 2, message: "💭 Nice! What should it NOT try to do? (Less is more!)" },
    ]
  }
};

export const SPARK_BUBBLES = [
  { text: 'A quiz that turns your personality into a superpower', emoji: '🦸' },
  { text: 'A goal tracker that actually feels good to use', emoji: '🎯' },
  { text: 'A team challenge board for your friend group', emoji: '👥' },
  { text: 'A journal that asks you the right questions', emoji: '📖' },
  { text: 'A dream-to-plan converter', emoji: '✨' },
  { text: 'A creative story builder with a twist', emoji: '📝' },
  { text: 'A mood check-in that gives you a pep talk', emoji: '😊' },
  { text: 'A fun way to quiz your mates', emoji: '🧠' },
  { text: 'A vision board you can actually build', emoji: '🖼️' },
  { text: 'A daily challenge generator', emoji: '⚡' },
];

export const DEFAULT_INSTRUCTIONS: Omit<Instruction, 'id' | 'isApproved'>[] = [
  { category: 'design', text: 'Make it look good on a phone' },
  { category: 'design', text: 'Keep the words simple and easy to read' },
  { category: 'design', text: 'Use bright, fun colours' },
  { category: 'design', text: 'Make it easy to tap around' },

  { category: 'functionality', text: 'It should load quickly' },
  { category: 'functionality', text: 'The main thing should be easy to find' },
  { category: 'functionality', text: 'Show helpful messages if something goes wrong' },
  { category: 'functionality', text: 'Remember what the user did last time' },
  { category: 'functionality', text: 'Have a quick intro that shows how it works' },

  { category: 'users', text: 'People should be able to use it in short bursts' },
  { category: 'users', text: 'No confusing technical words' },
  { category: 'users', text: 'Anyone should be able to use it, no matter the ability' }
];
