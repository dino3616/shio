type PostCategory = 'TECH' | 'LIFE';

export class Post {
  readonly id: string;

  readonly pinIndex: number | null;

  readonly title: string;

  readonly thumbnailUrl: string;

  readonly content: string;

  readonly category: PostCategory;

  readonly views: number;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly tagIds: string[];

  constructor({ id, pinIndex, title, thumbnailUrl, content, category, views, createdAt, updatedAt, tagIds }: Omit<Post, 'isPinned'>) {
    this.id = id;
    this.pinIndex = pinIndex;
    this.title = title;
    this.thumbnailUrl = thumbnailUrl;
    this.content = content;
    this.category = category;
    this.views = views;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tagIds = tagIds;
  }

  get isPinned(): boolean {
    return this.pinIndex !== null;
  }
}
