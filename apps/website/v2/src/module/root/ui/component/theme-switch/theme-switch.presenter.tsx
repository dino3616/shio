'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { type ComponentPropsWithoutRef, useState, useEffect } from 'react';
import { Switch } from '@/core/component/switch';
import { MoonIcon } from '@/core/icon/moon-icon';
import { SunIcon } from '@/core/icon/sun-icon';
import { cn } from '@/core/util/cn';

type ThemeSwitchProps = Omit<ComponentPropsWithoutRef<typeof Switch.Root>, 'children'>;

export const ThemeSwitch = ({ className, ...props }: ThemeSwitchProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark' ? true : theme === undefined ? undefined : false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <form>
      <label aria-description="A switch to turn on the dark mode." htmlFor="theme-switch" className="sr-only" />
      <Switch.Root
        id="theme-switch"
        checked={isDarkMode}
        value={isDarkMode ? 'on' : 'off'}
        onCheckedChange={(checked) => {
          setIsDarkMode(checked);
        }}
        className={cn('relative w-20 rounded-full bg-mauve-3 p-2', className)}
        {...props}
      >
        <AnimatePresence initial={false}>
          <motion.span
            animate={isDarkMode ? { translateX: 40 } : { translateX: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="block"
          >
            <Switch.Thumb className={cn('block h-6 w-6 rounded-full bg-black-5 shadow-lg dark:bg-white-5')} />
          </motion.span>
        </AnimatePresence>
        <div>
          <SunIcon className="absolute left-3 top-3 h-4 w-4 fill-mauve-11" />
          <MoonIcon className="absolute right-3 top-3 h-4 w-4 fill-mauve-11" />
        </div>
      </Switch.Root>
    </form>
  );
};
