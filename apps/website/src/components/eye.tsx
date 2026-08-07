import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * 訪問者のカーソルを追いかける目玉。
 * atan2 で方向を出し、バネ物理(減衰振動)で追従させる
 * (design-direction: 視線のインタラクション = 二大モチーフ直結の主演出)。
 *
 * 質感方針: 虹彩の繊維64本・血管・角膜反射をプロシージャルに描き込み、
 * シェーダー背景と「質感の解像度」を揃える(チープなフラットベクターにしない)。
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

type Fiber = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  opacity: number;
  color: string;
};

const FIBER_COLORS = ["#f2c4dc", "#a6d3ea", "#f7f2fa", "#8b5cf6"];

const createFibers = (): Fiber[] => {
  const rand = mulberry32(2026);
  const fibers: Fiber[] = [];
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2 + rand() * 0.1;
    const inner = 24 + rand() * 7;
    const outer = 44 + rand() * 7;
    fibers.push({
      x1: 100 + Math.cos(angle) * inner,
      y1: 100 + Math.sin(angle) * inner,
      x2: 100 + Math.cos(angle) * outer,
      y2: 100 + Math.sin(angle) * outer,
      width: 0.7 + rand() * 1.3,
      opacity: 0.1 + rand() * 0.25,
      color: FIBER_COLORS[Math.floor(rand() * FIBER_COLORS.length)] ?? "#f7f2fa",
    });
  }
  return fibers;
};

const FIBERS = createFibers();

export const Eye = ({ size = 200 }: { size?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 160, damping: 15, mass: 0.6 });
  const y = useSpring(targetY, { stiffness: 160, damping: 15, mass: 0.6 });

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
            <stop offset="100%" stopColor="#f2549e" />
          </radialGradient>
          <radialGradient id="eye-pupil" cx="45%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#241a30" />
            <stop offset="100%" stopColor="#0e0a14" />
          </radialGradient>
          <radialGradient id="eye-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="rgba(24, 28, 63, 0)" />
            <stop offset="100%" stopColor="rgba(24, 28, 63, 0.45)" />
          </radialGradient>
        </defs>

        {/* 白目 */}
        <circle cx="100" cy="100" r="98" fill="url(#eye-sclera)" />

        {/* 血管(かわいくて、不穏) */}
        <g stroke="#e0526e" fill="none" strokeLinecap="round">
          <path d="M 8 78 Q 34 88 55 95" strokeWidth="1.6" opacity="0.28" />
          <path d="M 14 122 Q 38 116 58 110" strokeWidth="1.2" opacity="0.2" />
          <path d="M 186 70 Q 165 82 148 90" strokeWidth="1.4" opacity="0.24" />
          <path d="M 190 118 Q 168 114 152 108" strokeWidth="1" opacity="0.16" />
          <path d="M 30 86 Q 44 92 56 98" strokeWidth="0.8" opacity="0.18" />
        </g>

        {/* 虹彩+瞳孔(バネ追従) */}
        <motion.g style={{ x, y }}>
          <circle cx="100" cy="100" r="52" fill="url(#eye-iris)" />
          <g strokeLinecap="round">
            {FIBERS.map((fiber) => (
              <line
                key={`${fiber.x1}-${fiber.y1}`}
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
          {/* 虹彩の外周リング */}
          <circle
            cx="100"
            cy="100"
            r="52"
            fill="none"
            stroke="#241a3f"
            strokeWidth="3.5"
            opacity="0.85"
          />
          <circle cx="100" cy="100" r="23" fill="url(#eye-pupil)" />
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
