import { Injectable } from '@nestjs/common';
import { Timeline } from '../domain/model/timeline.model';
import type { FindManyProps, TimelineRepositoryInterface } from '../domain/service/repository/timeline.repository';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class TimelineRepository implements TimelineRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({ orderBy, cursor, take, skip }: FindManyProps) {
    const foundTimelines = await this.prismaService.timeline.findMany({
      orderBy,
      cursor,
      take,
      skip,
    });

    return foundTimelines.map((foundTimeline) => new Timeline(foundTimeline));
  }
}
