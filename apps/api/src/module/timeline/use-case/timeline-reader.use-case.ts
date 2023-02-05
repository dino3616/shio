import { Inject, Injectable } from '@nestjs/common';
import { TimelineRepositoryInterface } from '../domain/service/repository/timeline.repository';
import { FindTimelinesProps } from '../domain/service/use-case/port/timeline-reader.input';
import { TimelineReaderUseCaseInterface } from '../domain/service/use-case/timeline-reader.use-case';
import { InjectionToken } from '@/common/constant/injection-token.constant';

@Injectable()
export class TimelineReaderUseCase implements TimelineReaderUseCaseInterface {
  constructor(
    @Inject(InjectionToken.TIMELINE_REPOSITORY)
    private readonly TimelineRepository: TimelineRepositoryInterface,
  ) {}

  async findTimelines({ orderBy, cursor, take, skip }: FindTimelinesProps) {
    const foundTimelines = await this.TimelineRepository.findMany({
      orderBy,
      cursor,
      take,
      skip,
    });

    return foundTimelines;
  }
}
