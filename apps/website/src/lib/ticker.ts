/**
 * サイト全体で共有する単一の requestAnimationFrame ループ。
 *
 * 各演出コンポーネントが個別に rAF を回すと、ループ本数ぶんの起動コストに
 * 加えて「タブ非表示での停止」「dt のクランプ」「scrollY の読み取り」が
 * それぞれに重複する。ここに一元化し、購読者はフレーム情報を受け取るだけにする。
 * - 購読者ゼロ、またはタブ非表示のあいだはループ自体を止める
 * - window.scrollY はフレームあたり1回だけ読んで全購読者に配る
 */

export type Frame = {
  /** performance.now() 起点のタイムスタンプ(ms) */
  now: number;
  /** 前フレームからの経過秒。復帰時のスパイクは 0.05s にクランプ済み */
  dt: number;
  /** このフレームで1回だけ読んだ window.scrollY */
  scrollY: number;
};

type FrameCallback = (frame: Frame) => void;

const subscribers = new Set<FrameCallback>();
let rafId: number | null = null;
let lastTime = 0;
let visibilityHooked = false;

const step = (now: number) => {
  rafId = requestAnimationFrame(step);
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const frame: Frame = { now, dt, scrollY: window.scrollY };
  for (const callback of subscribers) {
    callback(frame);
  }
};

const start = () => {
  if (rafId === null && subscribers.size > 0 && !document.hidden) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(step);
  }
};

const stopIfIdle = () => {
  if (rafId !== null && (subscribers.size === 0 || document.hidden)) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

export const subscribeFrame = (callback: FrameCallback): (() => void) => {
  if (!visibilityHooked) {
    visibilityHooked = true;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopIfIdle();
      } else {
        start();
      }
    });
  }
  subscribers.add(callback);
  start();
  return () => {
    subscribers.delete(callback);
    stopIfIdle();
  };
};

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
