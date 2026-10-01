import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  LEADERBOARD_SIZE,
  leaderboardDay,
  MAX_HITS_PER_ROUND,
  MAX_POINTS_PER_HIT,
  ROUND_MS,
  type Leaderboard,
} from "./rules";
import type { ScoreStore } from "./store";

const VISITOR_COOKIE = "aim_visitor";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
/** Allowance for network latency on top of the round length. */
const LATE_SUBMIT_MS = 15_000;
const MAX_SHOTS_PER_ROUND = 600;

/** Anonymous id kept in an httpOnly cookie; it only ever identifies a browser. */
export async function readVisitorId(): Promise<string | null> {
  const value = (await cookies()).get(VISITOR_COOKIE)?.value;
  return value && z.uuid().safeParse(value).success ? value : null;
}

/** Reads the visitor id, creating it on first play. Only callable from actions and routes. */
export async function ensureVisitorId(): Promise<string> {
  const existing = await readVisitorId();
  if (existing) return existing;

  const id = randomUUID();
  (await cookies()).set(VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  return id;
}

/** Public tag for a visitor; hashed so the cookie value is never exposed. */
function tagFor(visitorId: string): string {
  return `#${createHash("sha256").update(visitorId).digest("hex").slice(0, 4).toUpperCase()}`;
}

/** Today's top scores, plus where the visitor stands. */
export async function readLeaderboard(
  store: ScoreStore,
  visitorId: string | null,
  day = leaderboardDay(),
): Promise<Leaderboard> {
  const [top, standing] = await Promise.all([
    store.top(day, LEADERBOARD_SIZE),
    visitorId ? store.standing(day, visitorId) : null,
  ]);

  const entries = top.map((record, index) => ({
    rank: index + 1,
    tag: tagFor(record.visitorId),
    score: record.score,
    isYou: record.visitorId === visitorId,
  }));
  const you =
    visitorId && standing
      ? { rank: standing.rank + 1, tag: tagFor(visitorId), score: standing.score, isYou: true }
      : null;

  return { entries, you };
}

export const roundResultSchema = z
  .object({
    score: z.int().min(0),
    hits: z.int().min(0).max(MAX_HITS_PER_ROUND),
    shots: z.int().min(0).max(MAX_SHOTS_PER_ROUND),
  })
  .refine((round) => round.hits <= round.shots && round.score <= round.hits * MAX_POINTS_PER_HIT);

export type RoundResult = z.infer<typeof roundResultSchema>;

/** A round counts only if it was started on the server and lasted the full length. */
export function isRoundDurationValid(startedAt: number, now = Date.now()): boolean {
  const elapsed = now - startedAt;
  return elapsed >= ROUND_MS && elapsed <= ROUND_MS + LATE_SUBMIT_MS;
}
