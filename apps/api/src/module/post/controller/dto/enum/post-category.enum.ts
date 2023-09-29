import { registerEnumType } from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum PostCategoryEnum {
  TECH = 'TECH',
  LIFE = 'LIFE',
}

registerEnumType(PostCategoryEnum, { name: 'PostCategory' });
