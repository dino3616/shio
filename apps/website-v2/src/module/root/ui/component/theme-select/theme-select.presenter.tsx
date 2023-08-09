'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@shio/core/component/select';
import { useTheme } from '@shio/core/component/theme-provider';
import { ColorPaletteIcon } from '@shio/core/icon/color-palette-icon';
import { ComputerIcon } from '@shio/core/icon/computer-icon';
import { MoonIcon } from '@shio/core/icon/moon-icon';
import { SunIcon } from '@shio/core/icon/sun-icon';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';

type ThemeSelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'children' | 'className' | 'onValueChange' | 'value'>;

export const ThemeSelect = ({ ...props }: ThemeSelectProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Select
      value={mounted ? theme : undefined}
      onValueChange={(value) => {
        setTheme(value);
      }}
      {...props}
    >
      <SelectTrigger
        aria-label="theme selector"
        aria-description="Selector to choose between light, dark, or system theme."
        asIcon
        bg-color="transparent"
      >
        <ColorPaletteIcon className="h-6 w-6 fill-mauve-11 stroke-mauve-11" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Theme</SelectLabel>
          <SelectItem value="light">
            <span className="flex items-center gap-3">
              Light
              <SunIcon className="h-4 w-6 fill-mauve-11" />
            </span>
          </SelectItem>
          <SelectItem value="dark">
            <span className="flex items-center gap-3">
              Dark
              <MoonIcon className="h-4 w-6 fill-mauve-11" />
            </span>
          </SelectItem>
          <SelectItem value="system">
            <span className="flex items-center gap-3">
              System
              <ComputerIcon className="h-4 w-6 fill-mauve-11" />
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
