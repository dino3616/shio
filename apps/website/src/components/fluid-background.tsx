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
 * ピクセルあたりのシェーダーコストが最も高い演出なので、時間方向に償却する:
 * - 0.5x 解像度で描く(ぼかし気味の絵なので見分けがつかない)
 * - 重い fbm パスは 10fps でテクスチャに描き、画面へは前後2枚のテクスチャを
 *   線形補間するだけの軽量パスを 30fps で出す。動きが極端に遅い
 *   (u_time * 0.035 = 100ms で 0.0035)ので補間で滑らかさは保たれる
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

// 表示パス: 前後2枚のスナップショットを u_mix で線形補間するだけ
const BLEND_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const BLEND_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D u_prev;
uniform sampler2D u_next;
uniform float u_mix;
varying vec2 v_uv;
void main() {
  gl_FragColor = mix(texture2D(u_prev, v_uv), texture2D(u_next, v_uv), u_mix);
}
`;

/** 重い fbm パスをテクスチャへ再計算する周期。10fps でも補間で滑らかに見える */
const HEAVY_INTERVAL_MS = 100;

type RenderTarget = { texture: WebGLTexture; framebuffer: WebGLFramebuffer };

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

    const fluidProgram = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    const blendProgram = createProgram(gl, BLEND_VERTEX_SHADER, BLEND_FRAGMENT_SHADER);
    if (fluidProgram === null || blendProgram === null) {
      return;
    }

    // フルスクリーントライアングル(両パスで共有)。
    // 頂点属性の設定はプログラムではなくロケーションに紐づく状態なので、
    // 両プログラムのロケーションに一度ずつ設定しておけば切り替え不要
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLocations = new Set([
      gl.getAttribLocation(fluidProgram, "a_position"),
      gl.getAttribLocation(blendProgram, "a_position"),
    ]);
    for (const location of positionLocations) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    }

    const resolutionLocation = gl.getUniformLocation(fluidProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(fluidProgram, "u_time");
    const mixLocation = gl.getUniformLocation(blendProgram, "u_mix");
    gl.useProgram(blendProgram);
    gl.uniform1i(gl.getUniformLocation(blendProgram, "u_prev"), 0);
    gl.uniform1i(gl.getUniformLocation(blendProgram, "u_next"), 1);

    const reducedMotion = prefersReducedMotion();
    const startedAt = performance.now();
    const shaderTime = (wallMs: number) => (wallMs - startedAt) / 1000;

    /** 重い fbm パスを target(null なら画面)へ描く */
    const renderFluid = (target: RenderTarget | null, elapsedSeconds: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target === null ? null : target.framebuffer);
      gl.useProgram(fluidProgram);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reducedMotion) {
      // 静止画1枚でよいので償却は不要。固定シードで画面へ直描き
      // (それでも訪問ごとに違う絵にしたければ Date 起点にする)
      const stopTracking = trackCanvasSize(canvas, 0.5, (width, height) => {
        gl.viewport(0, 0, width, height);
        renderFluid(null, 42.0);
      });
      renderFluid(null, 42.0);
      return () => {
        stopTracking();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    // 補間の両端になる2枚のレンダーターゲット。
    // canvas と同サイズ・NEAREST サンプリングなので解像度の劣化はない
    const createTarget = (): RenderTarget | null => {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      if (texture === null || framebuffer === null) {
        return null;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return { texture, framebuffer };
    };
    let prevTarget = createTarget();
    let nextTarget = createTarget();
    if (prevTarget === null || nextTarget === null) {
      return;
    }

    // 区間 [segmentStartedAt, segmentStartedAt + HEAVY_INTERVAL_MS] の
    // 両端の状態が prev / next に描かれている、が不変条件
    let segmentStartedAt = 0;
    let synced = false;

    const resizeTargets = (width: number, height: number) => {
      for (const target of [prevTarget, nextTarget]) {
        if (target === null) {
          continue;
        }
        gl.bindTexture(gl.TEXTURE_2D, target.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          target.texture,
          0,
        );
      }
      synced = false;
    };

    const renderBlend = (mixAmount: number, prev: RenderTarget, next: RenderTarget) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(blendProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, prev.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, next.texture);
      gl.uniform1f(mixLocation, mixAmount);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // シェーダーはぼかし気味の絵なので 0.5x 解像度で十分(負荷を1/4に)
    const stopTracking = trackCanvasSize(canvas, 0.5, (width, height) => {
      gl.viewport(0, 0, width, height);
      resizeTargets(width, height);
    });
    // 初期サイズが既に一致していてコールバックが発火しなかった場合でも
    // テクスチャの実体を確実に確保する(再確保は無害)
    resizeTargets(canvas.width, canvas.height);

    // 表示は 30fps に間引く(動きが非常にゆっくりなので視覚差なし)
    const displayIntervalMs = 1000 / 30;
    let lastDisplayedAt = Number.NEGATIVE_INFINITY;
    const handleFrame = (frame: Frame) => {
      if (prevTarget === null || nextTarget === null) {
        return;
      }
      // rAF の刻み(60Hz なら約16.7ms)のゆらぎを吸収する 1ms のマージン
      if (frame.now - lastDisplayedAt < displayIntervalMs - 1) {
        return;
      }
      lastDisplayedAt = frame.now;

      if (!synced || frame.now - segmentStartedAt >= HEAVY_INTERVAL_MS * 2) {
        // 初回・リサイズ後・可視性ゲート復帰後は両端を描き直して同期する
        segmentStartedAt = frame.now;
        renderFluid(prevTarget, shaderTime(frame.now));
        renderFluid(nextTarget, shaderTime(frame.now + HEAVY_INTERVAL_MS));
        synced = true;
      } else if (frame.now - segmentStartedAt >= HEAVY_INTERVAL_MS) {
        // 次の区間へ: 今の「次」が「前」になり、新しい「次」の1枚だけ描く
        segmentStartedAt += HEAVY_INTERVAL_MS;
        const recycled = prevTarget;
        prevTarget = nextTarget;
        nextTarget = recycled;
        renderFluid(nextTarget, shaderTime(segmentStartedAt + HEAVY_INTERVAL_MS));
      }

      renderBlend(
        Math.min((frame.now - segmentStartedAt) / HEAVY_INTERVAL_MS, 1),
        prevTarget,
        nextTarget,
      );
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
