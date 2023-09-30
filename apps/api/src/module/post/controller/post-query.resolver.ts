import { Inject, Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectionToken } from '#api/common/constant/injection-token';
import type { Post } from '#api/module/post/domain/post.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type PostUseCaseInterface } from '#api/module/post/use-case/post.use-case';
import { PostWhereUniqueInput } from './dto/input/post-where-unique.input';
import { PostObject } from './dto/object/post.object';

@Resolver()
export class PostQuery {
  private readonly logger = new Logger(PostQuery.name);

  constructor(
    @Inject(InjectionToken.POST_USE_CASE)
    private readonly postUseCase: PostUseCaseInterface,
  ) {}

  @Query(() => PostObject, { nullable: true })
  async findPost(
    @Args('where', { type: () => PostWhereUniqueInput })
    where: PostWhereUniqueInput,
  ): Promise<Post | null> {
    this.logger.log(`${this.findPost.name} called`);

    const foundPost = await this.postUseCase.findPost(where.postId);

    return foundPost;
  }

  @Query(() => [PostObject])
  async findPinnedPosts(): Promise<Post[]> {
    this.logger.log(`${this.findPinnedPosts.name} called`);

    const foundPinnedPosts = await this.postUseCase.findPinnedPosts();

    return foundPinnedPosts;
  }

  @Query(() => [PostObject])
  async findLatestPosts(): Promise<Post[]> {
    this.logger.log(`${this.findLatestPosts.name} called`);

    const foundLatestPosts = await this.postUseCase.findLatestPosts();

    return foundLatestPosts;
  }
}
