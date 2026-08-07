/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type * as React from "react";
import { NoiseOverlay } from "~/components/noise-overlay";
import appCss from "~/styles/app.css?url";

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja" className="scroll-smooth">
    <head>
      <HeadContent />
    </head>
    <body className="bg-void text-star min-h-screen antialiased">
      {children}
      <NoiseOverlay />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "shio🧂 — Haruto Shiohata" },
      {
        name: "description",
        content: "塩畑晴人(shio)のポートフォリオ。エンジニア/デザイナー。矛盾ごと、かたちにする。",
      },
      { name: "theme-color", content: "#0E0A14" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=DotGothic16&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
});
