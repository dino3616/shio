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
 * 写真の右上角にべちゃっとへばりつくプランクトン。
 * ゆるい三角形のアメーバで、大部分は写真の内側にあり、頭だけが角の外に少しはみ出す。
 * 写真の角は svg 座標 (72, 24) に一致する(写真と同じ回転ラッパーの中に置く前提)
 */
const PerchedPlankton = () => (
  <div className="absolute -top-6 -right-6 z-10">
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
        d="M 22 21 C 28 21 33 17 40 15.5 C 49 13 63 9 74 11 C 82 12 87 18 85 26 C 83 33 78 38 76.5 44 C 75.5 49 75.5 53 75.5 58 C 75.5 65 66 68 60 60.5 C 55 52 46 44 38 37.5 C 31 33 25 25 22 21 Z"
      >
        <animate
          attributeName="d"
          values="M 22 21 C 28 21 33 17 40 15.5 C 49 13 63 9 74 11 C 82 12 87 18 85 26 C 83 33 78 38 76.5 44 C 75.5 49 75.5 53 75.5 58 C 75.5 65 66 68 60 60.5 C 55 52 46 44 38 37.5 C 31 33 25 25 22 21 Z;M 19 21 C 25 21 31 16 38 14 C 48 11 64 7 75 10 C 83 11 89 17 86 25 C 84 31 79 37 77 43 C 76 48 75.5 52 75.5 56 C 75.5 63 68 70 59 62 C 54 53 44 46 36 39 C 29 35 21 25 19 21 Z;M 25 21 C 30 21 34 18 44 16.5 C 52 14 62 10 73 12 C 81 13.5 86 19 84 27 C 81 36 77 39 76 45 C 75.5 50 75.5 55 75.5 60 C 75 67 64 66 59 59 C 55 50 50 42 41 35 C 34 30 28 26 25 21 Z;M 22 21 C 28 21 33 17 40 15.5 C 49 13 63 9 74 11 C 82 12 87 18 85 26 C 83 33 78 38 76.5 44 C 75.5 49 75.5 53 75.5 58 C 75.5 65 66 68 60 60.5 C 55 52 46 44 38 37.5 C 31 33 25 25 22 21 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 本体: 角(72,24)をまたぐゆるい三角形。左足の角は上辺(y=24)、下足の角は右辺(x=72)に乗って接する */}
      <path
        fill="#d8c2f5"
        opacity="0.92"
        d="M 26 24 C 31 24 35 21 41 19 C 49 16.5 62 13 72 14.5 C 79 15.5 83 20 81 26 C 79 32 75 36 73.5 42 C 72.5 47 72 51 72 56 C 72 61.5 66 63 62.5 57.5 C 58 49 49 41 41 34.5 C 35 30 29 27 26 24 Z"
      >
        <animate
          attributeName="d"
          values="M 26 24 C 31 24 35 21 41 19 C 49 16.5 62 13 72 14.5 C 79 15.5 83 20 81 26 C 79 32 75 36 73.5 42 C 72.5 47 72 51 72 56 C 72 61.5 66 63 62.5 57.5 C 58 49 49 41 41 34.5 C 35 30 29 27 26 24 Z;M 23 24 C 28 24 33 20 39 18 C 48 15 63 11 72 13.5 C 80 14 85 19 82 25 C 80 30 76 35 74 41 C 73 46 72 50 72 54 C 72 60 67 65 62 59 C 57 50 47 43 39 36 C 33 32 26 27 23 24 Z;M 29 24 C 33 24 36 22 43 20 C 51 17.5 61 14 71 15.5 C 78 17 82 21 80 27 C 78 34 74 37 73 43 C 72.5 48 72 53 72 58 C 71.5 64 65 62 61 56 C 57 47 51 39 43 33 C 37 28.5 32 26 29 24 Z;M 26 24 C 31 24 35 21 41 19 C 49 16.5 62 13 72 14.5 C 79 15.5 83 20 81 26 C 79 32 75 36 73.5 42 C 72.5 47 72 51 72 56 C 72 61.5 66 63 62.5 57.5 C 58 49 49 41 41 34.5 C 35 30 29 27 26 24 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      {/* 単眼: 角の内側。ゆっくりあたりを見回す */}
      <circle cx="64" cy="30" r="8" fill="#ffffff" />
      <circle cy="31" r="4" fill="#201a2e">
        <animate attributeName="cx" values="62;67;62;61;62" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="66.5" cy="28" r="1.3" fill="#ffffff" />
      {/* ほっぺ: しずく型。長軸をそれぞれの足の向きと平行にする */}
      <ellipse
        cx="48"
        cy="26"
        rx="4.2"
        ry="2.8"
        fill="#f2549e"
        opacity="0.4"
        transform="rotate(-18 48 26)"
      />
      <ellipse
        cx="66"
        cy="47"
        rx="2.5"
        ry="3.8"
        fill="#f2549e"
        opacity="0.4"
        transform="rotate(6 66 47)"
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
