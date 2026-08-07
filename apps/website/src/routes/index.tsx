import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <p className="font-mono text-pink text-sm tracking-[0.3em]">
        ENGINEER / DESIGNER — shio.studio
      </p>
      <h1 className="font-display mt-4 text-center text-7xl font-bold leading-none">
        Haruto
        <br />
        Shiohata
      </h1>
      <p className="font-pixel text-ice mt-6 text-xl tracking-[0.4em]">塩畑 晴人</p>
      <p className="text-pale mt-3 tracking-[0.2em]">矛盾ごと、かたちにする。</p>
      <p className="font-crt text-prism mt-16 text-lg">▚ UNDER CONSTRUCTION ▞</p>
    </main>
  );
}
