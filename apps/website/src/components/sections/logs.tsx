import { useState } from "react";
import { Reveal } from "~/components/reveal";
import { SectionHeader } from "~/components/section-header";

/**
 * Logs: 更新され続ける日誌。
 * - NOW PLAYING は「受信機」。まだ電波が来ていないあいだは選局針が彷徨う
 *   (嘘のイコライザーや進捗バーは置かない)
 * - スキンケア/メイクは「調合棚」。実際の手順をポーション瓶として順番に並べる
 * - 受信ログに実際の出来事が積もっていく(MCP 経由の更新もここに行が増えていく)
 */

type PotionKind = "pump" | "tube" | "jar" | "spray" | "bottle" | "dropper" | "packet" | "pen";

type Potion = {
  name: string;
  kind: PotionKind;
  color: string;
};

const SKINCARE_POTIONS: Potion[] = [
  { name: "shu uemura アルティム8∞ クレンジングオイル", kind: "pump", color: "#a6d3ea" },
  { name: "Klairs ビタミンマスククレンザー", kind: "tube", color: "#f2c4dc" },
  { name: "Anua ライスブライトニング酵素洗顔パウダー", kind: "jar", color: "#c4a8f8" },
  { name: "Curel ディープモイスチャースプレー", kind: "spray", color: "#a6d3ea" },
  { name: "SKIN & LAB グルタチオンアンプルトナー", kind: "bottle", color: "#f2c4dc" },
  { name: "ルルルン ハイドラ EX マスク", kind: "packet", color: "#c4a8f8" },
  { name: "Anua アゼライン酸15カーミングセラム", kind: "dropper", color: "#a6d3ea" },
  { name: "medicube エクソソームシカアンプル", kind: "dropper", color: "#f2c4dc" },
  { name: "Anua レチノール0.3リニューイングセラム", kind: "dropper", color: "#c4a8f8" },
  { name: "LANEIGE バウンシースリーピングマスク", kind: "jar", color: "#a6d3ea" },
];

const MAKEUP_POTIONS: Potion[] = [
  { name: "クレ・ド・ポー ヴォワールコレクチュールn", kind: "tube", color: "#f2c4dc" },
  { name: "shu uemura セラムファンデーション 594", kind: "bottle", color: "#f2549e" },
  { name: "Dior スキンコレクトコンシーラー 1N", kind: "pen", color: "#f2e85c" },
  { name: "クレ・ド・ポー プードルトランスパラントn M", kind: "jar", color: "#f2c4dc" },
  { name: "KOSÉ MAKE KEEP MIST", kind: "spray", color: "#f2549e" },
];

const RECEPTION_LOG = [
  { date: "2026.08.10", text: "v3.shio.studio を放送開始" },
  { date: "2026.05.30", text: "スキンケアの調合レシピを改訂" },
  { date: "2025.03.15", text: "WebNavix を IPSJ 全国大会で発表" },
];

const SKIN_NOTE = "インナードライ (混合肌)。敏感肌ではない、はず";

const NOTION_URL = "https://shio3616.notion.site/2b63868163c7802cb502c1080c9df1d3";

