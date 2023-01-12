import { LearningLevel } from '@/common/dto/enum/learning-level.dto';

export class Skill {
  readonly id: string;

  readonly name: string;

  readonly description: string;

  readonly learningLevel: keyof typeof LearningLevel;

  readonly officialUrl: string;

  readonly iconUrl: string;

  readonly createdAt: Date;

  constructor(args: {
    id: string;
    name: string;
    description: string;
    learningLevel: keyof typeof LearningLevel;
    officialUrl: string;
    iconUrl: string;
    createdAt: Date;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.learningLevel = args.learningLevel;
    this.officialUrl = args.officialUrl;
    this.iconUrl = args.iconUrl;
    this.createdAt = args.createdAt;
  }
}
