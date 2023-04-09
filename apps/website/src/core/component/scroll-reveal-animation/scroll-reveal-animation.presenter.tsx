'use client';

import { motion } from 'framer-motion';
import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';

type ScrollRevealAnimationProps = ComponentPropsWithRef<typeof motion.div> & {
  once?: boolean;
  duration?: number;
  delay?: number;
  distance?: string;
};

export const ScrollRevealAnimation: ForwardRefExoticComponent<ScrollRevealAnimationProps> = forwardRef<
  HTMLDivElement,
  Omit<ScrollRevealAnimationProps, 'ref'>
>(({ once = true, duration = 0.8, delay = 0, distance = '40px', children, ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={{
      offscreen: {
        y: distance,
        opacity: 0,
      },
      onscreen: {
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay,
        },
      },
    }}
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once, amount: 0 }}
    {...props}
  >
    {children}
  </motion.div>
));

ScrollRevealAnimation.displayName = 'ScrollRevealAnimation';
