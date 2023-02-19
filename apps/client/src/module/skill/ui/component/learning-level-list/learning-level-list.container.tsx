import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { LearningLevelList as LearningLevelListPresenter } from './learning-level-list.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type LearningLevelListProps = ComponentPropsWithoutRef<'div'>;

export const LearningLevelList: FC<LearningLevelListProps> = ({ ...props }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div {...props}>
      <LearningLevelListPresenter expantionController={{ isExpanded, setIsExpanded }} />
      <div aria-hidden className={twMerge("content-['']", !isExpanded && 'mb-[118px] md:mb-0')} />
    </div>
  );
};
