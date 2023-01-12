import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/common/util/tw-merge.util';
import { getLearningLevelBgColor, LearningLevel } from '@/module/skill/model/learning-level.model';

export type LearningLevelListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'>;

export const LearningLevelList: FC<LearningLevelListProps> = ({ className, ...props }) => (
  <ul className={twMerge('flex gap-6', className)} {...props}>
    {Object.entries(LearningLevel).map(([, learningLevel]) => (
      <li key={learningLevel} className="flex items-center gap-3">
        <div aria-hidden className="h-5 w-5 rounded-full" style={{ ...getLearningLevelBgColor(learningLevel) }} />
        <span className="text-lg font-semibold">{learningLevel.charAt(0).toUpperCase() + learningLevel.slice(1).toLowerCase()}</span>
      </li>
    ))}
  </ul>
);
