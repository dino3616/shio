import { registerEnumType } from '@nestjs/graphql';

export enum LearningLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

registerEnumType<typeof LearningLevel>(LearningLevel, { name: 'LearningLevel' });
