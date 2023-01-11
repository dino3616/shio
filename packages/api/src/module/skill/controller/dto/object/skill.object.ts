import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  officialLink: string;

  @Field(() => String, { nullable: false })
  iconUrl: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;
}
