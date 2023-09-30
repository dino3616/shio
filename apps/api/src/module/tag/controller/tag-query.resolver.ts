import { Inject, Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectionToken } from '#api/common/constant/injection-token';
import type { Tag } from '#api/module/tag/domain/tag.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type TagUseCaseInterface } from '#api/module/tag/use-case/tag.use-case';
import { TagWhereUniqueInput } from './dto/input/tag-where-unique.input';
import { TagObject } from './dto/object/tag.object';

@Resolver()
export class TagQuery {
  private readonly logger = new Logger(TagQuery.name);

  constructor(
    @Inject(InjectionToken.TAG_USE_CASE)
    private readonly tagUseCase: TagUseCaseInterface,
  ) {}

  @Query(() => TagObject, { nullable: true })
  async findTag(
    @Args('where', { type: () => TagWhereUniqueInput })
    where: TagWhereUniqueInput,
  ): Promise<Tag | null> {
    this.logger.log(`${this.findTag.name} called`);

    const foundTag = await this.tagUseCase.findTag(where.tagId);

    return foundTag;
  }
}
