import type { FC } from 'react';
import { Timeline, TimelineProps } from '../domain/timeline/component/timeline.presenter';
import type { UseFindTimelinesInterface } from '../repository/find-timelines.repository';
import { ScrollRevealAnimation } from '@/common/component/scroll-reveal-animation/scroll-reveal-animation.presenter';

export type FoundTimelinesProps = Omit<TimelineProps, 'timeline'> & {
  useFindTimelines: UseFindTimelinesInterface;
};

export const FoundTimelines: FC<FoundTimelinesProps> = ({ useFindTimelines, ...props }) => {
  const timelines = useFindTimelines();

  return (
    <>
      {timelines.map((timeline) => (
        <ScrollRevealAnimation key={timeline.id} duration={0.8} delay={0} distance="40px">
          <Timeline timeline={timeline} {...props} />
        </ScrollRevealAnimation>
      ))}
    </>
  );
};
