import { useEffect, useRef } from "react";

/**
 * WebGL 星空(design-direction: 数学的モーション+空間的な奥行き)。
 * - 加算ブレンドのポイントスプライトで発光を物理的に重ねる
 * - べき乗分布のサイズ(暗い星ほど多い)+色温度のばらつき+星団クラスタ
 * - 深度アトリビュートでマウス/スクロールに視差反応(近い星ほど動く)
 * - リサージュ的ドリフトと非同期の瞬きは頂点シェーダーで計算
 * - 十字のキラキラはアクセントとしてごく稀に混ぜる(かわいさの記号)
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

const buildStars = (stars: number, crosses: number): StarBuffers => {
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
  const clusters = Array.from({ length: 4 }, () => [Math.random(), Math.random()]);

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
    b.phase.push(Math.random() * Math.PI * 2);
    // 大きい星ほどゆっくり瞬く
    b.twinkle.push((0.3 + Math.random() * 1.4) / (1 + size * 0.08));
    b.color.push(...color);
    b.kind.push(kind);
    // リサージュドリフト: 角速度は 0.05〜0.2Hz(旧Canvas版と同じ体感速度)
    b.drift.push(
      4 + Math.random() * 12,
      4 + Math.random() * 10,
      (0.05 + Math.random() * 0.15) * Math.PI * 2,
      (0.05 + Math.random() * 0.15) * Math.PI * 2,
    );
  };

  for (let i = 0; i < stars; i++) {
    let x = Math.random();
    let y = Math.random();
    if (Math.random() < 0.4) {
      const cluster = clusters[i % clusters.length] ?? [0.5, 0.5];
      x = Math.min(Math.max((cluster[0] ?? 0.5) + (Math.random() - 0.5) * 0.3, 0), 1);
      y = Math.min(Math.max((cluster[1] ?? 0.5) + (Math.random() - 0.5) * 0.3, 0), 1);
    }
    // べき乗分布: 暗く小さい星が大半、明るい星は稀
    const u = Math.random();
    const size = 1.4 + 20 * u ** 7;
    const depth = 0.15 + 0.85 * Math.random() ** 1.6;
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] ?? [1, 1, 1];
    pushStar(x, y, size, depth, color, 0);
  }

  for (let i = 0; i < crosses; i++) {
    const color = CROSS_COLORS[i % CROSS_COLORS.length] ?? [1, 1, 1];
    pushStar(
      0.1 + Math.random() * 0.8,
      0.1 + Math.random() * 0.8,
      44 + Math.random() * 22,
      0.85,
      color,
      1,
    );
  }

  return b;
};

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (shader === null) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

export const Starfield = ({ stars = 240, crosses = 2 }: { stars?: number; crosses?: number }) => {
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

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (vert === null || frag === null || program === null) {
      return;
    }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 加算ブレンド: 光は重なると明るくなる
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const data = buildStars(stars, crosses);
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      return dpr;
    };

    let rafId = 0;
    const startedAt = performance.now();
    const render = () => {
      const dpr = resize();
      const t = reducedMotion ? 0 : (performance.now() - startedAt) / 1000;
      // 視差はスクロールのみ(深度1の星ほど大きくずれる)
      const parallaxX = 0;
      const parallaxY = -window.scrollY * 0.05;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, t);
      gl.uniform1f(dprLocation, dpr);
      gl.uniform2f(parallaxLocation, parallaxX, parallaxY);
      gl.drawArrays(gl.POINTS, 0, starCount);

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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [stars, crosses]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
