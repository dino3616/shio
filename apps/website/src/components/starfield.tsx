import { useEffect, useRef } from "react";
import { mulberry32 } from "~/lib/random";
import { type Frame, prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";
import { createProgram, trackCanvasSize } from "~/lib/webgl";

/**
 * WebGL 星空(design-direction: 数学的モーション+空間的な奥行き)。
 * - 加算ブレンドのポイントスプライトで発光を物理的に重ねる
 * - べき乗分布のサイズ(暗い星ほど多い)+色温度のばらつき+星団クラスタ
 * - 深度アトリビュートでマウス/スクロールに視差反応(近い星ほど動く)
 * - リサージュ的ドリフトと非同期の瞬きは頂点シェーダーで計算
 * - 十字のキラキラはアクセントとしてごく稀に混ぜる(かわいさの記号)
 * 描画は共有 ticker が駆動し、ビューポート外に出たインスタンスは止まる
 */

const VERTEX_SHADER = `
attribute vec2 a_pos;        // 0..1 正規化座標
attribute float a_size;      // CSS px
attribute float a_depth;     // 0=遠景 .. 1=近景
attribute float a_phase;
attribute float a_twinkle;   // 瞬き速度
attribute vec3 a_color;
attribute float a_kind;      // 0=丸い星, 1=十字スパークル
attribute vec4 a_drift;      // ampX, ampY, freqX, freqY

uniform vec2 u_resolution;   // デバイスpx
uniform float u_time;
uniform float u_dpr;
uniform vec2 u_parallax;     // CSS px(深度1のときの視差)

varying float v_alpha;
varying vec3 v_color;
varying float v_kind;

void main() {
  vec2 drift = vec2(
    a_drift.x * sin(a_drift.z * u_time + a_phase),
    a_drift.y * sin(a_drift.w * u_time + a_phase * 1.7)
  );
  vec2 px = a_pos * u_resolution + (drift + u_parallax * a_depth) * u_dpr;
  vec2 clip = (px / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  float tw = 0.55 + 0.45 * sin(u_time * a_twinkle + a_phase * 7.31);
  v_alpha = tw;
  v_color = a_color;
  v_kind = a_kind;
  float sizeJitter = a_kind > 0.5 ? 1.0 : (0.85 + 0.3 * tw);
  gl_PointSize = a_size * sizeJitter * u_dpr;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying float v_alpha;
varying vec3 v_color;
varying float v_kind;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);

  // 丸い星: 鋭いコア+指数減衰のグロー
  float core = exp(-r * r * 12.0);
  float glow = exp(-r * 3.0) * 0.55;
  float intensity = core + glow;

  if (v_kind > 0.5) {
    // 十字スパークル: 軸に沿った回折スパイク+コア
    float spikeH = exp(-abs(p.y) * 18.0) * max(0.0, 1.0 - abs(p.x));
    float spikeV = exp(-abs(p.x) * 18.0) * max(0.0, 1.0 - abs(p.y));
    intensity = core * 1.3 + (spikeH + spikeV) * 0.85 + exp(-r * 2.2) * 0.25;
  }

  // スプライトの四角い境界が見えないよう端で完全に減衰させる
  intensity *= 1.0 - smoothstep(0.72, 1.0, r);

  float a = intensity * v_alpha;
  gl_FragColor = vec4(v_color * a, a);
}
`;

// 色温度のばらつき(青白い星〜暖色の星、パレットのサブ色を混ぜる)
const STAR_COLORS: [number, number, number][] = [
  [0.97, 0.95, 0.98], // ニュートラル
  [0.97, 0.95, 0.98],
  [0.65, 0.83, 0.92], // アイスブルー(高温星)
  [1.0, 0.91, 0.77], // 暖色(低温星)
  [0.95, 0.77, 0.86], // ペールピンク
];

const CROSS_COLORS: [number, number, number][] = [
  [0.95, 0.77, 0.86], // ペールピンク
  [0.95, 0.91, 0.36], // プリズムイエロー
  [0.65, 0.83, 0.92], // アイスブルー
];

// 焼き込まれた星配置のシード
const DEFAULT_STAR_SEED = 119;

type StarBuffers = {
  pos: number[];
  size: number[];
  depth: number[];
  phase: number[];
  twinkle: number[];
  color: number[];
  kind: number[];
  drift: number[];
};

const buildStars = (stars: number, crosses: number, seed: number): StarBuffers => {
  const random = mulberry32(seed);
  const b: StarBuffers = {
    pos: [],
    size: [],
    depth: [],
    phase: [],
    twinkle: [],
    color: [],
    kind: [],
    drift: [],
  };

  // 星団クラスタ: 完全な一様分布は人工的に見えるので、4割をクラスタに寄せる
  const clusters = Array.from({ length: 4 }, () => [random(), random()]);

  const pushStar = (
    x: number,
    y: number,
    size: number,
    depth: number,
    color: [number, number, number],
    kind: number,
  ) => {
    b.pos.push(x, y);
    b.size.push(size);
    b.depth.push(depth);
    b.phase.push(random() * Math.PI * 2);
    // 大きい星ほどゆっくり瞬く
    b.twinkle.push((0.3 + random() * 1.4) / (1 + size * 0.08));
    b.color.push(...color);
    b.kind.push(kind);
    // リサージュドリフト: 角速度は 0.05〜0.2Hz(旧Canvas版と同じ体感速度)
    b.drift.push(
      4 + random() * 12,
      4 + random() * 10,
      (0.05 + random() * 0.15) * Math.PI * 2,
      (0.05 + random() * 0.15) * Math.PI * 2,
    );
  };

  for (let i = 0; i < stars; i++) {
    let x = random();
    let y = random();
    if (random() < 0.4) {
      const cluster = clusters[i % clusters.length] ?? [0.5, 0.5];
      x = Math.min(Math.max((cluster[0] ?? 0.5) + (random() - 0.5) * 0.3, 0), 1);
      y = Math.min(Math.max((cluster[1] ?? 0.5) + (random() - 0.5) * 0.3, 0), 1);
    }
    // べき乗分布: 暗く小さい星が大半、明るい星は稀
    const u = random();
    const size = 1.4 + 20 * u ** 7;
    const depth = 0.15 + 0.85 * random() ** 1.6;
    const color = STAR_COLORS[Math.floor(random() * STAR_COLORS.length)] ?? [1, 1, 1];
    pushStar(x, y, size, depth, color, 0);
  }

  for (let i = 0; i < crosses; i++) {
    const color = CROSS_COLORS[i % CROSS_COLORS.length] ?? [1, 1, 1];
    pushStar(0.1 + random() * 0.8, 0.1 + random() * 0.8, 44 + random() * 22, 0.85, color, 1);
  }

  return b;
};

export const Starfield = ({
  stars = 240,
  crosses = 2,
  seed = DEFAULT_STAR_SEED,
}: {
  stars?: number;
  crosses?: number;
  seed?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
      antialias: false,
    });
    if (gl === null) {
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (program === null) {
      return;
    }

    // 加算ブレンド: 光は重なると明るくなる
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const data = buildStars(stars, crosses, seed);
    const starCount = data.size.length;

    const bindAttribute = (name: string, values: number[], size: number) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    };

    bindAttribute("a_pos", data.pos, 2);
    bindAttribute("a_size", data.size, 1);
    bindAttribute("a_depth", data.depth, 1);
    bindAttribute("a_phase", data.phase, 1);
    bindAttribute("a_twinkle", data.twinkle, 1);
    bindAttribute("a_color", data.color, 3);
    bindAttribute("a_kind", data.kind, 1);
    bindAttribute("a_drift", data.drift, 4);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const dprLocation = gl.getUniformLocation(program, "u_dpr");
    const parallaxLocation = gl.getUniformLocation(program, "u_parallax");

    const reducedMotion = prefersReducedMotion();
    const startedAt = performance.now();

    const render = (t: number, scrollY: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, t);
      gl.uniform1f(dprLocation, Math.min(window.devicePixelRatio, 2));
      // 視差はスクロールのみ(深度1の星ほど大きくずれる)
      gl.uniform2f(parallaxLocation, 0, -scrollY * 0.05);
      gl.drawArrays(gl.POINTS, 0, starCount);
    };

    const stopTracking = trackCanvasSize(canvas, 1, (width, height) => {
      gl.viewport(0, 0, width, height);
      if (reducedMotion) {
        render(0, window.scrollY);
      }
    });

    if (reducedMotion) {
      render(0, window.scrollY);
      return () => {
        stopTracking();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const handleFrame = (frame: Frame) => {
      render((frame.now - startedAt) / 1000, frame.scrollY);
    };

    // ビューポート外の星空は描かない(Hero 用と下層用の2インスタンスが
    // 同時に全画面を占めることはないので、常にどちらかが止まる)
    let unsubscribe: (() => void) | null = null;
    const stopObserving = whenInView(canvas, (visible) => {
      if (visible && unsubscribe === null) {
        unsubscribe = subscribeFrame(handleFrame);
      } else if (!visible && unsubscribe !== null) {
        unsubscribe();
        unsubscribe = null;
      }
    });

    return () => {
      stopObserving();
      unsubscribe?.();
      stopTracking();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [stars, crosses, seed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
