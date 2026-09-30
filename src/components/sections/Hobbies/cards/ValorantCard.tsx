"use client";

import { animate, motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { buildReel, getValorantRank } from "@/lib/gaming/ranks";

import { GameCard } from "./GameCard";
import styles from "./GameCard.module.css";
import reelStyles from "./ValorantCard.module.css";
import { PLAY_DELAY, useCardPlayback } from "./useCardPlayback";

const TILE_WIDTH = 84;
const TILE_GAP = 6;
const REEL_LENGTH = 48;
const WINNER_INDEX = 40;
const START_INDEX = 3;
const SPIN_SECONDS = 5.2;
/** Fast start, long glide to a stop, like a CS2 case opening. */
const SPIN_EASE = [0.08, 0.7, 0.12, 1] as const;
/** Valorant's signature red for the card halo. */
const VALORANT_RED = "#ff4655";

/** X offset that centers tile `index` under the marker (the strip starts at the reel's center). */
const offsetFor = (index: number) => -(index * (TILE_WIDTH + TILE_GAP) + TILE_WIDTH / 2);

interface ValorantCardProps {
  rankId: string;
  isFront: boolean;
  playToken: number;
}

export function ValorantCard({ rankId, isFront, playToken }: ValorantCardProps) {
  const mode = useCardPlayback(isFront, playToken);
  const winner = getValorantRank(rankId);
  // Seeded by the play token so every spin differs but server and client agree.
  const reel = useMemo(
    () => buildReel(winner, REEL_LENGTH, WINNER_INDEX, playToken + 1),
    [winner, playToken],
  );

  const x = useMotionValue(offsetFor(mode === "start" ? START_INDEX : WINNER_INDEX));
  const [landedToken, setLandedToken] = useState(-1);
  const landed = mode === "final" || (mode === "play" && landedToken === playToken);

  useEffect(() => {
    if (mode !== "play") {
      x.set(offsetFor(mode === "start" ? START_INDEX : WINNER_INDEX));
      return;
    }

    // Land slightly off-center, then settle onto the winner, as the real reel does.
    const jitter = (Math.random() - 0.5) * (TILE_WIDTH - 16);
    x.set(offsetFor(START_INDEX));
    const spin = animate(x, offsetFor(WINNER_INDEX) + jitter, {
      duration: SPIN_SECONDS,
      ease: SPIN_EASE,
      delay: PLAY_DELAY,
    });
    let settle: ReturnType<typeof animate> | undefined;
    spin.then(() => {
      settle = animate(x, offsetFor(WINNER_INDEX), { duration: 0.35, ease: "easeOut" });
      settle.then(() => setLandedToken(playToken));
    });

    return () => {
      spin.stop();
      settle?.stop();
    };
  }, [mode, playToken, x]);

  return (
    <GameCard publisher="Riot Games" label="Peak rank" title="Valorant" accent={VALORANT_RED}>
      <div className={reelStyles.reel}>
        <span className={reelStyles.marker} aria-hidden="true" />
        <motion.ul className={reelStyles.strip} style={{ x }} aria-hidden="true">
          {reel.map((rank, index) => (
            <li
              key={index}
              className={reelStyles.tile}
              data-winner={landed && index === WINNER_INDEX}
              style={{ "--rank-color": rank.color } as React.CSSProperties}
            >
              <Image src={rank.icon} alt="" width={62} height={62} loading="eager" />
              <span>{rank.name.replace(/ \d$/, "")}</span>
            </li>
          ))}
        </motion.ul>
      </div>
      <p className={styles.result} aria-live="polite">
        {landed ? winner.name : ""}
      </p>
      <p className={styles.caption}>Competitive</p>
    </GameCard>
  );
}
