"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

/** Smooth scrolling and motion defaults shared by the whole page. */
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.1, anchors: true }}>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </MotionConfig>
    </ReactLenis>
  );
}
