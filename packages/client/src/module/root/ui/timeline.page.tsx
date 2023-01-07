import { ComponentPropsWithoutRef, FC, Suspense } from 'react';
import { FoundTimelines, FoundTimelinesProps } from '../use-case/found-timelines.use-case';
import { SkeletonTimeline } from './component/timeline/timeline.presenter';
import { Heading } from '@/common/component/heading/heading.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  foundTimelinesProps: FoundTimelinesProps;
};

export const Timeline: FC<TimelineProps> = ({ foundTimelinesProps, ...props }) => (
  <div {...props}>
    <Heading text="Timeline" alt="タイムライン" />
    <div className="relative mt-6">
      <div
        aria-hidden
        className="absolute inset-0 m-[5px] w-0.5 bg-gray-600 before:absolute before:top-[-5px] before:left-[-5px] before:flex before:h-3 before:w-3 before:rounded-full before:border-4 before:border-solid before:border-gray-600 before:bg-gray-600 after:absolute after:bottom-[-5px] after:left-[-5px] after:flex after:h-3 after:w-3 after:rounded-full after:border-4 after:border-solid after:border-gray-600 after:bg-gray-600"
      />
      <div className="space-y-5 py-5">
        <Suspense fallback={<SkeletonTimeline className="ml-7" />}>
          <FoundTimelines className={twMerge('ml-7', foundTimelinesProps.className)} {...foundTimelinesProps} />
        </Suspense>
      </div>
    </div>
  </div>
);
