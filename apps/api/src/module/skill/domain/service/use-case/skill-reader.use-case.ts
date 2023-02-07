import type { Skill } from '../../model/skill.model';
import type { FindSkillsProps } from './port/skill-reader.input';

export interface SkillReaderUseCaseInterface {
  findSkills(args: FindSkillsProps): Promise<Skill[]>;
}
