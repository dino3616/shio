import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/common/util/tw-merge.util';

export type HeadingProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  text: string;
  alt: string;
};

export const Heading: FC<HeadingProps> = ({ text, alt, className, ...props }) => (
  <span className={twMerge('font-rakkas text-xl relative md:text-5xl', className)} {...props}>
    <h2>
      <span className="pr-3 text-7xl md:text-8xl">{text.at(0)}</span>
      <span className="absolute bottom-6 md:bottom-10">{text.slice(1)}</span>
    </h2>
    <span className="text-sm font-bold md:text-xl">{alt}</span>
  </span>
);
