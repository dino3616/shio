import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Timeline } from '@/model/timeline.model';
import { twMerge } from '@/util/tw-merge';

export type TimelineItemProps = ComponentPropsWithoutRef<'div'> & {
  timeline: Timeline;
  dateFormatter: (date: Date, pattern: string) => string;
};

export const TimelineItem: FC<TimelineItemProps> = ({ timeline, dateFormatter, className, ...props }) => (
  <div className={twMerge('w-4/5 md:w-2/5 space-y-3 rounded-3xl bg-white p-5 shadow-lg', className)} {...props}>
    <div className="break-words text-lg font-semibold">{timeline.title}</div>
    <div className="text-sm text-gray-300">{dateFormatter(timeline.happenedAt, 'MMM. dd yyyy')}</div>
  </div>
);
