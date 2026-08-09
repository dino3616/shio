/**
 * できること: DESIGN と ENGINEERING が共鳴する演出。
 * - 2枚のガラスパネルを重ね、交差部が自然に明るくなる(ガラス越しのガラス)
 * - 交差点に「かたち」のエンブレム = Design ∩ Engineering から生まれるもの
 *   (タグライン「矛盾ごと、かたちにする。」への接続)
 * - 背後でピンクとアイスブルーのサイン波が逆向きに流れ、中央で干渉し続ける。
 *   ホバーで波とエンブレムが増幅する(=共鳴)
 */

const SKILL_GROUPS: { title: string; accent: string; items: string[] }[] = [
  {
    title: "DESIGN",
    accent: "#f2c4dc",
    items: ["UIデザイン", "グラフィックデザイン", "モーションデザイン", "世界観の設計"],
  },
  {
    title: "ENGINEERING",
    accent: "#a6d3ea",
    items: ["Webフロントエンド", "WebGL / シェーダー", "アクセシビリティ", "Web標準"],
  },
];

/** サイン波のパス。アニメーションでちょうど1周期ぶん平行移動してループさせる */
const createWavePath = (amplitude: number, period: number, phase: number): string => {
  const width = 1500;
  const midY = 160;
  const points: string[] = [];
  for (let x = 0; x <= width; x += 12) {
    const y = midY + amplitude * Math.sin((x / period) * Math.PI * 2 + phase);
    points.push(`${points.length === 0 ? "M" : "L"} ${x} ${y.toFixed(1)}`);
  }
  return points.join(" ");
};

const WAVE_PINK = createWavePath(46, 300, 0);
const WAVE_ICE = createWavePath(38, 300, Math.PI * 0.8);

export const SkillResonance = () => (
  <div className="group relative">
    {/* 共鳴の波: 2本のサイン波が逆向きに流れて中央で交わる */}
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/2 h-60 w-full -translate-y-1/2 opacity-50 transition-opacity duration-700 group-hover:opacity-100"
      viewBox="0 0 1200 320"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      <g className="wave-drift">
        <path d={WAVE_PINK} fill="none" stroke="#f2c4dc" strokeWidth="1.2" opacity="0.6" />
      </g>
      <g className="wave-drift-reverse">
        <path d={WAVE_ICE} fill="none" stroke="#a6d3ea" strokeWidth="1.2" opacity="0.6" />
      </g>
    </svg>

    <div className="relative flex flex-col items-center md:flex-row md:items-stretch md:justify-center">
      {SKILL_GROUPS.map((skillGroup, index) => (
        <div
          key={skillGroup.title}
          className={`w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-colors duration-500 group-hover:border-white/25 ${
            index === 0
              ? "-rotate-1 max-md:pb-16 md:-mr-9 md:mb-10 md:pr-20"
              : "-mt-5 rotate-1 max-md:pt-16 md:-ml-9 md:mt-10 md:pl-20"
          }`}
          style={{ boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)" }}
        >
          <p className="font-mono text-xs tracking-[0.3em]" style={{ color: skillGroup.accent }}>
            {skillGroup.title}
          </p>
          <ul className="mt-4 space-y-2.5">
            {skillGroup.items.map((item) => (
              <li key={item} className="text-pale text-sm">
                <span className="mr-2 text-xs" style={{ color: skillGroup.accent }}>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* 交差点: Design ∩ Engineering = かたち */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div
          className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/30 bg-white/[0.07] backdrop-blur-lg transition-all duration-700 group-hover:border-white/60 group-hover:shadow-[0_0_44px_10px_rgba(242,84,158,0.35)]"
          style={{ boxShadow: "0 0 30px 4px rgba(139, 92, 246, 0.3)" }}
        >
          <span className="text-pink text-sm leading-none">✦</span>
          <span className="font-mincho text-star mt-1.5 text-sm tracking-[0.15em]">かたち</span>
        </div>
      </div>
    </div>
  </div>
);
