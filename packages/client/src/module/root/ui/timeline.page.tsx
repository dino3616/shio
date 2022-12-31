import type { ComponentPropsWithoutRef, FC } from 'react';
import { TimelineItem } from './component/timeline-item.presenter';
import { ScrollRevealContainer } from '@/common/component/scroll-reveal-container/scroll-reveal-container.presenter';
import { StyledHeading } from '@/common/component/styled-heading/styled-heading.presenter';
import { twMerge } from '@/util/tw-merge';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const Timeline: FC<TimelineProps> = ({ className, ...props }) => (
  <div className={twMerge('py-10', className)} {...props}>
    <StyledHeading text="Timeline" alt="タイムライン" />
    <div className="relative mt-6">
      <div
        aria-hidden
        className="absolute inset-0 w-0.5 bg-gray-600 before:absolute before:top-[-6px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid before:border-gray-600 before:bg-gray-600 after:absolute after:bottom-[-6px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid after:border-gray-600 after:bg-gray-600"
      />
      <div className="space-y-5 py-5">
        <ScrollRevealContainer duration={0.8} delay={0} distance="40px">
          <TimelineItem
            timeline={{
              event: 'eventtttttttttttttttttt',
              date: '2023/01/01',
            }}
            className="ml-5"
          />
        </ScrollRevealContainer>
        <ScrollRevealContainer duration={0.8} delay={0} distance="40px">
          <TimelineItem
            timeline={{
              event: 'eventtttttttttttttttttteventtttttttttttttttttteventtttttttttttttttttt',
              date: '2023/01/01',
            }}
            className="ml-5"
          />
        </ScrollRevealContainer>
      </div>
    </div>
  </div>
);
