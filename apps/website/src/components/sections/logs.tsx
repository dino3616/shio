import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * Logs: プレイリストとメイク手順(content-plan: MCP 経由で更新される
 * 「生きてるコンテンツ」であること自体を演出にする)。
 * サーバー実装までは正直なプレースホルダーを表示する。
 */

// 待機中でも微かに揺れるイコライザー(生きてるコンテンツの鼓動)
const EQ_DELAYS = [0, 0.35, 0.15, 0.5, 0.25];

const SKINCARE_STEPS = ["クレンジング", "化粧水", "…"];

export const Logs = () => (
  <section id="logs" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="04" title="LOGS" jp="更新され続ける日誌" />
    <div className="mt-14 grid gap-6 lg:grid-cols-2">
      {/* NOW PLAYING */}
      <Reveal delay={0.08}>
        <div
          className="border-pink/40 hover:border-pink/80 h-full rounded-2xl border bg-white/[0.04] p-7 backdrop-blur-md transition-colors duration-500"
          style={{ boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)" }}
        >
          <div className="flex items-center justify-between">
            <p className="font-crt text-prism text-lg tracking-wider">♪ NOW PLAYING</p>
            <div className="flex h-5 items-end gap-1" aria-hidden="true">
              {EQ_DELAYS.map((delay) => (
                <span
                  key={delay}
                  className="eq-bar w-1 rounded-full"
                  style={{
                    height: "100%",
                    background: "linear-gradient(to top, #f2549e, #8b5cf6)",
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
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
      </Reveal>

      {/* SKINCARE / MAKE-UP */}
      <Reveal delay={0.16}>
        <div
          className="border-purple/40 hover:border-purple/80 h-full rounded-2xl border bg-white/[0.04] p-7 backdrop-blur-md transition-colors duration-500"
          style={{ boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)" }}
        >
          <p className="font-crt text-pale text-lg tracking-wider">☆ SKINCARE / MAKE-UP</p>
          <ol className="mt-4 space-y-2">
            {SKINCARE_STEPS.map((step, index) => (
              <li key={step} className="text-star flex items-baseline gap-3">
                <span className="font-mono text-pink text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="font-mono text-ice mt-5 text-xs">routine → 気分で更新予定</p>
        </div>
      </Reveal>
    </div>
    <Reveal delay={0.24}>
      <p className="font-mono mt-8 text-xs text-[#666c96]">
        $ このセクションは LLM (MCP) 経由で更新される、生きてるコンテンツになる
      </p>
    </Reveal>
  </section>
);
