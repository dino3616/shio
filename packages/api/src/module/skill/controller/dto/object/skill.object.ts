import { Field, ObjectType } from '@nestjs/graphql';
import { LearningLevel } from '@/infra/prisma/generated/prisma/learning-level/enum';

@ObjectType()
export class Skill {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => Number, { nullable: false })
  index: number;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => LearningLevel, { nullable: false })
  learningLevel: keyof typeof LearningLevel;

  @Field(() => String, { nullable: false })
  officialUrl: string;

  @Field(() => String, { nullable: false })
  iconUrl: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;
}
