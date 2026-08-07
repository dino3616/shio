import { SectionHeader } from "~/components/section-header";

const INTERESTS = ["コード", "グラフィック", "音楽", "メイク", "服", "ことば"];

export const About = () => (
  <section id="about" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="01" title="ABOUT" jp="こういう人間です" />
    <p className="text-pale mt-10 max-w-2xl text-lg leading-loose">
      人や物事の中にある違和感や矛盾を拾って、言葉や表現にするのが好きです。
      デザイン、音楽、服、文章など手段は違っても、「その人らしさ」や
      「まだ名前のない感覚」を形にすることに惹かれます。
    </p>
    <ul className="mt-10 flex max-w-2xl flex-wrap gap-3">
      {INTERESTS.map((interest) => (
        <li
          key={interest}
          className="border-pink/60 text-pale hover:border-pink hover:text-star rounded-full border px-5 py-2 text-sm transition-colors"
        >
          {interest}
        </li>
      ))}
    </ul>
    <p className="font-mono mt-12 text-xs text-[#666c96]">
      {"\u{1F47D}"} &gt; you found nothing. yet.
    </p>
  </section>
);
