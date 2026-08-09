import { useEffect, useRef, useState } from "react";

/**
 * 経歴を星座として描くタイムライン(content-plan: About の経歴は
 * 履歴書ではなく星を線で結ぶ星座モチーフで)。
 * 各マイルストーンがクロススパークルの星になり、細い線で結ばれる。
 * 星の位置は描画後に実測して折れ線を引く(行の高さが折り返しで
 * 変わっても星座がずれないように)
 */

type Milestone = {
  date: string;
  label: string;
  detail?: string;
  now?: boolean;
};

const MILESTONES: Milestone[] = [
  { date: "2004.11", label: "うまれる" },
  { date: "2020.04", label: "茨城工業高等専門学校 入学" },
  { date: "2025.03", label: "茨城工業高等専門学校 卒業" },
  { date: "2025.04", label: "株式会社ゆめみ 入社" },
  { date: "2025.12", label: "アクセンチュア株式会社 転籍" },
  {
    date: "NOW",
    label: "Accenture Song / Design & Digital Products Creative",
    detail: "Creative Technology Senior Analyst",
    now: true,
  },
];

// 星座らしく星を左右にずらす(直線の年表にしない)
const NODE_OFFSETS = [8, 30, 4, 26, 14, 34];

const STAR_COLORS = ["#f2c4dc", "#a6d3ea", "#f2e85c", "#c4a8f8", "#a6d3ea", "#f2549e"];

const STAR_PATH = "M 0 -7 L 1.8 -1.8 L 7 0 L 1.8 1.8 L 0 7 L -1.8 1.8 L -7 0 L -1.8 -1.8 Z";

export const ConstellationTimeline = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [points, setPoints] = useState("");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper === null) {
      return;
    }
    const measure = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const positions: string[] = [];
      for (const star of starRefs.current) {
        if (star === null) {
          continue;
        }
        const rect = star.getBoundingClientRect();
        positions.push(
          `${(rect.left - wrapperRect.left + rect.width / 2).toFixed(1)},${(rect.top - wrapperRect.top + rect.height / 2).toFixed(1)}`,
        );
      }
      setPoints(positions.join(" "));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* 星をつなぐ線 */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        role="presentation"
      >
        <polyline
          points={points}
          fill="none"
          stroke="rgba(242, 196, 220, 0.28)"
          strokeWidth="1"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
      </svg>
      <ol className="space-y-7">
        {MILESTONES.map((milestone, index) => (
          <li
            key={milestone.date}
            className="grid grid-cols-[52px_64px_1fr] items-baseline gap-x-3"
          >
            <span className="relative h-4">
              <svg
                ref={(node) => {
                  starRefs.current[index] = node;
                }}
                viewBox="-8 -8 16 16"
                width={milestone.now === true ? 20 : 14}
                height={milestone.now === true ? 20 : 14}
                className={`absolute top-1/2 -translate-y-1/2 ${milestone.now === true ? "motion-safe:animate-pulse" : ""}`}
                style={{
                  left: NODE_OFFSETS[index % NODE_OFFSETS.length],
                  filter: `drop-shadow(0 0 6px ${STAR_COLORS[index % STAR_COLORS.length]}aa)`,
                }}
                aria-hidden="true"
                role="presentation"
              >
                <path d={STAR_PATH} fill={STAR_COLORS[index % STAR_COLORS.length]} />
              </svg>
            </span>
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
    </div>
  );
};
