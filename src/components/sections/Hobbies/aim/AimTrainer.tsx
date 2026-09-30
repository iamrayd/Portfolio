"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { SubmitRoundResult } from "@/app/actions/aim";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ROUND_MS, TARGET_LIFE_MS } from "@/lib/aim/rules";

import styles from "./AimTrainer.module.css";
import { LeaderboardList } from "./LeaderboardList";
import { useAimGame, type Burst, type Phase } from "./useAimGame";

/** Mouse-only and motion-heavy, so it's skipped on touch screens and for reduced motion. */
const PLAYABLE_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const PARTICLE_ANGLES = Array.from({ length: 10 }, (_, index) => index * 36);
const numberFormat = new Intl.NumberFormat("en-US");

/**
 * Aimlabs-style mini game for the hobbies section: targets pop up around the
 * carousel, and timed rounds post each visitor's best score to a leaderboard.
 */
export function AimTrainer() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const canPlay = useMediaQuery(PLAYABLE_QUERY);
  const inView = useInView(arenaRef, { amount: 0.3 });
  const { state, start, hit, expire, clearBurst } = useAimGame(arenaRef, canPlay && inView);
  const { phase, targets, bursts, stats, outcome, board } = state;

  const accuracy = stats.shots ? Math.round((stats.hits / stats.shots) * 100) : null;
  const busy = phase === "starting" || phase === "playing" || phase === "submitting";

  return (
    <>
      <div ref={arenaRef} className={styles.arena} aria-hidden="true">
        {targets.map((target) => (
          <span
            key={target.id}
            data-aim-target
            className={styles.target}
            style={{
              left: target.x,
              top: target.y,
              width: target.radius * 2,
              height: target.radius * 2,
              animationDuration: `${TARGET_LIFE_MS}ms`,
            }}
            onPointerDown={() => hit(target.id)}
            onAnimationEnd={() => expire(target.id)}
          />
        ))}
        {bursts.map((burst) => (
          <PopBurst key={burst.id} burst={burst} onDone={() => clearBurst(burst.id)} />
        ))}
      </div>

      <div className={styles.panel} data-aim-solid>
        <div className={styles.round}>
          <p className={styles.label}>Aim trainer · 30s round</p>
          <dl className={styles.stats}>
            <div>
              <dt>Score</dt>
              <dd>{numberFormat.format(stats.score)}</dd>
            </div>
            <div>
              <dt>Accuracy</dt>
              <dd>{accuracy === null ? "—" : `${accuracy}%`}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{phase === "playing" ? <Countdown endsAt={state.endsAt} /> : "30.0"}</dd>
            </div>
          </dl>
          <p className={styles.message} aria-live="polite">
            {messageFor(phase, outcome)}
          </p>
          <button type="button" className={styles.start} onClick={start} disabled={busy}>
            {phase === "done" ? "Play again" : busy ? "Round in progress" : "Start round"}
          </button>
        </div>
        <LeaderboardList board={board} />
      </div>
    </>
  );
}

function messageFor(phase: Phase, outcome: SubmitRoundResult | null): string {
  if (phase === "starting") return "Get ready…";
  if (phase === "playing") return "Pop as many as you can.";
  if (phase === "submitting") return "Saving your score…";
  if (phase === "idle" || !outcome)
    return "Warm up on the targets, then start a round to post a score.";

  if (outcome.status === "rejected") return "That round couldn't be verified, so it wasn't saved.";
  if (outcome.status === "unranked")
    return "The leaderboard is offline, so that one was just for fun.";

  const you = outcome.leaderboard.you;
  if (outcome.isNewBest)
    return you ? `New personal best. You're rank #${you.rank}.` : "New personal best.";
  return you
    ? `Your best is still ${numberFormat.format(you.score)} (rank #${you.rank}).`
    : "Score saved.";
}

function Countdown({ endsAt }: { endsAt: number }) {
  const [remaining, setRemaining] = useState(ROUND_MS);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, endsAt - Date.now()));
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return <>{(remaining / 1000).toFixed(1)}</>;
}

function PopBurst({ burst, onDone }: { burst: Burst; onDone: () => void }) {
  return (
    <span
      className={styles.burst}
      style={{ left: burst.x, top: burst.y }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone();
      }}
    >
      <span className={styles.ring} />
      {PARTICLE_ANGLES.map((angle) => (
        <span
          key={angle}
          className={styles.particle}
          style={{ "--angle": `${angle}deg` } as React.CSSProperties}
        />
      ))}
      {burst.points !== null && <span className={styles.points}>+{burst.points}</span>}
    </span>
  );
}
