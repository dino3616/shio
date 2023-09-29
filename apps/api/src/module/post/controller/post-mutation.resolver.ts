import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectionToken } from '@/common/constant/injection-token';
import type { Post } from '@/module/post/domain/post.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type PostUseCaseInterface } from '@/module/post/use-case/post.use-case';
import { TagCreateInput } from '@/module/tag/controller/dto/input/tag-create.input';
import { PostCreateInput } from './dto/input/post-create.input';
import { PostWhereUniqueInput } from './dto/input/post-where-unique.input';
import { PostObject } from './dto/object/post.object';

@Resolver()
export class PostMutation {
  private readonly logger = new Logger(PostMutation.name);

  constructor(
    @Inject(InjectionToken.POST_USE_CASE)
    private readonly postUseCase: PostUseCaseInterface,
  ) {}

  @Mutation(() => PostObject)
  async createPost(
    @Args('post', { type: () => PostCreateInput })
    post: PostCreateInput,
    @Args('tags', { type: () => [TagCreateInput] })
    tags: TagCreateInput[],
  ): Promise<Post> {
    this.logger.log(`${this.createPost.name} called`);

    const createdPost = await this.postUseCase.createPost(post, tags);

    return createdPost;
  }

  @Mutation(() => PostObject)
  async updatePost(
    @Args('where', { type: () => PostWhereUniqueInput })
    where: PostWhereUniqueInput,
    @Args('data', { type: () => PostCreateInput })
    data: PostCreateInput,
  ): Promise<Post> {
    this.logger.log(`${this.updatePost.name} called`);

    const updatedPost = await this.postUseCase.updatePost(where.postId, data);

    return updatedPost;
  }

  @Mutation(() => PostObject)
  async incrementPostViews(
    @Args('where', { type: () => PostWhereUniqueInput })
    where: PostWhereUniqueInput,
  ): Promise<Post> {
    this.logger.log(`${this.incrementPostViews.name} called`);

    const updatedPost = await this.postUseCase.incrementPostViews(where.postId);

    return updatedPost;
  }
}
