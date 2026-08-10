/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type * as React from "react";
import { NoiseOverlay } from "~/components/noise-overlay";
import appCss from "~/styles/app.css?url";

// scroll-smooth を html に付けないこと: CSS の scroll-behavior はスクロール位置の
// 復元(TanStack のインラインスクリプト)にも適用されてしまう。
// アンカーへのスムーズスクロールはナビの onClick(scrollIntoView)で行う
const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head>
      {/*
       * スクロール位置の復元はブラウザネイティブ(描画前に完了=チラつかない)。
       * 過去に TanStack の復元が history.scrollRestoration を "manual" にした値は
       * 履歴エントリに永続化されて残るので、最初に明示的に "auto" へ戻す
       */}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: 静的な1行スクリプト */}
      <script dangerouslySetInnerHTML={{ __html: 'history.scrollRestoration = "auto"' }} />
      <HeadContent />
    </head>
    <body className="bg-void text-star min-h-screen antialiased">
      {children}
      <NoiseOverlay />
      <Scripts />
    </body>
  </html>
);

const SITE_URL = "https://shio.studio";
const SITE_TITLE = "shio.studio | 矛盾ごと、かたちにする。";
const SITE_DESCRIPTION =
  "塩畑晴人のポートフォリオ。かわいくて不穏な宇宙のかたすみに、作品や実験、いま聴いている曲までを集めていく場所。";
const OGP_IMAGE = `${SITE_URL}/ogp.png`;

const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "塩畑 晴人",
  alternateName: ["Haruto Shiohata", "shio"],
  url: SITE_URL,
  jobTitle: "Engineer / Designer",
  sameAs: ["https://github.com/dino3616", "https://x.com/shio3616"],
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#0E0A14" },
      // OGP
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:site_name", content: "shio.studio" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:locale", content: "ja_JP" },
      { property: "og:image", content: OGP_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "宇宙を漂う単眼とハートの月" },
      // X (Twitter) カード
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@shio3616" },
      { name: "twitter:creator", content: "@shio3616" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OGP_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "icon", href: "/brand-icon.webp", type: "image/webp" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Noto+Sans+JP:wght@400;700;900&family=Shippori+Mincho:wght@500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=DotGothic16&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap",
      },
    ],
    scripts: [{ type: "application/ld+json", children: PERSON_JSON_LD }],
  }),
  shellComponent: RootDocument,
});
