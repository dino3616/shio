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
  background: string;
  dark: boolean;
  tilt: number;
  live?: boolean;
};

const TILES: Tile[] = [
  {
    label: "シェーダー遊び",
    height: "h-60",
    background: "linear-gradient(150deg, #8b5cf6, #4c2e8f)",
    dark: true,
    tilt: -1.2,
    live: true,
  },
  {
    label: "落書き",
    height: "h-40",
    background: "linear-gradient(150deg, #f7d3e4, #f2c4dc)",
    dark: false,
    tilt: 1,
  },
  {
    label: "作曲メモ",
    height: "h-36",
    background: "linear-gradient(150deg, #f2549e, #b23a77)",
    dark: true,
    tilt: 1.6,
  },
  {
    label: "3D実験",
    height: "h-64",
    background: "linear-gradient(150deg, #222850, #181c3f)",
    dark: true,
    tilt: -1,
  },
  {
    label: "ボツ案供養",
    height: "h-52",
    background: "linear-gradient(150deg, #bfe0f0, #a6d3ea)",
    dark: false,
    tilt: 1.4,
  },
  {
    label: "???",
    height: "h-48",
    background: "linear-gradient(150deg, #16101f, #0e0a14)",
    dark: true,
    tilt: -1.8,
  },
];

export const Playground = () => (
  <section id="playground" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="03" title="PLAYGROUND" jp="完成度より熱量" />
    <Reveal delay={0.08}>
      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {TILES.map((tile) => (
          <div
            key={tile.label}
            className={`${tile.height} relative mb-5 overflow-hidden break-inside-avoid rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.03] hover:rotate-0`}
            style={{
              background: tile.background,
              rotate: `${tile.tilt}deg`,
              boxShadow:
                "inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 8px 30px rgba(0, 0, 0, 0.35)",
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
            <span
              className="font-pixel relative text-sm"
              style={{ color: tile.dark ? "#f7f2fa" : "#0e0a14" }}
            >
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
