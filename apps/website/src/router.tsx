import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    // スクロール位置の復元はブラウザネイティブに任せる(__root.tsx 参照)。
    // TanStack の復元(scrollRestoration: true)は body 末尾のスクリプトで
    // scrollTo() するため、先に Hero が描画されてから復元ジャンプする
    // 「一瞬チラついてから飛ぶ」挙動になる。ネイティブ復元は描画前に済む
  });

  // TanStack はオプション無効でも「レンダリング完了時にトップへスクロール」する
  // 購読を登録していて、ハイドレーション直後の1回がネイティブ復元を上書きして
  // しまう。初回のリセットフラグを寝かせて素通りさせる(以降のナビゲーションは
  // ハッシュ付きなのでトップリセットは元々走らない)
  router._scroll.next = false;

  return router;
};
