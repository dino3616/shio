import { Inject, Injectable } from '@nestjs/common';
import type { SkillRepositoryInterface } from '../domain/service/repository/skill.repository';
import type { FindSkillsProps } from '../domain/service/use-case/port/skill-reader.input';
import type { SkillReaderUseCaseInterface } from '../domain/service/use-case/skill-reader.use-case';
import { InjectionToken } from '@/common/constant/injection-token.constant';

@Injectable()
export class SkillReaderUseCase implements SkillReaderUseCaseInterface {
  constructor(
    @Inject(InjectionToken.SKILL_REPOSITORY)
    private readonly SkillRepository: SkillRepositoryInterface,
  ) {}

  async findSkills({ orderBy, cursor, take, skip }: FindSkillsProps) {
    const foundSkills = await this.SkillRepository.findMany({
      orderBy,
      cursor,
      take,
      skip,
    });

    return foundSkills;
  }
}
