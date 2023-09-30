import { breakpoints, colors, fonts } from '@shio/design-token';
import svgToDataUri from 'mini-svg-data-uri';
import { withTV } from 'tailwind-variants/transformer';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import type { KeyValuePair, PluginAPI, RecursiveKeyValuePair, ResolvableTo } from 'tailwindcss/types/config';
import { createThemes } from 'tw-colors';

const flattenColorPalette = (colorPalette: ResolvableTo<RecursiveKeyValuePair<string, string>>): KeyValuePair<string, string> =>
  Object.assign(
    {},
    ...Object.entries(colorPalette ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }],
    ),
  );

const defaultConfig: Config = {
  mode: 'jit',
  content: [],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    colors,
    fontFamily: {
      code: [`var(${fonts['fira-code'].variable})`, ...defaultTheme.fontFamily.mono],
      inter: [`var(${fonts.inter.variable})`, ...defaultTheme.fontFamily.sans],
      rakkas: [`var(${fonts.rakkas.variable})`, ...defaultTheme.fontFamily.serif],
      sans: [`var(${fonts['noto-sans'].variable})`, ...defaultTheme.fontFamily.sans],
    },
    fontWeight: {
      normal: '400',
      bold: '700',
    },
    screens: {
      mobile: `${breakpoints.mobile.minWidth}px`,
      tablet: `${breakpoints.tablet.minWidth}px`,
      laptop: `${breakpoints.laptop.minWidth}px`,
      desktop: `${breakpoints.desktop.minWidth}px`,
    },
  },
  plugins: [
    createThemes({
      light: colors.light,
      dark: colors.dark,
    }),
    ({ matchUtilities, theme }: PluginAPI) => {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}" stroke-dasharray="5 3" transform="scale(1, -1)"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' },
      );
    },
    require('tailwindcss-animate'),
  ],
};

type CreateConfig = (config: (c: Config) => Config) => Config;

export const createConfig: CreateConfig = (config) => withTV(config(defaultConfig));
