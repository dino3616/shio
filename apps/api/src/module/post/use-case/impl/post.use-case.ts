import { Inject, Injectable } from '@nestjs/common';
import { InjectionToken } from '#api/common/constant/injection-token';
import type { Post } from '#api/module/post/domain/post.model';
// TODO: Once this issue is resolved, modify to use `import type` syntax.
// https://github.com/typescript-eslint/typescript-eslint/issues/5468
import { type PostRepositoryInterface } from '#api/module/post/repository/post.repository';
import type { PostUseCaseInterface } from '#api/module/post/use-case/post.use-case';

@Injectable()
export class PostUseCase implements PostUseCaseInterface {
  constructor(
    @Inject(InjectionToken.POST_REPOSITORY)
    private readonly postRepository: PostRepositoryInterface,
  ) {}

  async findPost(postId: Parameters<PostUseCaseInterface['findPost']>[0]): Promise<Post | null> {
    const foundPost = await this.postRepository.find(postId);

    return foundPost;
  }

  async findPinnedPosts(): Promise<Post[]> {
    const foundPosts = await this.postRepository.findMany({
      where: {
        isPinned: true,
      },
      orderBy: {
        pinIndex: 'asc',
      },
    });

    return foundPosts;
  }

  async findLatestPosts(): Promise<Post[]> {
    const foundPosts = await this.postRepository.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return foundPosts;
  }

  async createPost(post: Parameters<PostUseCaseInterface['createPost']>[0], tags: Parameters<PostUseCaseInterface['createPost']>[1]): Promise<Post> {
    const createdPost = await this.postRepository.createWithTags(
      post,
      tags.map((tag) => ({
        ...tag,
        displayName: tag.displayName ?? tag.uniqueName,
      })),
    );

    return createdPost;
  }

  async updatePost(
    postId: Parameters<PostUseCaseInterface['updatePost']>[0],
    post: Parameters<PostUseCaseInterface['updatePost']>[1],
  ): Promise<Post> {
    const updatedPost = await this.postRepository.update(postId, post);

    return updatedPost;
  }

  async incrementPostViews(postId: Parameters<PostUseCaseInterface['incrementPostViews']>[0]): Promise<Post> {
    const updatedPost = await this.postRepository.update(postId, {
      views: {
        increment: 1,
      },
    });

    return updatedPost;
  }
}
