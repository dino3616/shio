import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Timeline {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  title!: string;

  @Field(() => Date, { nullable: false })
  happenedAt!: Date;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;
}
