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
 * 写真の右上角に乗っているプランクトン。
 * 角をまたいで写真の内外にはみ出す不定形のアメーバで、輪郭全体がゆっくりうねる。
 * svg の中心が写真の角に一致するよう配置する(写真と同じ回転ラッパーの中に置く前提)
 */
const PerchedPlankton = () => (
  <div className="absolute -top-12 -right-12 z-10">
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      className="overflow-visible"
      aria-hidden="true"
      role="presentation"
    >
      {/* 外殻のにじみ: 本体よりひとまわり大きい同形 */}
      <path
        fill="#c4a8f8"
        opacity="0.3"
        d="M 48 7 C 63 5 76 12 80 26 C 84 38 74 46 79 57 C 84 70 70 83 56 81 C 46 79 41 85 31 80 C 19 75 12 64 17 53 C 21 45 12 38 18 27 C 23 15 37 9 48 7 Z"
      >
        <animate
          attributeName="d"
          values="M 48 7 C 63 5 76 12 80 26 C 84 38 74 46 79 57 C 84 70 70 83 56 81 C 46 79 41 85 31 80 C 19 75 12 64 17 53 C 21 45 12 38 18 27 C 23 15 37 9 48 7 Z;M 47 10 C 64 6 78 15 80 28 C 82 40 77 48 80 59 C 83 71 68 81 55 79 C 45 76 39 82 30 77 C 20 72 14 61 18 51 C 23 43 14 36 20 26 C 26 15 36 12 47 10 Z;M 49 6 C 66 5 77 13 81 25 C 86 36 75 47 79 58 C 84 72 69 85 55 82 C 46 80 40 84 30 79 C 18 73 11 62 16 52 C 20 44 13 37 19 28 C 24 14 38 8 49 6 Z;M 48 7 C 63 5 76 12 80 26 C 84 38 74 46 79 57 C 84 70 70 83 56 81 C 46 79 41 85 31 80 C 19 75 12 64 17 53 C 21 45 12 38 18 27 C 23 15 37 9 48 7 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 本体: 角をまたぐアメーバ。輪郭全体が不定形にうねる */}
      <path
        fill="#d8c2f5"
        opacity="0.92"
        d="M 48 12 C 60 10 72 16 76 28 C 79 38 70 46 75 56 C 79 68 68 78 56 76 C 47 74.5 42 80 33 76 C 23 71.5 17 62 21 53 C 24 46 17 38 22 29 C 26 19 38 14 48 12 Z"
      >
        <animate
          attributeName="d"
          values="M 48 12 C 60 10 72 16 76 28 C 79 38 70 46 75 56 C 79 68 68 78 56 76 C 47 74.5 42 80 33 76 C 23 71.5 17 62 21 53 C 24 46 17 38 22 29 C 26 19 38 14 48 12 Z;M 47 15 C 61 11 74 19 76 30 C 77 40 73 48 76 58 C 78 68 66 76 55 74 C 46 72 40 77 32 73 C 24 68 19 59 22 51 C 26 44 19 36 24 28 C 29 19 37 17 47 15 Z;M 49 11 C 63 10 73 17 77 27 C 81 37 71 47 75 57 C 79 69 67 80 55 77 C 47 75 41 79 32 75 C 22 70 16 61 20 52 C 23 45 18 37 23 29 C 27 18 39 13 49 11 Z;M 48 12 C 60 10 72 16 76 28 C 79 38 70 46 75 56 C 79 68 68 78 56 76 C 47 74.5 42 80 33 76 C 23 71.5 17 62 21 53 C 24 46 17 38 22 29 C 26 19 38 14 48 12 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 単眼: ゆっくりあたりを見回す */}
      <circle cx="58" cy="34" r="8.5" fill="#ffffff" />
      <circle cy="35" r="4.2" fill="#201a2e">
        <animate attributeName="cx" values="56;61;56;55;56" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="60.5" cy="32" r="1.4" fill="#ffffff" />
      {/* 空胞: しずく型の斑点 */}
      <ellipse
        cx="40"
        cy="30"
        rx="3"
        ry="4.5"
        fill="#b493ec"
        opacity="0.55"
        transform="rotate(-12 40 30)"
      />
      <ellipse
        cx="61"
        cy="52"
        rx="2.6"
        ry="4"
        fill="#b493ec"
        opacity="0.55"
        transform="rotate(10 61 52)"
      />
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
