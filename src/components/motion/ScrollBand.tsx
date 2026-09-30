"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import styles from "./ScrollBand.module.css";

interface ScrollBandProps {
  /** Words repeated along each row. */
  words: readonly string[];
}

const REPEAT = 4;

/** Two rows of giant outlined text that slide in opposite directions as you scroll. */
export function ScrollBand({ words }: ScrollBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  const row = Array.from({ length: REPEAT }, () => words).flat();

  return (
    <div ref={ref} className={styles.band} aria-hidden="true">
      <motion.div className={styles.row} style={{ x: forward }}>
        {row.map((word, index) => (
          <span key={index} className={index % 2 ? styles.outline : styles.solid}>
            {word}
            <b className={styles.star}>✳</b>
          </span>
        ))}
      </motion.div>
      <motion.div className={styles.row} style={{ x: backward }}>
        {row.map((word, index) => (
          <span key={index} className={index % 2 ? styles.solid : styles.outline}>
            {word}
            <b className={styles.star}>✳</b>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
