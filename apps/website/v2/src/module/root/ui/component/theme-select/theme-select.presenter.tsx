'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/core/component/select';
import { ColorPaletteIcon } from '@/core/icon/color-palette-icon';
import { ComputerIcon } from '@/core/icon/computer-icon';
import { MoonIcon } from '@/core/icon/moon-icon';
import { SunIcon } from '@/core/icon/sun-icon';

export const ThemeSelect = () => {
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
    >
      <SelectTrigger
        aria-label="theme selector"
        aria-description="Selector to choose between light, dark, or system theme."
        className="h-auto rounded-full bg-transparent p-2"
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
