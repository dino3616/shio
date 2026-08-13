import { useEffect, useRef, useState } from "react";
import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * ブラウン管を額縁にした Works(design-direction: ブラウン管=画面の中に別世界)。
 * - チャンネル=作品。ツマミや番組表で切り替えると砂嵐が一瞬走って次の番組へ
 *   (ツマミは目的チャンネルまでの最短経路で回る)
 * - ホバーで静電ノイズが晴れる(説明はしない。触れば分かる)
 * - 画面は全チャンネルを同じグリッドセルに重ねて高さを固定し、
 *   ガラスの井戸+四隅の減光で分厚い曲面ガラスに見せる
 * - 筐体は無重力でゆっくり浮遊し、アンテナは遠くの星から点線の信号を受信、
 *   下からは電源ケーブルが虚空へ漂う
 */

type Channel = {
  id: string;
  callSign: string;
  title: string;
  lines: string[];
  tags: string;
  href: string;
  /** 放送映像(リンク先の OG 画像などの静止画) */
  image: string;
  soon?: boolean;
};

const CHANNELS: Channel[] = [
  {
    id: "01",
    callSign: "DCON 2025",
    title: "Locker.ai",
    lines: ["LLM×スマートロッカーによる", "自動応対遺失物管理サービス"],
    tags: "LLM / IoT / 茨城高専",
    href: "https://dcon.ai/teams/ibaraki2025",
    image: "/works/locker-ai-og.jpg",
  },
  {
    id: "02",
    callSign: "OSS",
    title: "sora",
    lines: ["任意の AI クライアントと DAW と VST と", "人の Creativity を繋ぐ"],
    tags: "Rust / DAW / VST",
    href: "https://github.com/dino3616/sora",
    image: "/works/sora-og.png",
  },
  {
    id: "03",
    callSign: "IPSJ 第87回全国大会",
    title: "WebNavix",
    lines: ["ドメイン別 Mixture-of-Experts による", "継続的汎用ウェブナビゲーションエージェント"],
    tags: "LLM / MoE / 研究論文",
    href: "https://www.ipsj.or.jp/event/taikai/87/WEB/data/pdf/5R-03.html",
    image: "/works/webnavix-og.png",
  },
  {
    id: "04",
    callSign: "COMING SOON",
    title: "",
    lines: [],
    tags: "",
    href: "",
    image: "",
    soon: true,
  },
];

const STATIC_NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="s"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#s)"/></svg>`,
);

const NOISE_URL = `url("data:image/svg+xml,${STATIC_NOISE_SVG}")`;

/**
 * アンテナと、遠くの星から降ってくる点線の信号(できることの矢印と同じ言語)。
 * 基部は svg 座標 (70, 145) にあるので、left-1/2 から 70px 引いて水平中心を合わせ、
 * 上方向は基部の楕円が筐体の天面(y=0)にちょうど載る高さまで引き上げる
 */
const Antenna = () => (
  <svg
    viewBox="0 0 380 150"
    width="380"
    height="150"
    className="pointer-events-none absolute -top-37 left-1/2 -translate-x-17.5 max-lg:hidden"
    aria-hidden="true"
    role="presentation"
  >
    {/* 信号源の星 */}
    <path
      d="M 330 26 L 333 37 L 344 40 L 333 43 L 330 54 L 327 43 L 316 40 L 327 37 Z"
      fill="#f2e85c"
      style={{ filter: "drop-shadow(0 0 6px rgba(242, 232, 92, 0.8))" }}
    >
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite" />
    </path>
    {/* 点線の信号がアンテナ先端へ */}
    <path
      id="works-signal"
      d="M 318 45 Q 230 20 132 36"
      fill="none"
      stroke="rgba(242, 232, 92, 0.35)"
      strokeWidth="1"
      strokeDasharray="2 6"
      strokeLinecap="round"
    />
    <g className="motion-reduce:hidden">
      <circle r="2" fill="#f2e85c" opacity="0.85">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M 318 45 Q 230 20 132 36" />
      </circle>
    </g>
    {/* V字アンテナ */}
    <line
      x1="70"
      y1="142"
      x2="130"
      y2="37"
      stroke="#d8a7c4"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line x1="70" y1="142" x2="16" y2="52" stroke="#d8a7c4" strokeWidth="3" strokeLinecap="round" />
    <circle cx="131" cy="35" r="4" fill="#f2c4dc" />
    <circle cx="15" cy="50" r="4" fill="#f2c4dc" />
    <ellipse cx="70" cy="145" rx="14" ry="6" fill="#d8a7c4" />
  </svg>
);

