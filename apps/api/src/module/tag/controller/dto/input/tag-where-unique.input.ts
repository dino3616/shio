import { Field, ID, InputType } from '@nestjs/graphql';
import type { Tag } from '#api/module/tag/domain/tag.model';

@InputType()
export class TagWhereUniqueInput implements Record<'tagId', Tag['id']> {
  @Field(() => ID, { nullable: false })
  tagId!: string;
}
