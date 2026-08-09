/**
 * 初回表示のゲート。Hero の主演出(流体背景)が最初のフレームを描ける状態に
 * なったことを1回だけ通知する。BootOverlay がこれを待って画面全体を
 * 一斉にフェードインする
 */

let ready = false;
const listeners = new Set<() => void>();

/** 準備完了を通知する(2回目以降の呼び出しは無視) */
export const markBootReady = () => {
  if (ready) {
    return;
  }
  ready = true;
  for (const listener of listeners) {
    listener();
  }
  listeners.clear();
};

/** 準備完了を購読する。既に完了していれば即座に呼ぶ */
export const onBootReady = (listener: () => void): (() => void) => {
  if (ready) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
