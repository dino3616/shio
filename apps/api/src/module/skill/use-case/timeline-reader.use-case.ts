import { Inject, Injectable } from '@nestjs/common';
import { SkillRepositoryInterface } from '../domain/service/repository/skill.repository';
import { FindSkillsProps } from '../domain/service/use-case/port/skill-reader.input';
import { SkillReaderUseCaseInterface } from '../domain/service/use-case/skill-reader.use-case';
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
