'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentPropsWithoutRef, FC } from 'react';

type ThemeProviderProps = ComponentPropsWithoutRef<typeof NextThemesProvider>;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => <NextThemesProvider {...props}>{children}</NextThemesProvider>;
