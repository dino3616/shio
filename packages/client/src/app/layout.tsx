import '../style/global.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head />
    <body>{children}</body>
  </html>
);

export default RootLayout;
