import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * About: Hero のガラス質感を引き継いだパネルに自己紹介を載せ、
 * 興味はステッカーを貼ったような傾きのあるチップで並べる
 */

const INTERESTS: { label: string; accent: string; tilt: number }[] = [
  { label: "コード", accent: "#f2549e", tilt: -2 },
  { label: "グラフィック", accent: "#a6d3ea", tilt: 1.5 },
  { label: "音楽", accent: "#8b5cf6", tilt: -1 },
  { label: "メイク", accent: "#f2c4dc", tilt: 2 },
  { label: "服", accent: "#f2e85c", tilt: -1.5 },
  { label: "ことば", accent: "#a6d3ea", tilt: 1 },
];

export const About = () => (
  <section id="about" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="01" title="ABOUT" jp="こういう人間です" />
    <Reveal delay={0.08}>
      {/* Hero の名前と同じ「透けるガラス」の言語をパネルとして継承 */}
      <div
        className="mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)" }}
      >
        <p className="text-pale text-lg leading-loose">
          人や物事の中にある違和感や矛盾を拾って、言葉や表現にするのが好きです。
          デザイン、音楽、服、文章など手段は違っても、「その人らしさ」や
          「まだ名前のない感覚」を形にすることに惹かれます。
        </p>
      </div>
    </Reveal>
    <Reveal delay={0.16}>
      <ul className="mt-10 flex max-w-2xl flex-wrap gap-3">
        {INTERESTS.map((interest) => (
          <li
            key={interest.label}
            className="text-pale hover:text-star cursor-default rounded-full border bg-white/[0.03] px-5 py-2 text-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            style={{
              borderColor: `${interest.accent}99`,
              rotate: `${interest.tilt}deg`,
            }}
            onPointerEnter={(event) => {
              event.currentTarget.style.boxShadow = `0 6px 24px ${interest.accent}55`;
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
            }}
          >
            {interest.label}
          </li>
        ))}
      </ul>
    </Reveal>
    <Reveal delay={0.24}>
      <p className="font-mono mt-12 text-xs text-[#666c96]">
        {"\u{1F47D}"} &gt; you found nothing. yet.
      </p>
    </Reveal>
  </section>
);
