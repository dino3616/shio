import { useMotionValue, useSpring } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * 訪問者のカーソルを追いかける目玉。
 * atan2 で方向を出し、バネ物理(減衰振動)で追従させる
 * (design-direction: 視線のインタラクション = 二大モチーフ直結の主演出)。
 * マイクロサッカード(微細な揺れ)と瞬きで「生きている」感を出す。
 */
export const Eye = ({ size = 200 }: { size?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  // 少しだけ揺れて止まるバネ: 不穏さはやりすぎない
  const x = useSpring(targetX, { stiffness: 160, damping: 15, mass: 0.6 });
  const y = useSpring(targetY, { stiffness: 160, damping: 15, mass: 0.6 });

  const maxOffset = size * 0.16;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) / 6, maxOffset);
      targetX.set(Math.cos(angle) * distance);
      targetY.set(Math.sin(angle) * distance);
    };
    window.addEventListener("pointermove", handlePointerMove);

    // マイクロサッカード: 800〜2000ms ごとに視線がわずかに泳ぐ
    let saccadeTimer = 0;
    const scheduleSaccade = () => {
      saccadeTimer = window.setTimeout(
        () => {
          targetX.set(targetX.get() + (Math.random() - 0.5) * size * 0.03);
          targetY.set(targetY.get() + (Math.random() - 0.5) * size * 0.03);
          scheduleSaccade();
        },
        800 + Math.random() * 1200,
      );
    };
    scheduleSaccade();

    // 瞬き: 3〜8秒ごと
    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(
        () => {
          setIsBlinking(true);
          window.setTimeout(() => {
            setIsBlinking(false);
          }, 130);
          scheduleBlink();
        },
        3000 + Math.random() * 5000,
      );
    };
    scheduleBlink();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.clearTimeout(saccadeTimer);
      window.clearTimeout(blinkTimer);
    };
  }, [targetX, targetY, size, maxOffset]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: "#f7f2fa",
        boxShadow: "0 0 60px 8px rgba(242, 84, 158, 0.45), inset 0 0 30px rgba(24, 28, 63, 0.25)",
      }}
      aria-hidden="true"
    >
      {/* 虹彩+瞳孔(バネ追従) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.54,
          height: size * 0.54,
          left: size * 0.23,
          top: size * 0.23,
          x,
          y,
          background: "radial-gradient(circle at 42% 38%, #8b5cf6 0%, #f2549e 78%)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "44%",
            height: "44%",
            left: "28%",
            top: "28%",
            background: "#0e0a14",
          }}
        />
        <div
          className="absolute rounded-full bg-white"
          style={{ width: "18%", height: "18%", left: "22%", top: "20%" }}
        />
      </motion.div>
      {/* まぶた */}
      <div
        className="absolute inset-0 origin-top transition-transform duration-100 ease-in"
        style={{
          background: "#181c3f",
          transform: isBlinking ? "scaleY(1)" : "scaleY(0)",
        }}
      />
    </div>
  );
};
