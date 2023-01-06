import { motion, MotionProps } from 'framer-motion';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'> & MotionProps, 'type'> & {
  asIcon?: boolean;
};

export const Button: FC<ButtonProps> = ({ asIcon, className, children, ...props }) => (
  <motion.button
    whileHover={{
      translateY: -3,
    }}
    whileTap={{ scale: 0.93 }}
    className={twMerge(
      'flex justify-center items-center gap-2 rounded-xl bg-white p-5 drop-shadow-lg hover:drop-shadow-xl',
      asIcon && 'bg-transparent p-0',
      className,
    )}
    type="button"
    {...props}
  >
    {children}
  </motion.button>
);
