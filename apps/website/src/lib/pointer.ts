/**
 * カーソル位置(ビューポート座標)の共有ストア。
 * pointermove のリスナーをサイト全体で1組にして、消費側は
 * getPointer() でフレームごとに読むか、コールバックで受け取る。
 *
 * リロード直後はカーソルが動くまで pointermove が発火しない。
 * Chromium は静止カーソルの下に要素が描画された時点で pointerover を
 * 発火するので、それを初期位置として使う。
 */

export type PointerPosition = { x: number; y: number };

type PointerListener = (position: PointerPosition) => void;

let current: PointerPosition | null = null;
const listeners = new Set<PointerListener>();
let refCount = 0;
let detach: (() => void) | null = null;

const publish = (position: PointerPosition) => {
  current = position;
  for (const listener of listeners) {
    listener(position);
  }
};

const attach = () => {
  const handleMove = (event: PointerEvent) => {
    publish({ x: event.clientX, y: event.clientY });
  };
  const handleOver = (event: PointerEvent) => {
    if (current === null) {
      publish({ x: event.clientX, y: event.clientY });
    }
  };
  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerover", handleOver);
  detach = () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerover", handleOver);
  };
};

/** 最後に観測したカーソル位置(まだ観測していなければ null) */
export const getPointer = (): PointerPosition | null => current;

/**
 * ストアを利用開始する。最初の利用者が現れたときだけ window にリスナーを張り、
 * 全員が離れたら外す。listener を渡すと位置の更新ごとに呼ばれる
 */
export const acquirePointer = (listener?: PointerListener): (() => void) => {
  if (refCount === 0) {
    attach();
  }
  refCount++;
  if (listener !== undefined) {
    listeners.add(listener);
  }
  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    if (listener !== undefined) {
      listeners.delete(listener);
    }
    refCount--;
    if (refCount === 0 && detach !== null) {
      detach();
      detach = null;
    }
  };
};
