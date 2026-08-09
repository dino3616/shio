import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type MouseEvent, useEffect, useRef } from "react";
import { Eye } from "~/components/eye";
import { FluidBackground } from "~/components/fluid-background";
import { HeartMoon } from "~/components/heart-moon";
import { About } from "~/components/sections/about";
import { Contact } from "~/components/sections/contact";
import { Logs } from "~/components/sections/logs";
import { Playground } from "~/components/sections/playground";
import { Works } from "~/components/sections/works";
import { SpacePlankton } from "~/components/space-plankton";
import { Starfield } from "~/components/starfield";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";

const NAV_ITEMS = ["ABOUT", "WORKS", "PLAYGROUND", "LOGS", "CONTACT"];

const Hero = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);

  // スクロール離脱パララックス: 奥にあるものほどゆっくり流れ、
  // フォールドに達する前に Hero の世界から静かに離脱していく
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    let settled = false;
    return subscribeFrame((frame) => {
      const viewportHeight = window.innerHeight;
      const y = frame.scrollY;
      if (y > viewportHeight * 1.2) {
        // 完全に見えなくなったら書き込みを止める
        if (settled) {
          return;
        }
        settled = true;
      } else {
        settled = false;
      }
      const fade = String(Math.max(0, 1 - y / (viewportHeight * 0.72)));
      // 名前は transform/opacity を使わない: 祖先にどちらかが付くと
      // backdrop-filter の参照範囲が切られ、ガラス文字のブラーが消えてしまう。
      // backdrop root を作らない relative + top でずらす
      const name = nameRef.current;
      if (name !== null) {
        name.style.top = `${y * 0.32}px`;
      }
      const layers: [HTMLDivElement | null, number][] = [
        [eyeRef.current, 0.24],
        [moonRef.current, 0.16],
      ];
      for (const [element, factor] of layers) {
        if (element !== null) {
          element.style.transform = `translateY(${y * factor}px)`;
          element.style.opacity = fade;
        }
      }
    });
  }, []);

  // アンカーへのスムーズスクロール。自前の scrollIntoView + pushState だと
  // TanStack がハッシュ変更を検知して即時の scrollIntoView で上書きしてしまう。
  // router.navigate に hashScrollIntoView を渡して TanStack 自身に滑らかに
  // スクロールさせる(CSS の scroll-smooth はスクロール位置の復元まで
  // 滑らかにしてしまうので使わない)
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, anchor: string) => {
    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void router.navigate({
      to: ".",
      hash: anchor,
      hashScrollIntoView: { behavior: reducedMotion ? "auto" : "smooth", block: "start" },
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
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
                onClick={(event) => {
                  handleNavClick(event, item.toLowerCase());
                }}
                className="text-sm tracking-[0.2em] text-white/60 transition-colors hover:text-white"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-10 flex flex-1 items-center px-8 md:px-28">
        <div ref={nameRef} className="relative">
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
      <div ref={moonRef} className="absolute top-[13%] right-[7%] z-10 hidden rotate-12 md:block">
        <div className="float-slower">
          <HeartMoon size={150} />
        </div>
      </div>
      <div ref={eyeRef} className="absolute top-[38%] right-[16%] z-10 hidden -rotate-6 lg:block">
        <div className="float-slow">
          <Eye size={190} />
        </div>
      </div>

      <p className="font-mono relative z-10 pb-8 text-center text-xs tracking-[0.3em] text-[#666c96]">
        ▼ scroll
      </p>
    </div>
  );
};

const Home = () => {
  const marbleRef = useRef<HTMLDivElement>(null);

  // マーブルの中景視差: コンテンツ(1.0)と星(ほぼ0)の間の速度(0.5)で流れることで
  // 「コンテンツ > 星雲 > 星」の単調な奥行きの階層を作る
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    let settled = false;
    return subscribeFrame((frame) => {
      const element = marbleRef.current;
      if (element === null) {
        return;
      }
      // マーブルの裾が視界から完全に出たら(=270vh)書き込みを止める
      if (frame.scrollY > window.innerHeight * 2.9) {
        if (settled) {
          return;
        }
        settled = true;
      } else {
        settled = false;
      }
      element.style.transform = `translateY(${frame.scrollY * 0.5}px)`;
    });
  }, []);

  return (
    <main className="relative">
      {/*
       * Hero のマーブル: 100vh を越えて About 冒頭の背後まで揺らぎ続け、
       * 下端はマスクの光の減衰で void に溶ける。境界線を持たない
       */}
      <div
        ref={marbleRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-[135vh]"
        style={{
          // コサインイージングの多段ストップ。単純な2点グラデーションは減衰の
          // 始点で傾きが不連続になり、マッハバンド(知覚上の線)が出てしまう
          maskImage:
            "linear-gradient(to bottom, black 55%, rgba(0, 0, 0, 0.94) 62%, rgba(0, 0, 0, 0.75) 70%, rgba(0, 0, 0, 0.55) 78%, rgba(0, 0, 0, 0.3) 85%, rgba(0, 0, 0, 0.09) 92%, rgba(0, 0, 0, 0.02) 97%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 55%, rgba(0, 0, 0, 0.94) 62%, rgba(0, 0, 0, 0.75) 70%, rgba(0, 0, 0, 0.55) 78%, rgba(0, 0, 0, 0.3) 85%, rgba(0, 0, 0, 0.09) 92%, rgba(0, 0, 0, 0.02) 97%, transparent 100%)",
        }}
      >
        <FluidBackground />
      </div>
      {/*
       * ページ全体で連続するひとつの星空。無限遠の空として視点に固定し、
       * スクロール視差(深度別)で奥行きだけが流れる。Hero と以降のセクションで
       * 星の世界が入れ替わらないので、フォールドに継ぎ目が生まれない
       */}
      <div className="pointer-events-none fixed inset-0">
        <Starfield stars={380} crosses={3} />
      </div>
      <Hero />
      {/* 以降のセクション: 宇宙の闇の中を降りていく */}
      <div className="relative">
        {/*
         * フォールドをまたぐ残光: Hero の色を受け継ぐ楕円をフォールド中心に置き、
         * 上下対称に減衰させる(箱の端で切れると新しい境界線になってしまう)
         */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-[22vh] h-[44vh]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 92, 246, 0.08), transparent 70%), radial-gradient(ellipse 45% 40% at 30% 55%, rgba(242, 84, 158, 0.05), transparent 70%)",
          }}
        />
        {/*
         * ネビュラの淡い残光。各楕円は箱の内側で必ず減衰しきるサイズ・位置にする
         * (裾が箱の縁を越えると、グラデーションが値を持ったまま切断されて
         * 水平線として知覚される)
         */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 26% at 80% 28%, rgba(139, 92, 246, 0.08), transparent), radial-gradient(ellipse 50% 25% at 15% 45%, rgba(242, 84, 158, 0.06), transparent), radial-gradient(ellipse 55% 22% at 75% 76%, rgba(166, 211, 234, 0.05), transparent)",
          }}
        />
        <About />
        <Works />
        <Playground />
        <Logs />
        <Contact />
      </div>
      {/* 時々画面を横切っていく宇宙プランクトンの群れ */}
      <SpacePlankton />
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
