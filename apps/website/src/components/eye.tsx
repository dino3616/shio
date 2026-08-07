import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * 訪問者のカーソルを追いかける目玉。
 * atan2 で方向を出し、バネ物理(減衰振動)で追従させる
 * (design-direction: 視線のインタラクション = 二大モチーフ直結の主演出)。
 *
 * 質感方針 v3: 背景シェーダーと複雑度を揃えるため、
 * - 毛細血管: ランダムウォークでジグザグ+分岐をプロシージャル生成
 * - 虹彩: 外繊維・内繊維・コラレット(波状リング)・クリプト(暗斑)・
 *   ノイズテクスチャの5層構成
 */

// SSR とクライアントで同じ絵になるよう、シード付き擬似乱数で生成する
const mulberry32 = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Stroke = {
  d?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width: number;
  opacity: number;
  color: string;
};

const CX = 100;
const CY = 100;

/** 極座標のランダムウォークで、ジグザグしながら分岐する毛細血管を生成する */
const createCapillaries = (): Stroke[] => {
  const rand = mulberry32(361601);
  const strokes: Stroke[] = [];

  const walk = (
    startAngle: number,
    startRadius: number,
    endRadius: number,
    width: number,
    opacity: number,
    depth: number,
  ) => {
    let angle = startAngle;
    let radius = startRadius;
    let drift = 0; // 全体がゆるくカーブするための累積ドリフト
    const points: string[] = [
      `M ${(CX + Math.cos(angle) * radius).toFixed(1)} ${(CY + Math.sin(angle) * radius).toFixed(1)}`,
    ];
    let step = 0;
    while (radius > endRadius) {
      // 歩幅も振れ幅も毎歩ランダムにして、稲妻ではなく血管のジグザグにする
      radius -= 1.5 + rand() * 2.5;
      drift += (rand() - 0.5) * 0.02;
      angle += (step % 2 === 0 ? 1 : -1) * (0.008 + rand() * 0.045) * (0.5 + rand()) + drift;
      points.push(
        `L ${(CX + Math.cos(angle) * radius).toFixed(1)} ${(CY + Math.sin(angle) * radius).toFixed(1)}`,
      );
      // 分岐: 途中から細い枝を生やす
      if (depth < 2 && rand() < 0.18 && radius > endRadius + 8) {
        walk(
          angle + (rand() - 0.5) * 0.8,
          radius,
          radius - 6 - rand() * 9,
          width * 0.5,
          opacity * 0.7,
          depth + 1,
        );
      }
      step++;
    }
    strokes.push({ d: points.join(" "), width, opacity, color: "#d8405e" });
  };

  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * Math.PI * 2 + rand() * 0.5;
    // 開始点はクリップ円の外: 追従で動いても根元が縁から浮かない
    walk(baseAngle, 112, 62 + rand() * 8, 1 + rand() * 0.6, 0.16 + rand() * 0.16, 0);
  }
  return strokes;
};

/** 虹彩の繊維(外層: コラレット→縁、内層: 瞳孔→コラレット) */
const createIrisFibers = (): { outer: Stroke[]; inner: Stroke[] } => {
  const rand = mulberry32(2026);
  const colors = ["#f2c4dc", "#a6d3ea", "#f7f2fa", "#c4a8f8", "#f2549e"];
  const outer: Stroke[] = [];
  const inner: Stroke[] = [];

  for (let i = 0; i < 96; i++) {
    const angle = (i / 96) * Math.PI * 2 + rand() * 0.06;
    const start = 30 + rand() * 4;
    const end = 46 + rand() * 6;
    const drift = (rand() - 0.5) * 0.12; // 繊維がまっすぐでなく僅かに流れる
    outer.push({
      x1: CX + Math.cos(angle) * start,
      y1: CY + Math.sin(angle) * start,
      x2: CX + Math.cos(angle + drift) * end,
      y2: CY + Math.sin(angle + drift) * end,
      width: 0.5 + rand() * 1.1,
      opacity: 0.08 + rand() * 0.3,
      color: colors[Math.floor(rand() * colors.length)] ?? "#f7f2fa",
    });
  }
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 + rand() * 0.1;
    const start = 23 + rand() * 2;
    const end = 29 + rand() * 3;
    inner.push({
      x1: CX + Math.cos(angle) * start,
      y1: CY + Math.sin(angle) * start,
      x2: CX + Math.cos(angle) * end,
      y2: CY + Math.sin(angle) * end,
      width: 0.5 + rand() * 0.8,
      opacity: 0.25 + rand() * 0.4,
      color: rand() < 0.2 ? "#f2e85c" : "#f7f2fa",
    });
  }
  return { outer, inner };
};

