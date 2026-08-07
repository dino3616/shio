import { useEffect, useRef } from "react";

/**
 * リサージュ曲線で漂う星空。
 * 各星が x = A·sin(at + φ), y = B·sin(bt) で独立に揺れ、
 * sin 位相で瞬く(design-direction: 数学的モーション)。
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
};

const STAR_COLORS = ["#f2e85c", "#f2c4dc", "#a6d3ea", "#f7f2fa"];

const createStars = (count: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      baseX: Math.random(),
      baseY: Math.random(),
      radius: 1.5 + Math.random() * 4.5,
      color: STAR_COLORS[i % STAR_COLORS.length] ?? "#f7f2fa",
      amplitudeX: 6 + Math.random() * 18,
      amplitudeY: 6 + Math.random() * 14,
      freqX: 0.05 + Math.random() * 0.15,
      freqY: 0.05 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.4 + Math.random() * 1.2,
    });
  }
  return stars;
};

const drawSparkle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  // 4芒星(モックのキラキラと同じ形)
  const w = r * 0.28;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + w * 0.4, cy - w * 0.4, cx + r, cy);
  ctx.quadraticCurveTo(cx + w * 0.4, cy + w * 0.4, cx, cy + r);
  ctx.quadraticCurveTo(cx - w * 0.4, cy + w * 0.4, cx - r, cy);
  ctx.quadraticCurveTo(cx - w * 0.4, cy - w * 0.4, cx, cy - r);
  ctx.closePath();
  ctx.fill();
};

export const Starfield = ({ count = 36 }: { count?: number }) => {
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

    const stars = createStars(count);
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
        ctx.globalAlpha = reducedMotion ? 0.7 : twinkle;
        ctx.fillStyle = star.color;
        drawSparkle(ctx, x, y, star.radius);
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
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
