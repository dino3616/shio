import type { ComponentPropsWithoutRef, FC } from 'react';
import { TimelineItem, TimelineItemProps } from './component/timeline-item.presenter';
import { ScrollRevealContainer } from '@/common/component/scroll-reveal-container/scroll-reveal-container.presenter';
import { StyledHeading } from '@/common/component/styled-heading/styled-heading.presenter';
import type { Timeline as TimelineModel } from '@/model/timeline.model';
import { twMerge } from '@/util/tw-merge';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timelines: TimelineModel[];
  dateFormatter: TimelineItemProps['dateFormatter'];
};

export const Timeline: FC<TimelineProps> = ({ timelines, dateFormatter, className, ...props }) => (
  <div className={twMerge('py-10', className)} {...props}>
    <StyledHeading text="Timeline" alt="タイムライン" />
    <div className="relative mt-6">
      <div
        aria-hidden
        className="absolute inset-0 mx-[5px] w-0.5 bg-gray-600 before:absolute before:top-[-6px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid before:border-gray-600 before:bg-gray-600 after:absolute after:bottom-[-6px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid after:border-gray-600 after:bg-gray-600"
      />
      <div className="space-y-5 py-5">
        {timelines.map((timeline) => (
          <ScrollRevealContainer key={timeline.id} duration={0.8} delay={0} distance="40px">
            <TimelineItem timeline={timeline} dateFormatter={dateFormatter} className="ml-7" />
          </ScrollRevealContainer>
        ))}
      </div>
    </div>
  </div>
);
