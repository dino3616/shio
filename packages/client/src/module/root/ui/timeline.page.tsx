'use client';

import { ComponentPropsWithoutRef, FC, Suspense, use } from 'react';
import { di } from 'react-magnetic-di';
import { SkeletonTimelineItem, TimelineItem, TimelineItemProps } from './component/timeline-item.presenter';
import { ScrollRevealContainer } from '@/common/component/scroll-reveal-container/scroll-reveal-container.presenter';
import { StyledHeading } from '@/common/component/styled-heading/styled-heading.presenter';
import type { Timeline as TimelineModel } from '@/model/timeline.model';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timelinesFinder: () => Promise<TimelineModel[]>;
  dateFormatter: TimelineItemProps['dateFormatter'];
};

export const Timeline: FC<TimelineProps> = ({ timelinesFinder, dateFormatter, className, ...props }) => {
  // TODO: Since the storybook does not support `use`, `use` is replaced by `di`. Therefore, as soon as the storybook supports it, `use` will be used directly.
  di(use);

  return (
    <div className={className} {...props}>
      <StyledHeading text="Timeline" alt="タイムライン" />
      <div className="relative mt-6">
        <div
          aria-hidden
          className="absolute inset-0 m-[5px] w-0.5 bg-gray-600 before:absolute before:top-[-5px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid before:border-gray-600 before:bg-gray-600 after:absolute after:bottom-[-5px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid after:border-gray-600 after:bg-gray-600"
        />
        <div className="space-y-5 py-5">
          <Suspense fallback={<SkeletonTimelineItem className="ml-7" />}>
            {use(timelinesFinder()).map((timeline) => (
              <ScrollRevealContainer key={timeline.id} duration={0.8} delay={0} distance="40px">
                <TimelineItem timeline={timeline} dateFormatter={dateFormatter} className="ml-7" />
              </ScrollRevealContainer>
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
};
