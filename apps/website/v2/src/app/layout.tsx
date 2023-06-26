import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontFamily } from '@/core/font/family';
import { cn } from '@/core/util/cn';
import { getBaseUrl } from '@/core/util/get-base-url';
import { Footer } from '@/module/root/ui/layout/footer';
import { Header } from '@/module/root/ui/layout/header';
import { PageTransitionAnimationProvider } from '@/module/root/ui/layout/page-transition-animation-provider';
import { ThemeProvider } from '@/module/root/ui/layout/theme-provider';
import { colors } from '@/style/token';
import '@/style/global.css';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): ReactNode => (
  <html lang="en" suppressHydrationWarning>
    <head />
    <body
      className={cn(
        fontFamily,
        'flex min-h-screen flex-col bg-purple-1 font-sans',
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-mauve-6 scrollbar-thumb-rounded-full hover:scrollbar-thumb-mauve-7',
        'bg-grid-light-purple-5/50 dark:bg-grid-dark-purple-5/50',
      )}
    >
      <Analytics />
      <ThemeProvider attribute="data-theme" enableSystem defaultTheme="system">
        <Header className="fixed left-0 top-0 z-10 grow-0" />
        <PageTransitionAnimationProvider>
          <main className="min-h-full grow">{children}</main>
        </PageTransitionAnimationProvider>
        <Footer className="mt-24" />
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
