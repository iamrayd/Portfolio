"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";

import { FACEIT_MAX_LEVEL, getFaceitColor, getFaceitLevel } from "@/lib/gaming/ranks";

import { GameCard } from "./GameCard";
import styles from "./GameCard.module.css";
import faceitStyles from "./FaceitCard.module.css";
import { PLAY_DELAY, useCardPlayback } from "./useCardPlayback";

const COUNT_SECONDS = 2;
/** The level ring is a 288° arc; these are its dash lengths on a r=35 circle. */
const ARC_LENGTH = 176;
const ARC_GAP = 44;
const numberFormat = new Intl.NumberFormat("en-US");

interface FaceitCardProps {
  elo: number;
  isFront: boolean;
  playToken: number;
}

export function FaceitCard({ elo, isFront, playToken }: FaceitCardProps) {
  const mode = useCardPlayback(isFront, playToken);
  const [progress, setProgress] = useState({ token: -1, value: 0 });

  useEffect(() => {
    if (mode !== "play") return;
    const controls = animate(0, elo, {
      duration: COUNT_SECONDS,
      ease: "easeOut",
      delay: PLAY_DELAY,
      onUpdate: (latest) => setProgress({ token: playToken, value: Math.round(latest) }),
    });
    return () => controls.stop();
  }, [mode, playToken, elo]);

  const value =
    mode === "final" ? elo : progress.token === playToken && mode === "play" ? progress.value : 0;
  const level = getFaceitLevel(value);
  const color = getFaceitColor(level);
  const filled = (ARC_LENGTH * level) / FACEIT_MAX_LEVEL;

  return (
    <GameCard publisher="FACEIT" label="Peak level" title="FACEIT" accent={color}>
      <svg
        className={faceitStyles.badge}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`FACEIT level ${getFaceitLevel(elo)}`}
      >
        <circle cx="50" cy="50" r="42" fill="#15151b" />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#26262e"
          strokeWidth="7"
          strokeDasharray={`${ARC_LENGTH} ${ARC_GAP}`}
          transform="rotate(126 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled} 400`}
          transform="rotate(126 50 50)"
        />
        <text x="50" y="61" textAnchor="middle" className={faceitStyles.level} fill={color}>
          {level}
        </text>
      </svg>
      <p className={styles.result}>Level {level}</p>
      <p className={faceitStyles.elo}>{numberFormat.format(value)} ELO</p>
    </GameCard>
  );
}
