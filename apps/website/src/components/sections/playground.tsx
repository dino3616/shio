import { FluidBackground } from "~/components/fluid-background";
import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * Pinterest 的マソンリーグリッド(content-plan: 完成度より熱量を見せる棚)。
 * 先頭の「シェーダー遊び」タイルは Hero と同じ流体シェーダーが実際に動く
 * ライブタイル(エンジニア×デザイナーの証明をプレースホルダーでもやる)。
 */

const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`,
);

type Tile = {
  label: string;
  height: string;
  tilt: number;
  live?: boolean;
};

const TILES: Tile[] = [
  { label: "シェーダー遊び", height: "h-60", tilt: -1.2, live: true },
  { label: "落書き", height: "h-40", tilt: 1 },
  { label: "作曲メモ", height: "h-36", tilt: 1.6 },
  { label: "3D実験", height: "h-64", tilt: -1 },
  { label: "ボツ案供養", height: "h-52", tilt: 1.4 },
  { label: "???", height: "h-48", tilt: -1.8 },
];

export const Playground = () => (
  <section id="playground" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="03" title="PLAYGROUND" jp="完成度より熱量" />
    <Reveal delay={0.08}>
      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {TILES.map((tile) => (
          <div
            key={tile.label}
            className={`${tile.height} relative mb-5 overflow-hidden break-inside-avoid rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.03] hover:rotate-0 ${
              tile.live === true ? "" : "border border-white/10 bg-white/[0.04] backdrop-blur-md"
            }`}
            style={{
              rotate: `${tile.tilt}deg`,
              boxShadow:
                tile.live === true
                  ? "inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 8px 30px rgba(0, 0, 0, 0.35)"
                  : "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* ライブタイル: Hero と同じ流体シェーダーが小窓の中で動く */}
            {tile.live === true && <FluidBackground className="absolute inset-0 h-full w-full" />}
            {/* フィルムグレイン: 背景シェーダーと同じ質感言語 */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
                backgroundSize: "140px 140px",
              }}
            />
            <span className="font-pixel text-star/80 relative text-sm">
              {tile.label}
              {tile.live === true && <span className="text-prism ml-2 animate-pulse">●</span>}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
    <Reveal delay={0.16}>
      <p className="font-mono mt-6 text-xs text-[#666c96]">
        coming soon — 実験・落書き・個人制作がここに積まれていく
      </p>
    </Reveal>
  </section>
);
