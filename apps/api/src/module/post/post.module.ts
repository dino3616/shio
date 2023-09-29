import { Module, forwardRef } from '@nestjs/common';
import { InjectionToken } from '@/common/constant/injection-token';
import { TagModule } from '@/module/tag/tag.module';
import { PostMutation } from './controller/post-mutation.resolver';
import { PostQuery } from './controller/post-query.resolver';
import { PostResolver } from './controller/post.resolver';
import { PostTagsDataLoader } from './dataloader/post-tags.dataloader';
import { PostDataLoader } from './dataloader/post.dataloader';
import { PostRepository } from './repository/impl/post.repository';
import { PostUseCase } from './use-case/impl/post.use-case';

@Module({
  imports: [forwardRef(() => TagModule)],
  providers: [
    PostDataLoader,
    PostTagsDataLoader,
    { provide: InjectionToken.POST_REPOSITORY, useClass: PostRepository },
    { provide: InjectionToken.POST_USE_CASE, useClass: PostUseCase },
    PostResolver,
    PostQuery,
    PostMutation,
  ],
  exports: [PostTagsDataLoader, { provide: InjectionToken.POST_REPOSITORY, useClass: PostRepository }],
})
export class PostModule {}
