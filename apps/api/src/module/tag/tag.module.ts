import { Module, forwardRef } from '@nestjs/common';
import { InjectionToken } from '@/common/constant/injection-token';
import { PostModule } from '@/module/post/post.module';
import { TagQuery } from './controller/tag-query.resolver';
import { TagResolver } from './controller/tag.resolver';
import { TagPostsDataLoader } from './dataloader/tag-posts.dataloader';
import { TagDataLoader } from './dataloader/tag.dataloader';
import { TagRepository } from './repository/impl/tag.repository';
import { TagUseCase } from './use-case/impl/tag.use-case';

@Module({
  imports: [forwardRef(() => PostModule)],
  providers: [
    TagDataLoader,
    TagPostsDataLoader,
    { provide: InjectionToken.TAG_REPOSITORY, useClass: TagRepository },
    { provide: InjectionToken.TAG_USE_CASE, useClass: TagUseCase },
    TagResolver,
    TagQuery,
  ],
  exports: [TagPostsDataLoader, { provide: InjectionToken.TAG_REPOSITORY, useClass: TagRepository }],
})
export class TagModule {}
