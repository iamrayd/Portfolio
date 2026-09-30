"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin red bar along the top edge that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        position: "fixed",
        inset: "0 0 auto",
        height: 2,
        zIndex: 70,
        transformOrigin: "0 50%",
        background: "var(--accent)",
        boxShadow: "0 0 12px var(--accent)",
      }}
    />
  );
}
