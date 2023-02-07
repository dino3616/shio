import type { Skill } from '../../model/skill.model';
import type { SortOrder } from '@/common/dto/enum/sort-order.dto';

export type FindManyProps = {
  orderBy?: {
    index?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
  }[];
  cursor?: {
    id?: string;
  };
  take?: number;
  skip?: number;
};

export interface SkillRepositoryInterface {
  findMany(args: FindManyProps): Promise<Skill[]>;
}
