'use client';

import * as RadixUiSelect from '@radix-ui/react-select';
import { type VariantProps, cn, tv } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import { CheckIcon } from '#core/icon/check-icon';

export const Select = RadixUiSelect.Root;

export const SelectGroup = RadixUiSelect.Group;

export const SelectValue = RadixUiSelect.Value;

const selectTriggerVatiant = tv({
  variants: {
    display: {
      flex: 'flex',
      'inline-flex': 'inline-flex',
    },
    color: {
      transparent: 'border-mauve-6 bg-transparent text-mauve-12 ring-mauve-7 hover:bg-mauve-4 focus:border-mauve-7',
      mauve: 'border-mauve-6 bg-mauve-3 text-mauve-12 ring-mauve-7 hover:bg-mauve-4 focus:border-mauve-7',
      purple: 'border-purple-6 bg-purple-3 text-purple-12 ring-purple-7 hover:bg-purple-4 focus:border-purple-7',
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
});

const selectTriggerIconVariant = tv({
  variants: {
    color: {
      transparent: 'fill-mauve-12',
      mauve: 'fill-mauve-12',
      purple: 'fill-purple-12',
    } satisfies Record<Extract<Exclude<VariantProps<typeof selectTriggerVatiant>['color'], undefined>, string>, string>,
  },
});

type SelectTriggerProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Trigger>, 'className'> &
  VariantProps<typeof selectTriggerVatiant> & {
    icon?: (props: Omit<ComponentPropsWithoutRef<'svg'>, 'children'>) => ReactNode;
  };

export const SelectTrigger = forwardRef<ElementRef<typeof RadixUiSelect.Trigger>, Omit<SelectTriggerProps, 'ref'>>(
  ({ display = 'flex', color = 'mauve', textSize = 'sm', asIcon = false, rounded = 'md', icon: Icon, children, ...props }, ref) => (
    <RadixUiSelect.Trigger
      ref={ref}
      className={cn(
        'items-center justify-between gap-8 border p-4 transition',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selectTriggerVatiant({ display, color, textSize, rounded, asIcon }),
      )}
      {...props}
    >
      {children}
      {!asIcon && (
        <RadixUiSelect.Icon asChild={!!Icon}>
          {Icon && <Icon className={cn('h-7 w-7 opacity-70', selectTriggerIconVariant({ color }))} />}
        </RadixUiSelect.Icon>
      )}
    </RadixUiSelect.Trigger>
  ),
);

SelectTrigger.displayName = RadixUiSelect.Trigger.displayName;

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

type SelectLabelProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Label>, 'className'>;

export const SelectLabel = forwardRef<ElementRef<typeof RadixUiSelect.Label>, Omit<SelectLabelProps, 'ref'>>(({ ...props }, ref) => (
  <RadixUiSelect.Label ref={ref} className="py-1.5 pl-5 text-xs font-bold text-mauve-11 tablet:text-sm" {...props} />
));

SelectLabel.displayName = RadixUiSelect.Label.displayName;

type SelectItemProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Item>, 'className'>;

export const SelectItem = forwardRef<ElementRef<typeof RadixUiSelect.Item>, Omit<SelectItemProps, 'ref'>>(({ children, ...props }, ref) => (
  <RadixUiSelect.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded py-1.5 pl-9 pr-2 text-sm outline-none tablet:text-base',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:bg-mauve-4',
    )}
    {...props}
  >
    <span className="absolute left-2 flex items-center justify-center">
      <RadixUiSelect.ItemIndicator>
        <CheckIcon className="h-4 w-4 fill-mauve-11" />
      </RadixUiSelect.ItemIndicator>
    </span>
    <RadixUiSelect.ItemText>{children}</RadixUiSelect.ItemText>
  </RadixUiSelect.Item>
));

SelectItem.displayName = RadixUiSelect.Item.displayName;

type SelectSeparatorProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Separator>, 'children' | 'className'>;

export const SelectSeparator = forwardRef<ElementRef<typeof RadixUiSelect.Separator>, Omit<SelectSeparatorProps, 'ref'>>(({ ...props }, ref) => (
  <RadixUiSelect.Separator ref={ref} className="-mx-1 my-1 h-px bg-mauve-6" {...props} />
));

SelectSeparator.displayName = RadixUiSelect.Separator.displayName;
