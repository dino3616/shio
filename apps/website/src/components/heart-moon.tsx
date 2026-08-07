/**
 * ハート形の月(ムードボード img 18)。
 * 質感方針: feTurbulence + ライティングで月面のクレーター質感を作り、
 * 明暗のターミネーター(欠け際)を入れて「写真の月」に寄せる。
 */

const HEART_PATH =
  "M120 210S20 142 20 78C20 46 45 20 76 20c19 0 35 10 44 25C129 30 145 20 164 20c31 0 56 26 56 58 0 64-100 132-100 132z";

export const HeartMoon = ({ size = 140 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.92}
    viewBox="0 0 240 220"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 0 26px rgba(217, 212, 200, 0.3))" }}
  >
    <defs>
      <radialGradient id="moon-shade" cx="36%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#f1ece0" />
        <stop offset="55%" stopColor="#d9d4c8" />
        <stop offset="100%" stopColor="#a49d8c" />
      </radialGradient>
      <linearGradient id="moon-terminator" x1="0%" y1="0%" x2="100%" y2="85%">
        <stop offset="55%" stopColor="rgba(14, 10, 20, 0)" />
        <stop offset="100%" stopColor="rgba(14, 10, 20, 0.5)" />
      </linearGradient>
      <filter id="moon-texture" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.09"
          numOctaves="4"
          seed="7"
          result="noise"
        />
        <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="1.6" result="light">
          <feDistantLight azimuth="235" elevation="60" />
        </feDiffuseLighting>
        <feComposite operator="in" in="light" in2="SourceGraphic" result="lit" />
        <feBlend in="lit" in2="SourceGraphic" mode="multiply" />
      </filter>
      <clipPath id="moon-clip">
        <path d={HEART_PATH} />
      </clipPath>
    </defs>

    {/* 月面ベース+ノイズライティング */}
    <path d={HEART_PATH} fill="url(#moon-shade)" filter="url(#moon-texture)" />

    {/* クレーター(影+リム) */}
    <g clipPath="url(#moon-clip)">
      <g opacity="0.55">
        <ellipse cx="165" cy="64" rx="15" ry="13" fill="#b3ab98" />
        <ellipse cx="162" cy="61" rx="11" ry="9" fill="#8f8875" />
        <ellipse cx="85" cy="88" rx="9" ry="8" fill="#b3ab98" />
        <ellipse cx="83" cy="86" rx="6.5" ry="5.5" fill="#938c79" />
        <ellipse cx="125" cy="128" rx="12" ry="10" fill="#aca491" />
        <ellipse cx="122" cy="125" rx="8.5" ry="7" fill="#8f8875" />
        <ellipse cx="72" cy="52" rx="5" ry="4.5" fill="#9c9482" />
        <ellipse cx="145" cy="165" rx="6" ry="5" fill="#9c9482" />
        <ellipse cx="103" cy="60" rx="4" ry="3.5" fill="#a89f8d" />
      </g>
      {/* 海(暗い平原) */}
      <g opacity="0.25">
        <ellipse cx="95" cy="115" rx="30" ry="22" fill="#7d765f" />
        <ellipse cx="160" cy="95" rx="22" ry="17" fill="#847c66" />
      </g>
    </g>

    {/* ターミネーター(欠け際の影) */}
    <path d={HEART_PATH} fill="url(#moon-terminator)" />
  </svg>
);
