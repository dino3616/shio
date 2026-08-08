import { useEffect, useRef } from "react";
import { type Frame, prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";
import { createProgram, trackCanvasSize } from "~/lib/webgl";

/**
 * 流体グラデーション背景。
 * ドメインワープした simplex noise で、ムードボード img 26/30 のマーブルを
 * 「生きた背景」にする(design-direction: Hero の主演出)。
 * ノイズ由来なので二度と同じ絵にならない。
 *
 * ピクセルあたりのシェーダーコストが最も高い演出なので、
 * - 0.5x 解像度で描く(ぼかし気味の絵なので見分けがつかない)
 * - 動きが極端に遅い(u_time * 0.035)ので 30fps に間引く
 * - ビューポート外(Hero を過ぎたら)は描画を完全に止める
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Ashima Arts simplex noise (MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p = p * 2.0 + 13.7;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.035;

  // ドメインワープ2段: q で歪ませた座標を r でさらに歪ませる
  // 低周波にして img 30 の「大きくゆったりした流動」に寄せる
  vec2 q = vec2(
    fbm(p * 0.6 + vec2(t, -t * 0.7)),
    fbm(p * 0.6 + vec2(-t * 0.6, t * 0.9) + 4.2)
  );
  vec2 r = vec2(
    fbm(p * 0.8 + 2.0 * q + vec2(1.7 - t * 0.3, 9.2)),
    fbm(p * 0.8 + 2.2 * q + vec2(8.3, 2.8 + t * 0.4))
  );
  float f = fbm(p * 0.7 + 1.9 * r);

  // パレット(design-direction: ダーク6:ネオン2:パステル1:アクセント1)
  vec3 voidBlack = vec3(0.055, 0.039, 0.078);
  vec3 navy = vec3(0.094, 0.110, 0.247);
  vec3 purple = vec3(0.545, 0.361, 0.965);
  vec3 pink = vec3(0.949, 0.329, 0.620);
  vec3 ice = vec3(0.651, 0.827, 0.918);

  // 暗部を広めに: ダーク6割の比率を守る
  vec3 col = mix(voidBlack, navy, smoothstep(-0.35, 0.9, f));
  col = mix(col, purple, smoothstep(0.32, 1.0, q.x) * 0.5);
  col = mix(col, pink, smoothstep(0.42, 1.0, r.y) * 0.62);
  col = mix(col, ice, smoothstep(0.65, 1.15, q.y * r.x) * 0.2);

  // ビネット: 端を宇宙の闇に沈める
  float vig = smoothstep(1.35, 0.3, length(p));
  col *= mix(0.45, 1.0, vig);

  // フィルムグレイン
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const FluidBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (gl === null) {
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (program === null) {
      return;
    }

    // フルスクリーントライアングル
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    const reducedMotion = prefersReducedMotion();
    const startedAt = performance.now();

    const render = (elapsedSeconds: number) => {
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      // reduced motion 時は固定シード(それでも訪問ごとに違う絵にしたければ Date 起点にする)
      gl.uniform1f(timeLocation, reducedMotion ? 42.0 : elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // シェーダーはぼかし気味の絵なので 0.5x 解像度で十分(負荷を1/4に)
    const stopTracking = trackCanvasSize(canvas, 0.5, (width, height) => {
      gl.viewport(0, 0, width, height);
      if (reducedMotion) {
        render(0);
      }
    });

    if (reducedMotion) {
      render(0);
      return () => {
        stopTracking();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    // 動きが非常にゆっくりなので 30fps への間引きは視覚的に区別がつかない
    const frameIntervalMs = 1000 / 30;
    let lastRenderedAt = Number.NEGATIVE_INFINITY;
    const handleFrame = (frame: Frame) => {
      // rAF の刻み(60Hz なら約16.7ms)のゆらぎを吸収する 1ms のマージン
      if (frame.now - lastRenderedAt < frameIntervalMs - 1) {
        return;
      }
      lastRenderedAt = frame.now;
      render((frame.now - startedAt) / 1000);
    };

    // Hero がビューポート外に出たら描画を完全に止める
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
      aria-hidden="true"
    />
  );
};
