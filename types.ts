
export type StageId = 'why' | 'who' | 'what' | 'how';

export interface StageData {
  id: StageId;
  label: string;
  text: string;
  locked: boolean;
  prompts: string[];
}

export interface Instruction {
  id: string;
  category: 'design' | 'functionality' | 'users';
  text: string;
  isApproved: boolean;
  isCustom?: boolean;
}

export interface PowerSkillsApp {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AppState {
  stages: Record<StageId, StageData>;
  instructions: Instruction[];
  hasLaunched: boolean;
  selectedApp: PowerSkillsApp | null;
  appName: string;
}

export const POWER_SKILLS = [
  'Analytical Thinking',
  'Agility',
  'Critical Thinking',
  'Communicating with Impact',
  'Financial Literacy',
  'Goal Driven',
  'Innovation',
  'Collaborative Relationships',
  'Self-Management'
] as const;

export type PowerSkill = typeof POWER_SKILLS[number];
