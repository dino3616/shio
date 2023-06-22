import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
