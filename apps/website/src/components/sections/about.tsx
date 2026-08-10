import { ConstellationTimeline } from "~/components/constellation-timeline";
import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";
import { SkillEyes } from "~/components/skill-eyes";

/**
 * About: 「自分は誰か」に集中するセクション(content-plan の確定構成)。
 * アイデンティティ / ステートメント / スタンス / 興味 / できること / 経歴星座。
 * now 系は Logs、作品の熱量は Playground の管轄なのでここには置かない
 */

const INTERESTS: { label: string; comment: string; tilt: number }[] = [
  { label: "コード", comment: "Web標準と数学が好き", tilt: -2 },
  { label: "グラフィック", comment: "かわいさと不穏、矛盾の同居が好き", tilt: 1.5 },
  { label: "音楽", comment: "歌唱音声合成とメタルを行き来してる", tilt: -1 },
  { label: "メイク", comment: "ベースメイクには一家言あり", tilt: 2 },
  { label: "服", comment: "リメイクして着るのが好き", tilt: -1.5 },
  { label: "ことば", comment: "倫理学を愛でてる", tilt: 1 },
];

const STANCE_STEPS = [
  { label: "観察する", color: "#f2c4dc" },
  { label: "ことばにする", color: "#c4a8f8" },
  { label: "世界観にする", color: "#a6d3ea" },
];

// 点線の弧(できることの矢印と同じ言語)。粒子が左から右へ流れる
const STANCE_ARCS = ["M 60 26 Q 152 46 244 26", "M 276 26 Q 368 46 460 26"];

const STAR_PATH = "M 0 -9 L 2.3 -2.3 L 9 0 L 2.3 2.3 L 0 9 L -2.3 2.3 L -9 0 L -2.3 -2.3 Z";

/** スタンスのミニ星座: 3つの星を点線の弧で結び、粒子が左から右へ流れる */
const StanceFlow = () => (
  <svg
    viewBox="0 0 520 76"
    className="h-auto w-full max-w-lg overflow-visible"
    role="img"
    aria-label="観察する、ことばにする、世界観にする"
  >
    {STANCE_ARCS.map((d, arcIndex) => (
      <g key={d}>
        <path
          d={d}
          fill="none"
          stroke="rgba(247, 242, 250, 0.22)"
          strokeWidth="1"
          strokeDasharray="2 5"
          strokeLinecap="round"
        />
        <g className="motion-reduce:hidden">
          <circle r="2.2" fill={STANCE_STEPS[arcIndex]?.color ?? "#f2c4dc"} opacity="0.85">
            <animateMotion dur="3.8s" repeatCount="indefinite" path={d} />
          </circle>
          <circle r="1.4" fill="#f7f2fa" opacity="0.6">
            <animateMotion dur="3.8s" begin="-1.9s" repeatCount="indefinite" path={d} />
          </circle>
        </g>
      </g>
    ))}
    {STANCE_STEPS.map((step, stepIndex) => {
      const x = 44 + stepIndex * 216;
      return (
        <g key={step.label} transform={`translate(${x}, 26)`}>
          <path
            d={STAR_PATH}
            fill={step.color}
            style={{ filter: `drop-shadow(0 0 6px ${step.color}aa)` }}
          >
            <animate
              attributeName="opacity"
              values="0.75;1;0.75"
              dur="3.2s"
              begin={`${stepIndex * 0.9}s`}
              repeatCount="indefinite"
            />
          </path>
          <text
            y="40"
            textAnchor="middle"
            fontSize="15"
            fill="#f7f2fa"
            style={{ fontFamily: '"Shippori Mincho", serif', letterSpacing: "0.12em" }}
          >
            {step.label}
          </text>
        </g>
      );
    })}
  </svg>
);

/**
 * 写真の右上角にへばりつくプランクトン。
 * 上辺と右辺の2辺に沿う三角形で、内側の斜辺だけがゆっくり不定形にうねる。
 * 写真と同じ回転ラッパーの中に置く前提(角に正確に沿わせるため)
 */
