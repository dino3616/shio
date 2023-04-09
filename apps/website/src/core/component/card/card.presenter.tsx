import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';
import { twMerge } from '@/core/util/tw-merge.util';

type CardProps = ComponentPropsWithRef<'div'>;

export const Card: ForwardRefExoticComponent<CardProps> = forwardRef<HTMLDivElement, Omit<CardProps, 'ref'>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={twMerge('flex flex-col gap-2 rounded-lg bg-white p-4 drop-shadow', className)} {...props}>
      {children}
    </div>
  ),
);

Card.displayName = 'Card';
