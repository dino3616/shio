import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from '@/common/dto/enum/sort-order.dto';

@InputType()
export class TimelineOrderInput {
  @Field(() => SortOrder, { nullable: true })
  happenedAt?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
}
