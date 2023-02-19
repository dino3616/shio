import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Skill as SkillModel } from '../model/skill.model';
import { LearningLevelList } from './component/learning-level-list/learning-level-list.container';
import { SkillCard } from './component/skill-card/skill-card.presenter';
import { Heading } from '@/common/component/heading/heading.presenter';
import { ScrollRevealAnimation } from '@/common/component/scroll-reveal-animation/scroll-reveal-animation.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type SkillProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  skills: SkillModel[];
};

export const Skill: FC<SkillProps> = ({ skills, className, ...props }) => (
  <div className={twMerge('space-y-5', className)} {...props}>
    <Heading text="Skill" alt="スキル" />
    <LearningLevelList className="sticky top-24 left-0 z-10" />
    <div className="flex flex-col flex-wrap gap-10 md:flex-row">
      {skills.map((skill) => (
        <ScrollRevealAnimation key={skill.id} once duration={0.8} delay={0} distance="40px">
          <SkillCard skill={skill} className="h-full" />
        </ScrollRevealAnimation>
      ))}
    </div>
  </div>
);
