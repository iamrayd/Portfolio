"use client";

import { useCallback, useEffect, useReducer, useRef, type RefObject } from "react";

import { startAimRound, submitAimRound, type SubmitRoundResult } from "@/app/actions/aim";
import {
  MAX_LIVE_TARGETS,
  pointsForHit,
  ROUND_MS,
  SPAWN_INTERVAL_MS,
  type Leaderboard,
} from "@/lib/aim/rules";

/** Between rounds, a few slower targets drift in just for fun. */
const IDLE_SPAWN_INTERVAL_MS = 1_100;
const IDLE_LIVE_TARGETS = 2;
const MIN_RADIUS = 14;
const MAX_RADIUS = 24;
/** Clearance between targets, page content and the arena edges. */
const CLEARANCE = 12;
const SPAWN_ATTEMPTS = 40;

export type Phase = "idle" | "starting" | "playing" | "submitting" | "done";

export interface Target {
  id: number;
  x: number;
  y: number;
  radius: number;
}

export interface Burst {
  id: number;
  x: number;
  y: number;
  /** Points shown above the pop; null for warm-up hits. */
  points: number | null;
}

export interface RoundStats {
  score: number;
  hits: number;
  shots: number;
  streak: number;
}

export type BoardState =
  { status: "loading" } | { status: "offline" } | { status: "ready"; leaderboard: Leaderboard };

interface GameState {
  phase: Phase;
  targets: Target[];
  bursts: Burst[];
  stats: RoundStats;
  ranked: boolean;
  endsAt: number;
  outcome: SubmitRoundResult | null;
  board: BoardState;
  nextId: number;
}

type GameAction =
  | { type: "spawn"; spot: Omit<Target, "id"> }
  | { type: "hit"; id: number }
  | { type: "expire"; id: number }
  | { type: "miss" }
  | { type: "clearBurst"; id: number }
  | { type: "start" }
  | { type: "begin"; ranked: boolean; endsAt: number }
  | { type: "end" }
  | { type: "finish"; outcome: SubmitRoundResult }
  | { type: "board"; board: BoardState };

const emptyStats: RoundStats = { score: 0, hits: 0, shots: 0, streak: 0 };

const initialState: GameState = {
  phase: "idle",
  targets: [],
  bursts: [],
  stats: emptyStats,
  ranked: false,
  endsAt: 0,
  outcome: null,
  board: { status: "loading" },
  nextId: 0,
};

const maxLiveTargets = (phase: Phase) =>
  phase === "playing" ? MAX_LIVE_TARGETS : IDLE_LIVE_TARGETS;

function reducer(state: GameState, action: GameAction): GameState {
  const playing = state.phase === "playing";

  switch (action.type) {
    case "spawn": {
      if (state.targets.length >= maxLiveTargets(state.phase)) return state;
      const target = { ...action.spot, id: state.nextId };
      return { ...state, targets: [...state.targets, target], nextId: state.nextId + 1 };
    }
    case "hit": {
      const target = state.targets.find((candidate) => candidate.id === action.id);
      if (!target) return state;

      const streak = state.stats.streak + 1;
      const points = playing ? pointsForHit(streak) : null;
      const stats = playing
        ? {
            score: state.stats.score + (points ?? 0),
            hits: state.stats.hits + 1,
            shots: state.stats.shots + 1,
            streak,
          }
        : state.stats;

      return {
        ...state,
        stats,
        targets: state.targets.filter((candidate) => candidate.id !== action.id),
        bursts: [...state.bursts, { id: target.id, x: target.x, y: target.y, points }],
      };
    }
    case "expire":
      return {
        ...state,
        targets: state.targets.filter((target) => target.id !== action.id),
        stats: playing ? { ...state.stats, streak: 0 } : state.stats,
      };
    case "miss":
      if (!playing) return state;
      return { ...state, stats: { ...state.stats, shots: state.stats.shots + 1, streak: 0 } };
    case "clearBurst":
      return { ...state, bursts: state.bursts.filter((burst) => burst.id !== action.id) };
    case "start":
      return { ...state, phase: "starting", targets: [], stats: emptyStats, outcome: null };
    case "begin":
      return { ...state, phase: "playing", ranked: action.ranked, endsAt: action.endsAt };
    case "end":
      return { ...state, phase: "submitting", targets: [] };
    case "finish": {
      const { outcome } = action;
      const board: BoardState =
        outcome.status === "saved"
          ? { status: "ready", leaderboard: outcome.leaderboard }
          : state.board;
      return { ...state, phase: "done", outcome, board };
    }
    case "board":
      return { ...state, board: action.board };
  }
}

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function circleClearsRect(x: number, y: number, radius: number, rect: Rect): boolean {
  const nearestX = Math.max(rect.left, Math.min(x, rect.right));
  const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));
  return Math.hypot(x - nearestX, y - nearestY) > radius + CLEARANCE;
}

