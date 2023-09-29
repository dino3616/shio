import type { Post } from '@/module/post/domain/post.model';
import type { Tag } from '@/module/tag/domain/tag.model';

export interface PostUseCaseInterface {
  findPost(postId: Post['id']): Promise<Post | null>;
  findPinnedPosts(): Promise<Post[]>;
  findLatestPosts(): Promise<Post[]>;
  createPost(
    post: Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'tagIds' | 'isPinned'>,
    tags: (Omit<Tag, 'id' | 'displayName' | 'postIds'> & Partial<Pick<Tag, 'displayName'>>)[],
  ): Promise<Post>;
  updatePost(postId: Post['id'], post: Partial<Omit<Post, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'isPinned'>>): Promise<Post>;
  incrementPostViews(postId: Post['id']): Promise<Post>;
}
