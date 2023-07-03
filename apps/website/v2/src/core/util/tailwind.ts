import clsx, { ClassValue } from 'clsx';
import { extendTailwindMerge, Config as TailwindMergeConfig } from 'tailwind-merge';
import { TV, tv as tvBase } from 'tailwind-variants';

const tailwindMergeConfig: Partial<TailwindMergeConfig> = {};

const twMerge = extendTailwindMerge(tailwindMergeConfig);

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const tv: TV = (options, config) =>
  tvBase(options, {
    ...config,
    twMerge: true,
    // TODO: Once following issue is resolved, remove type override.
    // https://github.com/nextui-org/tailwind-variants/issues/58
    twMergeConfig: tailwindMergeConfig as Required<typeof tailwindMergeConfig>,
  });
