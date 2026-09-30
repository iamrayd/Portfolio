"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel distance in pixels. */
  distance?: number;
  as?: "div" | "li" | "article" | "figure";
}

/**
 * Fades and lifts its children the first time they scroll into view.
 * Only opacity and transform animate, so the GPU handles it without repaints.
 */
export function Reveal({ children, className, delay = 0, distance = 40, as = "div" }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay }}
    >
      {children}
    </Component>
  );
}
