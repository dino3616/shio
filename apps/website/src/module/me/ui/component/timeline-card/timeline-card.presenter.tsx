'use client';

import type { ComponentPropsWithoutRef, FC } from 'react';
import type { Timeline } from '@/core/domain/timeline/model/timeline.model';
import { twMerge } from '@/core/util/tw-merge.util';

type TimelineCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  timeline: Timeline;
  formatDate: (date: Date, pattern: string) => string;
};

export const TimelineCard: FC<TimelineCardProps> = ({ timeline, formatDate, className, ...props }) => (
  <div className={twMerge('w-4/5 space-y-3 rounded-3xl bg-white p-5 shadow-lg md:w-2/5', className)} {...props}>
    <div className="break-words text-lg font-semibold">{timeline.title}</div>
    <div className="text-gray-400 text-sm">{formatDate(timeline.happenedAt, 'MMM. dd, yyyy')}</div>
  </div>
);
