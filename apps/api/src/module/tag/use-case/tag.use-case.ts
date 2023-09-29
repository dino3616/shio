import type { Tag } from '@/module/tag/domain/tag.model';

export interface TagUseCaseInterface {
  findTag(tagId: Tag['id']): Promise<Tag | null>;
}
