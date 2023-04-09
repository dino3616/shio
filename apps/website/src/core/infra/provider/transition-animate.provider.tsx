'use client';

import { AnimatePresence } from 'framer-motion';
import type { ComponentPropsWithoutRef, FC } from 'react';

type TransitionAnimateProviderProps = ComponentPropsWithoutRef<typeof AnimatePresence>;

export const TransitionAnimateProvider: FC<TransitionAnimateProviderProps> = ({ children, ...props }) => (
  <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)} {...props}>
    {children}
  </AnimatePresence>
);
