export class Timeline {
  readonly id: string;

  readonly title: string;

  readonly happenedAt: Date;

  readonly createdAt: Date;

  constructor(args: { id: string; title: string; happenedAt: Date; createdAt: Date }) {
    this.id = args.id;
    this.title = args.title;
    this.happenedAt = args.happenedAt;
    this.createdAt = args.createdAt;
  }
}
