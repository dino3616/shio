import type { Tag } from '@/module/tag/domain/tag.model';

export interface TagRepositoryInterface {
  find(tagId: Tag['id']): Promise<Tag | null>;
  findManyByIds(tagIds: Tag['id'][]): Promise<Tag[]>;
  findManyByNames(tagUniqueNames: Tag['uniqueName'][]): Promise<Tag[]>;
  findManyByPostIds(postIds: Tag['postIds']): Promise<Tag[]>;
  createMany(tags: (Omit<Tag, 'id' | 'postIds'> & Partial<Pick<Tag, 'postIds'>>)[]): Promise<Tag[]>;
}
