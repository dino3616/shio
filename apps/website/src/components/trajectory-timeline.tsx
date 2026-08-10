import { useEffect, useRef } from "react";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";

/**
 * これまでの軌跡: ページの「下へスクロール=宇宙を降下」のメタファーに乗せた縦の航行軌跡。
 * - 1本の蛇行するカーブがセクションを縦に貫き、時間は下へ流れる
 * - 星の間隔は経過時間の平方根に比例(16年の助走はゆったり、2025年の3連続は密集)
 * - 序盤ほどカーブが蛇行し、直近はまっすぐに(迷い→確信を曲率で語る)
 * - スクロールに同期した彗星が軌跡をなぞり、通過した道がピンクに灯り、星とラベルが明るさを増す
 *   (テキストは通過前から読める。演出は可読性に足し算だけする)
 * - NOW の先は点線が下(次のセクション)へ消えていく=これからも続く
 */

type Milestone = {
  date: string;
  label: string;
  detail?: string;
  now?: boolean;
  /** 経路上の点(viewBox 座標)。PATH_POINTS の該当インデックスと一致させる */
  x: number;
  y: number;
  side: "left" | "right";
  color: string;
};

const VIEW_W = 1000;
const VIEW_H = 1200;

/**
 * 経路の制御点。マイルストーンの y は経過月数の平方根圧縮
 * (2004.11→2020.04 の16年と 2025.03→NOW の17ヶ月が両方読める間隔になる)。
 * マイルストーン以外の点は蛇行のための曲げ点で、序盤に多く置いている
 */
const PATH_POINTS = [
  { x: 530, y: 80 }, // うまれる
  { x: 640, y: 240 },
  { x: 390, y: 420 },
  { x: 470, y: 562 }, // 高専 入学
  { x: 600, y: 700 },
  { x: 555, y: 834 }, // 高専 卒業
  { x: 515, y: 870 }, // ゆめみ 入社
  { x: 468, y: 970 }, // アクセンチュア 転籍
  { x: 445, y: 1070 }, // NOW
];

const MILESTONES: Milestone[] = [
  { date: "2004.11", label: "うまれる", x: 530, y: 80, side: "right", color: "#f2c4dc" },
  {
    date: "2020.04",
    label: "茨城工業高等専門学校 入学",
    x: 470,
    y: 562,
    side: "left",
    color: "#a6d3ea",
  },
  {
    date: "2025.03",
    label: "茨城工業高等専門学校 卒業",
    x: 555,
    y: 834,
    side: "right",
    color: "#f2e85c",
  },
  {
    date: "2025.04",
    label: "株式会社ゆめみ 入社",
    x: 515,
    y: 870,
    side: "left",
    color: "#c4a8f8",
  },
  {
    date: "2025.12",
    label: "アクセンチュア株式会社 転籍",
    x: 468,
    y: 970,
    side: "right",
    color: "#a6d3ea",
  },
  {
    date: "NOW",
    label: "Accenture Song / Design & Digital Products / Creative",
    detail: "Creative Technology Senior Analyst",
    now: true,
    x: 445,
    y: 1070,
    side: "left",
    color: "#f2549e",
  },
];

const STAR_PATH = "M 0 -7 L 1.8 -1.8 L 7 0 L 1.8 1.8 L 0 7 L -1.8 1.8 L -7 0 L -1.8 -1.8 Z";

/** Catmull-Rom スプラインを SVG の cubic Bezier パスに変換する */
const catmullRomPath = (points: { x: number; y: number }[]): string => {
  const first = points[0];
  if (first === undefined) {
    return "";
  }
  let d = `M ${first.x} ${first.y}`;
  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined) {
      continue;
    }
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const TRAJECTORY_PATH = catmullRomPath(PATH_POINTS);

// NOW から先: 点線になって画面の下(次のセクション)へ消えていく
const FUTURE_PATH = "M 445 1070 C 438 1115, 432 1155, 428 1200";

