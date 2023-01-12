import type { ComponentPropsWithoutRef, FC } from 'react';
import { Card } from '@/common/component/card/card.presenter';
import { Image } from '@/common/component/image/image.presenter';
import { Link } from '@/common/component/link/link.presenter';
import { twMerge } from '@/common/util/tw-merge.util';
import { getLearningLevelBgColor } from '@/module/skill/model/learning-level.model';
import type { Skill } from '@/module/skill/model/skill.model';

export type SkillCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, 'children'> & {
  skill: Skill;
};

export const SkillCard: FC<SkillCardProps> = ({ skill, className, ...props }) => (
  <Card className={twMerge('flex w-64 flex-col items-center overflow-hidden rounded-3xl p-0 drop-shadow-lg', className)} {...props}>
    <Link
      href={skill.officialUrl}
      target="_blank"
      className="flex h-36 w-full items-center justify-center"
      style={{ ...getLearningLevelBgColor(skill.learningLevel) }}
    >
      <Image src={skill.iconUrl} width={100} height={100} alt={skill.name} className="bg-white" />
    </Link>
    <div className="space-y-5 p-5">
      <h2 className="text-center text-3xl font-semibold hover:underline">
        <Link href={skill.officialUrl} target="_blank">
          {skill.name}
        </Link>
      </h2>
      <p>{skill.description}</p>
    </div>
  </Card>
);
