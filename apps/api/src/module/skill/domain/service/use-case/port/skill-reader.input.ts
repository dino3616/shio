import { SortOrder } from '@/common/dto/enum/sort-order.dto';

export type FindSkillsProps = {
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
