/**
 * ハート形の月(ムードボード img 18)。
 * 質感方針 v3: 平面感をなくすため球体として陰影設計する。
 * - 光源を左上に固定し、ハイライト・周縁減光・ターミネーターを整合させる
 * - クレーターは光源と整合する方向性のある影+明るいリム
 * - 影側の輪郭にアイスブルーのリムライト(宇宙空間の反射光)
 */

const HEART_PATH =
  "M120 210S20 142 20 78C20 46 45 20 76 20c19 0 35 10 44 25C129 30 145 20 164 20c31 0 56 26 56 58 0 64-100 132-100 132z";

/** クレーター: 光源(左上)と整合した内側の影+反対側の明るいリム */
const Crater = ({
  cx,
  cy,
  r,
  opacity = 0.6,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
}) => (
  <g opacity={opacity}>
    {/* 窪みの底 */}
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85} fill="#a89f8d" />
    {/* 光源側(左上)の内壁に落ちる影 */}
    <ellipse cx={cx - r * 0.18} cy={cy - r * 0.15} rx={r * 0.82} ry={r * 0.68} fill="#7d7562" />
    <ellipse cx={cx + r * 0.12} cy={cy + r * 0.1} rx={r * 0.6} ry={r * 0.5} fill="#948c78" />
    {/* 光の当たる縁(右下リム) */}
    <path
      d={`M ${cx - r * 0.7} ${cy + r * 0.55} A ${r * 0.9} ${r * 0.78} 0 0 0 ${cx + r * 0.85} ${cy - r * 0.3}`}
      fill="none"
      stroke="#f5f0e4"
      strokeWidth={r * 0.14}
      strokeLinecap="round"
      opacity="0.7"
    />
  </g>
);

export const HeartMoon = ({ size = 140 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.92}
    viewBox="0 0 240 220"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 0 28px rgba(217, 212, 200, 0.28))" }}
  >
    <defs>
      {/* 球面シェーディング: 左上ハイライト→右下へ減光 */}
      <radialGradient id="moon-sphere" cx="30%" cy="24%" r="95%">
        <stop offset="0%" stopColor="#f6f1e6" />
        <stop offset="30%" stopColor="#d6d1c2" />
        <stop offset="62%" stopColor="#a29a86" />
        <stop offset="100%" stopColor="#4a4438" />
      </radialGradient>
      {/* 周縁減光: 球の輪郭に沿って全周が暗く落ちる */}
      <radialGradient id="moon-limb" cx="40%" cy="34%" r="70%">
        <stop offset="58%" stopColor="rgba(20, 14, 24, 0)" />
        <stop offset="88%" stopColor="rgba(20, 14, 24, 0.35)" />
        <stop offset="100%" stopColor="rgba(20, 14, 24, 0.7)" />
      </radialGradient>
      {/* ターミネーター: 夜側が右下から侵食する */}
      <linearGradient id="moon-terminator" x1="18%" y1="8%" x2="95%" y2="92%">
        <stop offset="40%" stopColor="rgba(14, 10, 20, 0)" />
        <stop offset="72%" stopColor="rgba(14, 10, 20, 0.55)" />
        <stop offset="100%" stopColor="rgba(14, 10, 20, 0.85)" />
      </linearGradient>
      <filter id="moon-texture" x="-10%" y="-10%" width="120%" height="120%">
        {/* 輪郭ゆらぎ: 完璧なベクター曲線を先に壊す */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.025"
          numOctaves="2"
          seed="3"
          result="warp"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="warp"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
          result="warped"
        />
        {/* 月面の凹凸: 低周波を混ぜて石膏ではなく地形にする */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="5"
          seed="7"
          result="noise"
        />
        <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2.4" result="light">
          <feDistantLight azimuth="225" elevation="52" />
        </feDiffuseLighting>
        <feComposite operator="in" in="light" in2="warped" result="lit" />
        <feBlend in="lit" in2="warped" mode="multiply" />
      </filter>
      <clipPath id="moon-clip">
        <path d={HEART_PATH} />
      </clipPath>
      <filter id="moon-rim-blur">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>

    {/* 月面ベース+ノイズライティング */}
    <path d={HEART_PATH} fill="url(#moon-sphere)" filter="url(#moon-texture)" />

    <g clipPath="url(#moon-clip)">
      {/* 海(暗い平原) */}
      <g opacity="0.3">
        <ellipse cx="95" cy="112" rx="32" ry="24" fill="#6f6754" />
        <ellipse cx="158" cy="92" rx="24" ry="18" fill="#7a7260" />
        <ellipse cx="120" cy="160" rx="20" ry="14" fill="#736b58" />
      </g>

      {/* クレーター(光源整合) */}
      <Crater cx={163} cy={62} r={14} />
      <Crater cx={84} cy={86} r={9} />
      <Crater cx={124} cy={126} r={11} opacity={0.5} />
      <Crater cx={71} cy={52} r={5} opacity={0.45} />
      <Crater cx={146} cy={166} r={6} opacity={0.5} />
      <Crater cx={103} cy={58} r={4} opacity={0.4} />
      <Crater cx={185} cy={110} r={7} opacity={0.4} />

      {/* 周縁減光(球体感の要) */}
      <path d={HEART_PATH} fill="url(#moon-limb)" />

      {/* ターミネーター */}
      <path d={HEART_PATH} fill="url(#moon-terminator)" />

      {/* 影側のリムライト: 宇宙の青い反射光(輪郭を背景から浮かせる) */}
      <path
        d={HEART_PATH}
        fill="none"
        stroke="#a6d3ea"
        strokeWidth="2.5"
        opacity="0.5"
        filter="url(#moon-rim-blur)"
        strokeDasharray="150 320"
        strokeDashoffset="-208"
      />
    </g>
  </svg>
);
