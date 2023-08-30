import { PageTransitionAnimationProvider } from '@shio/core/component/page-transition-animation-provider';
import { ThemeProvider } from '@shio/core/component/theme-provider';
import { fontFamily } from '@shio/core/font/family';
import { getBaseUrl } from '@shio/core/util/get-base-url';
import { colors } from '@shio/design-token';
import { cn } from '@shio/tailwind';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/module/root/ui/layout/footer';
import { Header } from '@/module/root/ui/layout/header';
import '@/style/global.css';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): ReactNode => (
  <html lang="en" suppressHydrationWarning>
    <head />
    <body className={cn(fontFamily, 'bg-purple-1 font-sans', 'bg-grid-light-purple-5/50 dark:bg-grid-dark-purple-5/50')}>
      <Analytics />
      <ThemeProvider attribute="data-theme" enableSystem defaultTheme="system">
        <Header outsideClass="fixed left-0 top-0 z-10" />
        <PageTransitionAnimationProvider>
          <main className="min-h-screen">{children}</main>
        </PageTransitionAnimationProvider>
        <Footer outsideClass="mt-24" />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;

export const generateMetadata = (): Metadata => {
  const title = 'shio.studio | Provide accessible Web for everyone, everywhere.';
  const description =
    'This portfolio presents my projects and thoughts as a frontend developer who maximizes website accessibility from two perspectives: engineer and designer.';

  return {
    metadataBase: getBaseUrl(),
    title: {
      default: title,
      template: '%s | shio.studio',
    },
    description,
    openGraph: {
      title,
      description,
      locale: 'en_US',
      url: getBaseUrl(),
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
