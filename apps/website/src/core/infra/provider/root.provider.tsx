'use client';

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import { UrqlProvider } from './urql.provider';

type RootProviderProps = {
  children: ReactNode;
  recoil?: ComponentPropsWithoutRef<typeof RecoilRoot>;
  urql: ComponentPropsWithoutRef<typeof UrqlProvider>;
};

export const RootProvider: FC<RootProviderProps> = ({ recoil, urql, children }) => (
  <RecoilRoot {...recoil}>
    <UrqlProvider {...urql}>{children}</UrqlProvider>
  </RecoilRoot>
);
