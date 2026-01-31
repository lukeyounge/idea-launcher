
export type StageId = 'problem' | 'people' | 'solution';

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

export interface AppState {
  stages: Record<StageId, StageData>;
  instructions: Instruction[];
  hasLaunched: boolean;
  sparkSelections: string[];
}
