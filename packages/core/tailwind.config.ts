import { createConfig } from '@shio/tailwind';

const config = createConfig({
  mode: 'jit',
  content: ['./**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
});

export default config;
