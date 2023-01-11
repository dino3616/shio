import { Skill } from '../../model/skill.model';
import { FindSkillsProps } from './port/skill-reader.input';

export interface SkillReaderUseCaseInterface {
  findSkills(args: FindSkillsProps): Promise<Skill[]>;
}