/** コラレット: 瞳孔の周りの波打つリング(実際の虹彩にある構造) */
const createCollarette = (): string => {
  const rand = mulberry32(777);
  const points: string[] = [];
  const segments = 72;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const radius =
      30 + Math.sin(angle * 9) * 1.6 + Math.sin(angle * 4 + 1.3) * 1.2 + (rand() - 0.5) * 0.8;
    const x = CX + Math.cos(angle) * radius;
    const y = CY + Math.sin(angle) * radius;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `${points.join(" ")} Z`;
};

/** クリプト: 繊維の間の暗い窪み */
const createCrypts = (): {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  opacity: number;
}[] => {
  const rand = mulberry32(4649);
  const crypts = [];
  for (let i = 0; i < 14; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 34 + rand() * 12;
    crypts.push({
      cx: CX + Math.cos(angle) * radius,
      cy: CY + Math.sin(angle) * radius,
      rx: 1.2 + rand() * 2.4,
      ry: 3 + rand() * 4.5,
      rotate: (angle * 180) / Math.PI + 90,
      opacity: 0.15 + rand() * 0.25,
    });
  }
  return crypts;
};

const CAPILLARIES = createCapillaries();
const { outer: OUTER_FIBERS, inner: INNER_FIBERS } = createIrisFibers();
const COLLARETTE_PATH = createCollarette();
const CRYPTS = createCrypts();