/** ポーション瓶: 種類ごとの手続き的なかたち(viewBox 0 0 40 64、床は y=60) */
const PotionBottle = ({ kind, color }: { kind: PotionKind; color: string }) => {
  // キャップは背景の闇に沈まないよう、くすんだラベンダーの実色にする
  const cap = "#6b6084";
  const shine = "rgba(255, 255, 255, 0.4)";
  return (
    <svg viewBox="0 0 40 64" width="52" height="83" aria-hidden="true" role="presentation">
      {kind === "pump" && (
        <>
          <rect x="11" y="26" width="18" height="34" rx="4" fill={color} />
          <rect x="17" y="20" width="6" height="7" fill={cap} />
          <rect x="14" y="14" width="12" height="7" rx="2" fill={cap} />
          <rect x="25" y="15.5" width="8" height="3" rx="1.5" fill={cap} />
          <ellipse cx="16" cy="34" rx="2.4" ry="5" fill={shine} />
        </>
      )}
      {kind === "tube" && (
        <>
          <path d="M 13 24 L 27 24 L 28 53 Q 28 60 20 60 Q 12 60 12 53 Z" fill={color} />
          <rect x="11" y="19" width="18" height="4" rx="1.5" fill={cap} />
          <ellipse cx="17" cy="38" rx="2.2" ry="5" fill={shine} />
        </>
      )}
      {kind === "jar" && (
        <>
          <rect x="8" y="34" width="24" height="26" rx="6" fill={color} />
          <rect x="10" y="26" width="20" height="8" rx="3" fill={cap} />
          <ellipse cx="14" cy="44" rx="2.4" ry="4.5" fill={shine} />
        </>
      )}
      {kind === "spray" && (
        <>
          <rect x="13" y="24" width="14" height="36" rx="4" fill={color} />
          <rect x="13" y="13" width="10" height="9" rx="2" fill={cap} />
          <rect x="23" y="15" width="6" height="3.5" rx="1.5" fill={cap} />
          <ellipse cx="17" cy="34" rx="2" ry="5" fill={shine} />
        </>
      )}
      {kind === "bottle" && (
        <>
          <rect x="11" y="24" width="18" height="36" rx="6" fill={color} />
          <rect x="15" y="15" width="10" height="10" rx="2.5" fill={cap} />
          <ellipse cx="16" cy="34" rx="2.2" ry="5" fill={shine} />
        </>
      )}
      {kind === "dropper" && (
        <>
          <rect x="11" y="28" width="18" height="32" rx="6" fill={color} />
          <rect x="17" y="22" width="6" height="7" fill={cap} />
          <circle cx="20" cy="17" r="5" fill={cap} />
          <ellipse cx="16" cy="38" rx="2.2" ry="4.5" fill={shine} />
        </>
      )}
      {kind === "packet" && (
        <>
          <path
            d="M 9 26 Q 9 23 12 23 L 30 21 Q 33 21 33 24 L 34 56 Q 34 59 31 59 L 12 61 Q 9 61 9 58 Z"
            fill={color}
          />
          <line x1="10" y1="30" x2="33" y2="28" stroke={cap} strokeWidth="2" />
          <ellipse cx="16" cy="42" rx="2.4" ry="5" fill={shine} />
        </>
      )}
      {kind === "pen" && (
        <>
          <rect x="16" y="14" width="8" height="46" rx="4" fill={color} />
          <rect x="16" y="14" width="8" height="16" rx="4" fill={cap} />
          <ellipse cx="18.5" cy="42" rx="1.2" ry="6" fill={shine} />
        </>
      )}
    </svg>
  );
};

