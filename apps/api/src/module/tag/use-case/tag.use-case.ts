import type { Tag } from '#api/module/tag/domain/tag.model';

export interface TagUseCaseInterface {
  findTag(tagId: Tag['id']): Promise<Tag | null>;
}
