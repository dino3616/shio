import { useEffect, useState } from "react";
import { onBootReady } from "~/lib/boot";

/**
 * 初回ロードの幕。流体背景(Hero の主演出)が最初のフレームを描けるまで
 * 画面全体をサイトの背景色で覆い、準備ができたらページ全体を一斉に
 * フェードインする。準備通知が来ない異常系(WebGL 初期化失敗など)でも
 * 必ず開くようタイムアウトを持つ
 */

const FADE_MS = 700;
const TIMEOUT_MS = 4000;

export const BootOverlay = () => {
  const [phase, setPhase] = useState<"covering" | "fading" | "done">("covering");

  useEffect(() => {
    let fadeTimer = 0;
    const startFade = () => {
      setPhase((prev) => (prev === "covering" ? "fading" : prev));
      // reduced motion などで transitionend が飛ばなくても確実に片付ける
      fadeTimer = window.setTimeout(() => {
        setPhase("done");
      }, FADE_MS + 100);
    };
    const timeoutTimer = window.setTimeout(startFade, TIMEOUT_MS);
    const unsubscribe = onBootReady(startFade);
    return () => {
      unsubscribe();
      window.clearTimeout(timeoutTimer);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      id="boot-overlay"
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[60] bg-void transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* JS が無効だと幕を開ける者がいないので、最初から出さない */}
      <noscript>
        <style>{"#boot-overlay { display: none; }"}</style>
      </noscript>
    </div>
  );
};
