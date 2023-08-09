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
    asIcon: {
      true: 'h-auto w-auto rounded-full p-2',
    },
    'bg-color': {
      transparent: 'bg-transparent',
    },
  },
});

type SelectTriggerProps = Omit<ComponentPropsWithoutRef<typeof RadixUiSelect.Trigger>, 'className'> &
  VariantProps<typeof selectTriggerVatiant> & {
    icon?: (props: Omit<ComponentPropsWithoutRef<'svg'>, 'children'>) => ReactNode;
  };

export const SelectTrigger = forwardRef<ElementRef<typeof RadixUiSelect.Trigger>, Omit<SelectTriggerProps, 'ref'>>(
  ({ asIcon = false, 'bg-color': bgColor = undefined, icon: Icon, children, ...props }, ref) => (
    <RadixUiSelect.Trigger
      ref={ref}
      className={cn(
        'flex h-10 w-auto items-center justify-between rounded-md border border-mauve-6 bg-mauve-3 px-3 py-2 text-sm text-mauve-12 ring-mauve-7 transition',
        'hover:bg-mauve-4',
        'focus:border-mauve-7 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selectTriggerVatiant({ asIcon, 'bg-color': bgColor }),
      )}
      {...props}
    >
      {children}
      {Icon && (
        <RadixUiSelect.Icon asChild>
          <Icon className="h-4 w-4 opacity-50" />
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
      'relative flex w-full cursor-default select-none items-center rounded py-1.5 pl-9 text-sm outline-none tablet:text-base',
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
