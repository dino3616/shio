import { useEffect, useRef } from "react";
import { mulberry32 } from "~/lib/random";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";

/**
 * できること: DESIGN と ENGINEERING のふたつの惑星。
 * - 各惑星の周りにスキルの吹き出し(DOM。canvas がリード線を描いて惑星とつなぐ)
 * - 惑星の外縁から粒子が渦を巻きながら剥がれ、ふたつの惑星の中間へ流れていく
 * - 中間で粒子が不定形にうねる輪郭に合流し、「かたち」の外枠を作る
 *   (Design ∩ Engineering から生まれるもの。テキストは載せない)
 */

type PlanetConfig = {
  title: string;
  /** 惑星中心の位置クラス(モバイル: 縦積み / md+: 左右) */
  position: string;
  sphere: string;
  ring: string;
  glow: string;
  colors: string[];
  items: string[];
  /** md+ での吹き出しオフセット(惑星中心からの px)。左惑星は右端、右惑星は左端が基準 */
  chipOffsets: { dx: number; dy: number }[];
};

const PLANETS: [PlanetConfig, PlanetConfig] = [
  {
    title: "DESIGN",
    position: "left-1/2 top-[13%] md:left-[22%] md:top-[42%]",
    sphere: "radial-gradient(circle at 32% 28%, #ffe3f1, #f2549e 58%, #47163a 100%)",
    ring: "border-pink/40",
    glow: "0 0 44px rgba(242, 84, 158, 0.4)",
    colors: ["#f2c4dc", "#f2549e", "#ffd9ec"],
    items: ["UIデザイン", "グラフィックデザイン", "モーションデザイン", "世界観の設計"],
    chipOffsets: [
      { dx: -64, dy: -78 },
      { dx: -80, dy: -18 },
      { dx: -64, dy: 42 },
      { dx: -36, dy: 96 },
    ],
  },
  {
    title: "ENGINEERING",
    position: "left-1/2 top-[87%] md:left-[78%] md:top-[58%]",
    sphere: "radial-gradient(circle at 32% 28%, #eef9ff, #a6d3ea 58%, #16304d 100%)",
    ring: "border-ice/40",
    glow: "0 0 44px rgba(166, 211, 234, 0.4)",
    colors: ["#a6d3ea", "#c4a8f8", "#dff1ff"],
    items: ["Webフロントエンド", "WebGL / シェーダー", "アクセシビリティ", "Web標準"],
    chipOffsets: [
      { dx: 64, dy: -78 },
      { dx: 80, dy: -18 },
      { dx: 64, dy: 42 },
      { dx: 36, dy: 96 },
    ],
  },
];

const PARTICLES_PER_PLANET = 110;
const TAU = Math.PI * 2;

type Circle = { x: number; y: number; r: number };
type LeaderLine = { x1: number; y1: number; x2: number; y2: number };

