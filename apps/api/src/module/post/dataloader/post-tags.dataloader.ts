import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectionToken } from '@/common/constant/injection-token';
import { BaseDataLoader } from '@/common/service/cache/base.dataloader';
import type { Post } from '@/module/post/domain/post.model';
import type { Tag } from '@/module/tag/domain/tag.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type TagRepositoryInterface } from '@/module/tag/repository/tag.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostTagsDataLoader extends BaseDataLoader<string, Tag[]> {
  constructor(
    @Inject(InjectionToken.TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryInterface,
  ) {
    super();
  }

  protected async batchLoad(postIds: Post['id'][]): Promise<(Tag[] | Error)[]> {
    const tags = await this.tagRepository.findManyByPostIds(postIds);

    const mappedTagsList = postIds.map((postId) => {
      const mappedTags = tags.filter((tag) => tag.postIds.includes(postId));
      if (mappedTags.length === 0) {
        return new Error(`Tag with postId ${postId} not found`);
      }

      return mappedTags;
    });

    return mappedTagsList;
  }
}
