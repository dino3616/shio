import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    // ルートは1つだけ(セクションはハッシュアンカー)なので、スクロール位置の
    // 復元はブラウザ標準に任せる。TanStack の復元(scrollRestoration: true)は
    // history.scrollRestoration を manual にした上でハイドレーション後に
    // scrollTo() するため、html の scroll-smooth が適用されて「リロード後に
    // ゆっくり元の位置へスクロールしていく」奇妙な復元になっていた
  });

  return router;
};