const PerchedPlankton = () => (
  <div className="absolute -top-2 -right-2 z-10">
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="overflow-visible"
      aria-hidden="true"
      role="presentation"
    >
      {/* 外殻のにじみ: 本体よりひとまわり大きい同形 */}
      <path
        fill="#c4a8f8"
        opacity="0.3"
        d="M 15 5.5 C 24 5 31 7.5 39 6 C 47 4.5 55 7 63 5 C 70 5 75.5 9 75.5 16 C 75 27 72.5 33 74.5 40 C 73 47 75.5 52 75.5 59 C 75.5 65.5 70.5 68.5 62.5 64 C 53 57.5 45 50.5 37.5 42.5 C 30 34.5 22 24 17.5 16 C 15 11.5 14 7.5 15 5.5 Z"
      >
        <animate
          attributeName="d"
          values="M 15 5.5 C 24 5 31 7.5 39 6 C 47 4.5 55 7 63 5 C 70 5 75.5 9 75.5 16 C 75 27 72.5 33 74.5 40 C 73 47 75.5 52 75.5 59 C 75.5 65.5 70.5 68.5 62.5 64 C 53 57.5 45 50.5 37.5 42.5 C 30 34.5 22 24 17.5 16 C 15 11.5 14 7.5 15 5.5 Z;M 11 5.5 C 24 7.5 31 4.5 39 7.5 C 47 8 55 5 63 5 C 70 5 75.5 9 75.5 16 C 73 27 75.5 33 73.5 40 C 75.5 47 73 52 75.5 55 C 75.5 62 69.5 66 61 60.5 C 50 53 40.5 47 32.5 39 C 25.5 32 17 21 13 12.5 C 11.5 9.5 10.5 6.5 11 5.5 Z;M 18 6 C 26 5.5 33 8.5 40 5.5 C 48 6.5 56 8.5 64 5 C 70.5 5 75.5 9 75.5 17 C 75.5 27 71.5 34 74.5 41 C 73.5 48 74.5 53 75.5 62 C 75.5 68.5 71 71.5 63.5 66.5 C 55.5 61 48 55.5 41.5 48.5 C 34 40.5 25 26.5 21 20 C 18.5 15 17 8 18 6 Z;M 15 5.5 C 24 5 31 7.5 39 6 C 47 4.5 55 7 63 5 C 70 5 75.5 9 75.5 16 C 75 27 72.5 33 74.5 40 C 73 47 75.5 52 75.5 59 C 75.5 65.5 70.5 68.5 62.5 64 C 53 57.5 45 50.5 37.5 42.5 C 30 34.5 22 24 17.5 16 C 15 11.5 14 7.5 15 5.5 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 本体: 上辺と右辺は写真の内側に向かって波打ちながら縁に沿う。頭と両足先は丸いキャップ、斜辺は大きくうねる */}
      <path
        fill="#d8c2f5"
        opacity="0.9"
        d="M 18 8 C 26 8 33 11 40 9 C 47 7.5 54 11 62 8 C 67.5 8 72 11.5 72 17 C 71.5 26 69 33 71 39 C 69.5 46 72 51 72 57 C 72 62 68.5 64.5 63.5 61 C 55 55 47 48 40 40 C 33 32 25 23 21 16 C 19 12.5 17.5 9.5 18 8 Z"
      >
        <animate
          attributeName="d"
          values="M 18 8 C 26 8 33 11 40 9 C 47 7.5 54 11 62 8 C 67.5 8 72 11.5 72 17 C 71.5 26 69 33 71 39 C 69.5 46 72 51 72 57 C 72 62 68.5 64.5 63.5 61 C 55 55 47 48 40 40 C 33 32 25 23 21 16 C 19 12.5 17.5 9.5 18 8 Z;M 14 8 C 26 10.5 33 8 40 10.5 C 47 11 54 8.5 62 8 C 67.5 8 72 11.5 72 17 C 69.5 26 72 33 70 39 C 72 46 69.5 51 72 53 C 72 59 68 62.5 62.5 58.5 C 52 51 43 45 35 37 C 28 30 20 20 16 13 C 14.5 10.5 13.5 8.8 14 8 Z;M 21 8 C 28 8.5 33 12 40 8.2 C 48 9.5 56 12 63 8 C 68 8 72 11.5 72 18 C 72 27 68.5 34 71.5 41 C 70.5 48 71.5 53 72 60 C 72 65 69 68 64.5 64 C 57 58 50 53 44 46 C 37 38 28 25 24 19 C 22 14.5 20.5 9.5 21 8 Z;M 18 8 C 26 8 33 11 40 9 C 47 7.5 54 11 62 8 C 67.5 8 72 11.5 72 17 C 71.5 26 69 33 71 39 C 69.5 46 72 51 72 57 C 72 62 68.5 64.5 63.5 61 C 55 55 47 48 40 40 C 33 32 25 23 21 16 C 19 12.5 17.5 9.5 18 8 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 単眼: 角の近くの厚みのあるところ。ゆっくりあたりを見回す */}
      <circle cx="56" cy="22" r="8.5" fill="#ffffff" />
      <circle cy="23" r="4.2" fill="#201a2e">
        <animate attributeName="cx" values="54;59;54;53;54" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="58.5" cy="20" r="1.4" fill="#ffffff" />
      {/* ほっぺ */}
      <circle cx="40" cy="17" r="2.8" fill="#f2549e" opacity="0.4" />
      <circle cx="64" cy="40" r="2.8" fill="#f2549e" opacity="0.4" />
    </svg>
  </div>
);

