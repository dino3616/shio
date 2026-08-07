import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "~/components/eye";
import { FluidBackground } from "~/components/fluid-background";
import { HeartMoon } from "~/components/heart-moon";
import { About } from "~/components/sections/about";
import { Contact } from "~/components/sections/contact";
import { Logs } from "~/components/sections/logs";
import { Playground } from "~/components/sections/playground";
import { Works } from "~/components/sections/works";
import { Starfield } from "~/components/starfield";

const NAV_ITEMS = ["ABOUT", "WORKS", "PLAYGROUND", "LOGS", "CONTACT"];

const Hero = () => (
  <div className="relative flex min-h-screen flex-col overflow-hidden">
    <FluidBackground />
    <Starfield sparkles={12} dust={60} />

    <nav className="relative z-10 flex items-center justify-between px-8 py-8 md:px-20">
      <span className="font-pixel text-pale text-xl">shio🧂</span>
      <ul className="hidden gap-9 md:flex">
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="font-mono text-ice hover:text-pink text-sm tracking-[0.2em] transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <div className="relative z-10 flex flex-1 items-center px-8 md:px-28">
      <div className="relative">
        {/* テキスト背後の暗幕: マーブルをぼかして沈め、文字を浮かせる */}
        <div
          aria-hidden="true"
          className="bg-void/25 absolute -inset-x-24 -inset-y-16 rounded-full blur-3xl"
        />
        <div className="relative">
          <h1 className="sr-only">Haruto Shiohata</h1>
          {/*
           * フロストガラスの名前: SVG clipPath の文字形状で backdrop-filter を
           * 切り抜き、グリフの中に「ぼかされた背景」が透ける
           */}
          <div
            aria-hidden="true"
            className="relative h-[250px] w-[560px] origin-left scale-[0.6] sm:scale-75 md:scale-100"
          >
            {/* ガラスに映り込む光源: 背後の淡いネビュラ発光 */}
            <div
              className="absolute -inset-x-16 -inset-y-10 blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 55% 60% at 30% 30%, rgba(242, 84, 158, 0.34), transparent 70%), radial-gradient(ellipse 55% 60% at 72% 72%, rgba(139, 92, 246, 0.32), transparent 70%), radial-gradient(ellipse 40% 45% at 55% 20%, rgba(166, 211, 234, 0.16), transparent 70%)",
              }}
            />
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <defs>
                <clipPath id="hero-name-clip">
                  <text
                    x="0"
                    y="96"
                    fontFamily="'Noto Sans JP', sans-serif"
                    fontWeight="900"
                    fontSize="96"
                  >
                    Haruto
                  </text>
                  <text
                    x="0"
                    y="212"
                    fontFamily="'Noto Sans JP', sans-serif"
                    fontWeight="900"
                    fontSize="96"
                  >
                    Shiohata
                  </text>
                </clipPath>
              </defs>
            </svg>
            {/* 文字形に切り抜かれたすりガラス層(斜めのシャイン入り) */}
            <div
              className="absolute inset-0 backdrop-blur-lg"
              style={{
                clipPath: "url(#hero-name-clip)",
                background:
                  "linear-gradient(115deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.14) 34%, rgba(255, 255, 255, 0.52) 46%, rgba(255, 255, 255, 0.1) 56%, rgba(255, 255, 255, 0.08) 78%, rgba(255, 255, 255, 0.24) 100%)",
              }}
            />
            {/* エッジの輪郭線: ガラスの縁の光 */}
            <svg
              viewBox="0 0 560 250"
              width="560"
              height="250"
              className="absolute inset-0"
              role="presentation"
            >
              <text
                x="0"
                y="96"
                fontFamily="'Noto Sans JP', sans-serif"
                fontWeight="900"
                fontSize="96"
                fill="none"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.4"
              >
                Haruto
              </text>
              <text
                x="0"
                y="212"
                fontFamily="'Noto Sans JP', sans-serif"
                fontWeight="900"
                fontSize="96"
                fill="none"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.4"
              >
                Shiohata
              </text>
            </svg>
          </div>
          <p className="font-brush mt-6 text-2xl tracking-[0.15em] text-white md:text-3xl">
            矛盾ごと、かたちにする。
          </p>
        </div>
      </div>
    </div>

    {/* 奥行きレイヤー: 傾いたモチーフたち */}
    <div className="absolute top-[13%] right-[7%] z-10 hidden rotate-12 md:block">
      <div className="float-slower">
        <HeartMoon size={150} />
      </div>
    </div>
    <div className="absolute top-[38%] right-[16%] z-10 hidden -rotate-6 lg:block">
      <div className="float-slow">
        <Eye size={190} />
      </div>
    </div>

    <p className="font-mono relative z-10 pb-8 text-center text-xs tracking-[0.3em] text-[#666c96]">
      ▼ scroll
    </p>
  </div>
);

const Home = () => (
  <main className="relative">
    <Hero />
    {/* 以降のセクション: 宇宙の闇の中を降りていく */}
    <div className="relative">
      <Starfield sparkles={8} dust={90} />
      {/* ネビュラの淡い残光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 80% 12%, rgba(139, 92, 246, 0.08), transparent), radial-gradient(ellipse 50% 25% at 15% 45%, rgba(242, 84, 158, 0.06), transparent), radial-gradient(ellipse 55% 28% at 75% 80%, rgba(166, 211, 234, 0.05), transparent)",
        }}
      />
      <About />
      <Works />
      <Playground />
      <Logs />
      <Contact />
    </div>
  </main>
);

export const Route = createFileRoute("/")({
  component: Home,
});
