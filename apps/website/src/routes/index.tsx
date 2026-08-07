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
        <p className="font-mono text-pink flex items-center gap-4 text-sm tracking-[0.3em]">
          <span className="bg-pink inline-block h-px w-10" />
          ENGINEER / DESIGNER — SHIO.STUDIO
        </p>
        <h1 className="font-display mt-9 text-4xl font-black uppercase leading-[1.14] sm:text-5xl md:text-7xl">
          <span className="from-star via-pale to-ice bg-gradient-to-r bg-clip-text text-transparent">
            Haruto
          </span>
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "2px #cbb8dc" }}>
            Shiohata
          </span>
        </h1>
        <div className="mt-9 flex items-center gap-5">
          <p className="font-pixel text-ice text-2xl tracking-[0.5em]">塩畑 晴人</p>
          <span className="bg-ice/40 inline-block h-px w-16" />
        </div>
        <p className="text-pale mt-5 text-lg tracking-[0.25em]">
          矛盾ごと、かたちにする<span className="text-pink">。</span>
        </p>
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
