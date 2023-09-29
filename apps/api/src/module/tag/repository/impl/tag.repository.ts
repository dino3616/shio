import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Tag } from '@/module/tag/domain/tag.model';
import type { TagRepositoryInterface } from '@/module/tag/repository/tag.repository';

@Injectable()
export class TagRepository implements TagRepositoryInterface {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async find(tagId: Parameters<TagRepositoryInterface['find']>[0]): Promise<Tag | null> {
    const foundTag = await this.prismaService.tag.findUnique({
      where: { id: tagId },
    });

    return foundTag ? new Tag(foundTag) : null;
  }

  async findManyByIds(tagIds: Parameters<TagRepositoryInterface['findManyByIds']>[0]): Promise<Tag[]> {
    const foundTags = await this.prismaService.tag.findMany({
      where: { id: { in: tagIds } },
    });

    return foundTags.map((tag) => new Tag(tag));
  }

  async findManyByNames(tagUniqueNames: Parameters<TagRepositoryInterface['findManyByNames']>[0]): Promise<Tag[]> {
    const foundTags = await this.prismaService.tag.findMany({
      where: { uniqueName: { in: tagUniqueNames } },
    });

    return foundTags.map((tag) => new Tag(tag));
  }

  async findManyByPostIds(postIds: Parameters<TagRepositoryInterface['findManyByPostIds']>[0]): Promise<Tag[]> {
    const foundTags = await this.prismaService.tag.findMany({
      where: { postIds: { hasSome: postIds } },
    });

    return foundTags.map((tag) => new Tag(tag));
  }

  async createMany(tags: Parameters<TagRepositoryInterface['createMany']>[0]): Promise<Tag[]> {
    const createdTags = await this.prismaService.$transaction(
      tags.map((tag) =>
        this.prismaService.tag.create({
          data: { ...tag },
        }),
      ),
    );

    return createdTags.map((tag) => new Tag(tag));
  }
}
