import { SortOrder } from '@/common/dto/enum/sort-order.dto';

export type FindSkillsProps = {
  orderBy?: {
    happenedAt?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
  }[];
  cursor?: {
    id?: string;
  };
  take?: number;
  skip?: number;
};
