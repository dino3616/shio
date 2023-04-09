import type { ComponentPropsWithoutRef, FC } from 'react';
import { TimelineCard } from './component/timeline-card/timeline-card.presenter';
import { Heading } from '@/core/component/heading/heading.presenter';
import { ScrollRevealAnimation } from '@/core/component/scroll-reveal-animation/scroll-reveal-animation.presenter';
import type { Timeline as TimelineModel } from '@/core/domain/timeline/model/timeline.model';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timelines: TimelineModel[];
  timelineCardProps: Omit<ComponentPropsWithoutRef<typeof TimelineCard>, 'timeline'>;
};

export const Timeline: FC<TimelineProps> = ({ timelines, timelineCardProps, ...props }) => (
  <div {...props}>
    <Heading text="Timeline" alt="タイムライン" />
    <div className="relative mt-6">
      <div
        aria-hidden
        className="bg-gray-600 before:border-gray-600 before:bg-gray-600 after:border-gray-600 after:bg-gray-600 absolute inset-0 m-[5px] w-0.5 before:absolute before:top-[-5px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid after:absolute after:bottom-[-5px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid"
      />
      <div className="space-y-5 py-5">
        {timelines.map((timeline) => (
          <ScrollRevealAnimation key={timeline.id} duration={0.8} delay={0} distance="40px">
            <TimelineCard className="ml-7" timeline={timeline} {...timelineCardProps} />
          </ScrollRevealAnimation>
        ))}
      </div>
    </div>
  </div>
);
