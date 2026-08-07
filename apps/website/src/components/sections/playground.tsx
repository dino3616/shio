import { SectionHeader } from "~/components/section-header";

/**
 * Pinterest 的マソンリーグリッド(content-plan: 完成度より熱量を見せる棚)。
 * 中身が入るまではプレースホルダーのタイルで区画設計だけ示す。
 */

type Tile = {
  label: string;
  height: string;
  background: string;
  dark: boolean;
};

const TILES: Tile[] = [
  {
    label: "シェーダー遊び",
    height: "h-60",
    background: "linear-gradient(150deg, #8b5cf6, #4c2e8f)",
    dark: true,
  },
  {
    label: "落書き",
    height: "h-40",
    background: "linear-gradient(150deg, #f7d3e4, #f2c4dc)",
    dark: false,
  },
  {
    label: "作曲メモ",
    height: "h-36",
    background: "linear-gradient(150deg, #f2549e, #b23a77)",
    dark: true,
  },
  {
    label: "3D実験",
    height: "h-64",
    background: "linear-gradient(150deg, #222850, #181c3f)",
    dark: true,
  },
  {
    label: "ボツ案供養",
    height: "h-52",
    background: "linear-gradient(150deg, #bfe0f0, #a6d3ea)",
    dark: false,
  },
  {
    label: "???",
    height: "h-48",
    background: "linear-gradient(150deg, #16101f, #0e0a14)",
    dark: true,
  },
];

export const Playground = () => (
  <section id="playground" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="03" title="PLAYGROUND" jp="完成度より熱量" />
    <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
      {TILES.map((tile) => (
        <div
          key={tile.label}
          className={`${tile.height} mb-5 break-inside-avoid rounded-2xl p-5 transition-transform duration-300 hover:-rotate-1 hover:scale-[1.02]`}
          style={{
            background: tile.background,
            boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 8px 30px rgba(0, 0, 0, 0.35)",
          }}
        >
          <span className="font-pixel text-sm" style={{ color: tile.dark ? "#f7f2fa" : "#0e0a14" }}>
            {tile.label}
          </span>
        </div>
      ))}
    </div>
    <p className="font-mono mt-6 text-xs text-[#666c96]">
      coming soon — 実験・落書き・個人制作がここに積まれていく
    </p>
  </section>
);
