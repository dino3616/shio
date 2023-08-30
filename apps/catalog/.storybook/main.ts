import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials', '@storybook/addon-styling'],
  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../../website-v2/public'],
  stories: [
    {
      directory: '../../website-v2/src',
      files: '**/*.story.tsx',
      titlePrefix: 'website-v2',
    },
    {
      directory: '../../../packages/core',
      files: '**/*.story.tsx',
      titlePrefix: 'core',
    },
  ],
  typescript: {
    reactDocgenTypescriptOptions: {
      // NOTE: This setting is necessary to recognize JSDoc for components under monorepo.
      // ref: https://github.com/storybookjs/storybook/issues/21399#issuecomment-1473800791
      include: ['../../../**/*.tsx'],
    },
  },
  webpackFinal: (webpackConfig) => {
    const finalConfig: typeof webpackConfig = {
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve?.alias,
          '@': path.resolve(__dirname, '../../website-v2/src'),
          '#core': path.resolve(__dirname, '../../../packages/core'),
        },
      },
    };

    return finalConfig;
  },
};

export default config;
