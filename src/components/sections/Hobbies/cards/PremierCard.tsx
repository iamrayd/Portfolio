"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";

import { getPremierTier, premierTiers, splitPremierRating } from "@/lib/gaming/ranks";

import { GameCard } from "./GameCard";
import styles from "./GameCard.module.css";
import premierStyles from "./PremierCard.module.css";
import { PLAY_DELAY, useCardPlayback } from "./useCardPlayback";

const COUNT_SECONDS = 2.2;
const numberFormat = new Intl.NumberFormat("en-US");

interface PremierCardProps {
  rating: number;
  hours: number;
  isFront: boolean;
  playToken: number;
}

export function PremierCard({ rating, hours, isFront, playToken }: PremierCardProps) {
  const mode = useCardPlayback(isFront, playToken);
  // Progress is tagged with its token so a stale count never leaks into a new play.
  const [progress, setProgress] = useState({ token: -1, value: 0 });

  useEffect(() => {
    if (mode !== "play") return;
    const controls = animate(0, rating, {
      duration: COUNT_SECONDS,
      ease: "easeOut",
      delay: PLAY_DELAY,
      onUpdate: (latest) => setProgress({ token: playToken, value: Math.round(latest) }),
    });
    return () => controls.stop();
  }, [mode, playToken, rating]);

  const value =
    mode === "final"
      ? rating
      : progress.token === playToken && mode === "play"
        ? progress.value
        : 0;
  const tier = getPremierTier(value);
  const { thousands, rest } = splitPremierRating(value);

  return (
    <GameCard
      publisher="Valve"
      label="Peak rating"
      title="CS2 Premier"
      accent={tier.color}
      footer={
        <>
          <span className={premierStyles.platform}>Steam</span>
          <span>{numberFormat.format(hours)} hrs on record</span>
        </>
      }
    >
      <div
        className={premierStyles.badge}
        style={{ "--tier": tier.color } as React.CSSProperties}
        role="img"
        aria-label={`Premier rating ${numberFormat.format(rating)}`}
      >
        <span className={premierStyles.bars} aria-hidden="true">
          <b />
          <b />
          <b />
        </span>
        <span className={premierStyles.rating} aria-hidden="true">
          <span className={premierStyles.thousands}>{thousands}</span>
          <span className={premierStyles.rest}>{rest}</span>
        </span>
      </div>

      <ol className={premierStyles.ladder} aria-hidden="true">
        {premierTiers.map((item) => (
          <li
            key={item.name}
            data-active={item === tier}
            style={{ "--tier": item.color } as React.CSSProperties}
          />
        ))}
      </ol>
      <p className={styles.caption}>{tier.name} tier</p>
    </GameCard>
  );
}
