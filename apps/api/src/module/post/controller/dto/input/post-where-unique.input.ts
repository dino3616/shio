import { Field, ID, InputType } from '@nestjs/graphql';
import type { Post } from '#api/module/post/domain/post.model';

@InputType()
export class PostWhereUniqueInput implements Record<'postId', Post['id']> {
  @Field(() => ID, { nullable: false })
  postId!: string;
}
