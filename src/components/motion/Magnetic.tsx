"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

interface MagneticProps {
  children: React.ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
}

const spring = { stiffness: 220, damping: 16, mass: 0.4 };

/** Pulls its child slightly toward a mouse pointer hovering over it. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
