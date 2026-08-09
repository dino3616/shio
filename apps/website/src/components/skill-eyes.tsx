import { useEffect, useRef } from "react";
import { acquirePointer, getPointer } from "~/lib/pointer";
import { mulberry32 } from "~/lib/random";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";

/**
 * できること: img11(ムードボード)の構図を再解釈した、二体の巨大プランクトンエイリアン。
 * - 左= DESIGN(ピンク)、右= ENGINEERING(ブルー)。不定形の半透明ボディがうねり続ける
 * - それぞれの単眼の瞳孔は宇宙(星が瞬き、視線と一緒に動く)
 * - ふたつの瞳の狭間で、ピンクとブルーの小さなふたりが寄り添う=「かたち」
 * - 目はカーソルを追い、不定期にまばたきする
 * - 全部 Canvas 2D の手続き描画。イラスト素材は使わない
 */

type AlienConfig = {
  title: string;
  tint: string;
  soft: string;
  deep: string;
  sclera: string;
  items: string[];
  /** シーン仮想座標(1000x520)でのボディ中心 */
  cx: number;
  cy: number;
  rotation: number;
};

const ALIENS: [AlienConfig, AlienConfig] = [
  {
    title: "DESIGN",
    tint: "#f2549e",
    soft: "#f2c4dc",
    deep: "#b3457e",
    sclera: "#f6ecf3",
    items: ["UIデザイン", "グラフィックデザイン", "モーションデザイン", "世界観の設計"],
    cx: 380,
    cy: 248,
    rotation: 0.06,
  },
  {
    title: "ENGINEERING",
    tint: "#6ea3d6",
    soft: "#a6d3ea",
    deep: "#49759e",
    sclera: "#edf3f9",
    items: ["Webフロントエンド", "WebGL / シェーダー", "アクセシビリティ", "Web標準"],
    cx: 620,
    cy: 266,
    rotation: -0.06,
  },
];

// 仮想シーン(幅1000 x 高さ520)。実描画時に scale される
const SCENE_W = 1000;
const SCENE_H = 520;
/** ボディ最外層の基準半径 */
const BODY_R = 195;
const SCLERA_R = 110;
const PUPIL_R = 86;

const TAU = Math.PI * 2;

const SPARKLE_COLORS = ["#f2e85c", "#f2c4dc", "#a6d3ea", "#c4a8f8"];

type PupilStar = { x: number; y: number; r: number; speed: number; phase: number };
type PupilSparkle = { x: number; y: number; size: number; color: string; phase: number };

