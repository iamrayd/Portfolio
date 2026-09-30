"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

import styles from "./Experiences.module.css";

/** Ordered list with a glowing rail that fills as the timeline scrolls past. */
export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <div ref={ref} className={styles.timeline}>
      <span className={styles.rail} aria-hidden="true" />
      <motion.span className={styles.railFill} style={{ scaleY }} aria-hidden="true" />
      <ol className={styles.list}>{children}</ol>
    </div>
  );
}
