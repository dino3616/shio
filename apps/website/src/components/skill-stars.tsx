import { useEffect, useRef } from "react";
import { mulberry32 } from "~/lib/random";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";

/**
 * できること: DESIGN と ENGINEERING のふたつの恒星。
 * - 各恒星の周りにスキルの吹き出し(DOM。canvas がリード線を描いて恒星とつなぐ)
 * - 恒星の外縁からエネルギーが無数の粒子として漏れ出し、渦を巻きながら中間へ流れる
 * - 中間で粒子が不定形にうねる輪郭に合流し、「かたち」の外枠を作る
 *   (Design ∩ Engineering から生まれるもの。テキストは載せない)
 */

type StarConfig = {
  title: string;
  /** 恒星中心の位置クラス(モバイル: 縦積み / md+: 左右) */
  position: string;
  surface: string;
  glow: string;
  colors: string[];
  items: string[];
  /** md+ での吹き出しオフセット(恒星中心からの px)。左恒星は右端、右恒星は左端が基準 */
  chipOffsets: { dx: number; dy: number }[];
};

const STARS: [StarConfig, StarConfig] = [
  {
    title: "DESIGN",
    position: "left-1/2 top-[12%] md:left-[22%] md:top-[42%]",
    surface: "radial-gradient(circle at 40% 38%, #ffffff, #ffd9ec 22%, #f2549e 62%, #7a1c52 100%)",
    glow: "0 0 60px 10px rgba(242, 84, 158, 0.45), 0 0 160px 50px rgba(242, 84, 158, 0.18)",
    colors: ["#f2c4dc", "#f2549e", "#ffd9ec"],
    items: ["UIデザイン", "グラフィックデザイン", "モーションデザイン", "世界観の設計"],
    chipOffsets: [
      { dx: -86, dy: -102 },
      { dx: -102, dy: -30 },
      { dx: -86, dy: 46 },
      { dx: -50, dy: 118 },
    ],
  },
  {
    title: "ENGINEERING",
    position: "left-1/2 top-[84%] md:left-[78%] md:top-[58%]",
    surface: "radial-gradient(circle at 40% 38%, #ffffff, #dff1ff 22%, #a6d3ea 62%, #1d3e63 100%)",
    glow: "0 0 60px 10px rgba(166, 211, 234, 0.45), 0 0 160px 50px rgba(166, 211, 234, 0.18)",
    colors: ["#a6d3ea", "#c4a8f8", "#dff1ff"],
    items: ["Webフロントエンド", "WebGL / シェーダー", "アクセシビリティ", "Web標準"],
    chipOffsets: [
      { dx: 86, dy: -102 },
      { dx: 102, dy: -30 },
      { dx: 86, dy: 46 },
      { dx: 50, dy: 118 },
    ],
  },
];

const PARTICLES_PER_STAR = 320;
const TAU = Math.PI * 2;

type Circle = { x: number; y: number; r: number };
type LeaderLine = { x1: number; y1: number; x2: number; y2: number };

