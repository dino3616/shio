import { registerEnumType } from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum LearningLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

registerEnumType(LearningLevel, { name: 'LearningLevel', description: undefined });
