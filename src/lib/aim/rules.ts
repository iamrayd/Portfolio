/** Aim game rules, shared by the client game and the server-side score check. */

export const ROUND_MS = 30_000;
export const SPAWN_INTERVAL_MS = 450;
export const TARGET_LIFE_MS = 2_400;
export const MAX_LIVE_TARGETS = 3;

const BASE_POINTS = 100;
const STREAK_BONUS = 10;
const MAX_STREAK_STEPS = 10;

/** Points for a hit; `streak` counts consecutive hits including this one. */
export function pointsForHit(streak: number): number {
  return BASE_POINTS + Math.min(Math.max(streak - 1, 0), MAX_STREAK_STEPS) * STREAK_BONUS;
}

export const MAX_POINTS_PER_HIT = pointsForHit(MAX_STREAK_STEPS + 1);

/** The most targets one round can ever spawn, which caps hits and score. */
export const MAX_HITS_PER_ROUND = Math.ceil(ROUND_MS / SPAWN_INTERVAL_MS) + MAX_LIVE_TARGETS;

export const LEADERBOARD_SIZE = 5;

export interface LeaderboardEntry {
  rank: number;
  /** Short anonymous tag derived from the visitor id, e.g. "#A3F2". */
  tag: string;
  score: number;
  isYou: boolean;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  /** The current visitor's standing, whether or not it made the top list. */
  you: LeaderboardEntry | null;
}
