"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const SIZE = 520;
const spring = { stiffness: 120, damping: 24, mass: 0.6 };

/** Soft red light that trails a mouse pointer; skipped for touch and reduced motion. */
export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const x = useSpring(useMotionValue(-SIZE), spring);
  const y = useSpring(useMotionValue(-SIZE), spring);

  useEffect(() => {
    if (reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX - SIZE / 2);
      y.set(event.clientY - SIZE / 2);
      setVisible(true);
    };
    const onPointerLeave = () => setVisible(false);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduceMotion, x, y]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x,
        y,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgb(255 45 45 / 0.07), transparent 65%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s",
      }}
    />
  );
}
