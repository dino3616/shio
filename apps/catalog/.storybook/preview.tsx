import { ThemeProvider } from '@shio/core/component/theme-provider';
import { firaCode, getFontVariables, inter, notoSans, rakkas } from '@shio/core/font/family';
import { cn } from '@shio/tailwind';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import React from 'react';
import './storybook.css';

const themeDataAttribute = 'data-theme';
const defaultTheme = 'light';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute={themeDataAttribute} defaultTheme={defaultTheme}>
        <Story />
      </ThemeProvider>
    ),
    // FIXME: I'm trying to add fontFamily to className and load the font by next/font, but oddly enough this does not work correctly.
    // Probably due to the fact that it work on monorepo.
    (Story) => (
      <div className={cn(getFontVariables([firaCode, inter, notoSans, rakkas]), 'font-sans')}>
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      attributeName: themeDataAttribute,
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: defaultTheme,
    }),
  ],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

export default preview;
