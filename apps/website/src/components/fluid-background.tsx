import { useEffect, useRef } from "react";
import { markBootReady } from "~/lib/boot";
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
 *
 * 初回表示: シェーダーのコンパイル完了(KHR_parallel_shader_compile があれば
 * 非同期で待つ)→ 初回フレーム描画まで BootOverlay が画面全体を覆っている。
 * 描けたら markBootReady で幕を開ける。WebGL が使えない・Hero が画面外などの
 * 「描けない」ケースでも必ず markBootReady を呼んで幕を開けっぱなしにしない
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const MARBLE_FRAGMENT_SHADER = `
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

  gl_FragColor = vec4(col, 1.0);
}
`;

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
      // WebGL が使えなくても幕は開ける(背景は bg-void のまま)
      markBootReady();
      return;
    }

    const marbleProgram = createProgram(gl, VERTEX_SHADER, MARBLE_FRAGMENT_SHADER);
    const displayProgram = createProgram(gl, DISPLAY_VERTEX_SHADER, DISPLAY_FRAGMENT_SHADER);
    if (marbleProgram === null || displayProgram === null) {
      markBootReady();
      return;
    }

    // 対応ブラウザではシェーダーをバックグラウンドでコンパイルさせ、リンク完了を
    // 待ってから描き始める(待っている間は BootOverlay が画面を覆っている)。
    // 拡張がなければ従来どおり初回描画時に同期コンパイルされる
    const parallelExt = gl.getExtension("KHR_parallel_shader_compile");
    const programsCompiled = () =>
      parallelExt === null ||
      (gl.getProgramParameter(marbleProgram, parallelExt.COMPLETION_STATUS_KHR) === true &&
        gl.getProgramParameter(displayProgram, parallelExt.COMPLETION_STATUS_KHR) === true);

    // フルスクリーントライアングル(両パスで共有)。バッファ作成はリンク完了を
    // 待たずにできるが、ロケーション取得(getAttribLocation / getUniformLocation)
    // はリンク完了までブロックするため initPipeline に遅延する
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    let resolutionLocation: WebGLUniformLocation | null = null;
    let timeLocation: WebGLUniformLocation | null = null;
    let pipelineReady = false;

    const initPipeline = () => {
      // 頂点属性の設定はプログラムではなくロケーションに紐づく状態なので、
      // 両プログラムのロケーションに一度ずつ設定しておけば切り替え不要
      const positionLocations = new Set([
        gl.getAttribLocation(marbleProgram, "a_position"),
        gl.getAttribLocation(displayProgram, "a_position"),
      ]);
      for (const location of positionLocations) {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
      }
      resolutionLocation = gl.getUniformLocation(marbleProgram, "u_resolution");
      timeLocation = gl.getUniformLocation(marbleProgram, "u_time");
      gl.useProgram(displayProgram);
      gl.uniform1i(gl.getUniformLocation(displayProgram, "u_marble"), 0);
      pipelineReady = true;
    };

    // マーブル用レンダーターゲット。バイリニア拡大するので LINEAR
    const marbleTexture = gl.createTexture();
    const marbleFramebuffer = gl.createFramebuffer();
    if (marbleTexture === null || marbleFramebuffer === null) {
      markBootReady();
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
      if (reducedMotion && pipelineReady) {
        render(0);
      }
    });
    // 初期サイズが既に一致していてコールバックが発火しなかった場合の保険
    resizeMarble();

    if (reducedMotion) {
      // 静止画1枚。リンク完了を待ってから一度だけ描いて幕を開ける
      let pollId = 0;
      const renderOnceReady = () => {
        if (!programsCompiled()) {
          pollId = requestAnimationFrame(renderOnceReady);
          return;
        }
        initPipeline();
        render(0);
        markBootReady();
      };
      renderOnceReady();
      return () => {
        cancelAnimationFrame(pollId);
        stopTracking();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const handleFrame = (frame: Frame) => {
      if (!pipelineReady) {
        // リンク完了までは描かない(そのあいだは BootOverlay が覆っている)
        if (!programsCompiled()) {
          return;
        }
        initPipeline();
      }
      render((frame.now - startedAt) / 1000);
      markBootReady();
    };

    // Hero がビューポート外に出たら描画を完全に止める
    let unsubscribe: (() => void) | null = null;
    const stopObserving = whenInView(canvas, (visible) => {
      if (visible && unsubscribe === null) {
        unsubscribe = subscribeFrame(handleFrame);
      } else if (!visible) {
        // スクロール位置の復元などで Hero が画面外のまま始まった場合、
        // 流体は描かれないので幕をここで開ける
        markBootReady();
        if (unsubscribe !== null) {
          unsubscribe();
          unsubscribe = null;
        }
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
