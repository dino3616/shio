import type { FC } from 'react';
import { Timeline, TimelineProps } from '../domain/timeline/component/timeline.presenter';
import type { UseFindTimelinesInterface } from '../repository/find-timelines.repository';
import { ScrollRevealContainer } from '@/common/component/scroll-reveal-container/scroll-reveal-container.presenter';

export type FoundTimelinesProps = Omit<TimelineProps, 'timeline'> & {
  useFindTimelines: UseFindTimelinesInterface;
};

export const FoundTimelines: FC<FoundTimelinesProps> = ({ useFindTimelines, ...props }) => {
  const timelines = useFindTimelines();

  return (
    <>
      {timelines.map((timeline) => (
        <ScrollRevealContainer key={timeline.id} duration={0.8} delay={0} distance="40px">
          <Timeline timeline={timeline} {...props} />
        </ScrollRevealContainer>
      ))}
    </>
  );
};
