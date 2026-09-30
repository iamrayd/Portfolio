"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent } from "react";

import styles from "./TiltCard.module.css";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  maxTilt?: number;
}

const spring = { stiffness: 180, damping: 18 };

/** Card that tilts toward the pointer in 3D with a soft red glare. */
export function TiltCard({ children, className, maxTilt = 7 }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-maxTilt, maxTilt]), spring);
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgb(255 45 45 / 0.16), transparent 60%)`;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div className={styles.perspective}>
      <motion.div
        className={`${styles.card} ${className ?? ""}`}
        style={{ rotateX, rotateY }}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
      >
        {children}
        <motion.div className={styles.glare} style={{ background: glare }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
