import { Field, InputType, Int } from '@nestjs/graphql';
import { PostCategoryEnum } from '@/module/post/controller/dto/enum/post-category.enum';
import type { Post } from '@/module/post/domain/post.model';

@InputType()
export class PostCreateInput implements Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'tagIds' | 'isPinned'> {
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
}
