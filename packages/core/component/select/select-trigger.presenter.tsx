'use client';

import * as RadixUiSelect from '@radix-ui/react-select';
import { type VariantProps, cn, tv } from '@shio/tailwind';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';

const selectTriggerVatiant = tv({
  slots: {
    base: null,
    icon: null,
  },
  variants: {
    display: {
      flex: 'flex',
      'inline-flex': 'inline-flex',
    },
    color: {
      transparent: null,
      mauve: null,
      purple: null,
    },
    textSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl',
    },
    rounded: {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },
    asIcon: {
      true: 'h-auto w-auto rounded-full p-2',
    },
  },
  compoundSlots: [
    {
      slots: [`base`],
      color: `transparent`,
      className: 'border-mauve-6 bg-transparent text-mauve-12 ring-mauve-7 hover:bg-mauve-4 focus:border-mauve-7',
    },
    {
      slots: [`base`],
      color: `mauve`,
      className: 'border-mauve-6 bg-mauve-3 text-mauve-12 ring-mauve-7 hover:bg-mauve-4 focus:border-mauve-7',
    },
    {
      slots: [`base`],
      color: `purple`,
      className: 'border-purple-6 bg-purple-3 text-purple-12 ring-purple-7 hover:bg-purple-4 focus:border-purple-7',
    },
    {
      slots: [`icon`],
      color: `transparent`,
      className: 'fill-mauve-12',
    },
    {
      slots: [`icon`],
      color: `mauve`,
      className: 'fill-mauve-12',
    },
    {
      slots: [`icon`],
      color: `purple`,
      className: 'fill-purple-12',
    },
  ],
});

type SelectTriggerProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Trigger>, 'className'> &
  VariantProps<typeof selectTriggerVatiant> & {
    icon?: (props: Omit<ComponentPropsWithoutRef<'svg'>, 'children'>) => ReactNode;
  };

export const SelectTrigger = forwardRef<ElementRef<typeof RadixUiSelect.Trigger>, Omit<SelectTriggerProps, 'ref'>>(
  ({ display = 'flex', color = 'mauve', textSize = 'sm', asIcon = false, rounded = 'md', icon: Icon, children, ...props }, ref) => {
    const { base, icon } = selectTriggerVatiant({ display, color, textSize, rounded, asIcon });

    return (
      <RadixUiSelect.Trigger
        ref={ref}
        className={cn(
          'items-center justify-between gap-8 border p-4 transition',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          base({ display, color, textSize, rounded, asIcon }),
        )}
        {...props}
      >
        {children}
        {!asIcon && (
          <RadixUiSelect.Icon asChild={!!Icon}>{Icon && <Icon className={cn('h-7 w-7 opacity-70', icon({ color }))} />}</RadixUiSelect.Icon>
        )}
      </RadixUiSelect.Trigger>
    );
  },
);

SelectTrigger.displayName = RadixUiSelect.Trigger.displayName;