type Particle = {
  star: 0 | 1;
  mode: "travel" | "blob";
  /** travel: 恒星から中間までの進行度 0..1 */
  s: number;
  speed: number;
  theta0: number;
  spins: number;
  dir: 1 | -1;
  /** blob: 輪郭上の角度と周回速度 */
  thetaB: number;
  drift: number;
  life: number;
  maxLife: number;
  jitterPhase: number;
  color: string;
  x: number;
  y: number;
  /** トレイル(残像)の座標。頭より遅れて追従し、速度に応じた流線を作る */
  tx: number;
  ty: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** 不定形にうねる輪郭の半径。複数の正弦波の重ね合わせで有機的に流動させる */
const blobRadius = (base: number, theta: number, t: number) =>
  base *
  (1 +
    0.17 * Math.sin(2 * theta + t * 0.8) +
    0.11 * Math.sin(3 * theta - t * 1.3 + 2.1) +
    0.06 * Math.sin(5 * theta + t * 1.9 + 4.2));

export const SkillStars = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (container === null || canvas === null || context === null || context === undefined) {
      return;
    }

    let dpr = 1;
    let stars: [Circle, Circle] = [
      { x: 0, y: 0, r: 56 },
      { x: 0, y: 0, r: 56 },
    ];
    let blob: Circle = { x: 0, y: 0, r: 72 };
    let leaderLines: LeaderLine[] = [];

    const measure = () => {
      const canvasRect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio, 2);
      const width = Math.floor(canvasRect.width * dpr);
      const height = Math.floor(canvasRect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const measured: Circle[] = [];
      for (const element of starRefs.current) {
        if (element === null) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        measured.push({
          x: rect.left + rect.width / 2 - canvasRect.left,
          y: rect.top + rect.height / 2 - canvasRect.top,
          r: rect.width / 2,
        });
      }
      const [first, second] = measured;
      if (first === undefined || second === undefined) {
        return;
      }
      stars = [first, second];
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      blob = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
        r: Math.min(Math.max(distance * 0.15, 52), 92),
      };

      // 吹き出しから恒星へのリード線(吹き出しの縁 → 恒星の縁の少し手前)
      leaderLines = [];
      for (const [index, element] of chipRefs.current.entries()) {
        if (element === null) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        if (rect.width === 0) {
          continue;
        }
        const star = stars[index < STARS[0].items.length ? 0 : 1];
        const cx = rect.left + rect.width / 2 - canvasRect.left;
        const cy = rect.top + rect.height / 2 - canvasRect.top;
        const dx = star.x - cx;
        const dy = star.y - cy;
        const length = Math.hypot(dx, dy);
        if (length < star.r + 12) {
          continue;
        }
        const exit = Math.min(
          dx === 0 ? Number.POSITIVE_INFINITY : (rect.width / 2 + 3) / Math.abs(dx / length),
          dy === 0 ? Number.POSITIVE_INFINITY : (rect.height / 2 + 3) / Math.abs(dy / length),
        );
        leaderLines.push({
          x1: cx + (dx / length) * exit,
          y1: cy + (dy / length) * exit,
          x2: star.x - (dx / length) * (star.r + 5),
          y2: star.y - (dy / length) * (star.r + 5),
        });
      }
    };

    const random = mulberry32(3616);

    const spawnTravel = (particle: Particle) => {
      particle.mode = "travel";
      particle.s = 0;
      particle.speed = 0.17 + random() * 0.13;
      particle.theta0 = random() * TAU;
      particle.spins = 0.8 + random() * 0.9;
      particle.jitterPhase = random() * TAU;
      const palette = STARS[particle.star].colors;
      particle.color = palette[Math.floor(random() * palette.length)] ?? "#f7f2fa";
    };

    const particles: Particle[] = [];
    for (let index = 0; index < PARTICLES_PER_STAR * 2; index++) {
      const particle: Particle = {
        star: index < PARTICLES_PER_STAR ? 0 : 1,
        mode: "travel",
        s: 0,
        speed: 0,
        theta0: 0,
        spins: 0,
        // 渦の向きは恒星ごとに統一する。中央の輪郭上では互いに逆行して交わる
        dir: index < PARTICLES_PER_STAR ? 1 : -1,
        thetaB: random() * TAU,
        drift: 0.5 + random() * 0.55,
        life: 0,
        maxLife: 3 + random() * 4,
        jitterPhase: 0,
        color: "#f7f2fa",
        x: Number.NaN,
        y: Number.NaN,
        tx: Number.NaN,
        ty: Number.NaN,
      };
      spawnTravel(particle);
      // 初期状態から絵が成立するよう、半分は輪郭に、残りは道中にばらまく
      if (random() < 0.5) {
        particle.mode = "blob";
        particle.life = particle.maxLife * random();
      } else {
        particle.s = random();
      }
      particles.push(particle);
    }

    const updateParticle = (particle: Particle, dt: number, t: number) => {
      const star = stars[particle.star];
      if (particle.mode === "travel") {
        particle.s += dt * particle.speed;
        if (particle.s >= 1) {
          particle.mode = "blob";
          particle.thetaB = Math.atan2(particle.y - blob.y, particle.x - blob.x);
          particle.life = particle.maxLife;
        }
        const eased = smoothstep(Math.min(particle.s, 1));
        const centerX = lerp(star.x, blob.x, eased);
        const centerY = lerp(star.y, blob.y, eased);
        const angle = particle.theta0 + particle.dir * particle.spins * TAU * particle.s;
        // 外縁から漏れ出し、いったん膨らんでから輪郭の半径に収束する渦
        const offset =
          lerp(star.r, blob.r, particle.s) + Math.sin(Math.PI * particle.s) * star.r * 0.45;
        particle.x = centerX + Math.cos(angle) * offset;
        particle.y = centerY + Math.sin(angle) * offset;
        return Math.min(particle.s * 8, 1) * 0.75;
      }
      particle.thetaB += particle.dir * particle.drift * dt;
      particle.life -= dt;
      if (particle.life <= 0) {
        spawnTravel(particle);
        particle.x = Number.NaN;
        particle.tx = Number.NaN;
        return 0;
      }
      const radius =
        blobRadius(blob.r, particle.thetaB, t) + Math.sin(t * 2 + particle.jitterPhase) * 2.5;
      particle.x = blob.x + Math.cos(particle.thetaB) * radius;
      particle.y = blob.y + Math.sin(particle.thetaB) * radius;
      return Math.min(particle.life / (particle.maxLife * 0.25), 1) * 0.8;
    };

    const render = (dt: number, t: number) => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      // 吹き出しのリード線
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = "rgba(247, 242, 250, 0.16)";
      context.lineWidth = 1;
      context.setLineDash([2, 4]);
      context.beginPath();
      for (const line of leaderLines) {
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
      }
      context.stroke();
      context.setLineDash([]);

      // 中間の淡い内殻グロー
      const glow = context.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r * 1.5);
      glow.addColorStop(0, "rgba(196, 168, 248, 0.10)");
      glow.addColorStop(1, "rgba(196, 168, 248, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(blob.x, blob.y, blob.r * 1.5, 0, TAU);
      context.fill();

      // 粒子(加算合成で発光)。頭の点+遅れて追従するトレイルで流線を描く
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      for (const particle of particles) {
        const alpha = updateParticle(particle, dt, t);
        if (alpha <= 0 || !Number.isFinite(particle.x)) {
          continue;
        }
        if (!Number.isFinite(particle.tx)) {
          particle.tx = particle.x;
          particle.ty = particle.y;
        } else {
          const follow = Math.min(1, dt * 4.5);
          particle.tx += (particle.x - particle.tx) * follow;
          particle.ty += (particle.y - particle.ty) * follow;
          // 低FPS時にトレイルが伸びすぎて棘状にならないよう上限を設ける
          const trailX = particle.x - particle.tx;
          const trailY = particle.y - particle.ty;
          const trailLength = Math.hypot(trailX, trailY);
          const maxTrail = 16;
          if (trailLength > maxTrail) {
            particle.tx = particle.x - (trailX / trailLength) * maxTrail;
            particle.ty = particle.y - (trailY / trailLength) * maxTrail;
          }
        }
        context.globalAlpha = alpha;
        context.strokeStyle = particle.color;
        context.fillStyle = particle.color;
        context.lineWidth = particle.mode === "blob" ? 1.8 : 1.2;
        context.beginPath();
        context.moveTo(particle.tx, particle.ty);
        context.lineTo(particle.x, particle.y);
        context.stroke();
        context.beginPath();
        context.arc(particle.x, particle.y, particle.mode === "blob" ? 1.4 : 1.1, 0, TAU);
        context.fill();
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    void document.fonts.ready.then(measure);

    if (prefersReducedMotion()) {
      // 静止画として1フレームだけ描く
      render(0, 0);
      return () => {
        observer.disconnect();
      };
    }

    let stopFrame: (() => void) | null = null;
    const stopVisibility = whenInView(container, (visible) => {
      if (visible && stopFrame === null) {
        stopFrame = subscribeFrame((frame) => {
          render(frame.dt, frame.now / 1000);
        });
      } else if (!visible && stopFrame !== null) {
        stopFrame();
        stopFrame = null;
      }
    });

    return () => {
      observer.disconnect();
      stopVisibility();
      if (stopFrame !== null) {
        stopFrame();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[40rem] md:h-[32rem]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        role="presentation"
      />
      {STARS.map((star, starIndex) => (
        <div key={star.title} className={`absolute h-0 w-0 ${star.position}`}>
          {/* 恒星本体 */}
          <div
            ref={(node) => {
              starRefs.current[starIndex] = node;
            }}
            className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-36 md:w-36"
            style={{ background: star.surface, boxShadow: star.glow }}
          />
          <p className="font-mono text-star/70 absolute top-[68px] left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] whitespace-nowrap md:top-[88px]">
            {star.title}
          </p>
          {/* md+: 恒星の周りに散らす吹き出し */}
          <ul className="hidden md:block">
            {star.items.map((item, itemIndex) => {
              const offset = star.chipOffsets[itemIndex] ?? { dx: 0, dy: 0 };
              return (
                <li
                  key={item}
                  ref={(node) => {
                    chipRefs.current[starIndex * STARS[0].items.length + itemIndex] = node;
                  }}
                  className="text-pale bg-void/50 absolute rounded-full border border-white/15 px-3.5 py-1.5 text-xs whitespace-nowrap backdrop-blur-sm"
                  style={{
                    left: offset.dx,
                    top: offset.dy,
                    transform: starIndex === 0 ? "translate(-100%, -50%)" : "translate(0, -50%)",
                  }}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {/* モバイル: 吹き出しは恒星の近くに折り返して並べる */}
      <ul className="absolute inset-x-4 top-[12%] mt-28 flex flex-wrap justify-center gap-2 md:hidden">
        {STARS[0].items.map((item) => (
          <li
            key={item}
            className="text-pale bg-void/50 rounded-full border border-white/15 px-3.5 py-1.5 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <ul className="absolute inset-x-4 bottom-[16%] mb-16 flex flex-wrap justify-center gap-2 md:hidden">
        {STARS[1].items.map((item) => (
          <li
            key={item}
            className="text-pale bg-void/50 rounded-full border border-white/15 px-3.5 py-1.5 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
