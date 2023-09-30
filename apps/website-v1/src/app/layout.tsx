import { PageTransitionAnimationProvider } from '@shio/core/component/page-transition-animation-provider';
import { ThemeProvider } from '@shio/core/component/theme-provider';
import { getFontVariables, inter, notoSans, rakkas } from '@shio/core/font/family';
import { getBaseUrl } from '@shio/core/util/get-base-url';
import { colors } from '@shio/design-token';
import { cn } from '@shio/tailwind';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '#website-v1/module/root/ui/layout/footer';
import { Header } from '#website-v1/module/root/ui/layout/header';
import '#website-v1/style/global.css';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): ReactNode => (
  <html lang="ja" suppressHydrationWarning>
    <head />
    <body className={cn(getFontVariables([inter, notoSans, rakkas]), 'bg-purple-3 font-sans')}>
      <ThemeProvider attribute="data-theme" enableSystem defaultTheme="system">
        <Header outsideClass="fixed left-0 top-0 z-10" />
        <PageTransitionAnimationProvider>
          <main className="min-h-[100svh]">{children}</main>
        </PageTransitionAnimationProvider>
        <Footer />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;

export const generateMetadata = (): Metadata => {
  const title = 'shio.studio | Creator for Creators';
  const description = 'Portfolio site of shio, creator for creators.';

  return {
    metadataBase: getBaseUrl({ app: 'website-v1' }),
    title: {
      default: title,
      template: '%s | shio.studio',
    },
    description,
    openGraph: {
      title,
      description,
      locale: 'ja_JP',
      url: getBaseUrl({ app: 'website-v1' }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@shio3616',
      creator: '@shio3616',
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: colors.light.purple['7'] },
      { media: '(prefers-color-scheme: dark)', color: colors.dark.purple['7'] },
    ],
  };
};
