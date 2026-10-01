import "server-only";

import { Redis } from "@upstash/redis";

/** Each day gets its own board; see `leaderboardDay`. */
const scoresKey = (day: string) => `aim:scores:${day}`;
/** Past boards are dropped automatically once they're old. */
const DAY_BOARD_TTL_SECONDS = 2 * 24 * 60 * 60;
const roundKey = (visitorId: string) => `aim:round:${visitorId}`;
/** A started round must be submitted within this window. */
const ROUND_TTL_SECONDS = 120;
/** Only the best scores are kept so storage stays bounded. */
const MAX_STORED_SCORES = 1000;

export interface ScoreRecord {
  visitorId: string;
  score: number;
}

export interface ScoreStore {
  startRound(visitorId: string, startedAt: number): Promise<void>;
  /** Returns when the visitor's pending round started, and consumes it. */
  takeRound(visitorId: string): Promise<number | null>;
  /** Stores the score only if it beats the visitor's best for that day. */
  saveBest(day: string, visitorId: string, score: number): Promise<void>;
  top(day: string, count: number): Promise<ScoreRecord[]>;
  /** Zero-based rank and best score that day, or null if the visitor has no score. */
  standing(day: string, visitorId: string): Promise<{ rank: number; score: number } | null>;
}

function createRedisStore(redis: Redis): ScoreStore {
  return {
    async startRound(visitorId, startedAt) {
      await redis.set(roundKey(visitorId), startedAt, { ex: ROUND_TTL_SECONDS });
    },
    async takeRound(visitorId) {
      return redis.getdel<number>(roundKey(visitorId));
    },
    async saveBest(day, visitorId, score) {
      const key = scoresKey(day);
      await redis
        .pipeline()
        .zadd(key, { gt: true }, { score, member: visitorId })
        .zremrangebyrank(key, 0, -(MAX_STORED_SCORES + 1))
        .expire(key, DAY_BOARD_TTL_SECONDS)
        .exec();
    },
    async top(day, count) {
      const flat = await redis.zrange<(string | number)[]>(scoresKey(day), 0, count - 1, {
        rev: true,
        withScores: true,
      });
      const records: ScoreRecord[] = [];
      for (let i = 0; i < flat.length; i += 2) {
        records.push({ visitorId: String(flat[i]), score: Number(flat[i + 1]) });
      }
      return records;
    },
    async standing(day, visitorId) {
      const [rank, score] = await redis
        .pipeline()
        .zrevrank(scoresKey(day), visitorId)
        .zscore(scoresKey(day), visitorId)
        .exec<[number | null, number | null]>();
      return rank === null || score === null ? null : { rank, score: Number(score) };
    },
  };
}

/** Local development stand-in so the game works without a database. */
function createMemoryStore(): ScoreStore {
  const rounds = new Map<string, number>();
  const boards = new Map<string, Map<string, number>>();
  const board = (day: string) => {
    if (!boards.has(day)) boards.set(day, new Map());
    return boards.get(day)!;
  };
  const sorted = (day: string) => [...board(day)].sort((a, b) => b[1] - a[1]);

  return {
    async startRound(visitorId, startedAt) {
      rounds.set(visitorId, startedAt);
    },
    async takeRound(visitorId) {
      const startedAt = rounds.get(visitorId) ?? null;
      rounds.delete(visitorId);
      return startedAt;
    },
    async saveBest(day, visitorId, score) {
      const scores = board(day);
      if (score > (scores.get(visitorId) ?? -1)) scores.set(visitorId, score);
    },
    async top(day, count) {
      return sorted(day)
        .slice(0, count)
        .map(([visitorId, score]) => ({ visitorId, score }));
    },
    async standing(day, visitorId) {
      const rank = sorted(day).findIndex(([id]) => id === visitorId);
      return rank === -1 ? null : { rank, score: board(day).get(visitorId)! };
    },
  };
}

function createStore(): ScoreStore | null {
  // Vercel's Upstash integration sets KV_*; a direct Upstash setup uses UPSTASH_*.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return createRedisStore(new Redis({ url, token }));
  if (process.env.NODE_ENV !== "development") return null;

  // Route handlers and actions are bundled separately in dev; share one store between them.
  const devGlobal = globalThis as typeof globalThis & { aimMemoryStore?: ScoreStore };
  devGlobal.aimMemoryStore ??= createMemoryStore();
  return devGlobal.aimMemoryStore;
}

/** The score store, or null when no database is configured in production. */
export const scoreStore = createStore();
