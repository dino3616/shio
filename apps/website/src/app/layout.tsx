'use client';

import type { FC, ReactNode } from 'react';
import { fontFamily } from '@/core/infra/font/font.service';
import { RootProvider } from '@/core/infra/provider/root.provider';
import { ThemeProvider } from '@/core/infra/provider/theme.provider';
import { TransitionAnimateProvider } from '@/core/infra/provider/transition-animate.provider';
import { urqlClient } from '@/core/infra/urql/urql.service';
import { Footer } from '@/module/me/ui/footer.layout';
import { Header } from '@/module/me/ui/header.layout';
import '@/core/style/global.css';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="ja" suppressHydrationWarning>
    <RootProvider urql={{ value: urqlClient }}>
      <head />
      <ThemeProvider attribute="data-theme">
        <body
          className={`${fontFamily} flex min-h-screen flex-col bg-slate-2 font-sans scrollbar-thin scrollbar-track-transparent scrollbar-thumb-keyplate-6 scrollbar-thumb-rounded-full hover:scrollbar-thumb-keyplate-7`}
        >
          <Header />
          <TransitionAnimateProvider>
            <main className="min-h-full grow">{children}</main>
          </TransitionAnimateProvider>
          <Footer />
        </body>
      </ThemeProvider>
    </RootProvider>
  </html>
);

export default RootLayout;
