
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
  category: 'design' | 'functionality' | 'users' | 'screens';
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
  'Agility',
  'Analytical Thinking',
  'Collaborative Relationships',
  'Critical Thinking',
  'Financial Literacy',
  'Goal-Driven',
  'Innovative Thinking',
  'Self-Management'
] as const;

export type PowerSkill = typeof POWER_SKILLS[number];
