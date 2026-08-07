import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * スクロールで視界に入ったときにバネ物理で浮かび上がる汎用ラッパー
 * (design-direction: 数学的モーション。フェードではなく減衰振動で現れる)
 */
export const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const reducedMotion = useReducedMotion();
  if (reducedMotion === true) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ type: "spring", stiffness: 65, damping: 15, delay }}
    >
      {children}
    </motion.div>
  );
};