/** 調合棚: 瓶が調合順に並ぶ。ホバーで揺れて、棚下のキャプションに名前が浮かぶ */
const PotionShelf = ({
  label,
  potions,
  startNumber,
  onHover,
}: {
  label: string;
  potions: Potion[];
  startNumber: number;
  onHover: (name: string | null) => void;
}) => (
  <div>
    <p className="font-mono text-star/60 text-xs tracking-[0.25em]">{label}</p>
    <div className="mt-2 flex flex-wrap items-end gap-x-2.5 gap-y-4">
      {potions.map((potion, index) => (
        <div
          key={potion.name}
          className="potion flex cursor-default flex-col items-center"
          onPointerEnter={() => {
            onHover(`${String(startNumber + index).padStart(2, "0")} ${potion.name}`);
          }}
          onPointerLeave={() => {
            onHover(null);
          }}
        >
          <PotionBottle kind={potion.kind} color={potion.color} />
          <span className="font-mono text-star/45 mt-1 text-[10px]">
            {String(startNumber + index).padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
    {/* 棚板 */}
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(to right, rgba(242, 196, 220, 0.45), rgba(196, 168, 248, 0.25), transparent)",
      }}
    />
  </div>
);

/** 受信機: プレイリストの電波を待っている。選局針は電波を探して彷徨い続ける */
const RadioReceiver = () => (
  <div
    className="relative max-w-md rounded-3xl p-5"
    style={{
      background: "linear-gradient(165deg, #cfe4f2 0%, #a6d3ea 55%, #7fa8c9 100%)",
      boxShadow:
        "0 14px 50px rgba(139, 92, 246, 0.25), inset 0 2px 3px rgba(255, 255, 255, 0.6), inset 0 -3px 6px rgba(50, 80, 110, 0.4)",
    }}
  >
    {/* 周波数窓 */}
    <div
      className="relative overflow-hidden rounded-xl p-4"
      style={{
        background: "radial-gradient(ellipse at 40% 30%, #1c2244 0%, #0e0a14 90%)",
        boxShadow: "inset 0 0 22px rgba(0, 0, 0, 0.8)",
      }}
    >
      <p className="font-crt text-ice text-xl tracking-wider">
        ---.- MHz
        <span className="crt-blink ml-1.5">▮</span>
      </p>
      {/* 周波数バンド: 目盛りの上を針が彷徨う */}
      <div className="relative mt-3 h-6 overflow-hidden rounded">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(166, 211, 234, 0.55) 0 1px, transparent 1px 9px)",
            backgroundPosition: "center",
          }}
        />
        <div
          className="radio-needle absolute inset-y-0 w-0.5 rounded-full"
          style={{ background: "#f2549e", boxShadow: "0 0 6px rgba(242, 84, 158, 0.9)" }}
        />
      </div>
      <p className="text-pale/80 mt-3 text-sm leading-relaxed">
        受信待機中 — 最初の電波はまだ届いていない
      </p>
    </div>
    {/* スピーカーとツマミ */}
    <div className="mt-4 flex items-center justify-between px-1">
      <div
        className="h-8 w-28 rounded"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(50, 80, 110, 0.45) 0 2px, transparent 2px 7px)",
        }}
      />
      <div className="flex items-center gap-3">
        <span
          className="size-7 rounded-full"
          style={{
            background: "radial-gradient(circle at 34% 30%, #8fb6d4, #5b7f9e 75%)",
            boxShadow:
              "inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(30, 50, 70, 0.5)",
          }}
        />
        <span className="size-4 rounded-full bg-[#6e94b3] shadow-inner" />
      </div>
    </div>
    <p className="font-mono mt-3 ml-1 text-[10px] tracking-[0.3em] text-[#5b7f9e]">SHIO-WAVE 616</p>
  </div>
);

export const Logs = () => {
  const [hoveredPotion, setHoveredPotion] = useState<string | null>(null);

  return (
    <section id="logs" className="relative z-10 px-8 py-28 md:px-28">
      <SectionHeader number="04" title="LOGS" jp="更新され続ける日誌" />
      <div className="mt-14 grid items-start gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        {/* 左: 受信機と受信ログ */}
        <div>
          <Reveal delay={0.08}>
            <p className="font-crt text-prism text-lg tracking-wider">♪ NOW PLAYING</p>
            <div className="mt-4">
              <RadioReceiver />
            </div>
            <p className="font-mono text-ice mt-4 text-xs">playlists → 月替わりで受信予定</p>
          </Reveal>
          <Reveal delay={0.16} className="mt-12">
            <p className="font-mono text-star/60 text-xs tracking-[0.25em]">
              受信ログ / RECEPTION LOG
            </p>
            <div className="font-mono mt-4 space-y-2 text-xs leading-relaxed">
              {RECEPTION_LOG.map((entry) => (
                <p key={entry.date}>
                  <span className="text-pink">{entry.date}</span>
                  <span className="text-star/40"> ▸ </span>
                  <span className="text-pale/85">{entry.text}</span>
                </p>
              ))}
              <p className="text-ice/75">
                ♪ 次の受信を待機中<span className="crt-blink">▮</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* 右: 調合棚 */}
        <Reveal delay={0.2}>
          <p className="font-crt text-pale text-lg tracking-wider">☆ SKINCARE / MAKE-UP</p>
          <div className="mt-6 space-y-9">
            <PotionShelf
              label="スキンケア"
              potions={SKINCARE_POTIONS}
              startNumber={1}
              onHover={setHoveredPotion}
            />
            <PotionShelf
              label="メイク"
              potions={MAKEUP_POTIONS}
              startNumber={1}
              onHover={setHoveredPotion}
            />
          </div>
          {/* キャプション: ホバー中の瓶の名前、平時は肌質メモ */}
          <p className="text-star/60 mt-6 min-h-10 max-w-xl text-sm leading-relaxed">
            {hoveredPotion ?? SKIN_NOTE}
          </p>
          <a
            href={NOTION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-pink mt-2 inline-block text-xs underline-offset-4 hover:underline"
          >
            調合メモの全文 →
          </a>
        </Reveal>
      </div>
    </section>
  );
};
