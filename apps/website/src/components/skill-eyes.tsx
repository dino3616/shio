import { useEffect, useRef } from "react";
import { createMarbleRenderer } from "~/lib/marble";
import { acquirePointer, getPointer } from "~/lib/pointer";
import { mulberry32 } from "~/lib/random";
import { prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";

/**
 * できること: img11(ムードボード)の構図を再解釈した、二体の巨大プランクトンエイリアン。
 * - 左= DESIGN(ピンク)、右= ENGINEERING(ブルー)。不定形の半透明ボディがうねり続ける
 * - それぞれの単眼の瞳孔は宇宙。Hero と同じマーブルシェーダーが流れ続ける
 * - ふたつの瞳の狭間で、ピンクとブルーの小さなふたりが寄り添う=「かたち」
 * - 瞳はカーソルにほんの少しだけ反応する
 * - イラスト素材は使わず、Canvas 2D +オフスクリーン WebGL の手続き描画
 */

type AlienConfig = {
  title: string;
  tint: string;
  soft: string;
  /** ボディの暗い核の色(Hero の闇に馴染む暗色) */
  core: string;
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
    core: "#3c1832",
    sclera: "#f6ecf3",
    items: ["UIデザイン", "プロトタイピング", "モーションデザイン", "世界観の設計"],
    cx: 380,
    cy: 248,
    rotation: 0.06,
  },
  {
    title: "ENGINEERING",
    tint: "#6ea3d6",
    soft: "#a6d3ea",
    core: "#152840",
    sclera: "#edf3f9",
    items: ["ウェブフロントエンド", "WebGL", "アクセシビリティ", "Agent"],
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
/** 寄り目: 瞳孔を相手側へ寄せる量 */
const PUPIL_BIAS = 17;

const TAU = Math.PI * 2;

// Hero での出現頻度に合わせた、ふたりの周りのきらめきの色
const SPARKLE_COLORS = ["#f2c4dc", "#a6d3ea", "#c4a8f8"];

/** 毛細血管の色(Hero の目玉と同じ「かわいくて、不穏」の言語) */
const CAPILLARY_COLOR = "rgba(216, 79, 116, 0.34)";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const withAlpha = (hex: string, alpha: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

    // 瞳孔の宇宙: Hero と同じマーブルシェーダーをオフスクリーンで描いて転写する。
    // 羽根状のアルファ減衰(輪郭は不定形にうねる)をシェーダー側で焼き込むので、
    // 転写先ではクリップも境界処理も不要になり、外縁は原理的に知覚できない
    const marble = createMarbleRenderer(256, true);

    // 毛細血管: 白目の外縁から瞳孔へ向かって這う細い糸(外側の白目が広い側に多め)
    const buildCapillaries = (side: 0 | 1) => {
      const baseAngle = side === 0 ? Math.PI : 0;
      const strands: { x: number; y: number }[][] = [];
      for (let index = 0; index < 5; index++) {
        const points: { x: number; y: number }[] = [];
        let angle = baseAngle + (random() - 0.5) * 2.6;
        const endRadius = PUPIL_R * (0.95 + random() * 0.15);
        const startRadius = SCLERA_R * 1.02;
        const steps = 5;
        for (let step = 0; step <= steps; step++) {
          const radius = lerp(startRadius, endRadius, step / steps);
          points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
          angle += (random() - 0.5) * 0.11;
        }
        strands.push(points);
      }
      return strands;
    };
    const capillaries = [buildCapillaries(0), buildCapillaries(1)] as const;

    let dpr = 1;
    let scale = 1;
    let originX = 0;
    let originY = 0;
    /** 矢印の始点になる、md+ のスキルチップの矩形(canvas CSS px 座標) */
    let chipRects: { x: number; y: number; w: number; h: number; side: 0 | 1; order: number }[] =
      [];

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

      chipRects = [];
      for (const [index, element] of chipRefs.current.entries()) {
        if (element === null) {
          continue;
        }
        const chipRect = element.getBoundingClientRect();
        if (chipRect.width === 0) {
          continue;
        }
        chipRects.push({
          x: chipRect.left - rect.left,
          y: chipRect.top - rect.top,
          w: chipRect.width,
          h: chipRect.height,
          side: index < ALIENS[0].items.length ? 0 : 1,
          order: index % ALIENS[0].items.length,
        });
      }
    };

    // 視線と視差の状態
    const gaze: { x: number; y: number }[] = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    const parallax = { x: 0, y: 0 };

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

    /**
     * うねる輪郭のパス。elongation > 0 で outward 方向に膨らむ卵形になり、
     * offsetX で中心そのものも外側へずらす(=目が内側に寄って中央を向く姿勢)
     */
    const traceWobbly = (
      radius: number,
      t: number,
      phase: number,
      outward: -1 | 1,
      offsetX: number,
      elongation: number,
    ) => {
      context.beginPath();
      const segments = 64;
      for (let index = 0; index <= segments; index++) {
        const theta = (index / segments) * TAU;
        const r =
          wobblyRadius(radius, theta, t, phase) * (1 + elongation * outward * Math.cos(theta));
        const x = outward * offsetX + Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.closePath();
    };

    /**
     * ボディの浮遊と揺らぎ(ボディと目で同じ変換を共有する)。
     * depth はカーソル視差の係数で、手前の層ほど大きくして奥行きを出す
     */
    const applyAlienTransform = (side: 0 | 1, t: number, depth: number) => {
      const alien = ALIENS[side];
      const bob = Math.sin(t * 0.5 + side * 2.1) * 9;
      context.translate(alien.cx + parallax.x * depth, alien.cy + bob + parallax.y * depth * 0.6);
      context.rotate(alien.rotation + Math.sin(t * 0.3 + side * 1.4) * 0.02);
    };

    /**
     * ボディ: 暗い核から縁へ消えていく霧の膜。均一な塗りではなく
     * 中心が Hero の闇に沈み、縁だけが微かに生体発光する。
     * 外側に重心を寄せて中央を向く姿勢にする
     */
    const drawAlienBody = (side: 0 | 1, t: number) => {
      const alien = ALIENS[side];
      const outward: -1 | 1 = side === 0 ? -1 : 1;
      context.save();
      applyAlienTransform(side, t, 3);
      const layers = [
        {
          radius: BODY_R,
          offset: 60,
          elongation: 0.16,
          coreAlpha: 0.42,
          rimAlpha: 0.12,
          phase: 0.4 + side * 3,
        },
        {
          radius: BODY_R * 0.82,
          offset: 40,
          elongation: 0.13,
          coreAlpha: 0.34,
          rimAlpha: 0.16,
          phase: 1.9 + side * 3,
        },
        {
          radius: BODY_R * 0.66,
          offset: 22,
          elongation: 0.1,
          coreAlpha: 0.3,
          rimAlpha: 0.2,
          phase: 3.6 + side * 3,
        },
      ];
      for (const layer of layers) {
        traceWobbly(layer.radius, t * 0.8, layer.phase, outward, layer.offset, layer.elongation);
        const gradient = context.createRadialGradient(
          outward * layer.offset,
          0,
          layer.radius * 0.12,
          outward * layer.offset,
          0,
          layer.radius * 1.16,
        );
        gradient.addColorStop(0, withAlpha(alien.core, layer.coreAlpha));
        gradient.addColorStop(0.72, withAlpha(alien.tint, 0.09));
        gradient.addColorStop(1, withAlpha(alien.soft, 0));
        context.fillStyle = gradient;
        context.fill();
        // 縁の生体発光ライン
        context.strokeStyle = withAlpha(alien.soft, layer.rimAlpha);
        context.lineWidth = 1.4;
        context.stroke();
      }
      context.restore();
    };

    /** 単眼: 発光する白目の環+宇宙の瞳孔。ボディの重なりに濁らないよう後から描く */
    const drawAlienEye = (side: 0 | 1, t: number) => {
      const alien = ALIENS[side];
      context.save();
      applyAlienTransform(side, t, 6);

      // 白目: ベタ塗りではなく、縁が光の減衰で消えていく発光体
      const scleraGlow = context.createRadialGradient(0, 0, PUPIL_R * 0.6, 0, 0, SCLERA_R * 1.22);
      scleraGlow.addColorStop(0, withAlpha(alien.sclera, 0.92));
      scleraGlow.addColorStop(0.55, withAlpha(alien.sclera, 0.88));
      scleraGlow.addColorStop(0.72, withAlpha(alien.soft, 0.42));
      scleraGlow.addColorStop(1, withAlpha(alien.soft, 0));
      context.beginPath();
      context.arc(0, 0, SCLERA_R * 1.22, 0, TAU);
      context.fillStyle = scleraGlow;
      context.fill();
      // 外周の淡いハロー(加算)
      context.globalCompositeOperation = "lighter";
      const halo = context.createRadialGradient(0, 0, SCLERA_R * 0.9, 0, 0, SCLERA_R * 1.5);
      halo.addColorStop(0, withAlpha(alien.soft, 0.14));
      halo.addColorStop(1, withAlpha(alien.soft, 0));
      context.beginPath();
      context.arc(0, 0, SCLERA_R * 1.5, 0, TAU);
      context.fillStyle = halo;
      context.fill();
      context.globalCompositeOperation = "source-over";

      // 毛細血管(白目の上、瞳孔の下)
      context.strokeStyle = CAPILLARY_COLOR;
      context.lineWidth = 1.1;
      context.lineCap = "round";
      for (const strand of capillaries[side]) {
        context.beginPath();
        for (const [pointIndex, point] of strand.entries()) {
          if (pointIndex === 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        }
        context.stroke();
      }

      // 瞳孔=宇宙。寄り目がデフォルトで、視線ぶんだけ微動する
      const gazeOffset = gaze[side] ?? { x: 0, y: 0 };
      const px = (side === 0 ? PUPIL_BIAS : -PUPIL_BIAS) + gazeOffset.x;
      const py = 4 + gazeOffset.y;

      if (marble !== null) {
        context.save();
        context.translate(px, py);
        // 左右で回転を変えて別の宇宙に見せる
        context.rotate(side === 0 ? 0.4 : Math.PI + 1.1);

        // 白目への滲み出し: 同じ羽根付きスプライトを大きく薄く重ね、
        // 「模様が終わる場所」そのものを無くす
        context.globalCompositeOperation = "soft-light";
        context.globalAlpha = 0.4;
        const bleedSize = PUPIL_R * 4;
        context.drawImage(marble.canvas, -bleedSize / 2, -bleedSize / 2, bleedSize, bleedSize);
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = 1;

        // 瞳孔本体: アルファはシェーダーで焼き込み済み(クリップ不要)
        const marbleSize = PUPIL_R * 2.5;
        context.drawImage(marble.canvas, -marbleSize / 2, -marbleSize / 2, marbleSize, marbleSize);
        // screen 合成で同じ絵を重ね、Hero 背景より明るく発光させる
        context.globalCompositeOperation = "screen";
        context.globalAlpha = 0.55;
        context.drawImage(marble.canvas, -marbleSize / 2, -marbleSize / 2, marbleSize, marbleSize);
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
        context.restore();
      }

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

    /** ふたつの瞳の狭間で寄り添うふたり(いちばん手前=視差が最大) */
    const drawPair = (t: number) => {
      const bobY = Math.sin(t * 0.85) * 6;
      const sway = Math.sin(t * 0.5) * 0.05;
      context.save();
      context.translate(500 + parallax.x * 9, 262 + bobY + parallax.y * 5.4);
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
          SPARKLE_COLORS[index % SPARKLE_COLORS.length] ?? "#f2c4dc",
          pulse * 0.9,
        );
      }
      context.restore();
    };

    const render = (dt: number, t: number) => {
      const rect = { width: canvas.width / dpr, height: canvas.height / dpr };
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      // 視線を更新(カーソル方向へ最大4px、なめらかに追従)
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
            // ほんのちょっとだけ動く
            const reach = Math.min(length / 60, 4);
            target.x = (dx / length) * reach;
            target.y = (dy / length) * reach;
          }
        }
        const state = gaze[side] ?? { x: 0, y: 0 };
        const follow = dt > 0 ? Math.min(1, dt * 5.5) : 1;
        state.x = lerp(state.x, target.x, follow);
        state.y = lerp(state.y, target.y, follow);
      }

      // 層別パララックス(奥のボディ3 / 目6 / 手前のふたり9 の係数で使う)
      const parallaxTarget = { x: 0, y: 0 };
      if (pointer !== null && canvasRect.width > 0) {
        parallaxTarget.x = Math.max(
          -1,
          Math.min(
            1,
            (pointer.x - canvasRect.left - canvasRect.width / 2) / (canvasRect.width / 2),
          ),
        );
        parallaxTarget.y = Math.max(
          -1,
          Math.min(
            1,
            (pointer.y - canvasRect.top - canvasRect.height / 2) / (canvasRect.height / 2),
          ),
        );
      }
      const parallaxFollow = dt > 0 ? Math.min(1, dt * 3) : 1;
      parallax.x = lerp(parallax.x, parallaxTarget.x, parallaxFollow);
      parallax.y = lerp(parallax.y, parallaxTarget.y, parallaxFollow);

      // 瞳孔の宇宙(マーブル)を今フレームぶん進める
      if (marble !== null) {
        marble.render(t === 0 ? 42 : t);
      }

      // スキルチップからプランクトンへ、ゆるく弧をかく点線矢印
      // (ボディの浮遊と視差に追従させるため毎フレーム描く)
      for (const chip of chipRects) {
        const alien = ALIENS[chip.side];
        const bob = Math.sin(t * 0.5 + chip.side * 2.1) * 9;
        const target = toCanvas(alien.cx + parallax.x * 3, alien.cy + bob + parallax.y * 1.8);
        const startX = chip.side === 0 ? chip.x + chip.w + 6 : chip.x - 6;
        const startY = chip.y + chip.h / 2;
        // 終点はボディの縁の少し外。チップの縦順と同じ順で固定の扇角に
        // 割り当てる(順序が保存されるので矢印同士は交差しない)
        const fan = chip.order - (ALIENS[0].items.length - 1) / 2;
        const spreadStep = 0.15;
        const endAngle = chip.side === 0 ? Math.PI - fan * spreadStep : fan * spreadStep;
        const endX = target.x + Math.cos(endAngle) * BODY_R * 0.78 * scale;
        const endY = target.y + Math.sin(endAngle) * BODY_R * 0.78 * scale;
        // ゆるい弧: チップ順に入れ子で膨らませる(上は上へ、下は下へ)
        const bulgeStep = 22;
        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2 + fan * bulgeStep;
        const color = chip.side === 0 ? "#f2c4dc" : "#a6d3ea";
        context.strokeStyle = withAlpha(color, 0.5);
        context.lineWidth = 1.2;
        context.lineCap = "round";
        context.setLineDash([1.5, 5]);
        context.beginPath();
        context.moveTo(startX, startY);
        context.quadraticCurveTo(controlX, controlY, endX, endY);
        context.stroke();
        context.setLineDash([]);
        // 矢印の先端(終端の接線方向に開く)
        const tipAngle = Math.atan2(endY - controlY, endX - controlX);
        context.strokeStyle = withAlpha(color, 0.75);
        context.beginPath();
        context.moveTo(endX, endY);
        context.lineTo(endX - Math.cos(tipAngle - 0.45) * 8, endY - Math.sin(tipAngle - 0.45) * 8);
        context.moveTo(endX, endY);
        context.lineTo(endX - Math.cos(tipAngle + 0.45) * 8, endY - Math.sin(tipAngle + 0.45) * 8);
        context.stroke();
      }

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
        marble?.destroy();
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
      marble?.destroy();
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
      {/* md+: 吹き出しは左右の縁に寄せる */}
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
              className={`bg-void/50 rounded-full border px-3.5 py-1.5 text-xs whitespace-nowrap backdrop-blur-sm ${
                alienIndex === 0 ? "border-pink/25 text-pale" : "border-ice/40 text-ice"
              }`}
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
            className="border-pink/25 text-pale bg-void/50 rounded-full border px-3 py-1 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <ul className="absolute inset-x-2 bottom-0 flex flex-wrap justify-center gap-2 md:hidden">
        {ALIENS[1].items.map((item) => (
          <li
            key={item}
            className="border-ice/40 text-ice bg-void/50 rounded-full border px-3 py-1 text-xs backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
