import type { Timeline } from '../../model/timeline.model';
import type { SortOrder } from '@/common/dto/enum/sort-order.dto';

export type FindManyProps = {
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

export interface TimelineRepositoryInterface {
  findMany(args: FindManyProps): Promise<Timeline[]>;
}
