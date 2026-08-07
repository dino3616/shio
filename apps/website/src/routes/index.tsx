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
    <Starfield stars={240} crosses={2} />

    <nav className="font-name relative z-10 flex items-center justify-between px-8 py-8 md:px-20">
      {/* 旧サイト(shio-archive)と同じブランドロゴ */}
      <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
        <img
          src="/brand-icon.webp"
          alt="shio のブランドアイコン"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
        <p className="text-2xl font-bold text-white">
          <span className="text-purple">shio</span>.studio
        </p>
      </a>
      <ul className="hidden gap-9 md:flex">
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <div className="relative z-10 flex flex-1 items-center px-8 md:px-28">
      <div className="relative">
        <div className="relative">
          <h1 className="sr-only">Haruto Shiohata</h1>
          {/*
           * 透けるガラス文字: SVG clipPath の文字形状で backdrop-filter を
           * 切り抜き、シェーダー背景のグラデーションがグリフ越しに見える。
           * 白い塗りは乗せず、明度・彩度ブーストで背景自体を光らせる
           */}
          <div
            aria-hidden="true"
            className="relative h-[250px] w-[560px] origin-left scale-[0.6] sm:scale-75 md:scale-100"
          >
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
            {/* 文字形に切り抜かれた透過層: 背景をぼかし、明るく・鮮やかに増幅 */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "url(#hero-name-clip)",
                backdropFilter: "blur(5px) brightness(2.4) saturate(1.6)",
                background: "rgba(255, 255, 255, 0.05)",
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
          <p className="font-mincho mt-6 text-2xl tracking-[0.2em] text-white md:text-3xl">
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
      <Starfield stars={420} crosses={3} />
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
