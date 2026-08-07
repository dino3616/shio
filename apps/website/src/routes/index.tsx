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
    <div className="absolute top-[15%] right-[7%] z-10 hidden rotate-12 md:block">
      <HeartMoon size={140} />
    </div>
    <div className="absolute top-[38%] right-[16%] z-10 hidden -rotate-6 lg:block">
      <Eye size={190} />
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