/** 彗星の尾のサンプル(頭からの距離と大きさ・濃さ) */
const TAIL = [
  { back: 10, r: 2.6, alpha: 0.5 },
  { back: 22, r: 2.1, alpha: 0.34 },
  { back: 36, r: 1.7, alpha: 0.22 },
  { back: 54, r: 1.3, alpha: 0.13 },
  { back: 74, r: 1, alpha: 0.07 },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const TrajectoryTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const progressPath = progressRef.current;
    const comet = cometRef.current;
    if (container === null || path === null || progressPath === null || comet === null) {
      return;
    }

    const total = path.getTotalLength();

    // 各マイルストーンの弧長(彗星がそこを通過したら星を灯す)
    const milestoneLengths = MILESTONES.map((milestone) => {
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let length = 0; length <= total; length += 4) {
        const point = path.getPointAtLength(length);
        const distance = (point.x - milestone.x) ** 2 + (point.y - milestone.y) ** 2;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = length;
        }
      }
      return best;
    });

    const setLit = (index: number, lit: boolean) => {
      const star = starRefs.current[index];
      if (star === null || star === undefined) {
        return;
      }
      star.dataset["lit"] = lit ? "true" : "false";
    };

    progressPath.style.strokeDasharray = `${total} ${total}`;

    if (prefersReducedMotion()) {
      progressPath.style.strokeDashoffset = "0";
      comet.style.display = "none";
      for (let index = 0; index < MILESTONES.length; index++) {
        setLit(index, true);
      }
      return;
    }

    progressPath.style.strokeDashoffset = String(total);
    let progress = 0;
    const headDot = comet.querySelector<HTMLElement>('[data-comet="head"]');
    const tailDots = [...comet.querySelectorAll<HTMLElement>('[data-comet="tail"]')];
    const place = (element: HTMLElement, point: { x: number; y: number }) => {
      element.style.left = `${((point.x / VIEW_W) * 100).toFixed(2)}%`;
      element.style.top = `${((point.y / VIEW_H) * 100).toFixed(2)}%`;
    };

    const update = (dt: number) => {
      const rect = container.getBoundingClientRect();
      // ビューポートの6割の高さのラインを彗星が保つように降下する
      const target = clamp01((window.innerHeight * 0.6 - rect.top) / rect.height);
      progress = lerp(progress, target, dt > 0 ? Math.min(1, dt * 4) : 1);
      const length = progress * total;

      progressPath.style.strokeDashoffset = String(Math.max(total - length, 0));

      // 彗星の頭と尾
      comet.style.display = length > 2 ? "" : "none";
      if (length > 2) {
        if (headDot !== null) {
          place(headDot, path.getPointAtLength(length));
        }
        for (const [tailIndex, tail] of TAIL.entries()) {
          const dot = tailDots[tailIndex];
          if (dot === undefined) {
            continue;
          }
          const tailLength = length - tail.back;
          if (tailLength <= 0) {
            dot.style.opacity = "0";
            continue;
          }
          place(dot, path.getPointAtLength(tailLength));
          dot.style.opacity = String(tail.alpha);
        }
      }

      for (const [index, milestoneLength] of milestoneLengths.entries()) {
        setLit(index, length >= milestoneLength - 2);
      }
    };

    let stopFrame: (() => void) | null = null;
    const stopVisibility = whenInView(container, (visible) => {
      if (visible && stopFrame === null) {
        stopFrame = subscribeFrame((frame) => {
          update(frame.dt);
        });
      } else if (!visible && stopFrame !== null) {
        stopFrame();
        stopFrame = null;
      }
    });

    return () => {
      stopVisibility();
      if (stopFrame !== null) {
        stopFrame();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mt-8 h-288 w-full">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          {/* 過去(氷色・淡)→現在(ピンク・明)の時間グラデーション */}
          <linearGradient id="trajectory-time" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(166, 211, 234, 0.35)" />
            <stop offset="55%" stopColor="rgba(196, 168, 248, 0.55)" />
            <stop offset="100%" stopColor="rgba(242, 84, 158, 0.8)" />
          </linearGradient>
          <linearGradient id="trajectory-future" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(242, 84, 158, 0.55)" />
            <stop offset="100%" stopColor="rgba(242, 84, 158, 0)" />
          </linearGradient>
        </defs>
        {/* これから進む道: 常に見えている淡い下書き */}
        <path
          ref={pathRef}
          d={TRAJECTORY_PATH}
          fill="none"
          stroke="rgba(247, 242, 250, 0.14)"
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />
        {/* 通過した道: 彗星の背後だけ時間グラデーションで灯る */}
        <path
          ref={progressRef}
          d={TRAJECTORY_PATH}
          fill="none"
          stroke="url(#trajectory-time)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
        {/* NOW の先: 未来へ続く点線 */}
        <path
          d={FUTURE_PATH}
          fill="none"
          stroke="url(#trajectory-future)"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* 彗星: 頭(コア+ハロー)と粒子の尾。svg は縦横比を無視して伸縮するため、
          真円を保てる HTML レイヤーに置き、% 座標で追従させる */}
      <div
        ref={cometRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div
          data-comet="head"
          className="absolute size-1.5 -translate-1/2 rounded-full bg-star"
          style={{ boxShadow: "0 0 10px 4px rgba(247, 242, 250, 0.35)" }}
        />
        {TAIL.map((tail) => (
          <div
            key={tail.back}
            data-comet="tail"
            className="bg-pale absolute -translate-1/2 rounded-full"
            style={{ width: tail.r * 2, height: tail.r * 2, opacity: 0 }}
          />
        ))}
      </div>

      {MILESTONES.map((milestone, index) => {
        const leftPercent = (milestone.x / VIEW_W) * 100;
        const topPercent = (milestone.y / VIEW_H) * 100;
        return (
          <div key={milestone.date}>
            {/* 星: 彗星が通過するまで眠っている */}
            <div
              ref={(node) => {
                starRefs.current[index] = node;
              }}
              data-lit="false"
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
            >
              <svg
                viewBox="-8 -8 16 16"
                width={milestone.now === true ? 30 : 18}
                height={milestone.now === true ? 30 : 18}
                className={`transition-all duration-700 group-data-[lit=false]:scale-75 group-data-[lit=false]:opacity-55 ${
                  milestone.now === true ? "motion-safe:animate-pulse" : ""
                }`}
                style={{ filter: `drop-shadow(0 0 9px ${milestone.color}cc)` }}
                aria-hidden="true"
                role="presentation"
              >
                <path d={STAR_PATH} fill={milestone.color} />
              </svg>
              {/* ラベル: 常に読める。彗星が通過すると少しだけ明るくなる */}
              <div
                className={`absolute top-1/2 w-44 -translate-y-1/2 transition-opacity duration-700 group-data-[lit=false]:opacity-70 md:w-64 ${
                  milestone.side === "right"
                    ? "left-full ml-4 text-left"
                    : "right-full mr-4 text-right"
                }`}
              >
                <p className="font-mono text-pink text-xs">{milestone.date}</p>
                <p className="text-pale mt-0.5 text-sm leading-snug">{milestone.label}</p>
                {milestone.detail !== undefined && (
                  <p className="text-ice font-mono mt-0.5 text-[11px] leading-snug">
                    {milestone.detail}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
