/** WebGL 演出(fluid-background / starfield)で共通のボイラープレート */

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

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null => {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (vert === null || frag === null || program === null) {
    return null;
  }
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);
  return program;
};

/**
 * canvas の描画バッファサイズを CSS サイズ × DPR × scale に追従させる。
 * 毎フレーム clientWidth を読む(=レイアウト読み取りする)代わりに
 * ResizeObserver で変化時だけ反映する。DPR の変化(ブラウザズームなど)は
 * ResizeObserver では拾えないので window resize も併用する
 */
export const trackCanvasSize = (
  canvas: HTMLCanvasElement,
  scale: number,
  onResize: (width: number, height: number, dpr: number) => void,
): (() => void) => {
  const apply = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = Math.floor(canvas.clientWidth * dpr * scale);
    const height = Math.floor(canvas.clientHeight * dpr * scale);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      onResize(width, height, dpr);
    }
  };
  apply();
  const observer = new ResizeObserver(apply);
  observer.observe(canvas);
  window.addEventListener("resize", apply);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", apply);
  };
};
