import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "~/components/eye";
import { FluidBackground } from "~/components/fluid-background";
import { HeartMoon } from "~/components/heart-moon";
import { Starfield } from "~/components/starfield";

const NAV_ITEMS = ["ABOUT", "WORKS", "PLAYGROUND", "LOGS", "CONTACT"];

const Home = () => (
  <main className="relative flex min-h-screen flex-col overflow-hidden">
    {/* 背景レイヤー: 宇宙(流体グラデーション+星空) */}
    <FluidBackground />
    <Starfield />

    {/* ナビ */}
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

    {/* ヒーロー本体 */}
    <div className="relative z-10 flex flex-1 items-center px-8 md:px-28">
      <div>
        <p className="font-mono text-pink text-sm tracking-[0.3em]">
          ENGINEER / DESIGNER — shio.studio
        </p>
        <h1 className="font-display mt-5 text-7xl font-bold leading-[0.95] md:text-8xl">
          Haruto
          <br />
          Shiohata
        </h1>
        <p className="font-pixel text-ice mt-7 text-xl tracking-[0.4em]">塩畑 晴人</p>
        <p className="text-pale mt-4 tracking-[0.2em]">矛盾ごと、かたちにする。</p>
      </div>
    </div>

    {/* 奥行きレイヤー: 傾いたモチーフたち */}
    <div className="absolute top-[16%] right-[7%] z-10 hidden rotate-12 md:block">
      <HeartMoon size={130} />
    </div>
    <div className="absolute top-[38%] right-[16%] z-10 hidden -rotate-6 lg:block">
      <Eye size={190} />
    </div>

    {/* 工事中マーカー */}
    <p className="font-crt text-prism relative z-10 pb-10 text-center text-lg">
      ▚ UNDER CONSTRUCTION ▞
    </p>
  </main>
);

export const Route = createFileRoute("/")({
  component: Home,
});
