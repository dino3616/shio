import { Field, InputType, Int } from '@nestjs/graphql';
import { PostCategoryEnum } from '@/module/post/controller/dto/enum/post-category.enum';
import type { Post } from '@/module/post/domain/post.model';

@InputType()
export class PostUpdateInput implements Partial<Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'isPinned'>> {
  @Field(() => Int, { nullable: true })
  pinIndex?: number | null;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  thumbnailUrl?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => PostCategoryEnum, { nullable: true })
  category?: PostCategoryEnum;
}
