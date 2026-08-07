import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * 宇宙プランクトン(moodboard img26)。
 * パステルの不定形流動体に目玉が浮かぶ生物が、時間経過で画面外から
 * 群れで現れ、うねうね漂いながら反対側の画面外へ抜けていくイベント。
 * - 輪郭: 調和級数ブロブを SMIL でモーフさせてアメーバの蠕動にする
 * - 遊泳: 直線移動+進行方向と垂直なサイン波で「漂い」を作る
 * - 目玉: 瞳がゆっくりリサージュで泳ぎ、周囲を見回しているように見せる
 */

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

type Vec = { x: number; y: number };

type PlanktonSpec = {
  id: number;
  seed: number;
  size: number;
  /** 画面を横切るのにかける秒数 */
  duration: number;
  from: Vec;
  to: Vec;
  wobbleAmp: number;
  wobbleCycles: number;
  hueShift: number;
  opacity: number;
  blur: number;
};

/**
 * 不定形ブロブの輪郭。同じ調和級数の位相だけずらした3変種を返し、
 * SMIL の d モーフで絶えず形が変わり続けるようにする
 */
const createBlobVariants = (rand: () => number, radius: number, wobble: number): string[] => {
  const harmonics = Array.from({ length: 4 }, (_, i) => ({
    k: i + 2,
    amp: (wobble * (0.4 + rand() * 0.8)) / (i + 1.5),
    phase: rand() * Math.PI * 2,
  }));
  const variant = (shift: number): string => {
    const segments = 64;
    const points: string[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      let r = radius;
      for (const h of harmonics) {
        r += radius * h.amp * Math.sin(h.k * angle + h.phase + shift * (h.k % 2 === 0 ? 1 : -1));
      }
      points.push(
        `${i === 0 ? "M" : "L"} ${(100 + Math.cos(angle) * r).toFixed(1)} ${(100 + Math.sin(angle) * r).toFixed(1)}`,
      );
    }
    return `${points.join(" ")} Z`;
  };
  return [variant(0), variant(1.6), variant(3.4)];
};

// まつ毛: 目の上側から放射状に生える短い線(img26 の記号的なかわいさ)
const LASHES = [-2.35, -2.0, -1.65, -1.3, -0.95].map((angle) => ({
  x1: 100 + Math.cos(angle) * 20,
  y1: 100 + Math.sin(angle) * 20,
  x2: 100 + Math.cos(angle) * 27,
  y2: 100 + Math.sin(angle) * 27,
}));

