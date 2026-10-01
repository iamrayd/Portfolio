"use server";

import {
  ensureVisitorId,
  isRoundDurationValid,
  readLeaderboard,
  roundResultSchema,
  type RoundResult,
} from "@/lib/aim/leaderboard";
import { leaderboardDay, type Leaderboard } from "@/lib/aim/rules";
import { scoreStore } from "@/lib/aim/store";

export type StartRoundResult = { ranked: boolean };

export type SubmitRoundResult =
  | { status: "saved"; leaderboard: Leaderboard; isNewBest: boolean }
  /** The round failed the server checks. */
  | { status: "rejected" }
  /** No database, or it couldn't be reached; the round was just for fun. */
  | { status: "unranked" };

/** Marks the start of a ranked round; the score is only accepted after a full round. */
export async function startAimRound(): Promise<StartRoundResult> {
  if (!scoreStore) return { ranked: false };

  try {
    const visitorId = await ensureVisitorId();
    await scoreStore.startRound(visitorId, Date.now());
    return { ranked: true };
  } catch (error) {
    console.error("Failed to start aim round", error);
    return { ranked: false };
  }
}

export async function submitAimRound(result: RoundResult): Promise<SubmitRoundResult> {
  if (!scoreStore) return { status: "unranked" };

  const parsed = roundResultSchema.safeParse(result);
  const visitorId = await ensureVisitorId();

  try {
    const startedAt = await scoreStore.takeRound(visitorId);
    if (!parsed.success || startedAt === null || !isRoundDurationValid(startedAt)) {
      return { status: "rejected" };
    }

    // One day for the whole submission, so a round ending at midnight is compared consistently.
    const day = leaderboardDay();
    const previous = await scoreStore.standing(day, visitorId);
    await scoreStore.saveBest(day, visitorId, parsed.data.score);

    return {
      status: "saved",
      leaderboard: await readLeaderboard(scoreStore, visitorId, day),
      isNewBest: !previous || parsed.data.score > previous.score,
    };
  } catch (error) {
    console.error("Failed to save aim score", error);
    return { status: "unranked" };
  }
}
