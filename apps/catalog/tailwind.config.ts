import { createConfig } from '@shio/tailwind/config';

const config = createConfig((defaultConfig) => ({
  ...defaultConfig,
  content: ['./.storybook/**/*.{.ts,.tsx}', '../../**/*.{ts,tsx}'],
}));

export default config;
