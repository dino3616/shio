import { Test } from '@nestjs/testing';
import dotenv from 'dotenv';
import { Timeline } from '../domain/model/timeline.model';
import { TimelineRepository } from './timeline.repository';
import { PrismaService } from '@/infra/prisma/prisma.service';

dotenv.config();
dotenv.config({ path: '.env.test' });

jest.setTimeout(15000);

export const createTimeline = async (prismaService: PrismaService) => {
  const createdTimeline = await prismaService.timeline.create({
    data: {
      title: 'test timeline',
      happenedAt: new Date(),
    },
  });

  return new Timeline(createdTimeline);
};

export const deleteTimeline = async (prismaService: PrismaService, TimelineId: string) => {
  const deletedTimeline = await prismaService.timeline.delete({
    where: { id: TimelineId },
  });

  return new Timeline(deletedTimeline);
};

describe('TimelineRepository', () => {
  let prismaService: PrismaService;
  let timelineRepository: TimelineRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, TimelineRepository],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    timelineRepository = moduleRef.get(TimelineRepository);
  });

  test('findMany', async () => {
    const createdTimeline = await createTimeline(prismaService);

    const foundTimelines = await timelineRepository.findMany({});

    expect(foundTimelines).toEqual(expect.any(Array<Timeline>()));

    await deleteTimeline(prismaService, createdTimeline.id);
  });
});
