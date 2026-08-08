import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { acquirePointer, getPointer } from "~/lib/pointer";
import { mulberry32 } from "~/lib/random";
import { type Frame, prefersReducedMotion, subscribeFrame } from "~/lib/ticker";

/**
 * 宇宙プランクトン(moodboard img26)。
 * ボイド(群れの理論)で泳ぐ: 分離・整列・結合の3規則に、出口方向への
 * 弱い回遊力を足して駆動する。群れと別に画面外から入ってきたはぐれ個体も、
 * 群れの近くを通ると結合・整列規則で自然に合流し、一緒に画面外へ出ていく。
 * - 輪郭: 調和級数ブロブを SMIL の d モーフで絶えずウニョウニョ蠕動させる
 * - 目玉: 全個体が常にカーソルの方向を見る
 * シミュレーションは共有 ticker が駆動し、個体がゼロのあいだは購読を外して止める
 */

type Vec = { x: number; y: number };

type PlanktonSpec = {
  id: number;
  seed: number;
  size: number;
  hueShift: number;
  opacity: number;
  blur: number;
};

/** 回遊イベントの舞台(スポーン時のビューポートをドキュメント座標で切り取った矩形) */
type Region = { left: number; right: number; top: number; bottom: number };

type Agent = {
  spec: PlanktonSpec;
  /** ドキュメント座標。スクロールしても画面に追従せず、ページに留まる */
  pos: Vec;
  vel: Vec;
  /** 回遊の目標方向(単位ベクトル)。群れ全体をゆるく出口へ導く */
  migration: Vec;
  region: Region;
  phase: number;
  spawnedAt: number;
};

// ボイドのパラメータ(px/s 系)
const NEIGHBOR_RADIUS = 280;
const MIN_SPEED = 24;
const MAX_SPEED = 80;
const WEIGHTS = {
  separation: 95,
  alignment: 34,
  cohesion: 30,
  migration: 20,
  wander: 11,
};
const SPAWN_MARGIN = 220;
const REMOVE_MARGIN = 320;

/**
 * 不定形ブロブの輪郭。同じ調和級数の位相をずらした5変種を SMIL の
 * d モーフで巡回させ、絶えずウニョウニョと蠕動し続けるようにする
 */
