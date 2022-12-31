import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Timeline } from '@/model/timeline.model';
import { twMerge } from '@/util/tw-merge';

export type TimelineItemProps = ComponentPropsWithoutRef<'div'> & {
  timeline: Timeline;
};

export const TimelineItem: FC<TimelineItemProps> = ({ timeline, className, ...props }) => (
  <div className={twMerge('w-4/5 md:w-2/5 space-y-3 rounded-3xl bg-white p-5 shadow-lg', className)} {...props}>
    <div className="break-words text-lg font-semibold">{timeline.event}</div>
    <div className="text-sm text-gray-300">{timeline.date.toString()}</div>
  </div>
);
