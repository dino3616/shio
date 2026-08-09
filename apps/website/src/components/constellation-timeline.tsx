import { motion, useReducedMotion } from "motion/react";

/**
 * これまでの軌跡を夜空の星座として描く。
 * - 星を平面に散らし、時系列の折れ線(星座線)で結ぶ
 * - 視界に入ると線が描かれ、星が時系列順に灯る
 * - 彗星が軌跡を繰り返しなぞり、時間の向きを示す
 * - モバイルは幅が足りないので縦のリストにフォールバックする
 */

type Milestone = {
  date: string;
  label: string;
  detail?: string;
  now?: boolean;
  /** 星の位置(% 座標。viewBox 1000x400 と共有) */
  x: number;
  y: number;
  /** ラベルを星の上に出すか下に出すか(線との重なり回避) */
  side: "top" | "bottom";
};

const MILESTONES: Milestone[] = [
  { date: "2004.11", label: "うまれる", x: 6, y: 74, side: "bottom" },
  { date: "2020.04", label: "茨城工業高等専門学校 入学", x: 24, y: 28, side: "top" },
  { date: "2025.03", label: "茨城工業高等専門学校 卒業", x: 42, y: 62, side: "bottom" },
  { date: "2025.04", label: "株式会社ゆめみ 入社", x: 59, y: 22, side: "top" },
  { date: "2025.12", label: "アクセンチュア株式会社 転籍", x: 75, y: 60, side: "bottom" },
  {
    date: "NOW",
    label: "Accenture Song / Design & Digital Products Creative",
    detail: "Creative Technology Senior Analyst",
    now: true,
    x: 89,
    y: 26,
    side: "top",
  },
];

const STAR_COLORS = ["#f2c4dc", "#a6d3ea", "#f2e85c", "#c4a8f8", "#a6d3ea", "#f2549e"];

const STAR_PATH = "M 0 -7 L 1.8 -1.8 L 7 0 L 1.8 1.8 L 0 7 L -1.8 1.8 L -7 0 L -1.8 -1.8 Z";

// viewBox 1000x400 上の星座線(コンテナも同じ縦横比にして歪みをなくす)
const LINE_PATH = MILESTONES.map(
  (milestone, index) => `${index === 0 ? "M" : "L"} ${milestone.x * 10} ${milestone.y * 4}`,
).join(" ");

const Star = ({ milestone, index }: { milestone: Milestone; index: number }) => (
  <div
    className="absolute -translate-x-1/2 -translate-y-1/2"
    style={{ left: `${milestone.x}%`, top: `${milestone.y}%` }}
  >
    <svg
      viewBox="-8 -8 16 16"
      width={milestone.now === true ? 26 : 17}
      height={milestone.now === true ? 26 : 17}
      className={`mx-auto ${milestone.now === true ? "motion-safe:animate-pulse" : ""}`}
      style={{
        filter: `drop-shadow(0 0 8px ${STAR_COLORS[index % STAR_COLORS.length]}cc)`,
      }}
      aria-hidden="true"
      role="presentation"
    >
      <path d={STAR_PATH} fill={STAR_COLORS[index % STAR_COLORS.length]} />
    </svg>
    {/* ラベル: 線と重ならない側に出す */}
    <div
      className={`absolute left-1/2 w-56 -translate-x-1/2 text-center ${
        milestone.side === "top" ? "bottom-full mb-2.5" : "top-full mt-2.5"
      }`}
    >
      <p className="font-mono text-pink text-xs">{milestone.date}</p>
      <p className="text-pale mt-0.5 text-sm leading-snug">{milestone.label}</p>
      {milestone.detail !== undefined && (
        <p className="text-ice font-mono mt-0.5 text-[11px] leading-snug">{milestone.detail}</p>
      )}
    </div>
  </div>
);

export const ConstellationTimeline = () => {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* デスクトップ: 平面の星座 */}
      <div className="relative mt-4 hidden aspect-[5/2] w-full md:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 400"
          aria-hidden="true"
          role="presentation"
        >
          {/* 星座線: 視界に入ると端から描かれる */}
          {reducedMotion === true ? (
            <path d={LINE_PATH} fill="none" stroke="rgba(242, 196, 220, 0.35)" strokeWidth="1.2" />
          ) : (
            <motion.path
              d={LINE_PATH}
              fill="none"
              stroke="rgba(242, 196, 220, 0.35)"
              strokeWidth="1.2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          )}
          {/* 彗星: 軌跡を繰り返しなぞって時間の向きを示す */}
          {reducedMotion !== true && (
            <g>
              <circle r="7" fill="rgba(247, 242, 250, 0.2)">
                <animateMotion dur="9s" repeatCount="indefinite" path={LINE_PATH} />
              </circle>
              <circle r="2.5" fill="#f7f2fa">
                <animateMotion dur="9s" repeatCount="indefinite" path={LINE_PATH} />
              </circle>
            </g>
          )}
        </svg>
        {MILESTONES.map((milestone, index) =>
          reducedMotion === true ? (
            <Star key={milestone.date} milestone={milestone} index={index} />
          ) : (
            <motion.div
              key={milestone.date}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 14,
                delay: 0.3 + index * 0.3,
              }}
            >
              <Star milestone={milestone} index={index} />
            </motion.div>
          ),
        )}
      </div>

      {/* モバイル: 縦のリスト */}
      <ol className="mt-6 space-y-6 md:hidden">
        {MILESTONES.map((milestone, index) => (
          <li
            key={milestone.date}
            className="grid grid-cols-[24px_64px_1fr] items-baseline gap-x-3"
          >
            <svg
              viewBox="-8 -8 16 16"
              width={12}
              height={12}
              className="translate-y-0.5"
              style={{
                filter: `drop-shadow(0 0 5px ${STAR_COLORS[index % STAR_COLORS.length]}aa)`,
              }}
              aria-hidden="true"
              role="presentation"
            >
              <path d={STAR_PATH} fill={STAR_COLORS[index % STAR_COLORS.length]} />
            </svg>
            <span className="font-mono text-pink text-xs">{milestone.date}</span>
            <span className="text-pale text-sm leading-relaxed">
              {milestone.label}
              {milestone.detail !== undefined && (
                <>
                  <br />
                  <span className="text-ice font-mono text-xs">{milestone.detail}</span>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
};