const Plankton = ({ spec, onDone }: { spec: PlanktonSpec; onDone: (id: number) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGGElement>(null);

  const shapes = useMemo(() => {
    const rand = mulberry32(spec.seed);
    return {
      outer: createBlobVariants(rand, 88, 0.14),
      mid: createBlobVariants(rand, 60, 0.12),
      inner: createBlobVariants(rand, 36, 0.1),
      morphDur: 9 + rand() * 7,
    };
  }, [spec.seed]);

  useEffect(() => {
    const el = ref.current;
    if (el === null) {
      return;
    }
    const startedAt = performance.now();
    const phase = (spec.seed % 628) / 100;
    const dirX = spec.to.x - spec.from.x;
    const dirY = spec.to.y - spec.from.y;
    const length = Math.hypot(dirX, dirY);
    const perpX = -dirY / length;
    const perpY = dirX / length;
    const half = spec.size / 2;

    let rafId = 0;
    const tick = (now: number) => {
      const t = (now - startedAt) / (spec.duration * 1000);
      if (t >= 1) {
        onDone(spec.id);
        return;
      }
      const wobble = Math.sin(t * spec.wobbleCycles * Math.PI * 2 + phase) * spec.wobbleAmp;
      const x = spec.from.x + dirX * t + perpX * wobble - half;
      const y = spec.from.y + dirY * t + perpY * wobble - half;
      const rotate = Math.sin(t * spec.wobbleCycles * Math.PI * 2 + phase + 1.2) * 14;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotate.toFixed(1)}deg)`;

      const pupil = pupilRef.current;
      if (pupil !== null) {
        const elapsed = (now - startedAt) / 1000;
        const px = Math.sin(elapsed * 0.8 + phase) * 3;
        const py = Math.cos(elapsed * 0.6 + phase * 1.3) * 3;
        pupil.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [spec, onDone]);

  const gradientId = (layer: string) => `plankton-${spec.id}-${layer}`;
  const morph = (variants: string[]) => (
    <animate
      attributeName="d"
      values={`${variants[0]};${variants[1]};${variants[2]};${variants[0]}`}
      dur={`${shapes.morphDur.toFixed(1)}s`}
      repeatCount="indefinite"
    />
  );

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 will-change-transform"
      style={{
        width: spec.size,
        height: spec.size,
        opacity: spec.opacity,
        filter: `drop-shadow(0 0 18px rgba(242, 132, 190, 0.3)) hue-rotate(${spec.hueShift}deg) blur(${spec.blur}px)`,
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" role="presentation">
        <defs>
          {/* 中腹が明るいリング状のグラデーションで img26 の同心円マーブルを再現 */}
          <radialGradient id={gradientId("outer")} cx="50%" cy="50%" r="50%">
            <stop offset="35%" stopColor="rgba(242, 178, 214, 0.04)" />
            <stop offset="78%" stopColor="rgba(242, 178, 214, 0.3)" />
            <stop offset="100%" stopColor="rgba(242, 178, 214, 0.1)" />
          </radialGradient>
          <radialGradient id={gradientId("mid")} cx="50%" cy="50%" r="50%">
            <stop offset="30%" stopColor="rgba(166, 211, 234, 0.08)" />
            <stop offset="75%" stopColor="rgba(166, 211, 234, 0.38)" />
            <stop offset="100%" stopColor="rgba(166, 211, 234, 0.14)" />
          </radialGradient>
          <radialGradient id={gradientId("inner")} cx="45%" cy="42%" r="60%">
            <stop offset="0%" stopColor="rgba(220, 200, 252, 0.55)" />
            <stop offset="100%" stopColor="rgba(196, 168, 248, 0.32)" />
          </radialGradient>
          <radialGradient id={gradientId("iris")} cx="42%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#a6d3ea" />
            <stop offset="100%" stopColor="#6f96d8" />
          </radialGradient>
        </defs>

        <path
          fill={`url(#${gradientId("outer")})`}
          stroke="rgba(255, 220, 240, 0.25)"
          strokeWidth="1"
        >
          {morph(shapes.outer)}
        </path>
        <path fill={`url(#${gradientId("mid")})`} stroke="rgba(214, 240, 255, 0.3)" strokeWidth="1">
          {morph(shapes.mid)}
        </path>
        <path
          fill={`url(#${gradientId("inner")})`}
          stroke="rgba(236, 222, 255, 0.4)"
          strokeWidth="1"
        >
          {morph(shapes.inner)}
        </path>

        {/* 目玉 */}
        <circle cx="100" cy="100" r="18" fill="#fdf4fa" opacity="0.92" />
        <g stroke="#3b2a5f" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
          {LASHES.map((lash) => (
            <line
              key={`${lash.x2.toFixed(1)}-${lash.y2.toFixed(1)}`}
              x1={lash.x1}
              y1={lash.y1}
              x2={lash.x2}
              y2={lash.y2}
            />
          ))}
        </g>
        <g ref={pupilRef}>
          <circle cx="100" cy="100" r="11" fill={`url(#${gradientId("iris")})`} />
          <circle cx="100" cy="100" r="5.5" fill="#241a30" />
          <circle cx="97.5" cy="97.5" r="1.8" fill="#ffffff" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};

export const SpacePlankton = () => {
  const [specs, setSpecs] = useState<PlanktonSpec[]>([]);
  const removeSpec = useCallback((id: number) => {
    setSpecs((prev) => prev.filter((spec) => spec.id !== id));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let nextId = 1;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const spawnOne = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 200;
      const fromLeft = Math.random() < 0.5;
      setSpecs((prev) => [
        ...prev,
        {
          id: nextId++,
          seed: Math.floor(Math.random() * 2 ** 31),
          size: 110 + Math.random() * 130,
          duration: 30 + Math.random() * 20,
          from: { x: fromLeft ? -margin : vw + margin, y: vh * (0.1 + Math.random() * 0.8) },
          to: { x: fromLeft ? vw + margin : -margin, y: vh * (0.1 + Math.random() * 0.8) },
          wobbleAmp: 50 + Math.random() * 90,
          wobbleCycles: 1.5 + Math.random() * 2,
          hueShift: -20 + Math.random() * 70,
          opacity: 0.65 + Math.random() * 0.3,
          blur: Math.random() * 1.4,
        },
      ]);
    };

    // 群れ: 2〜4体が数秒差で同じ方向から流れてくる
    const spawnSchool = () => {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        later(spawnOne, i * (1500 + Math.random() * 2500));
      }
      later(spawnSchool, 35000 + Math.random() * 30000);
    };
    later(spawnSchool, 5000 + Math.random() * 5000);

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {specs.map((spec) => (
        <Plankton key={spec.id} spec={spec} onDone={removeSpec} />
      ))}
    </div>
  );
};
