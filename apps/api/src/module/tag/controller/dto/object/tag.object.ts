import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Tag } from '#api/module/tag/domain/tag.model';

@ObjectType('Tag')
export class TagObject implements Omit<Tag, 'postIds'> {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  uniqueName!: string;

  @Field(() => String, { nullable: false })
  displayName!: string;
}
