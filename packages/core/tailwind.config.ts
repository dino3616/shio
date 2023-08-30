import { createConfig } from '@shio/tailwind/config';

const config = createConfig((defaultConfig) => ({
  ...defaultConfig,
  content: ['./**/*.{ts,tsx}'],
}));

export default config;
