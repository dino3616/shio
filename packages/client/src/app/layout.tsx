'use client';

import type { FC, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import { fontFamily } from '@/font/family';
import { Footer } from '@/module/root/ui/footer.layout';
import { Header } from '@/module/root/ui/header.layout';
import '@/style/global.css';

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>
    <html
      lang="ja"
      className="bg-accent-100 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500"
    >
      <head />
      <body className={`${fontFamily} flex min-h-screen flex-col font-sans`}>
        <Header className="sticky top-0 left-0 grow-0" />
        <main className="min-h-full grow">{children}</main>
        <Footer className="grow-0" />
      </body>
    </html>
  </RecoilRoot>
);

export default RootLayout;
