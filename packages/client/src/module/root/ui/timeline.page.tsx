import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Timeline as TimelineModel } from '../model/timeline.model';
import { Timeline as TimelineItem } from './component/timeline/timeline.presenter';
import { Heading } from '@/common/component/heading/heading.presenter';
import { ScrollRevealAnimation } from '@/common/component/scroll-reveal-animation/scroll-reveal-animation.presenter';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timelines: TimelineModel[];
  timelineItemProps: Omit<ComponentPropsWithoutRef<typeof TimelineItem>, 'timeline'>;
};

export const Timeline: FC<TimelineProps> = ({ timelines, timelineItemProps, ...props }) => (
  <div {...props}>
    <Heading text="Timeline" alt="タイムライン" />
    <div className="relative mt-6">
      <div
        aria-hidden
        className="absolute inset-0 m-[5px] w-0.5 bg-gray-600 before:absolute before:top-[-5px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid before:border-gray-600 before:bg-gray-600 after:absolute after:bottom-[-5px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid after:border-gray-600 after:bg-gray-600"
      />
      <div className="space-y-5 py-5">
        {timelines.map((timeline) => (
          <ScrollRevealAnimation key={timeline.id} duration={0.8} delay={0} distance="40px">
            <TimelineItem className="ml-7" timeline={timeline} {...timelineItemProps} />
          </ScrollRevealAnimation>
        ))}
      </div>
    </div>
  </div>
);
