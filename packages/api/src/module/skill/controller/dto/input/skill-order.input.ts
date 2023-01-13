import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from '@/common/dto/enum/sort-order.dto';

@InputType()
export class SkillOrderInput {
  @Field(() => SortOrder, { nullable: true })
  index?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
}
