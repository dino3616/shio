import { motion, MotionProps } from 'framer-motion';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'> & MotionProps, 'type'>;

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => (
  <motion.button
    whileTap={{ scale: 0.93 }}
    className={twMerge('flex justify-center items-center gap-2 rounded-xl bg-white p-5 drop-shadow-lg', className)}
    type="button"
    {...props}
  >
    {children}
  </motion.button>
);
