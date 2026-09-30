"use client";

import { useReducedMotion } from "motion/react";

/** Pause (seconds) so the animation starts after the card has slid to the front. */
export const PLAY_DELAY = 0.45;

export type PlaybackMode = "start" | "play" | "final";

/**
 * Decides what a hobby card shows:
 * - "final" when it sits behind the front card (or motion is reduced),
 * - "start" when it's in front but the section hasn't been seen yet,
 * - "play" when it should run its animation for the current `playToken`.
 */
export function useCardPlayback(isFront: boolean, playToken: number): PlaybackMode {
  const reduceMotion = useReducedMotion();
  if (!isFront || reduceMotion) return "final";
  return playToken === 0 ? "start" : "play";
}
