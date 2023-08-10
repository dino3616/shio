import { config as coreConfig } from '@shio/tailwind';

const config: typeof coreConfig = {
  ...coreConfig,
  mode: 'jit',
  content: ['./.storybook/**/*.{.ts,.tsx}', '../../**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
};

export default config;