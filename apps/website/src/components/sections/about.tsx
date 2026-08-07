import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * About: Hero のガラス質感を引き継いだパネルに自己紹介を載せ、
 * 興味はステッカーを貼ったような傾きのあるチップで並べる。
 * 右側には本人の写真とブランドイラストをコラージュ風に重ねる
 */

const INTERESTS: { label: string; tilt: number }[] = [
  { label: "コード", tilt: -2 },
  { label: "グラフィック", tilt: 1.5 },
  { label: "音楽", tilt: -1 },
  { label: "メイク", tilt: 2 },
  { label: "服", tilt: -1.5 },
  { label: "ことば", tilt: 1 },
];

export const About = () => (
  <section id="about" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="01" title="ABOUT" jp="こういう人間です" />
    <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
      <div className="max-w-2xl flex-1">
        <Reveal delay={0.08}>
          {/* Hero の名前と同じ「透けるガラス」の言語をパネルとして継承 */}
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md"
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
          <ul className="mt-10 flex flex-wrap gap-3">
            {INTERESTS.map((interest) => (
              <li
                key={interest.label}
                className="border-star/25 text-pale hover:border-star/70 hover:text-star cursor-default rounded-full border bg-white/[0.03] px-5 py-2 text-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_6px_24px_rgba(247,242,250,0.18)]"
                style={{ rotate: `${interest.tilt}deg` }}
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
      </div>

      {/* 写真+イラストのコラージュ: モチーフと同じく傾けて貼る */}
      <Reveal delay={0.2} className="relative self-center lg:self-start">
        <div className="relative h-64 w-64 md:h-72 md:w-72">
          <img
            src="/about-photo.jpg"
            alt="shio のポートレート"
            width={720}
            height={720}
            className="h-full w-full rotate-3 rounded-2xl border border-white/15 object-cover"
            style={{ boxShadow: "0 14px 50px rgba(139, 92, 246, 0.35)" }}
          />
          <img
            src="/about-illust.png"
            alt="shio のブランドイラスト"
            width={480}
            height={480}
            className="float-slower absolute -bottom-8 -left-10 w-28 -rotate-8 rounded-2xl border border-white/20 md:w-32"
            style={{ boxShadow: "0 10px 34px rgba(242, 84, 158, 0.35)" }}
          />
        </div>
      </Reveal>
    </div>
  </section>
);
