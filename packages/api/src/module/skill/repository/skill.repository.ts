import { Injectable } from '@nestjs/common';
import { Skill } from '../domain/model/skill.model';
import { FindManyProps, SkillRepositoryInterface } from '../domain/service/repository/skill.repository';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class SkillRepository implements SkillRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({ orderBy, cursor, take, skip }: FindManyProps) {
    const foundSkills = await this.prismaService.skill.findMany({
      orderBy,
      cursor,
      take,
      skip,
    });

    return foundSkills.map((foundSkill) => new Skill(foundSkill));
  }
}
