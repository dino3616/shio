import { useEffect, useRef } from "react";

/**
 * リサージュ曲線で漂う星空。
 * 各星が x = A·sin(at + φ), y = B·sin(bt) で独立に揺れ、
 * sin 位相で瞬く(design-direction: 数学的モーション)。
 *
 * 質感方針: 大きな星はグロー+クロスフレア+白いコアの三層描画、
 * 背景には小さな星屑を散らして奥行きを出す。
 */

type Star = {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  amplitudeX: number;
  amplitudeY: number;
  freqX: number;
  freqY: number;
  phase: number;
  twinkleSpeed: number;
  kind: "sparkle" | "dust";
};

const STAR_COLORS = ["#f2e85c", "#f2c4dc", "#a6d3ea", "#f7f2fa"];

const createStars = (sparkles: number, dust: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < sparkles + dust; i++) {
    const isSparkle = i < sparkles;
    stars.push({
      baseX: Math.random(),
      baseY: Math.random(),
      radius: isSparkle ? 3 + Math.random() * 6 : 0.5 + Math.random() * 1.1,
      color: STAR_COLORS[i % STAR_COLORS.length] ?? "#f7f2fa",
      amplitudeX: 6 + Math.random() * 18,
      amplitudeY: 6 + Math.random() * 14,
      freqX: 0.05 + Math.random() * 0.15,
      freqY: 0.05 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.4 + Math.random() * 1.2,
      kind: isSparkle ? "sparkle" : "dust",
    });
  }
  return stars;
};

const drawSparkle = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  alpha: number,
) => {
  // 三層描画: グロー → クロスフレア(4芒星) → 白いコア
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
  glow.addColorStop(0, color);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
  ctx.fill();

  const w = r * 0.22;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + w, cy - w, cx + r, cy);
  ctx.quadraticCurveTo(cx + w, cy + w, cx, cy + r);
  ctx.quadraticCurveTo(cx - w, cy + w, cx - r, cy);
  ctx.quadraticCurveTo(cx - w, cy - w, cx, cy - r);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = Math.min(alpha * 1.4, 1);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(r * 0.16, 0.6), 0, Math.PI * 2);
  ctx.fill();
};

export const Starfield = ({ sparkles = 14, dust = 70 }: { sparkles?: number; dust?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    const stars = createStars(sparkles, dust);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let rafId = 0;
    const startedAt = performance.now();
    const render = () => {
      resize();
      const t = reducedMotion ? 0 : (performance.now() - startedAt) / 1000;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const x =
          star.baseX * width +
          star.amplitudeX * Math.sin(star.freqX * t * Math.PI * 2 + star.phase);
        const y = star.baseY * height + star.amplitudeY * Math.sin(star.freqY * t * Math.PI * 2);
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(star.twinkleSpeed * t + star.phase));
        const alpha = reducedMotion ? 0.7 : twinkle;

        if (star.kind === "sparkle") {
          drawSparkle(ctx, x, y, star.radius, star.color, alpha);
        } else {
          ctx.globalAlpha = alpha * 0.8;
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(x, y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };
    rafId = requestAnimationFrame(render);

    const handleResize = () => {
      if (reducedMotion) {
        render();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [sparkles, dust]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
