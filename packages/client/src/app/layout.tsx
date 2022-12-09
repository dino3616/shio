import { fontFamily } from '@/font/family';
import '@/style/global.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head />
    <body className={`${fontFamily} font-sans`}>{children}</body>
  </html>
);

export default RootLayout;
