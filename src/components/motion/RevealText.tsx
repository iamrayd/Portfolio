"use client";

import { motion, type Variants } from "motion/react";

import styles from "./RevealText.module.css";

interface RevealTextProps {
  text: string;
  /** Trailing words rendered in the accent color. */
  accent?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  visible: { y: "0%", rotate: 0, transition: { duration: 0.9 } },
};

/** Heading whose words slide up from behind a mask, one after another. */
export function RevealText({ text, accent, as = "h2", className, id }: RevealTextProps) {
  const Component = motion[as];
  const words = [
    ...text.split(" ").map((value) => ({ value, accent: false })),
    ...(accent?.split(" ").map((value) => ({ value, accent: true })) ?? []),
  ];

  return (
    <Component
      id={id}
      className={className}
      aria-label={accent ? `${text} ${accent}` : text}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {words.map((item, index) => (
        <span key={index} className={styles.mask} aria-hidden="true">
          <motion.span className={item.accent ? styles.accent : styles.word} variants={word}>
            {item.value}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
