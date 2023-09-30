import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PostObject } from '#api/module/post/controller/dto/object/post.object';
import type { Post } from '#api/module/post/domain/post.model';
import { TagPostsDataLoader } from '#api/module/tag/dataloader/tag-posts.dataloader';
import { Tag } from '#api/module/tag/domain/tag.model';
import { TagObject } from './dto/object/tag.object';

@Resolver(() => TagObject)
export class TagResolver {
  constructor(private readonly tagPostsDataLoader: TagPostsDataLoader) {}

  @ResolveField(() => [PostObject])
  async posts(@Parent() tag: Tag): Promise<Post[]> {
    const posts = await this.tagPostsDataLoader.load(tag.id);

    return posts;
  }
}
