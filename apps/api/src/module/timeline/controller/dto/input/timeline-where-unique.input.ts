import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TimelineWhereUniqueInput {
  @Field(() => String, { nullable: false })
  id: string;
}
