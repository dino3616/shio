'use client';

import type { ComponentPropsWithoutRef, FC } from 'react';
import { Provider } from 'urql';

type UrqlProviderProps = ComponentPropsWithoutRef<typeof Provider>;

export const UrqlProvider: FC<UrqlProviderProps> = ({ children, ...props }) => {
  return <Provider {...props}>{children}</Provider>;
};
