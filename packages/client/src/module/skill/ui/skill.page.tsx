import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Skill as SkillModel } from '../model/skill.model';
import { SkillCard } from './component/skill-card/skill-card.presenter';
import { Heading } from '@/common/component/heading/heading.presenter';
import { ScrollRevealAnimation } from '@/common/component/scroll-reveal-animation/scroll-reveal-animation.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type SkillProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  skills: SkillModel[];
};

export const Skill: FC<SkillProps> = ({ skills, className, ...props }) => (
  <div className={twMerge('space-y-6', className)} {...props}>
    <Heading text="Skill" alt="スキル" />
    <div className="my-5 flex gap-5">
      {skills.map((skill) => (
        <ScrollRevealAnimation key={skill.id} duration={0.8} delay={0} distance="40px">
          <SkillCard skill={skill} />
        </ScrollRevealAnimation>
      ))}
    </div>
  </div>
);