type Particle = {
  planet: 0 | 1;
  mode: "travel" | "blob";
  /** travel: 惑星から中間までの進行度 0..1 */
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

export const SkillPlanets = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (container === null || canvas === null || context === null || context === undefined) {
      return;
    }

    let dpr = 1;
    let planets: [Circle, Circle] = [
      { x: 0, y: 0, r: 40 },
      { x: 0, y: 0, r: 40 },
    ];
    let blob: Circle = { x: 0, y: 0, r: 56 };
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
      for (const element of planetRefs.current) {
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
      planets = [first, second];
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      blob = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
        r: Math.min(Math.max(distance * 0.13, 44), 72),
      };

      // 吹き出しから惑星へのリード線(吹き出しの縁 → 惑星の縁の少し手前)
      leaderLines = [];
      for (const [index, element] of chipRefs.current.entries()) {
        if (element === null) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        if (rect.width === 0) {
          continue;
        }
        const planet = planets[index < PLANETS[0].items.length ? 0 : 1];
        const cx = rect.left + rect.width / 2 - canvasRect.left;
        const cy = rect.top + rect.height / 2 - canvasRect.top;
        const dx = planet.x - cx;
        const dy = planet.y - cy;
        const length = Math.hypot(dx, dy);
        if (length < planet.r + 12) {
          continue;
        }
        const exit = Math.min(
          dx === 0 ? Number.POSITIVE_INFINITY : (rect.width / 2 + 3) / Math.abs(dx / length),
          dy === 0 ? Number.POSITIVE_INFINITY : (rect.height / 2 + 3) / Math.abs(dy / length),
        );
        leaderLines.push({
          x1: cx + (dx / length) * exit,
          y1: cy + (dy / length) * exit,
          x2: planet.x - (dx / length) * (planet.r + 5),
          y2: planet.y - (dy / length) * (planet.r + 5),
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
      const palette = PLANETS[particle.planet].colors;
      particle.color = palette[Math.floor(random() * palette.length)] ?? "#f7f2fa";
    };

    const particles: Particle[] = [];
    for (let index = 0; index < PARTICLES_PER_PLANET * 2; index++) {
      const particle: Particle = {
        planet: index < PARTICLES_PER_PLANET ? 0 : 1,
        mode: "travel",
        s: 0,
        speed: 0,
        theta0: 0,
        spins: 0,
        // 渦の向きは惑星ごとに統一する。中央の輪郭上では互いに逆行して交わる
        dir: index < PARTICLES_PER_PLANET ? 1 : -1,
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
      const planet = planets[particle.planet];
      if (particle.mode === "travel") {
        particle.s += dt * particle.speed;
        if (particle.s >= 1) {
          particle.mode = "blob";
          particle.thetaB = Math.atan2(particle.y - blob.y, particle.x - blob.x);
          particle.life = particle.maxLife;
        }
        const eased = smoothstep(Math.min(particle.s, 1));
        const centerX = lerp(planet.x, blob.x, eased);
        const centerY = lerp(planet.y, blob.y, eased);
        const angle = particle.theta0 + particle.dir * particle.spins * TAU * particle.s;
        // 外縁から出発し、いったん膨らんでから輪郭の半径に収束する渦
        const offset =
          lerp(planet.r, blob.r, particle.s) + Math.sin(Math.PI * particle.s) * planet.r * 0.45;
        particle.x = centerX + Math.cos(angle) * offset;
        particle.y = centerY + Math.sin(angle) * offset;
        return Math.min(particle.s * 8, 1);
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
      return Math.min(particle.life / (particle.maxLife * 0.25), 1);
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
          const maxTrail = 14;
          if (trailLength > maxTrail) {
            particle.tx = particle.x - (trailX / trailLength) * maxTrail;
            particle.ty = particle.y - (trailY / trailLength) * maxTrail;
          }
        }
        context.globalAlpha = alpha;
        context.strokeStyle = particle.color;
        context.fillStyle = particle.color;
        context.lineWidth = particle.mode === "blob" ? 2.2 : 1.6;
        context.beginPath();
        context.moveTo(particle.tx, particle.ty);
        context.lineTo(particle.x, particle.y);
        context.stroke();
        context.beginPath();
        context.arc(particle.x, particle.y, particle.mode === "blob" ? 1.8 : 1.4, 0, TAU);
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
    <div ref={containerRef} className="relative h-[34rem] md:h-[27rem]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        role="presentation"
      />
      {PLANETS.map((planet, planetIndex) => (
        <div key={planet.title} className={`absolute h-0 w-0 ${planet.position}`}>
          {/* 環(惑星の背面) */}
          <div
            className={`absolute top-1/2 left-1/2 h-12 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border md:h-14 md:w-48 ${planet.ring}`}
            style={{ rotate: planetIndex === 0 ? "-16deg" : "14deg" }}
            aria-hidden="true"
          />
          {/* 惑星本体 */}
          <div
            ref={(node) => {
              planetRefs.current[planetIndex] = node;
            }}
            className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-24 md:w-24"
            style={{ background: planet.sphere, boxShadow: planet.glow }}
          />
          <p className="font-mono text-star/70 absolute top-14 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] whitespace-nowrap md:top-16">
            {planet.title}
          </p>
          {/* md+: 惑星の周りに散らす吹き出し */}
          <ul className="hidden md:block">
            {planet.items.map((item, itemIndex) => {
              const offset = planet.chipOffsets[itemIndex] ?? { dx: 0, dy: 0 };
              return (
                <li
                  key={item}
                  ref={(node) => {
                    chipRefs.current[planetIndex * PLANETS[0].items.length + itemIndex] = node;
                  }}
                  className="text-pale bg-void/50 absolute rounded-full border border-white/15 px-3.5 py-1.5 text-xs whitespace-nowrap backdrop-blur-sm"
                  style={{
                    left: offset.dx,
                    top: offset.dy,
                    transform: planetIndex === 0 ? "translate(-100%, -50%)" : "translate(0, -50%)",
                  }}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {/* モバイル: 吹き出しは惑星の近くに折り返して並べる */}
      <ul className="absolute inset-x-4 top-[13%] mt-24 flex flex-wrap justify-center gap-2 md:hidden">
        {PLANETS[0].items.map((item) => (
          <li
            key={item}
            className="text-pale bg-void/50 rounded-full border border-white/15 px-3.5 py-1.5 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <ul className="absolute inset-x-4 bottom-[13%] mb-14 flex flex-wrap justify-center gap-2 md:hidden">
        {PLANETS[1].items.map((item) => (
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
