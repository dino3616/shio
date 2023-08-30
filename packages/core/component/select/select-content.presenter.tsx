'use client';

import * as RadixUiSelect from '@radix-ui/react-select';
import { cn } from '@shio/tailwind';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

type SelectContentProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Content>, 'className'>;

export const SelectContent = forwardRef<ElementRef<typeof RadixUiSelect.Content>, Omit<SelectContentProps, 'ref'>>(
  ({ children, position = 'popper', ...props }, ref) => (
    <RadixUiSelect.Portal>
      <RadixUiSelect.Content
        ref={ref}
        className={cn(
          'relative min-w-[8rem] overflow-hidden rounded-md border border-mauve-6 text-mauve-12 shadow-md animate-in fade-in-80',
          position === 'popper' && 'translate-y-1',
        )}
        position={position}
        {...props}
      >
        <RadixUiSelect.Viewport
          className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}
        >
          {children}
        </RadixUiSelect.Viewport>
      </RadixUiSelect.Content>
    </RadixUiSelect.Portal>
  ),
);

SelectContent.displayName = RadixUiSelect.Content.displayName;
