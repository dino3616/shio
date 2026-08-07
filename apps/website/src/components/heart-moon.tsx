/**
 * ハート形の月(ムードボード img 18)。傾けて浮かべる。
 */
export const HeartMoon = ({ size = 140 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.92}
    viewBox="0 0 24 22"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 0 24px rgba(217, 212, 200, 0.35))" }}
  >
    <title>heart moon</title>
    <path
      d="M12 21S2 14.2 2 7.8C2 4.6 4.5 2 7.6 2c1.9 0 3.5 1 4.4 2.5C12.9 3 14.5 2 16.4 2 19.5 2 22 4.6 22 7.8 22 14.2 12 21 12 21z"
      fill="#d9d4c8"
    />
    {/* クレーター */}
    <circle cx="16.5" cy="6.5" r="1.4" fill="#c3bdae" />
    <circle cx="8.5" cy="8.5" r="0.9" fill="#c3bdae" />
    <circle cx="12.5" cy="12.5" r="1.1" fill="#cbc5b6" />
  </svg>
);
