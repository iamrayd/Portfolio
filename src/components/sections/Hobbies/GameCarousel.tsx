"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useInView } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";

import { gamingStats } from "@/data/gaming";

import { FaceitCard } from "./cards/FaceitCard";
import { PremierCard } from "./cards/PremierCard";
import { ValorantCard } from "./cards/ValorantCard";
import styles from "./Hobbies.module.css";

const games = [
  { id: "valorant", label: "Valorant" },
  { id: "cs2", label: "CS2 Premier" },
  { id: "faceit", label: "FACEIT" },
] as const;

type Position = "front" | "right" | "left";

function positionOf(index: number, front: number): Position {
  const offset = (index - front + games.length) % games.length;
  return offset === 0 ? "front" : offset === 1 ? "right" : "left";
}

/**
 * Three game cards in a triangle: one in front, two blurred behind.
 * The card that reaches the front plays its rank animation.
 */
export function GameCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [front, setFront] = useState(0);
  const [moves, setMoves] = useState(0);

  // 0 until the section is first seen; each rotation after that replays the front card.
  const playToken = inView ? moves + 1 : 0;

  const rotate = (step: 1 | -1) => {
    setFront((current) => (current + step + games.length) % games.length);
    setMoves((count) => count + 1);
  };

  const bringToFront = (index: number) => {
    if (index === front) return;
    setFront(index);
    setMoves((count) => count + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") rotate(1);
    if (event.key === "ArrowLeft") rotate(-1);
  };

  const cards = {
    valorant: (isFront: boolean) => (
      <ValorantCard
        rankId={gamingStats.valorant.peakRank}
        isFront={isFront}
        playToken={playToken}
      />
    ),
    cs2: (isFront: boolean) => (
      <PremierCard
        rating={gamingStats.cs2.premierRating}
        hours={gamingStats.cs2.hoursOnRecord}
        isFront={isFront}
        playToken={playToken}
      />
    ),
    faceit: (isFront: boolean) => (
      <FaceitCard elo={gamingStats.faceit.elo} isFront={isFront} playToken={playToken} />
    ),
  };

  return (
    <div
      ref={ref}
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Peak gaming ranks"
      onKeyDown={onKeyDown}
    >
      <div className={styles.stage}>
        {games.map((game, index) => {
          const position = positionOf(index, front);
          const isFront = position === "front";
          return (
            <div
              key={game.id}
              className={styles.slot}
              data-aim-solid
              data-pos={position}
              aria-roledescription="slide"
              aria-label={`${game.label}, ${index + 1} of ${games.length}`}
              aria-hidden={!isFront}
              onClick={() => bringToFront(index)}
            >
              {cards[game.id](isFront)}
            </div>
          );
        })}
      </div>

      <div className={styles.controls} data-aim-solid>
        <button type="button" onClick={() => rotate(-1)} aria-label="Previous game">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <p className={styles.status} aria-live="polite">
          {games[front].label}
        </p>
        <button type="button" onClick={() => rotate(1)} aria-label="Next game">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
