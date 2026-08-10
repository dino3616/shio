import { useEffect, useRef, useState } from "react";
import { createProgram } from "~/lib/webgl";

/**
 * テキストを WebGL の渦巻きシェーダで歪ませる見出し。
 * 文字を一度 2D canvas にラスタライズしてテクスチャ化し、中心ほど強い回転波で
 * 「渦に巻かれている」ような静的な歪みを与える。歪みの形は seed で決まる。
 * WebGL 不可の環境では静的なテキストのまま
 */

const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_size;
uniform float u_seed;

void main() {
  vec2 p = (v_uv - 0.5) * u_size;
  // 横長のテキスト全体が渦の影響圏に入るよう、x を潰した楕円距離で減衰を測る
  vec2 q = vec2(p.x * 0.38, p.y);
  float r = length(q);
  float fall = 1.0 - smoothstep(0.0, 0.62 * u_size.y, r);
  // 中心から外へ向かう回転波。位相は u_seed で固定
  float ang = 0.5 * fall * sin(u_seed - r * 0.05);
  float ca = cos(ang);
  float sa = sin(ang);
  vec2 rp = mat2(ca, -sa, sa, ca) * p;
  vec2 uv = rp / u_size + 0.5;
  gl_FragColor = texture2D(u_tex, uv);
}
`;

export const SwirlText = ({
  text,
  seed = 0,
  className = "",
  fontSize = 24,
  color = "#f2c4dc",
  font = '"Shippori Mincho", serif',
}: {
  text: string;
  /** 渦の位相。値を変えると歪みの形が変わる(目安: 0〜6.28) */
  seed?: number;
  className?: string;
  fontSize?: number;
  color?: string;
  font?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const pad = Math.round(fontSize * 0.9);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    let disposed = false;

    const setup = async () => {
      // フォント読み込み前にラスタライズするとフォールバック字形が焼き付く
      await document.fonts.load(`${fontSize}px ${font}`, text).catch(() => undefined);
      if (disposed) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);

      const source = document.createElement("canvas");
      const ctx = source.getContext("2d");
      if (ctx === null) {
        return;
      }
      ctx.font = `${fontSize * dpr}px ${font}`;
      const cssWidth = Math.ceil(ctx.measureText(text).width / dpr) + pad * 2;
      const cssHeight = Math.ceil(fontSize * 1.5) + pad * 2;
      source.width = cssWidth * dpr;
      source.height = cssHeight * dpr;
      // canvas のサイズ変更でコンテキスト状態が消えるので設定し直す
      ctx.font = `${fontSize * dpr}px ${font}`;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.fillText(text, pad * dpr, (cssHeight * dpr) / 2);

      canvas.width = source.width;
      canvas.height = source.height;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const gl = canvas.getContext("webgl", { premultipliedAlpha: true });
      if (gl === null) {
        return;
      }
      const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      if (program === null) {
        return;
      }
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const posLoc = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex"), 0);
      gl.uniform2f(gl.getUniformLocation(program, "u_size"), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, "u_seed"), seed);

      // 静的な歪みなので1回だけ描画する
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      setActive(true);
    };
    void setup();

    return () => {
      disposed = true;
    };
  }, [text, seed, fontSize, color, font, pad]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* レイアウトとアクセシビリティは実テキストが担う。演出中は透明にするだけ */}
      <span className={active ? "opacity-0" : undefined} style={{ fontSize, color }}>
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${active ? "block" : "hidden"}`}
        style={{ left: -pad }}
      />
    </span>
  );
};
