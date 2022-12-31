import type { ComponentPropsWithoutRef, FC } from 'react';
import { StyledHeading } from '@/common/component/styled-heading/styled-heading.presenter';
import { twMerge } from '@/util/tw-merge';

export type TimelineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const Timeline: FC<TimelineProps> = ({ className, ...props }) => (
  <div className={twMerge('', className)} {...props}>
    <StyledHeading text="Timeline" alt="タイムライン" />
  </div>
);