export const Eye = ({ size = 200 }: { size?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 160, damping: 15, mass: 0.6 });
  const y = useSpring(targetY, { stiffness: 160, damping: 15, mass: 0.6 });
  // 毛細血管は眼球表面にあるので虹彩と一緒に動く。
  // ただし虹彩より赤道寄りにあるぶん見かけの移動量は小さい
  const capillaryX = useTransform(x, (value) => value * 0.55);
  const capillaryY = useTransform(y, (value) => value * 0.55);

  const maxOffset = 30;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) / 6, maxOffset);
      targetX.set(Math.cos(angle) * distance);
      targetY.set(Math.sin(angle) * distance);
    };
    window.addEventListener("pointermove", handlePointerMove);

    // マイクロサッカード: 視線がわずかに泳ぐ
    let saccadeTimer = 0;
    const scheduleSaccade = () => {
      saccadeTimer = window.setTimeout(
        () => {
          targetX.set(targetX.get() + (Math.random() - 0.5) * 6);
          targetY.set(targetY.get() + (Math.random() - 0.5) * 6);
          scheduleSaccade();
        },
        800 + Math.random() * 1200,
      );
    };
    scheduleSaccade();

    // 瞬き
    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(
        () => {
          setIsBlinking(true);
          window.setTimeout(() => {
            setIsBlinking(false);
          }, 130);
          scheduleBlink();
        },
        3000 + Math.random() * 5000,
      );
    };
    scheduleBlink();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.clearTimeout(saccadeTimer);
      window.clearTimeout(blinkTimer);
    };
  }, [targetX, targetY]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 50px 6px rgba(242, 84, 158, 0.35), 0 0 90px 20px rgba(139, 92, 246, 0.18)",
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" role="presentation">
        <defs>
          <radialGradient id="eye-sclera" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#fdfbff" />
            <stop offset="72%" stopColor="#f3ecf5" />
            <stop offset="100%" stopColor="#d9cbdf" />
          </radialGradient>
          <radialGradient id="eye-iris" cx="42%" cy="40%" r="68%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="45%" stopColor="#8b5cf6" />
            <stop offset="80%" stopColor="#d14b9e" />
            <stop offset="100%" stopColor="#f2549e" />
          </radialGradient>
          <radialGradient id="eye-pupil" cx="45%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#241a30" />
            <stop offset="100%" stopColor="#0a0710" />
          </radialGradient>
          <radialGradient id="eye-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(24, 28, 63, 0)" />
            <stop offset="100%" stopColor="rgba(24, 28, 63, 0.5)" />
          </radialGradient>
          {/* 虹彩の有機的なまだら模様 */}
          <filter id="eye-iris-texture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.4"
              numOctaves="3"
              seed="13"
              result="noise"
            />
            <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="0.9" result="light">
              <feDistantLight azimuth="225" elevation="55" />
            </feDiffuseLighting>
            <feComposite operator="in" in="light" in2="SourceGraphic" result="lit" />
            <feBlend in="lit" in2="SourceGraphic" mode="multiply" />
          </filter>
          <filter id="eye-soft-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* 白目 */}
        <circle cx="100" cy="100" r="98" fill="url(#eye-sclera)" />

        {/* 毛細血管: ジグザグ+分岐(かわいくて、不穏)。眼球ごと回るので虹彩に追従 */}
        <motion.g
          style={{ x: capillaryX, y: capillaryY }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {CAPILLARIES.map((vessel) => (
            <path
              key={vessel.d}
              d={vessel.d}
              stroke={vessel.color}
              strokeWidth={vessel.width}
              opacity={vessel.opacity}
            />
          ))}
        </motion.g>

        {/* 上まぶたの環境光遮蔽 */}
        <ellipse
          cx="100"
          cy="4"
          rx="112"
          ry="42"
          fill="#181c3f"
          opacity="0.28"
          filter="url(#eye-soft-blur)"
        />

        {/* 虹彩+瞳孔(バネ追従) */}
        <motion.g style={{ x, y }}>
          <circle cx="100" cy="100" r="52" fill="url(#eye-iris)" filter="url(#eye-iris-texture)" />
          {/* 外繊維: コラレット→縁 */}
          <g strokeLinecap="round">
            {OUTER_FIBERS.map((fiber) => (
              <line
                key={`o-${fiber.x1}-${fiber.y1}`}
                x1={fiber.x1}
                y1={fiber.y1}
                x2={fiber.x2}
                y2={fiber.y2}
                stroke={fiber.color}
                strokeWidth={fiber.width}
                opacity={fiber.opacity}
              />
            ))}
          </g>
          {/* クリプト: 繊維の間の暗い窪み */}
          <g fill="#241a3f">
            {CRYPTS.map((crypt) => (
              <ellipse
                key={`c-${crypt.cx}-${crypt.cy}`}
                cx={crypt.cx}
                cy={crypt.cy}
                rx={crypt.rx}
                ry={crypt.ry}
                opacity={crypt.opacity}
                transform={`rotate(${crypt.rotate} ${crypt.cx} ${crypt.cy})`}
              />
            ))}
          </g>
          {/* コラレット: 瞳孔周りの波状リング */}
          <path d={COLLARETTE_PATH} fill="none" stroke="#3b2a5f" strokeWidth="1.4" opacity="0.65" />
          {/* 内繊維: 瞳孔→コラレット(明るく密) */}
          <g strokeLinecap="round">
            {INNER_FIBERS.map((fiber) => (
              <line
                key={`i-${fiber.x1}-${fiber.y1}`}
                x1={fiber.x1}
                y1={fiber.y1}
                x2={fiber.x2}
                y2={fiber.y2}
                stroke={fiber.color}
                strokeWidth={fiber.width}
                opacity={fiber.opacity}
              />
            ))}
          </g>
          {/* 虹彩の外周リング(二重) */}
          <circle
            cx="100"
            cy="100"
            r="52"
            fill="none"
            stroke="#241a3f"
            strokeWidth="4"
            opacity="0.9"
          />
          <circle
            cx="100"
            cy="100"
            r="47.5"
            fill="none"
            stroke="#1a1230"
            strokeWidth="1"
            opacity="0.35"
          />
          {/* 瞳孔 */}
          <circle cx="100" cy="100" r="23" fill="url(#eye-pupil)" />
          <circle
            cx="100"
            cy="100"
            r="23"
            fill="none"
            stroke="#0a0710"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* 角膜反射(濡れた質感) */}
          <circle cx="86" cy="84" r="9" fill="#ffffff" opacity="0.95" />
          <ellipse
            cx="116"
            cy="114"
            rx="5.5"
            ry="3.5"
            fill="#ffffff"
            opacity="0.5"
            transform="rotate(-30 116 114)"
          />
          <circle cx="80" cy="96" r="2" fill="#ffffff" opacity="0.6" />
        </motion.g>

        {/* 眼窩の落ち影 */}
        <circle cx="100" cy="100" r="98" fill="url(#eye-shadow)" />
      </svg>

      {/* まぶた */}
      <div
        className="absolute inset-0 origin-top transition-transform duration-100 ease-in"
        style={{
          background: "linear-gradient(#241a3f, #181c3f)",
          transform: isBlinking ? "scaleY(1)" : "scaleY(0)",
        }}
      />
    </div>
  );
};
