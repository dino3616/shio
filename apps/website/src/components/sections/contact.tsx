/**
 * Contact: UFO との交信(content-plan: 「交信」っぽく。UFO や電波モチーフ)。
 * 虹は「動きの瞬間」だけの原則に従い、ビームは常時薄く+ホバーで強く。
 */

const Ufo = ({ size = 170 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.5}
    viewBox="0 0 180 90"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 4px 22px rgba(139, 92, 246, 0.45))" }}
  >
    <defs>
      <linearGradient id="ufo-dome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d8ecf6" />
        <stop offset="100%" stopColor="#a6d3ea" />
      </linearGradient>
      <linearGradient id="ufo-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f7d3e4" />
        <stop offset="55%" stopColor="#f2c4dc" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <ellipse cx="90" cy="38" rx="36" ry="22" fill="url(#ufo-dome)" opacity="0.9" />
    <ellipse cx="80" cy="30" rx="10" ry="6" fill="#ffffff" opacity="0.55" />
    <ellipse cx="90" cy="55" rx="84" ry="23" fill="url(#ufo-body)" />
    <ellipse cx="90" cy="48" rx="84" ry="17" fill="#f7f2fa" opacity="0.25" />
    <circle cx="40" cy="55" r="5" fill="#f2549e" />
    <circle cx="90" cy="61" r="5" fill="#f2e85c" />
    <circle cx="140" cy="55" r="5" fill="#f2549e" />
  </svg>
);

export const Contact = () => (
  <section id="contact" className="group relative z-10 flex flex-col items-center px-8 pt-28 pb-16">
    <Ufo />
    {/* 虹のビーム: 常時は薄く、ホバーで強く(虹は動きの瞬間だけ) */}
    <div
      className="pointer-events-none -mt-2 h-64 w-72 opacity-40 transition-opacity duration-700 group-hover:opacity-90"
      style={{
        clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
        background:
          "linear-gradient(to bottom, rgba(242, 84, 158, 0.55), rgba(242, 232, 92, 0.28) 45%, rgba(166, 211, 234, 0.05))",
      }}
    />
    <div className="-mt-44 flex flex-col items-center">
      <h2 className="font-display text-star text-4xl font-bold tracking-wide md:text-5xl">
        CONTACT
      </h2>
      <p className="font-pixel text-ice mt-4 text-sm">交信を待っています</p>
      <a
        href="mailto:shio3616@gmail.com"
        className="bg-pink mt-8 rounded-full px-10 py-4 font-medium text-[#0e0a14] transition-shadow duration-300 hover:shadow-[0_0_40px_8px_rgba(242,84,158,0.5)]"
      >
        交信する →
      </a>
      <p className="font-mono text-ice mt-8 text-sm">
        <a
          href="https://github.com/dino3616"
          target="_blank"
          rel="noreferrer"
          className="hover:text-pink transition-colors"
        >
          GitHub
        </a>
        {" ・ "}
        <a
          href="https://x.com/dino3616"
          target="_blank"
          rel="noreferrer"
          className="hover:text-pink transition-colors"
        >
          X
        </a>
        {" ・ "}
        <a href="mailto:shio3616@gmail.com" className="hover:text-pink transition-colors">
          mail
        </a>
      </p>
    </div>
    <footer className="mt-24 pb-2">
      <p className="font-mono text-xs text-[#666c96]">
        © 2026 shio🧂 — built with Bun, served from the edge ▚ UNDER CONSTRUCTION ▞
      </p>
    </footer>
  </section>
);
