import { Test } from '@nestjs/testing';
import dotenv from 'dotenv';
import { Skill } from '../domain/model/skill.model';
import { SkillRepository } from './skill.repository';
import { PrismaService } from '@/infra/prisma/prisma.service';

dotenv.config();
dotenv.config({ path: '.env.test' });

jest.setTimeout(15000);

export const createSkill = async (prismaService: PrismaService) => {
  const createdSkill = await prismaService.skill.create({
    data: {
      name: 'hoge',
      description: 'hoge',
      officialLink: 'http://hoge.com',
      iconUrl: 'http://hoge.com/icon.png',
    },
  });

  return new Skill(createdSkill);
};

export const deleteSkill = async (prismaService: PrismaService, SkillId: string) => {
  const deletedSkill = await prismaService.skill.delete({
    where: { id: SkillId },
  });

  return new Skill(deletedSkill);
};

describe('SkillRepository', () => {
  let prismaService: PrismaService;
  let skillRepository: SkillRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, SkillRepository],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    skillRepository = moduleRef.get(SkillRepository);
  });

  test('findMany', async () => {
    const createdSkill = await createSkill(prismaService);

    const foundSkills = await skillRepository.findMany({});

    expect(foundSkills).toEqual(expect.any(Array));

    await deleteSkill(prismaService, createdSkill.id);
  });
});