type Blink = { next: number; start: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 不定形にうねる輪郭 */
const wobblyRadius = (base: number, theta: number, t: number, phase: number) =>
  base *
  (1 +
    0.1 * Math.sin(3 * theta + t * 0.8 + phase) +
    0.06 * Math.sin(5 * theta - t * 0.6 + phase * 2) +
    0.035 * Math.sin(7 * theta + t * 1.1 + phase));

/** 小さなふたりのうねる輪郭(ボディより速くうねる) */
const creatureRadius = (base: number, theta: number, t: number, phase: number) =>
  base *
  (1 +
    0.13 * Math.sin(3 * theta + t * 1.1 + phase) +
    0.08 * Math.sin(5 * theta - t * 0.8 + phase * 2));

export const SkillEyes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (container === null || canvas === null || context === null || context === undefined) {
      return;
    }

    const random = mulberry32(1103);

    // 瞳孔の宇宙(瞳孔中心からの相対座標。視線と一緒に動く)
    const buildUniverse = () => {
      const stars: PupilStar[] = [];
      for (let index = 0; index < 40; index++) {
        const angle = random() * TAU;
        const distance = Math.sqrt(random()) * 0.92;
        stars.push({
          x: Math.cos(angle) * distance * PUPIL_R,
          y: Math.sin(angle) * distance * PUPIL_R,
          r: 0.6 + random() * 1.1,
          speed: 0.6 + random() * 1.8,
          phase: random() * TAU,
        });
      }
      const sparkles: PupilSparkle[] = [];
      for (let index = 0; index < 5; index++) {
        const angle = random() * TAU;
        const distance = (0.3 + random() * 0.6) * PUPIL_R;
        sparkles.push({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 5 + random() * 5,
          color: SPARKLE_COLORS[Math.floor(random() * SPARKLE_COLORS.length)] ?? "#f2e85c",
          phase: random() * TAU,
        });
      }
      return { stars, sparkles };
    };
    const universes = [buildUniverse(), buildUniverse()] as const;

    let dpr = 1;
    let scale = 1;
    let originX = 0;
    let originY = 0;
    let leaderLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

    const toCanvas = (vx: number, vy: number) => ({
      x: originX + vx * scale,
      y: originY + vy * scale,
    });

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio, 2);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      scale = Math.min(rect.width / SCENE_W, rect.height / (SCENE_H + 30));
      originX = (rect.width - SCENE_W * scale) / 2;
      originY = (rect.height - SCENE_H * scale) / 2;

      // ボディの外縁へ吹き出しのリード線を向ける
      const leaderTargets = [
        toCanvas(ALIENS[0].cx - BODY_R - 6, ALIENS[0].cy),
        toCanvas(ALIENS[1].cx + BODY_R + 6, ALIENS[1].cy),
      ];
      leaderLines = [];
      for (const [index, element] of chipRefs.current.entries()) {
        if (element === null) {
          continue;
        }
        const chipRect = element.getBoundingClientRect();
        if (chipRect.width === 0) {
          continue;
        }
        const side = index < ALIENS[0].items.length ? 0 : 1;
        const target = leaderTargets[side];
        if (target === undefined) {
          continue;
        }
        const cx = chipRect.left + chipRect.width / 2 - rect.left;
        const cy = chipRect.top + chipRect.height / 2 - rect.top;
        const dx = target.x - cx;
        const dy = target.y - cy;
        const length = Math.hypot(dx, dy);
        if (length < 30) {
          continue;
        }
        const exit = Math.min(
          dx === 0 ? Number.POSITIVE_INFINITY : (chipRect.width / 2 + 3) / Math.abs(dx / length),
          dy === 0 ? Number.POSITIVE_INFINITY : (chipRect.height / 2 + 3) / Math.abs(dy / length),
        );
        leaderLines.push({
          x1: cx + (dx / length) * exit,
          y1: cy + (dy / length) * exit,
          x2: target.x - (dx / length) * 10,
          y2: target.y - (dy / length) * 10,
        });
      }
    };

    // 視線とまばたきの状態
    const gaze: { x: number; y: number }[] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    const blinks: Blink[] = [
      { next: 2.2, start: Number.NEGATIVE_INFINITY },
      { next: 4.1, start: Number.NEGATIVE_INFINITY },
    ];

    const blinkScale = (blink: Blink, t: number) => {
      const duration = 0.26;
      if (t >= blink.next) {
        blink.start = t;
        blink.next = t + 2.8 + random() * 5;
      }
      const progress = (t - blink.start) / duration;
      if (progress < 0 || progress > 1) {
        return 1;
      }
      return 1 - Math.sin(progress * Math.PI) * 0.93;
    };

    const drawSparkle = (x: number, y: number, size: number, color: string, alpha: number) => {
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(x, y - size);
      context.lineTo(x + size * 0.26, y - size * 0.26);
      context.lineTo(x + size, y);
      context.lineTo(x + size * 0.26, y + size * 0.26);
      context.lineTo(x, y + size);
      context.lineTo(x - size * 0.26, y + size * 0.26);
      context.lineTo(x - size, y);
      context.lineTo(x - size * 0.26, y - size * 0.26);
      context.closePath();
      context.fill();
      context.globalAlpha = 1;
    };

    const traceWobbly = (radius: number, t: number, phase: number, fn = wobblyRadius) => {
      context.beginPath();
      const segments = 64;
      for (let index = 0; index <= segments; index++) {
        const theta = (index / segments) * TAU;
        const r = fn(radius, theta, t, phase);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.closePath();
    };

    /** ボディの浮遊と揺らぎ(ボディと目で同じ変換を共有する) */
    const applyAlienTransform = (side: 0 | 1, t: number) => {
      const alien = ALIENS[side];
      const bob = Math.sin(t * 0.5 + side * 2.1) * 9;
      context.translate(alien.cx, alien.cy + bob);
      context.rotate(alien.rotation + Math.sin(t * 0.3 + side * 1.4) * 0.02);
    };

    /** ボディ: 外側ほど淡い多層の不定形。層ごとに位相をずらしてうねらせる */
    const drawAlienBody = (side: 0 | 1, t: number) => {
      const alien = ALIENS[side];
      context.save();
      applyAlienTransform(side, t);
      const layers = [
        { radius: BODY_R, color: alien.soft, alpha: 0.12, phase: 0.4 + side * 3 },
        { radius: BODY_R * 0.82, color: alien.tint, alpha: 0.13, phase: 1.9 + side * 3 },
        { radius: BODY_R * 0.66, color: alien.soft, alpha: 0.2, phase: 3.6 + side * 3 },
      ];
      for (const layer of layers) {
        traceWobbly(layer.radius, t * 0.8, layer.phase);
        context.globalAlpha = layer.alpha;
        context.fillStyle = layer.color;
        context.fill();
      }
      context.globalAlpha = 1;
      context.restore();
    };

    /** 単眼: 白目+宇宙の瞳孔。ボディの重なりに濁らないよう後から描く */
    const drawAlienEye = (side: 0 | 1, t: number) => {
      const alien = ALIENS[side];
      context.save();
      applyAlienTransform(side, t);

      // まばたきで縦に潰れる
      context.scale(1, blinkScale(blinks[side] ?? { next: 0, start: 0 }, t));

      // 白目
      context.beginPath();
      context.arc(0, 0, SCLERA_R, 0, TAU);
      context.fillStyle = alien.sclera;
      context.fill();
      context.strokeStyle = alien.deep;
      context.globalAlpha = 0.55;
      context.lineWidth = 3;
      context.stroke();
      context.globalAlpha = 1;

      // 瞳孔=宇宙(視線ぶんだけ動く)
      const gazeOffset = gaze[side] ?? { x: 0, y: 0 };
      const px = gazeOffset.x;
      const py = gazeOffset.y;
      context.beginPath();
      context.arc(px, py, PUPIL_R, 0, TAU);
      context.fillStyle = "#0a0714";
      context.fill();
      context.strokeStyle = alien.soft;
      context.globalAlpha = 0.55;
      context.lineWidth = 2;
      context.stroke();
      context.globalAlpha = 1;
      // 上側のハイライト弧
      context.beginPath();
      context.arc(px, py, PUPIL_R - 7, -2.4, -1.2);
      context.strokeStyle = "rgba(255, 255, 255, 0.75)";
      context.lineWidth = 3;
      context.lineCap = "round";
      context.stroke();

      // 宇宙: 星の瞬き+きらめき(瞳孔中心と一緒に動く)
      context.save();
      context.beginPath();
      context.arc(px, py, PUPIL_R - 2, 0, TAU);
      context.clip();
      const universe = universes[side];
      for (const star of universe.stars) {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
        context.globalAlpha = twinkle;
        context.fillStyle = "#f7f2fa";
        context.beginPath();
        context.arc(px + star.x, py + star.y, star.r, 0, TAU);
        context.fill();
      }
      context.globalAlpha = 1;
      for (const sparkle of universe.sparkles) {
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.9 + sparkle.phase);
        drawSparkle(
          px + sparkle.x,
          py + sparkle.y,
          sparkle.size * (0.8 + 0.2 * pulse),
          sparkle.color,
          pulse,
        );
      }
      context.restore();

      context.restore();

      // ラベル
      const labelPosition = toCanvas(alien.cx, alien.cy + BODY_R + 40);
      context.save();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "center";
      context.fillStyle = "rgba(247, 242, 250, 0.7)";
      context.fillText(alien.title.split("").join(" "), labelPosition.x, labelPosition.y);
      context.restore();
      context.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * originX, dpr * originY);
    };

    /** ふたつの瞳の狭間で寄り添うふたり */
    const drawPair = (t: number) => {
      const bobY = Math.sin(t * 0.85) * 6;
      const sway = Math.sin(t * 0.5) * 0.05;
      context.save();
      context.translate(500, 262 + bobY);
      context.rotate(sway);

      const bodies = [
        {
          x: -22,
          y: 0,
          r: 30,
          lean: 0.22,
          color: ALIENS[0].soft,
          accent: ALIENS[0].tint,
          phase: 0.4,
        },
        {
          x: 24,
          y: 6,
          r: 26,
          lean: -0.24,
          color: ALIENS[1].soft,
          accent: ALIENS[1].tint,
          phase: 2.6,
        },
      ];

      // 腕(相手を抱く曲線)を先に描く
      context.lineCap = "round";
      for (const body of bodies) {
        const partner = body === bodies[0] ? bodies[1] : bodies[0];
        if (partner === undefined) {
          continue;
        }
        context.beginPath();
        context.moveTo(body.x, body.y + body.r * 0.5);
        context.quadraticCurveTo(
          (body.x + partner.x) / 2,
          Math.max(body.y, partner.y) + 26,
          partner.x + (partner.x > body.x ? 10 : -10),
          partner.y + partner.r * 0.55,
        );
        context.strokeStyle = body.color;
        context.globalAlpha = 0.9;
        context.lineWidth = 8;
        context.stroke();
      }
      context.globalAlpha = 1;

      for (const body of bodies) {
        context.save();
        context.translate(body.x, body.y);
        context.rotate(body.lean);
        for (const [layerScale, alpha] of [
          [1.35, 0.22],
          [1, 0.92],
        ] as const) {
          context.beginPath();
          const segments = 40;
          for (let index = 0; index <= segments; index++) {
            const theta = (index / segments) * TAU;
            const radius = creatureRadius(body.r * layerScale, theta, t, body.phase);
            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;
            if (index === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
          }
          context.closePath();
          context.globalAlpha = alpha;
          context.fillStyle = body.color;
          context.fill();
        }
        context.globalAlpha = 1;
        // 目(相手の方を見る)
        const lookX = body.x < 0 ? 7 : -7;
        context.beginPath();
        context.arc(lookX, -4, 8, 0, TAU);
        context.fillStyle = "#ffffff";
        context.fill();
        context.beginPath();
        context.arc(lookX + (body.x < 0 ? 2 : -2), -3, 4, 0, TAU);
        context.fillStyle = "#201a2e";
        context.fill();
        context.beginPath();
        context.arc(lookX + (body.x < 0 ? 3.4 : -0.6), -4.4, 1.4, 0, TAU);
        context.fillStyle = "#ffffff";
        context.fill();
        // ほっぺ
        context.beginPath();
        context.arc(lookX + (body.x < 0 ? -9 : 9), 3, 3.4, 0, TAU);
        context.fillStyle = body.accent;
        context.globalAlpha = 0.5;
        context.fill();
        context.globalAlpha = 1;
        context.restore();
      }

      // ふたりの周りのきらめき
      for (let index = 0; index < 4; index++) {
        const angle = t * 0.25 + (index / 4) * TAU;
        const distance = 62 + Math.sin(t * 0.7 + index * 2) * 8;
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + index * 1.7));
        drawSparkle(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance * 0.7,
          4 + pulse * 3,
          SPARKLE_COLORS[index] ?? "#f2e85c",
          pulse * 0.9,
        );
      }
      context.restore();
    };

    const render = (dt: number, t: number) => {
      const rect = { width: canvas.width / dpr, height: canvas.height / dpr };
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      // 視線を更新(カーソル方向へ最大14px、なめらかに追従)
      const pointer = getPointer();
      const canvasRect = canvas.getBoundingClientRect();
      for (const side of [0, 1] as const) {
        const alien = ALIENS[side];
        const target = { x: 0, y: 0 };
        if (pointer !== null) {
          const center = toCanvas(alien.cx, alien.cy);
          const dx = pointer.x - canvasRect.left - center.x;
          const dy = pointer.y - canvasRect.top - center.y;
          const length = Math.hypot(dx, dy);
          if (length > 1) {
            const reach = Math.min(length / 22, 14);
            target.x = (dx / length) * reach;
            target.y = (dy / length) * reach;
          }
        }
        const state = gaze[side] ?? { x: 0, y: 0 };
        const follow = dt > 0 ? Math.min(1, dt * 5.5) : 1;
        state.x = lerp(state.x, target.x, follow);
        state.y = lerp(state.y, target.y, follow);
      }

      // 吹き出しのリード線
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

      // 仮想シーン座標へ
      context.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * originX, dpr * originY);

      drawAlienBody(0, t);
      drawAlienBody(1, t);
      drawAlienEye(0, t);
      drawAlienEye(1, t);
      drawPair(t);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    void document.fonts.ready.then(measure);

    if (prefersReducedMotion()) {
      render(0, 0);
      return () => {
        observer.disconnect();
      };
    }

    const releasePointer = acquirePointer();
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
      releasePointer();
      if (stopFrame !== null) {
        stopFrame();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[30rem] md:h-[34rem]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        role="presentation"
      />
      {/* md+: 吹き出しは左右の縁に寄せ、リード線でボディとつなぐ */}
      {ALIENS.map((alien, alienIndex) => (
        <ul
          key={alien.title}
          className={`absolute top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex ${
            alienIndex === 0 ? "left-2 items-start" : "right-2 items-end"
          }`}
        >
          {alien.items.map((item, itemIndex) => (
            <li
              key={item}
              ref={(node) => {
                chipRefs.current[alienIndex * ALIENS[0].items.length + itemIndex] = node;
              }}
              className="text-pale bg-void/50 rounded-full border border-white/15 px-3.5 py-1.5 text-xs whitespace-nowrap backdrop-blur-sm"
              style={{
                marginLeft: alienIndex === 0 ? itemIndex * 6 : 0,
                marginRight: alienIndex === 1 ? itemIndex * 6 : 0,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      ))}
      {/* モバイル: 上下に折り返して並べる */}
      <ul className="absolute inset-x-2 top-0 flex flex-wrap justify-center gap-2 md:hidden">
        {ALIENS[0].items.map((item) => (
          <li
            key={item}
            className="text-pale bg-void/50 rounded-full border border-white/15 px-3 py-1 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <ul className="absolute inset-x-2 bottom-0 flex flex-wrap justify-center gap-2 md:hidden">
        {ALIENS[1].items.map((item) => (
          <li
            key={item}
            className="text-pale bg-void/50 rounded-full border border-white/15 px-3 py-1 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
