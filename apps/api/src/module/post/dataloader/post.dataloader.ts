import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectionToken } from '@/common/constant/injection-token';
import { BaseDataLoader } from '@/common/service/cache/base.dataloader';
import type { Post } from '@/module/post/domain/post.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type PostRepositoryInterface } from '@/module/post/repository/post.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostDataLoader extends BaseDataLoader<Post['id'], Post> {
  constructor(
    @Inject(InjectionToken.POST_REPOSITORY)
    private readonly postRepository: PostRepositoryInterface,
  ) {
    super();
  }

  protected async batchLoad(postIds: Post['id'][]): Promise<(Post | Error)[]> {
    const posts = await this.postRepository.findManyByIds(postIds);

    const mappedPosts = postIds.map((postId) => {
      const post = posts.find((p) => p.id === postId);

      return post || new Error(`Cannot find Post with id ${postId}.`);
    });

    return mappedPosts;
  }
}
