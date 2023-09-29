import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectionToken } from '@/common/constant/injection-token';
import { BaseDataLoader } from '@/common/service/cache/base.dataloader';
import type { Post } from '@/module/post/domain/post.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type PostRepositoryInterface } from '@/module/post/repository/post.repository';
import type { Tag } from '@/module/tag/domain/tag.model';

@Injectable({ scope: Scope.REQUEST })
export class TagPostsDataLoader extends BaseDataLoader<string, Post[]> {
  constructor(
    @Inject(InjectionToken.POST_REPOSITORY)
    private readonly postRepository: PostRepositoryInterface,
  ) {
    super();
  }

  protected async batchLoad(tagIds: Tag['id'][]): Promise<(Post[] | Error)[]> {
    const posts = await this.postRepository.findManyByTagIds(tagIds);

    const mappedPostsList = tagIds.map((tagId) => {
      const mappedPosts = posts.filter((post) => post.tagIds.includes(tagId));
      if (mappedPosts.length === 0) {
        return new Error(`Post with tagId ${tagId} not found`);
      }

      return mappedPosts;
    });

    return mappedPostsList;
  }
}
