import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';
import { twMerge } from '@/core/util/tw-merge.util';

type HeadingProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  text: string;
  alt: string;
};

export const Heading: ForwardRefExoticComponent<HeadingProps> = forwardRef<HTMLSpanElement, Omit<HeadingProps, 'ref'>>(
  ({ text, alt, className, ...props }, ref) => (
    <span ref={ref} className={twMerge('relative flex font-rakkas text-4xl md:text-5xl', className)} {...props}>
      <h2>
        <span className="pr-3 text-7xl md:text-8xl">{text.at(0)}</span>
        <span className="absolute bottom-7 md:bottom-10">{text.slice(1)}</span>
      </h2>
      <div className="mt-auto mb-[0.65rem] inline text-sm font-bold md:mb-[0.8rem] md:text-xl">{alt}</div>
    </span>
  ),
);

Heading.displayName = 'Heading';