export const About = () => (
  <section id="about" className="relative z-10 px-8 py-28 md:px-28">
    <SectionHeader number="01" title="ABOUT" jp="こういう人間です" />
    <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
      <div className="max-w-2xl flex-1">
        {/* アイデンティティ: 肩書き → 名前(主役) → ローマ字+ハンドルの階層 */}
        <Reveal delay={0.08}>
          <div className="relative">
            {/* 名前の背後の光だまり */}
            <div
              className="pointer-events-none absolute -inset-x-10 -inset-y-8"
              style={{
                background:
                  "radial-gradient(ellipse 55% 90% at 18% 45%, rgba(242, 84, 158, 0.1), transparent 70%), radial-gradient(ellipse 45% 80% at 52% 55%, rgba(139, 92, 246, 0.08), transparent 70%)",
              }}
            />
            <p className="font-mono text-pink relative text-xs tracking-[0.3em]">
              ENGINEER × DESIGNER
            </p>
            <p className="font-name text-star relative mt-3 text-4xl font-bold md:text-5xl">
              塩畑 晴人
            </p>
            <div className="relative mt-4 flex flex-wrap items-center gap-3">
              <p className="font-mono text-star/60 text-sm tracking-[0.08em]">Haruto Shiohata</p>
              <span className="font-mono text-pale bg-void/50 rounded-full border border-white/15 px-3 py-1 text-xs">
                shio🧂
              </span>
            </div>
          </div>
        </Reveal>

        {/* ステートメント: 枠を持たず、縁の消える光だまりに浮かぶ言葉 */}
        <Reveal delay={0.14}>
          <div className="relative mt-10 max-w-xl">
            <div
              className="pointer-events-none absolute -inset-x-12 -inset-y-10"
              style={{
                background:
                  "radial-gradient(ellipse 72% 65% at 42% 50%, rgba(196, 168, 248, 0.08), transparent 72%)",
              }}
            />
            <p className="text-pale relative text-lg leading-loose">
              人や物事の中にある違和感や矛盾を拾って、言葉や表現にするのが好きです。
              デザイン、音楽、服、文章など手段は違っても、「その人らしさ」や
              「まだ名前のない感覚」を形にすることに惹かれます。
            </p>
            <p className="text-pale relative mt-5 text-lg leading-loose">
              好奇心は強いけれど、考えすぎるところもあります。それでも結局、
              ずっと人に興味があります。自分の中の矛盾も含めて、面白がりながら、
              かたちにしていきたい。
            </p>
          </div>
        </Reveal>

        {/* 仕事のスタンス: 3つの星を粒子が渡っていくミニ星座 */}
        <Reveal delay={0.2}>
          <div className="mt-12">
            <StanceFlow />
            <p className="text-star/50 mt-3 text-sm leading-relaxed">
              違和感に気づいて、名前を付けて、ひとつの世界に組み上げる。仕事の進め方はいつもこの順番です。
            </p>
          </div>
        </Reveal>

        {/* 興味: ステッカー風チップ+ホバー/フォーカスで人柄コメント */}
        <Reveal delay={0.26}>
          <ul className="mt-10 flex max-w-2xl flex-wrap gap-3">
            {INTERESTS.map((interest) => (
              <li
                key={interest.label}
                className="group relative"
                style={{ rotate: `${interest.tilt}deg` }}
              >
                <button
                  type="button"
                  className="text-pale hover:border-star/70 hover:text-star focus-visible:border-star/70 bg-void/50 cursor-default rounded-full border border-white/15 px-5 py-2 text-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_6px_24px_rgba(247,242,250,0.18)] focus:outline-none"
                >
                  {interest.label}
                </button>
                {/* 人柄コメントの吹き出し */}
                <span
                  role="tooltip"
                  className="bg-navy/90 text-pale pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[11px] whitespace-nowrap opacity-0 backdrop-blur-sm transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
                >
                  {interest.comment}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="font-mono mt-12 text-xs text-[#666c96]">
            {"\u{1F47D}"} &gt; you found nothing. yet.
          </p>
        </Reveal>
      </div>

      {/* 写真+イラストのコラージュ: モチーフと同じく傾けて貼る */}
      <Reveal delay={0.2} className="relative self-center lg:self-start">
        <div className="relative h-64 w-64 md:h-72 md:w-72">
          {/* 写真とプランクトンを同じ回転に入れて、角に沿わせる */}
          <div className="relative h-full w-full rotate-3">
            <img
              src="/about-photo.jpg"
              alt="shio のポートレート"
              width={720}
              height={720}
              className="h-full w-full rounded-2xl border border-white/15 object-cover"
              style={{ boxShadow: "0 14px 50px rgba(139, 92, 246, 0.35)" }}
            />
            <PerchedPlankton />
          </div>
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

    {/* できること: ふたつの目(img11再解釈)。瞳の宇宙の狭間でふたりが寄り添う */}
    <Reveal delay={0.1} className="mt-20">
      <h3 className="font-mincho text-star/80 text-sm tracking-[0.3em]">できること</h3>
      <div className="mt-8">
        <SkillEyes />
      </div>
    </Reveal>

    {/* これまでの軌跡: 夜空の星座 */}
    <Reveal delay={0.1} className="mt-20">
      <h3 className="font-mincho text-star/80 text-sm tracking-[0.3em]">これまでの軌跡</h3>
      <ConstellationTimeline />
    </Reveal>
  </section>
);