/** 電源ケーブル: 筐体の下から虚空へクラゲの触手みたいに漂う */
const PowerCable = () => (
  <svg
    viewBox="0 0 240 260"
    width="240"
    height="260"
    className="pointer-events-none absolute top-[97%] left-[16%] -z-10 overflow-visible"
    aria-hidden="true"
    role="presentation"
  >
    <path fill="none" stroke="rgba(216, 167, 196, 0.4)" strokeWidth="3" strokeLinecap="round">
      <animate
        attributeName="d"
        values="M 20 0 C 30 70, -10 120, 40 170 C 70 200, 120 190, 150 225;M 20 0 C 36 60, 2 130, 52 172 C 84 198, 112 202, 150 225;M 20 0 C 24 76, -18 114, 34 168 C 66 204, 126 182, 150 225;M 20 0 C 30 70, -10 120, 40 170 C 70 200, 120 190, 150 225"
        dur="11s"
        repeatCount="indefinite"
      />
    </path>
    {/* プラグ: どこにも刺さっていない */}
    <g transform="translate(150, 225) rotate(40)">
      <rect x="-4" y="-6" width="14" height="12" rx="3" fill="#d8a7c4" />
      <line x1="10" y1="-3.5" x2="18" y2="-3.5" stroke="#d8a7c4" strokeWidth="2.4" />
      <line x1="10" y1="3.5" x2="18" y2="3.5" stroke="#d8a7c4" strokeWidth="2.4" />
    </g>
  </svg>
);

