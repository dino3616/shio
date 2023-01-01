import { registerEnumType } from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortOrder, { name: 'SortOrder', description: undefined });
