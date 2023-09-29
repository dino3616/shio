export class Tag {
  readonly id!: string;

  readonly uniqueName!: string;

  readonly displayName!: string;

  readonly postIds!: string[];

  constructor({ id, uniqueName, displayName, postIds }: Tag) {
    this.id = id;
    this.uniqueName = uniqueName;
    this.displayName = displayName;
    this.postIds = postIds;
  }
}
