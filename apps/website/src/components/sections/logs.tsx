import { SectionHeader } from "~/components/section-header";

/**
 * Logs: プレイリストとメイク手順(content-plan: MCP 経由で更新される
 * 「生きてるコンテンツ」であること自体を演出にする)。
 * サーバー実装までは正直なプレースホルダーを表示する。
 */

export const Logs = () => (
  <section id="logs" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="04" title="LOGS" jp="更新され続ける日誌" />
    <div className="mt-14 grid gap-6 lg:grid-cols-2">
      {/* NOW PLAYING */}
      <div className="border-pink/70 rounded-2xl border bg-[#181c3f]/80 p-7 backdrop-blur-sm">
        <p className="font-crt text-prism text-lg tracking-wider">♪ NOW PLAYING</p>
        <p className="text-star mt-4">
          まだ何も流れていない —{" "}
          <span className="font-mono text-ice text-sm">mcp worker 実装待ち</span>
        </p>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-[8%] rounded-full"
            style={{ background: "linear-gradient(90deg, #f2549e, #8b5cf6)" }}
          />
        </div>
        <p className="font-mono text-ice mt-5 text-xs">playlists → 月替わりで更新予定</p>
      </div>

      {/* SKINCARE / MAKE-UP */}
      <div className="border-purple/70 rounded-2xl border bg-[#181c3f]/80 p-7 backdrop-blur-sm">
        <p className="font-crt text-pale text-lg tracking-wider">☆ SKINCARE / MAKE-UP</p>
        <p className="text-star mt-4">01 クレンジング → 02 化粧水 → 03 …</p>
        <p className="font-mono text-ice mt-5 text-xs">routine → 気分で更新予定</p>
      </div>
    </div>
    <p className="font-mono mt-8 text-xs text-[#666c96]">
      $ このセクションは LLM (MCP) 経由で更新される、生きてるコンテンツになる
    </p>
  </section>
);
