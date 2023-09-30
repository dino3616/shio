import { Inject, Injectable } from '@nestjs/common';
import { InjectionToken } from '#api/common/constant/injection-token';
import type { Tag } from '#api/module/tag/domain/tag.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type TagRepositoryInterface } from '#api/module/tag/repository/tag.repository';
import type { TagUseCaseInterface } from '#api/module/tag/use-case/tag.use-case';

@Injectable()
export class TagUseCase implements TagUseCaseInterface {
  constructor(
    @Inject(InjectionToken.TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryInterface,
  ) {}

  async findTag(tagId: Parameters<TagUseCaseInterface['findTag']>[0]): Promise<Tag | null> {
    const foundTag = await this.tagRepository.find(tagId);

    return foundTag;
  }
}