const CrtTv = ({
  current,
  burst,
  osd,
  knobTurns,
  onNext,
}: {
  current: number;
  burst: boolean;
  osd: boolean;
  knobTurns: number;
  onNext: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const channel = CHANNELS[current] ?? CHANNELS[0];
  const noiseOpacity = burst ? 0.95 : isHovered ? 0 : 0.28;

  return (
    <div
      className="relative w-full max-w-2xl -rotate-2 rounded-4xl p-7"
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
      <Antenna />
      <PowerCable />
      <div className="flex items-stretch gap-5">
        {/* 画面 */}
        {/* ガラスの井戸: ひと回り暗い縁に画面を沈めて、分厚いガラスの奥行きを出す */}
        <div
          className="min-w-0 flex-1 rounded-[1.7rem] p-2"
          style={{
            background: "linear-gradient(180deg, #c793b3, #ab7a99)",
            boxShadow:
              "inset 0 3px 8px rgba(60, 30, 50, 0.55), inset 0 -1px 2px rgba(255, 255, 255, 0.35)",
          }}
        >
          <div
            className="crt-flicker relative grid overflow-hidden rounded-3xl"
            style={{
              background: "radial-gradient(ellipse at 40% 35%, #222850 0%, #0e0a14 90%)",
              boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            {/* 全チャンネルを同じセルに重ねて、いちばん背の高い番組で画面の高さを固定する */}
            {CHANNELS.map((item, index) =>
              item.soon ? (
                <div
                  key={item.id}
                  className={`relative col-start-1 row-start-1 ${index === current ? "" : "invisible"}`}
                >
                  <div
                    className="noise-dance absolute inset-0"
                    style={{
                      backgroundImage: NOISE_URL,
                      backgroundSize: "120px 120px",
                      opacity: 0.5,
                    }}
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <p
                      className="font-crt text-star/80 text-2xl tracking-widest"
                      style={{ textShadow: "0 0 12px rgba(247, 242, 250, 0.5)" }}
                    >
                      COMING SOON
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className={`relative z-0 col-start-1 row-start-1 ${index === current ? "" : "invisible"}`}
                >
                  {/* 放送映像: リンク先の OG 画像。左をスクリムで沈めてテキストを読ませる */}
                  <img
                    src={item.image}
                    alt=""
                    width={1200}
                    height={630}
                    loading="lazy"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(100deg, rgba(14, 10, 20, 0.95) 32%, rgba(14, 10, 20, 0.62) 66%, rgba(14, 10, 20, 0.32) 100%)",
                    }}
                  />
                  <div className="relative p-9">
                    <p
                      className="font-crt text-prism text-lg tracking-wider"
                      style={{ textShadow: "0 0 10px rgba(242, 232, 92, 0.55)" }}
                    >
                      CH {item.id} ▸ {item.callSign}
                      <span className="crt-blink ml-1.5">▮</span>
                    </p>
                    <h3
                      className="glitch-hover font-crt text-star mt-3 cursor-default text-5xl md:text-6xl"
                      style={{ textShadow: "0 0 14px rgba(247, 242, 250, 0.4)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-pale mt-4 leading-relaxed">
                      {item.lines[0]}
                      <br />
                      {item.lines[1]}
                    </p>
                    <p className="font-mono text-ice mt-5 text-xs tracking-wider">{item.tags}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-pink mt-6 inline-block text-sm underline-offset-4 hover:underline"
                    >
                      view project →
                    </a>
                  </div>
                </div>
              ),
            )}
            {/* 垂直同期のロールライン */}
            <div
              className="crt-roll pointer-events-none absolute inset-x-0 z-10 h-10"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(247, 242, 250, 0.05), transparent)",
              }}
            />
            {/* 走査線 */}
            <div className="scanlines pointer-events-none absolute inset-0 z-10" />
            {/* ガラスの膨らみ: 中央の大きなハイライト+下端の反射+四隅の暗いフォールオフ */}
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "radial-gradient(ellipse 60% 35% at 28% 12%, rgba(255, 255, 255, 0.16), transparent 70%), radial-gradient(ellipse 90% 70% at 50% 42%, rgba(255, 255, 255, 0.05), transparent 65%), radial-gradient(ellipse 70% 22% at 55% 102%, rgba(255, 255, 255, 0.06), transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "radial-gradient(ellipse 130% 105% at 50% 50%, transparent 62%, rgba(0, 0, 0, 0.55) 98%)",
              }}
            />
            {/* OSD: チャンネル切り替え直後に浮かぶ */}
            <p
              className={`font-crt pointer-events-none absolute top-3 right-5 z-30 text-2xl text-[#9df2a8] transition-opacity duration-500 ${
                osd ? "opacity-100" : "opacity-0"
              }`}
              style={{ textShadow: "0 0 10px rgba(157, 242, 168, 0.7)" }}
            >
              CH {channel?.id}
            </p>
            {/* 静電ノイズ: ホバーで晴れ、チャンネル切り替えで一瞬吹き荒れる */}
            <div
              className={`pointer-events-none absolute inset-0 z-30 ${burst ? "noise-dance" : ""}`}
              style={{
                backgroundImage: NOISE_URL,
                backgroundSize: "120px 120px",
                opacity: noiseOpacity,
                mixBlendMode: "screen",
                transitionProperty: "opacity",
                transitionDuration: burst ? "80ms" : "500ms",
              }}
            />
          </div>
        </div>

        {/* 操作部: ツマミ+スピーカースリット */}
        <div className="flex w-14 flex-col items-center gap-4">
          <button
            type="button"
            onClick={onNext}
            aria-label="次のチャンネルへ"
            className="relative size-11 cursor-pointer rounded-full transition-transform duration-500 hover:scale-105"
            style={{
              background: "radial-gradient(circle at 34% 30%, #b98aa6, #8a5e7c 75%)",
              boxShadow:
                "inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(60, 30, 50, 0.5), 0 2px 6px rgba(60, 30, 50, 0.35)",
              transform: `rotate(${knobTurns * 72}deg)`,
            }}
          >
            {/* ツマミの刻み */}
            <span className="absolute top-1 left-1/2 h-3 w-0.5 -translate-x-1/2 rounded-full bg-[#f7d3e4]" />
          </button>
          <span className="size-5 rounded-full bg-[#9c6e8a] shadow-inner" />
          {/* スピーカースリット */}
          <div
            className="w-9 flex-1 rounded"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(120, 70, 100, 0.4) 0 2px, transparent 2px 7px)",
            }}
          />
        </div>
      </div>
      {/* 銘板 */}
      <p className="font-mono mt-3 ml-1 text-[10px] tracking-[0.3em] text-[#a06f8c]">
        SHIO-TRON 616
      </p>
      {/* 脚 */}
      <div className="absolute -bottom-3.5 left-14 h-4 w-7 -skew-x-6 rounded-b bg-[#d8a7c4]" />
      <div className="absolute right-14 -bottom-3.5 h-4 w-7 skew-x-6 rounded-b bg-[#d8a7c4]" />
    </div>
  );
};

