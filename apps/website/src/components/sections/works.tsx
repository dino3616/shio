import { useState } from "react";
import { SectionHeader } from "~/components/section-header";

/**
 * ブラウン管を額縁にした Works(design-direction: ブラウン管=画面の中に別世界)。
 * ホバーで静電ノイズが晴れて中身が見える(壊れたレトロテック)。
 */

const STATIC_NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="s"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#s)"/></svg>`,
);

const CrtFrame = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-2xl -rotate-2 rounded-[2rem] p-7 pb-12 transition-transform duration-300 hover:rotate-0"
      style={{
        background: "linear-gradient(160deg, #f7d3e4 0%, #f2c4dc 55%, #d8a7c4 100%)",
        boxShadow:
          "0 14px 60px rgba(139, 92, 246, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.6), inset 0 -3px 6px rgba(120, 70, 100, 0.35)",
      }}
      onPointerEnter={() => {
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
      }}
    >
      <div
        className="crt-flicker relative overflow-hidden rounded-2xl"
        style={{
          background: "radial-gradient(ellipse at 40% 35%, #222850 0%, #0e0a14 90%)",
          boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div className="relative z-0 p-9">{children}</div>
        {/* 走査線 */}
        <div className="scanlines pointer-events-none absolute inset-0 z-10" />
        {/* ガラスの映り込み */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 35% at 28% 12%, rgba(255, 255, 255, 0.14), transparent 70%)",
          }}
        />
        {/* 静電ノイズ: ホバーで晴れる */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
          style={{
            backgroundImage: `url("data:image/svg+xml,${STATIC_NOISE_SVG}")`,
            backgroundSize: "120px 120px",
            opacity: isHovered ? 0 : 0.3,
            mixBlendMode: "screen",
          }}
        />
      </div>
      {/* ツマミ */}
      <div className="absolute right-9 bottom-4 flex gap-2.5">
        <span className="h-3.5 w-3.5 rounded-full bg-[#9c6e8a] shadow-inner" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#9c6e8a] shadow-inner" />
      </div>
    </div>
  );
};

export const Works = () => (
  <section id="works" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="02" title="WORKS" jp="ブラウン管に映してます" />
    <div className="mt-14 flex flex-col items-start gap-10 lg:flex-row lg:items-center">
      <CrtFrame>
        <p className="font-crt text-prism text-lg tracking-wider">CH 01 ▸ DCON 2025</p>
        <h3 className="glitch-hover font-crt text-star mt-3 cursor-default text-6xl">Locker.ai</h3>
        <p className="text-pale mt-4 leading-relaxed">
          LLM×スマートロッカーによる
          <br />
          自動応対遺失物管理サービス
        </p>
        <p className="font-mono text-ice mt-5 text-xs tracking-wider">LLM / IoT / 茨城高専</p>
        <a
          href="https://dcon.ai/teams/ibaraki2025"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-pink mt-6 inline-block text-sm underline-offset-4 hover:underline"
        >
          view project →
        </a>
      </CrtFrame>
      <p className="font-mono text-sm leading-loose text-[#666c96]">
        hover でノイズ → クリア。
        <br />+ more works soon
      </p>
    </div>
  </section>
);
