/**
 * mulberry32: シード付き擬似乱数。
 * Math.random と違い、同じシードなら同じ列を再現する
 * (SSR とクライアントの絵の一致、焼き込んだ星配置の再現に使う)。
 */
export const mulberry32 = (initialSeed: number): (() => number) => {
  let seed = initialSeed;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
