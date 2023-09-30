import { Field, InputType } from '@nestjs/graphql';
import type { Tag } from '#api/module/tag/domain/tag.model';

@InputType()
export class TagCreateInput implements Omit<Tag, 'id' | 'displayName' | 'postIds'> {
  @Field(() => String, { nullable: false })
  uniqueName!: string;

  @Field(() => String, { nullable: true })
  displayName?: string;
}
