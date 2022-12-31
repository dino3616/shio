import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/util/tw-merge';

export type StyledHeadingProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  text: string;
  alt: string;
};

export const StyledHeading: FC<StyledHeadingProps> = ({ text, alt, className, ...props }) => (
  <span className={twMerge('font-rakkas text-5xl relative', className)} {...props}>
    <span className="pr-3 text-8xl">{text.at(0)}</span>
    <span className="absolute bottom-10">{text.slice(1)}</span>
    <span className="text-xl font-bold">{alt}</span>
  </span>
);
