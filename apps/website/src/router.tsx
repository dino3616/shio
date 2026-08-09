import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    // リロード後のスクロール位置復元。behavior を instant にしないと
    // CSS の scroll-behavior に引きずられて「ゆっくり元の位置へ
    // スクロールしていく」復元になる(スムーズはナビクリック時だけ
    // JS の scrollIntoView で行い、グローバル CSS には持たせない)
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
  });

  return router;
};
