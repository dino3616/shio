import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SkillWhereUniqueInput {
  @Field(() => String, { nullable: false })
  id: string;
}
