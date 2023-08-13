import { createConfig } from '@shio/tailwind';

const config = createConfig({
  mode: 'jit',
  content: ['./src/**/*.{ts,tsx}', '../../packages/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
});

export default config;
