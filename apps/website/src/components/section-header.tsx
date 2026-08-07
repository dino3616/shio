import { Reveal } from "~/components/reveal";

/**
 * セクション見出し。Hero のタイポ言語(Noto Sans JP 900 の白 +
 * Shippori Mincho の和文)を踏襲し、奥にゴースト番号を沈めて奥行きを出す
 */
export const SectionHeader = ({
  number,
  title,
  jp,
}: {
  number: string;
  title: string;
  jp: string;
}) => (
  <Reveal className="relative">
    {/* 奥のレイヤー: 巨大なゴースト番号(空間的な奥行き) */}
    <span
      aria-hidden="true"
      className="font-mono text-star/4 pointer-events-none absolute -top-14 -left-3 select-none text-[8rem] leading-none font-bold md:text-[10rem]"
    >
      {number}
    </span>
    <div className="relative flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="font-mono text-pink text-sm">{number} /</span>
      <h2 className="font-name text-star text-4xl font-black tracking-wide md:text-5xl">{title}</h2>
      <span className="font-mincho text-star/60 hidden text-sm tracking-[0.25em] md:inline">
        {jp}
      </span>
    </div>
    <div className="from-pink/80 via-purple/50 mt-6 h-px w-28 bg-gradient-to-r to-transparent" />
  </Reveal>
);