/** 番組表: 作品のインデックス。行をクリックするとそのチャンネルへ */
const TvGuide = ({ current, onSelect }: { current: number; onSelect: (index: number) => void }) => (
  <div className="bg-void/45 w-full max-w-sm rounded-2xl border border-white/10 p-6 backdrop-blur-sm lg:min-w-72">
    <div className="flex items-baseline gap-3">
      <p className="font-mincho text-star text-base tracking-[0.25em]">番組表</p>
      <p className="font-mono text-star/50 text-xs tracking-[0.2em]">TV GUIDE</p>
    </div>
    <ul className="font-mono mt-5 space-y-1 text-sm">
      {CHANNELS.map((channel, index) => (
        <li key={channel.id}>
          <button
            type="button"
            onClick={() => {
              onSelect(index);
            }}
            className={`grid w-full cursor-pointer grid-cols-[1rem_3.4rem_1fr_auto] items-baseline gap-x-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
              index === current
                ? "bg-pink/15 text-pink"
                : "text-star/55 hover:bg-white/5 hover:text-star/90"
            }`}
          >
            <span>{index === current ? "▸" : ""}</span>
            <span>CH {channel.id}</span>
            <span className="truncate">{channel.soon ? "???" : channel.title}</span>
            <span
              className={`text-[11px] ${
                channel.soon ? "text-star/35" : index === current ? "text-pink/80" : "text-ice/80"
              }`}
            >
              {channel.soon ? "準備中" : "放送中"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const Works = () => {
  const [current, setCurrent] = useState(0);
  const [burst, setBurst] = useState(false);
  const [osd, setOsd] = useState(false);
  const [knobTurns, setKnobTurns] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      for (const timeout of timeoutsRef.current) {
        clearTimeout(timeout);
      }
    },
    [],
  );

  const switchTo = (index: number) => {
    if (index === current || burst) {
      return;
    }
    // ツマミは目的チャンネルまでの最短経路で回す(戻るときは反時計回り)
    let delta = index - current;
    if (delta > CHANNELS.length / 2) {
      delta -= CHANNELS.length;
    } else if (delta < -CHANNELS.length / 2) {
      delta += CHANNELS.length;
    }
    setKnobTurns((turns) => turns + delta);
    setBurst(true);
    timeoutsRef.current.push(
      setTimeout(() => {
        setCurrent(index);
        setOsd(true);
      }, 160),
      setTimeout(() => {
        setBurst(false);
      }, 430),
      setTimeout(() => {
        setOsd(false);
      }, 2100),
    );
  };

  return (
    <section id="works" className="relative z-10 px-8 pt-28 pb-44 md:px-28">
      <SectionHeader number="02" title="WORKS" jp="ブラウン管に映してます" />
      {/* 上の余白はアンテナと信号の星のぶん */}
      <Reveal
        delay={0.08}
        className="mt-44 flex flex-col items-start gap-14 lg:flex-row lg:items-center lg:gap-20"
      >
        <div className="float-slower relative w-full max-w-2xl">
          <CrtTv
            current={current}
            burst={burst}
            osd={osd}
            knobTurns={knobTurns}
            onNext={() => {
              switchTo((current + 1) % CHANNELS.length);
            }}
          />
        </div>
        <TvGuide current={current} onSelect={switchTo} />
      </Reveal>
    </section>
  );
};
