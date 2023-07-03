import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';
import React from 'react';
import { fontFamily } from '../src/core/font/family';
import { cn } from '../src/core/util/tailwind';
import { ThemeProvider } from '../src/module/root/ui/layout/theme-provider';
import '../src/style/global.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="data-theme">
        <div className={cn(fontFamily, 'bg-mauve-2 font-sans text-mauve-12')}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

export default preview;
