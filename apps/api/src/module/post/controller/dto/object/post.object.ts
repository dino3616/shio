import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { PostCategoryEnum } from '#api/module/post/controller/dto/enum/post-category.enum';
import type { Post } from '#api/module/post/domain/post.model';

@ObjectType('Post')
export class PostObject implements Omit<Post, 'tagIds' | 'isPinned'> {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => Int, { nullable: true })
  pinIndex!: number | null;

  @Field(() => String, { nullable: false })
  title!: string;

  @Field(() => String, { nullable: false })
  thumbnailUrl!: string;

  @Field(() => String, { nullable: false })
  content!: string;

  @Field(() => PostCategoryEnum, { nullable: false })
  category!: PostCategoryEnum;

  @Field(() => Int, { nullable: false })
  views!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
}
