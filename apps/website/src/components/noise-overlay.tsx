/**
 * 全画面フィルムグレイン。
 * フラットなモチーフとシェーダー背景の「質感の解像度差」を埋めて
 * 全レイヤーを1枚のコラージュに統一する。
 */
const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export const NoiseOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
      backgroundSize: "180px 180px",
    }}
  />
);
