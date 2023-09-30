import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectionToken } from '#api/common/constant/injection-token';
import { BaseDataLoader } from '#api/common/service/cache/base.dataloader';
import type { Tag } from '#api/module/tag/domain/tag.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type TagRepositoryInterface } from '#api/module/tag/repository/tag.repository';

@Injectable({ scope: Scope.REQUEST })
export class TagDataLoader extends BaseDataLoader<Tag['id'], Tag> {
  constructor(
    @Inject(InjectionToken.POST_REPOSITORY)
    private readonly tagRepository: TagRepositoryInterface,
  ) {
    super();
  }

  protected async batchLoad(tagIds: Tag['id'][]): Promise<(Tag | Error)[]> {
    const tags = await this.tagRepository.findManyByIds(tagIds);

    const mappedTags = tagIds.map((tagId) => {
      const tag = tags.find((t) => t.id === tagId);

      return tag || new Error(`Cannot find Tag with id ${tagId}.`);
    });

    return mappedTags;
  }
}
