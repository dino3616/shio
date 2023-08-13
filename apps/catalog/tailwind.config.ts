import { createConfig } from '@shio/tailwind';

const config = createConfig({
  mode: 'jit',
  content: ['./.storybook/**/*.{.ts,.tsx}', '../../**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
});

export default config;