const createBlobVariants = (rand: () => number, radius: number, wobble: number): string[] => {
  const harmonics = Array.from({ length: 5 }, (_, i) => ({
    k: i + 2,
    amp: (wobble * (0.5 + rand() * 0.9)) / (i * 0.6 + 1),
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
  return [variant(0), variant(1.3), variant(2.6), variant(3.9), variant(5.2)];
};

// まつ毛: 目の上側から放射状に生える短い線(img26 の記号的なかわいさ)
const LASHES = [-2.35, -2.0, -1.65, -1.3, -0.95].map((angle) => ({
  x1: 100 + Math.cos(angle) * 20,
  y1: 100 + Math.sin(angle) * 20,
  x2: 100 + Math.cos(angle) * 27,
  y2: 100 + Math.sin(angle) * 27,
}));

type PlanktonNodes = { root: HTMLDivElement; pupil: SVGGElement };

const Plankton = ({
  spec,
  register,
}: {
  spec: PlanktonSpec;
  register: (id: number, nodes: PlanktonNodes | null) => void;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGGElement>(null);

  const shapes = useMemo(() => {
    const rand = mulberry32(spec.seed);
    return {
      outer: createBlobVariants(rand, 88, 0.15),
      mid: createBlobVariants(rand, 60, 0.13),
      inner: createBlobVariants(rand, 36, 0.1),
      morphDur: 4.5 + rand() * 3,
    };
  }, [spec.seed]);

  useEffect(() => {
    if (rootRef.current !== null && pupilRef.current !== null) {
      register(spec.id, { root: rootRef.current, pupil: pupilRef.current });
    }
    return () => {
      register(spec.id, null);
    };
  }, [spec.id, register]);

  const gradientId = (layer: string) => `plankton-${spec.id}-${layer}`;
  const morph = (variants: string[]) => (
    <animate
      attributeName="d"
      values={`${variants.join(";")};${variants[0]}`}
      dur={`${shapes.morphDur.toFixed(1)}s`}
      repeatCount="indefinite"
    />
  );

  return (
    <div
      ref={rootRef}
      className="absolute top-0 left-0 will-change-transform"
      style={{
        width: spec.size,
        height: spec.size,
        opacity: spec.opacity,
        filter: `drop-shadow(0 0 18px rgba(242, 132, 190, 0.3)) hue-rotate(${spec.hueShift}deg) blur(${spec.blur}px)`,
        transform: `translate(${-spec.size}px, ${-spec.size}px)`,
      }}
    >
      {/* モーフのピークで輪郭が viewBox を超えることがあるのでクリップしない */}
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="overflow-visible"
        role="presentation"
      >
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

        {/* 目玉: 瞳は常にカーソル方向を見る(親のシミュレーションが駆動) */}
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

const normalize = (x: number, y: number): Vec => {
  const length = Math.hypot(x, y);
  return length < 1e-5 ? { x: 0, y: 0 } : { x: x / length, y: y / length };
};

const rotate = (v: Vec, angle: number): Vec => ({
  x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
  y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
});

/** region 内の origin から direction 方向に進んで region の境界に達するまでの距離 */
const distanceToEdge = (origin: Vec, direction: Vec, region: Region): number => {
  let t = Number.POSITIVE_INFINITY;
  if (direction.x > 1e-6) {
    t = Math.min(t, (region.right - origin.x) / direction.x);
  }
  if (direction.x < -1e-6) {
    t = Math.min(t, (region.left - origin.x) / direction.x);
  }
  if (direction.y > 1e-6) {
    t = Math.min(t, (region.bottom - origin.y) / direction.y);
  }
  if (direction.y < -1e-6) {
    t = Math.min(t, (region.top - origin.y) / direction.y);
  }
  return Number.isFinite(t)
    ? t
    : Math.hypot(region.right - region.left, region.bottom - region.top);
};

export const SpacePlankton = () => {
  const [specs, setSpecs] = useState<PlanktonSpec[]>([]);
  const agentsRef = useRef<Agent[]>([]);
  const nodesRef = useRef(new Map<number, PlanktonNodes>());

  const register = useCallback((id: number, nodes: PlanktonNodes | null) => {
    if (nodes === null) {
      nodesRef.current.delete(id);
    } else {
      nodesRef.current.set(id, nodes);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    // 目玉の注視に使うカーソル位置は共有ストアから毎フレーム読む
    const releasePointer = acquirePointer();

    let nextId = 1;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const spawn = (pos: Vec, vel: Vec, migration: Vec, region: Region) => {
      const spec: PlanktonSpec = {
        id: nextId++,
        seed: Math.floor(Math.random() * 2 ** 31),
        size: 110 + Math.random() * 120,
        hueShift: -20 + Math.random() * 70,
        opacity: 0.65 + Math.random() * 0.3,
        blur: Math.random() * 1.4,
      };
      agentsRef.current.push({
        spec,
        pos,
        vel,
        migration,
        region,
        phase: Math.random() * Math.PI * 2,
        spawnedAt: performance.now(),
      });
      setSpecs((prev) => [...prev, spec]);
      ensureRunning();
    };

    /**
     * 目標地点に incoming 方向で入ってくるよう、region の外側に配置してスポーンする。
     * 方向は自由(全方位)で、入場位置は目標から逆算する
     */
    const spawnToward = (
      target: Vec,
      incoming: Vec,
      speed: number,
      migration: Vec,
      region: Region,
    ) => {
      const back = { x: -incoming.x, y: -incoming.y };
      const entryDistance = distanceToEdge(target, back, region) + SPAWN_MARGIN;
      spawn(
        { x: target.x - incoming.x * entryDistance, y: target.y - incoming.y * entryDistance },
        { x: incoming.x * speed, y: incoming.y * speed },
        migration,
        region,
      );
    };

    // 回遊イベント: 群れ本体が上流の画面外から流れてきて、途中で別方向から
    // 入ってきたはぐれ個体が合流し、全員で下流の画面外へ出ていく。
    // 回遊方向は毎回ランダム(横断・縦断・斜めのどれもあり得る)
    const spawnMigration = () => {
      // 非表示タブでは rAF(移動・退場)が止まる一方タイマーは動き続けるので、
      // スポーンを見送らないと復帰時に画面が群れで溢れる。
      // rAF だけ止まる環境(スロットリング)もあるため総数の上限でも守る
      if (document.hidden || agentsRef.current.length > 10) {
        later(spawnMigration, 15000);
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // 舞台はスポーン時点のビューポート(ドキュメント座標)。スクロールしても
      // 群れはこの矩形の中〜周辺に留まり、画面には追従しない
      const region: Region = {
        left: 0,
        right: vw,
        top: window.scrollY,
        bottom: window.scrollY + vh,
      };
      const angle = Math.random() * Math.PI * 2;
      const migration = { x: Math.cos(angle), y: Math.sin(angle) };
      const perpendicular = { x: -migration.y, y: migration.x };
      // レーンの基準点: 舞台の中央寄りを通るようにして必ず視界を横切らせる
      const anchor = {
        x: vw * (0.3 + Math.random() * 0.4),
        y: region.top + vh * (0.3 + Math.random() * 0.4),
      };

      // 群れ本体: 3〜4体が数秒差で同じレーンに入ってくる
      const schoolCount = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < schoolCount; i++) {
        later(
          () => {
            const lateral = (Math.random() - 0.5) * 300;
            const jitter = rotate(migration, (Math.random() - 0.5) * 0.3);
            spawnToward(
              { x: anchor.x + perpendicular.x * lateral, y: anchor.y + perpendicular.y * lateral },
              jitter,
              40 + Math.random() * 20,
              migration,
              region,
            );
          },
          i * (1300 + Math.random() * 1700),
        );
      }

      // はぐれ個体: 1〜2体が回遊方向から55〜100度ずれた別方向から入ってきて、
      // レーンの少し先で群れと出会い、結合・整列規則で合流する
      const strayCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < strayCount; i++) {
        later(
          () => {
            const side = Math.random() < 0.5 ? 1 : -1;
            const incoming = rotate(migration, side * (0.96 + Math.random() * 0.78));
            const ahead = 100 + Math.random() * 250;
            spawnToward(
              { x: anchor.x + migration.x * ahead, y: anchor.y + migration.y * ahead },
              incoming,
              34 + Math.random() * 16,
              migration,
              region,
            );
          },
          3500 + Math.random() * 8000 + i * 4000,
        );
      }

      later(spawnMigration, 45000 + Math.random() * 30000);
    };
    later(spawnMigration, 5000 + Math.random() * 5000);

    // ボイドシミュレーション本体。個体がいるあいだだけ共有 ticker を購読する
    const step = (frame: Frame) => {
      const agents = agentsRef.current;
      if (agents.length === 0) {
        unsubscribe?.();
        unsubscribe = null;
        return;
      }
      const { now, dt, scrollY } = frame;
      const t = now / 1000;
      // カーソルはビューポート座標なのでスクロール量を足してドキュメント座標に直す
      const pointer = getPointer();
      const pointerDoc = pointer === null ? null : { x: pointer.x, y: pointer.y + scrollY };
      const removed: number[] = [];

      for (const agent of agents) {
        // 近傍の集計(個体数は高々数体なので全対全で十分)
        let separationX = 0;
        let separationY = 0;
        let alignX = 0;
        let alignY = 0;
        let cohesionX = 0;
        let cohesionY = 0;
        let neighborCount = 0;
        for (const other of agents) {
          if (other === agent) {
            continue;
          }
          const dx = other.pos.x - agent.pos.x;
          const dy = other.pos.y - agent.pos.y;
          const distance = Math.hypot(dx, dy);
          if (distance > NEIGHBOR_RADIUS) {
            continue;
          }
          neighborCount++;
          alignX += other.vel.x;
          alignY += other.vel.y;
          cohesionX += dx;
          cohesionY += dy;
          // 分離: 体の大きさに応じた距離を保つ。近いほど強く反発
          const personalSpace = (agent.spec.size + other.spec.size) * 0.55;
          if (distance < personalSpace && distance > 0.01) {
            const strength = 1 - distance / personalSpace;
            separationX -= (dx / distance) * strength;
            separationY -= (dy / distance) * strength;
          }
        }

        // 加速度 = 各規則の単位ベクトル × 重み の合成
        let accelX = agent.migration.x * WEIGHTS.migration;
        let accelY = agent.migration.y * WEIGHTS.migration;
        const wanderAngle = agent.phase + Math.sin(t * 0.35 + agent.phase * 2) * 2.4;
        accelX += Math.cos(wanderAngle) * WEIGHTS.wander;
        accelY += Math.sin(wanderAngle) * WEIGHTS.wander;
        if (neighborCount > 0) {
          const align = normalize(
            alignX / neighborCount - agent.vel.x,
            alignY / neighborCount - agent.vel.y,
          );
          accelX += align.x * WEIGHTS.alignment;
          accelY += align.y * WEIGHTS.alignment;
          const cohesion = normalize(cohesionX / neighborCount, cohesionY / neighborCount);
          accelX += cohesion.x * WEIGHTS.cohesion;
          accelY += cohesion.y * WEIGHTS.cohesion;
          const separation = normalize(separationX, separationY);
          accelX += separation.x * WEIGHTS.separation;
          accelY += separation.y * WEIGHTS.separation;
        }

        agent.vel.x += accelX * dt;
        agent.vel.y += accelY * dt;
        const speed = Math.hypot(agent.vel.x, agent.vel.y);
        const clamped = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
        if (speed > 1e-5 && speed !== clamped) {
          agent.vel.x = (agent.vel.x / speed) * clamped;
          agent.vel.y = (agent.vel.y / speed) * clamped;
        }
        agent.pos.x += agent.vel.x * dt;
        agent.pos.y += agent.vel.y * dt;

        const nodes = nodesRef.current.get(agent.spec.id);
        if (nodes !== undefined) {
          const half = agent.spec.size / 2;
          const rotate = Math.sin(t * 0.9 + agent.phase) * 10;
          nodes.root.style.transform = `translate(${(agent.pos.x - half).toFixed(1)}px, ${(agent.pos.y - half).toFixed(1)}px) rotate(${rotate.toFixed(1)}deg)`;
          // 瞳: 常にカーソルの方を見る(座標が来るまでは中央)
          if (pointerDoc !== null) {
            const dx = pointerDoc.x - agent.pos.x;
            const dy = pointerDoc.y - agent.pos.y;
            const distance = Math.hypot(dx, dy);
            const offset = Math.min(distance / 40, 4.5);
            const direction = normalize(dx, dy);
            nodes.pupil.style.transform = `translate(${(direction.x * offset).toFixed(2)}px, ${(direction.y * offset).toFixed(2)}px)`;
          }
        }

        // 舞台(スポーン時のビューポート矩形)から十分出た個体は退場
        const age = now - agent.spawnedAt;
        const out =
          agent.pos.x < agent.region.left - REMOVE_MARGIN ||
          agent.pos.x > agent.region.right + REMOVE_MARGIN ||
          agent.pos.y < agent.region.top - REMOVE_MARGIN ||
          agent.pos.y > agent.region.bottom + REMOVE_MARGIN;
        // 2分居座っている個体はどこにいても退場させる(タブ非表示中の滞留対策)
        if ((age > 12000 && out) || age > 120000) {
          removed.push(agent.spec.id);
        }
      }

      if (removed.length > 0) {
        agentsRef.current = agents.filter((agent) => !removed.includes(agent.spec.id));
        setSpecs((prev) => prev.filter((spec) => !removed.includes(spec.id)));
      }
    };

    let unsubscribe: (() => void) | null = null;
    const ensureRunning = () => {
      if (unsubscribe === null) {
        unsubscribe = subscribeFrame(step);
      }
    };

    return () => {
      unsubscribe?.();
      releasePointer();
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
      agentsRef.current = [];
    };
  }, []);

  return (
    // ドキュメント全体を覆う絶対配置(fixed だとスクロールに追従してしまう)
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {specs.map((spec) => (
        <Plankton key={spec.id} spec={spec} register={register} />
      ))}
    </div>
  );
};
