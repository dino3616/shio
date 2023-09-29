import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Post } from '@/module/post/domain/post.model';
import type { PostRepositoryInterface } from '@/module/post/repository/post.repository';

@Injectable()
export class PostRepository implements PostRepositoryInterface {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async find(postId: Parameters<PostRepositoryInterface['find']>[0]): Promise<Post | null> {
    const foundPost = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    return foundPost && new Post(foundPost);
  }

  async findMany({ where, orderBy }: Parameters<PostRepositoryInterface['findMany']>[0]): Promise<Post[]> {
    const { isPinned, ...whereRest } = where ?? {};

    const foundPosts = await this.prismaService.post.findMany({
      where: {
        ...whereRest,
        pinIndex: isPinned === undefined ? undefined : isPinned ? { not: null } : { equals: null },
      },
      orderBy,
    });

    return foundPosts.map((post) => new Post(post));
  }

  async findManyByIds(postIds: Parameters<PostRepositoryInterface['findManyByIds']>[0]): Promise<Post[]> {
    const foundPosts = await this.prismaService.post.findMany({
      where: { id: { in: postIds } },
    });

    return foundPosts.map((post) => new Post(post));
  }

  async findManyByTagIds(tagIds: Parameters<PostRepositoryInterface['findManyByTagIds']>[0]): Promise<Post[]> {
    const foundPosts = await this.prismaService.post.findMany({
      where: { tagIds: { hasSome: tagIds } },
    });

    return foundPosts.map((post) => new Post(post));
  }

  async create(post: Parameters<PostRepositoryInterface['create']>[0]): Promise<Post> {
    const createdPost = await this.prismaService.post.create({
      data: { ...post },
    });

    return new Post(createdPost);
  }

  async createWithTags(
    post: Parameters<PostRepositoryInterface['createWithTags']>[0],
    tags: Parameters<PostRepositoryInterface['createWithTags']>[1],
  ): Promise<Post> {
    const createdPost = await this.prismaService.post.create({
      data: {
        ...post,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { uniqueName: tag.uniqueName },
            create: { ...tag },
          })),
        },
      },
    });

    return new Post(createdPost);
  }

  async update(postId: Parameters<PostRepositoryInterface['update']>[0], post: Parameters<PostRepositoryInterface['update']>[1]): Promise<Post> {
    const updatedPost = await this.prismaService.post.update({
      where: { id: postId },
      data: { ...post },
    });

    return new Post(updatedPost);
  }
}
