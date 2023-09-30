import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PostTagsDataLoader } from '#api/module/post/dataloader/post-tags.dataloader';
import { Post } from '#api/module/post/domain/post.model';
import { TagObject } from '#api/module/tag/controller/dto/object/tag.object';
import type { Tag } from '#api/module/tag/domain/tag.model';
import { PostObject } from './dto/object/post.object';

@Resolver(() => PostObject)
export class PostResolver {
  constructor(private readonly postTagsDataLoader: PostTagsDataLoader) {}

  @ResolveField(() => [TagObject])
  async tags(@Parent() post: Post): Promise<Tag[]> {
    const tags = await this.postTagsDataLoader.load(post.id);

    return tags;
  }
}
