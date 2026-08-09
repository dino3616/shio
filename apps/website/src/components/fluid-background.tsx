import { useEffect, useRef } from "react";
import { MARBLE_FRAGMENT_SHADER, MARBLE_VERTEX_SHADER } from "~/lib/marble";
import { type Frame, prefersReducedMotion, subscribeFrame } from "~/lib/ticker";
import { whenInView } from "~/lib/visibility";
import { createProgram, trackCanvasSize } from "~/lib/webgl";

/**
 * 流体グラデーション背景。
 * ドメインワープした simplex noise で、ムードボード img 26/30 のマーブルを
 * 「生きた背景」にする(design-direction: Hero の主演出)。
 * ノイズ由来なので二度と同じ絵にならない。
 *
 * ピクセルあたりのシェーダーコストが最も高い演出なので、空間方向に償却する:
 * - 重い fbm パスはマーブルが低周波なことを利用して、canvas のさらに半分の
 *   解像度のテクスチャへ毎フレーム描き、表示パスでバイリニア拡大する。
 *   模様の動きは真の 60fps のまま、fbm の実行回数は面積比で 1/4 になる
 *   (時間方向の償却=スナップショットのクロスフェードは、明るさは滑らかでも
 *   模様の「動き」がスナップショット周期でしか更新されずカクついて見えた)
 * - 質感の要のフィルムグレインは表示パスで従来どおりの解像度で合成する
 * - ビューポート外(Hero を過ぎたら)は描画を完全に止める
 */

// マーブル本体のシェーダーは lib/marble.ts に共有化(瞳孔の宇宙にも使う)

// 表示パス: 低解像度のマーブルをバイリニア拡大し、
// フィルムグレインだけを canvas 解像度(従来と同じ細かさ)で合成する
const DISPLAY_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const DISPLAY_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D u_marble;
varying vec2 v_uv;
void main() {
  vec3 col = texture2D(u_marble, v_uv).rgb;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** マーブルを描くテクスチャの canvas(0.5x DPR)に対する解像度比。要調整の余地あり */
const MARBLE_SCALE = 0.5;

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

    const marbleProgram = createProgram(gl, MARBLE_VERTEX_SHADER, MARBLE_FRAGMENT_SHADER);
    const displayProgram = createProgram(gl, DISPLAY_VERTEX_SHADER, DISPLAY_FRAGMENT_SHADER);
    if (marbleProgram === null || displayProgram === null) {
      return;
    }

    // フルスクリーントライアングル(両パスで共有)。
    // 頂点属性の設定はプログラムではなくロケーションに紐づく状態なので、
    // 両プログラムのロケーションに一度ずつ設定しておけば切り替え不要
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLocations = new Set([
      gl.getAttribLocation(marbleProgram, "a_position"),
      gl.getAttribLocation(displayProgram, "a_position"),
    ]);
    for (const location of positionLocations) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    }

    const resolutionLocation = gl.getUniformLocation(marbleProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(marbleProgram, "u_time");
    gl.useProgram(displayProgram);
    gl.uniform1i(gl.getUniformLocation(displayProgram, "u_marble"), 0);

    // マーブル用レンダーターゲット。バイリニア拡大するので LINEAR
    const marbleTexture = gl.createTexture();
    const marbleFramebuffer = gl.createFramebuffer();
    if (marbleTexture === null || marbleFramebuffer === null) {
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, marbleTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let marbleWidth = 0;
    let marbleHeight = 0;
    const resizeMarble = () => {
      marbleWidth = Math.max(1, Math.floor(canvas.width * MARBLE_SCALE));
      marbleHeight = Math.max(1, Math.floor(canvas.height * MARBLE_SCALE));
      gl.bindTexture(gl.TEXTURE_2D, marbleTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        marbleWidth,
        marbleHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, marbleFramebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        marbleTexture,
        0,
      );
    };

    const reducedMotion = prefersReducedMotion();
    const startedAt = performance.now();

    const render = (elapsedSeconds: number) => {
      // パス1: 低解像度テクスチャへマーブル本体(重い fbm)を描く
      gl.bindFramebuffer(gl.FRAMEBUFFER, marbleFramebuffer);
      gl.viewport(0, 0, marbleWidth, marbleHeight);
      gl.useProgram(marbleProgram);
      gl.uniform2f(resolutionLocation, marbleWidth, marbleHeight);
      // reduced motion 時は固定シード(それでも訪問ごとに違う絵にしたければ Date 起点にする)
      gl.uniform1f(timeLocation, reducedMotion ? 42.0 : elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // パス2: canvas へ拡大しつつグレインを従来の細かさで合成する
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(displayProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, marbleTexture);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // canvas はぼかし気味の絵なので従来どおり 0.5x 解像度
    const stopTracking = trackCanvasSize(canvas, 0.5, () => {
      resizeMarble();
      if (reducedMotion) {
        render(0);
      }
    });
    // 初期サイズが既に一致していてコールバックが発火しなかった場合の保険
    resizeMarble();

    if (reducedMotion) {
      render(0);
      return () => {
        stopTracking();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const handleFrame = (frame: Frame) => {
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