/** Picks a random spot in the arena that avoids content marked with `data-aim-solid`. */
function findSpot(arena: HTMLElement, targets: Target[]): Omit<Target, "id"> | null {
  const bounds = arena.getBoundingClientRect();
  const solids: Rect[] = [
    ...(arena.closest("section")?.querySelectorAll("[data-aim-solid]") ?? []),
  ].map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left - bounds.left,
      top: rect.top - bounds.top,
      right: rect.right - bounds.left,
      bottom: rect.bottom - bounds.top,
    };
  });

  // Only the part of the section on screen, below the fixed header, is in play.
  const header = parseFloat(getComputedStyle(arena).getPropertyValue("--header-height")) || 0;
  const visibleTop = Math.max(0, header - bounds.top);
  const visibleBottom = Math.min(bounds.height, window.innerHeight - bounds.top);

  for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt++) {
    const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
    const margin = radius + CLEARANCE;
    if (visibleBottom - visibleTop < 2 * margin) return null;

    const x = margin + Math.random() * (bounds.width - 2 * margin);
    const y = visibleTop + margin + Math.random() * (visibleBottom - visibleTop - 2 * margin);

    const clear =
      solids.every((rect) => circleClearsRect(x, y, radius, rect)) &&
      targets.every((other) => Math.hypot(x - other.x, y - other.y) > radius + other.radius);
    if (clear) return { x, y, radius };
  }
  return null;
}

/**
 * Aim trainer state: warm-up targets between rounds, and timed ranked rounds
 * whose score is verified and stored on the server.
 */
export function useAimGame(arenaRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { phase, targets, stats } = state;
  const spawning = phase === "playing" || (enabled && (phase === "idle" || phase === "done"));

  // Timers read the latest values through refs so they aren't restarted on every hit.
  const targetsRef = useRef(targets);
  const statsRef = useRef(stats);
  useEffect(() => {
    targetsRef.current = targets;
    statsRef.current = stats;
  }, [targets, stats]);

  useEffect(() => {
    if (!spawning) return;
    const spawn = () => {
      const arena = arenaRef.current;
      const spot = arena && findSpot(arena, targetsRef.current);
      if (spot) dispatch({ type: "spawn", spot });
    };
    const interval = phase === "playing" ? SPAWN_INTERVAL_MS : IDLE_SPAWN_INTERVAL_MS;
    const timer = window.setInterval(spawn, interval);
    return () => window.clearInterval(timer);
  }, [spawning, phase, arenaRef]);

  // Load the leaderboard the first time the game becomes playable.
  const boardRequested = useRef(false);
  useEffect(() => {
    if (!enabled || boardRequested.current) return;
    boardRequested.current = true;
    fetch("/api/aim/leaderboard")
      .then((response) => (response.ok ? (response.json() as Promise<Leaderboard>) : null))
      .catch(() => null)
      .then((leaderboard) =>
        dispatch({
          type: "board",
          board: leaderboard ? { status: "ready", leaderboard } : { status: "offline" },
        }),
      );
  }, [enabled]);

  // Clicks on empty space during a round count as misses.
  useEffect(() => {
    const area = arenaRef.current?.closest("section");
    if (!area || phase !== "playing") return;
    const onPointerDown = (event: PointerEvent) => {
      const element = event.target as Element;
      if (element.closest("[data-aim-target], [data-aim-solid], button, a")) return;
      dispatch({ type: "miss" });
    };
    area.addEventListener("pointerdown", onPointerDown);
    return () => area.removeEventListener("pointerdown", onPointerDown);
  }, [phase, arenaRef]);

  // End the round on time, then submit it if it was started as a ranked round.
  const { ranked, endsAt } = state;
  useEffect(() => {
    if (phase !== "playing") return;
    const finish = async () => {
      dispatch({ type: "end" });
      const { score, hits, shots } = statsRef.current;
      const outcome: SubmitRoundResult = ranked
        ? await submitAimRound({ score, hits, shots }).catch(() => ({ status: "unranked" }))
        : { status: "unranked" };
      dispatch({ type: "finish", outcome });
    };
    const timer = window.setTimeout(finish, endsAt - Date.now());
    return () => window.clearTimeout(timer);
  }, [phase, ranked, endsAt]);

  const start = useCallback(async () => {
    dispatch({ type: "start" });
    const { ranked } = await startAimRound().catch(() => ({ ranked: false }));
    dispatch({ type: "begin", ranked, endsAt: Date.now() + ROUND_MS });
  }, []);

  return {
    state,
    start,
    hit: useCallback((id: number) => dispatch({ type: "hit", id }), []),
    expire: useCallback((id: number) => dispatch({ type: "expire", id }), []),
    clearBurst: useCallback((id: number) => dispatch({ type: "clearBurst", id }), []),
  };
}
