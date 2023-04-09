import { motion } from 'framer-motion';
import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = Omit<ComponentPropsWithRef<typeof motion.button>, 'type'> & {
  asIcon?: boolean;
  disableHoverAnimation?: boolean;
  disableTapAnimation?: boolean;
};

export const Button: ForwardRefExoticComponent<ButtonProps> = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'ref'>>(
  ({ asIcon, disableHoverAnimation, disableTapAnimation, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileHover={!disableHoverAnimation ? { translateY: -3 } : undefined}
      whileTap={!disableTapAnimation ? { scale: 0.93 } : undefined}
      className={twMerge(
        'flex justify-center items-center gap-2 rounded-xl bg-white p-5 drop-shadow-lg hover:drop-shadow-xl',
        asIcon && 'bg-transparent p-0',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  ),
);

Button.displayName = 'Button';
