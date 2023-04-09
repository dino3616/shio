const tailwindScrollbar = require('tailwind-scrollbar');
const defaultTheme = require('tailwindcss/defaultTheme');
const { createThemes } = require('tw-colors');

const coreToken = require('./src/core/style/token/core.token.json');
const darkToken = require('./src/core/style/token/dark.token.json');
const lightToken = require('./src/core/style/token/light.token.json');

/** @type {import('tailwindcss').Config} */
const config = {
  mode: 'jit',
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['[data-theme="dark"]'],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      primary: coreToken.colors.plum,
      info: coreToken.colors.cyan,
      success: coreToken.colors.green,
      warning: coreToken.colors.yellow,
      danger: coreToken.colors.crimson,
      keyplate: coreToken.colors.slate,
      ...coreToken.colors,
    },
    extend: {
      fontFamily: {
        main: ['var(--font-noto-sans-jp)', ...defaultTheme.fontFamily.sans],
        article: ['var(--font-Shippori-mincho-b1)', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        article: [
          '1.125rem',
          {
            lineHeight: '1.55',
          },
        ],
        heading1: [
          '2.5rem',
          {
            fontWeight: '700',
          },
        ],
        heading2: [
          '2rem',
          {
            fontWeight: '700',
          },
        ],
        heading3: [
          '1.75rem',
          {
            fontWeight: '700',
          },
        ],
        small: '0.75rem',
      },
      lineHeight: {
        medium: '1.55',
      },
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
    createThemes({
      light: {
        primary: lightToken.colors.plum,
        info: lightToken.colors.cyan,
        success: lightToken.colors.green,
        warning: lightToken.colors.yellow,
        danger: lightToken.colors.crimson,
        keyplate: lightToken.colors.slate,
        ...lightToken.colors,
      },
      dark: {
        primary: darkToken.colors.plum,
        info: darkToken.colors.cyan,
        success: darkToken.colors.green,
        warning: darkToken.colors.yellow,
        danger: darkToken.colors.crimson,
        keyplate: darkToken.colors.slate,
        ...darkToken.colors,
      },
    }),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
};

module.exports = config;
