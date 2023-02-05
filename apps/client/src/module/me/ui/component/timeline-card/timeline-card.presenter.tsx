import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Timeline as TimelineModel } from '../../../model/timeline.model';
import { twMerge } from '@/common/util/tw-merge.util';

export type TimelineCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timeline: TimelineModel;
  formatDate: (date: Date, pattern: string) => string;
};

export const TimelineCard: FC<TimelineCardProps> = ({ timeline, formatDate, className, ...props }) => (
  <div className={twMerge('w-4/5 md:w-2/5 space-y-3 rounded-3xl bg-white p-5 shadow-lg', className)} {...props}>
    <div className="break-words text-lg font-semibold">{timeline.title}</div>
    <div className="text-sm text-gray-400">{formatDate(timeline.happenedAt, 'MMM. dd, yyyy')}</div>
  </div>
);
