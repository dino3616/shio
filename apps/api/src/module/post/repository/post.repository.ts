import type { Increment, SortOrder } from '#api/common/type/repository';
import type { Post } from '#api/module/post/domain/post.model';
import { type Tag } from '#api/module/tag/domain/tag.model';

export interface PostRepositoryInterface {
  find(postId: Post['id']): Promise<Post | null>;
  findMany(data: {
    where?: Partial<Pick<Post, 'isPinned'>>;
    orderBy?: Partial<Record<keyof Pick<Post, 'pinIndex' | 'createdAt'>, SortOrder>>;
  }): Promise<Post[]>;
  findManyByIds(postIds: Post['id'][]): Promise<Post[]>;
  findManyByTagIds(tagIds: Post['tagIds']): Promise<Post[]>;
  create(post: Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'isPinned'>): Promise<Post>;
  createWithTags(
    post: Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'tagIds' | 'isPinned'>,
    tags: Omit<Tag, 'id' | 'postIds'>[],
  ): Promise<Post>;
  update(
    postId: Post['id'],
    post: Partial<Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'isPinned'> & Record<keyof Pick<Post, 'views'>, Increment<Post['views']>>>,
  ): Promise<Post>;
}
