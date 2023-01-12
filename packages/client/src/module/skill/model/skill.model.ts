import type { LearningLevel } from './learning-level.model';

export type Skill = {
  id: string;
  name: string;
  description: string;
  learningLevel: LearningLevel;
  officialUrl: string;
  iconUrl: string;
};
