import type { LeaderboardEntry } from "@/lib/aim/rules";

import styles from "./AimTrainer.module.css";
import type { BoardState } from "./useAimGame";

const numberFormat = new Intl.NumberFormat("en-US");

export function LeaderboardList({ board }: { board: BoardState }) {
  return (
    <div className={styles.board}>
      <p className={styles.label}>Today&apos;s leaderboard</p>
      {board.status === "loading" && <p className={styles.note}>Loading scores…</p>}
      {board.status === "offline" && <p className={styles.note}>Leaderboard is offline.</p>}
      {board.status === "ready" && <Rows {...board.leaderboard} />}
      <p className={styles.reset}>Resets daily at 12 AM, Philippine time</p>
    </div>
  );
}

function Rows({ entries, you }: { entries: LeaderboardEntry[]; you: LeaderboardEntry | null }) {
  if (entries.length === 0) {
    return <p className={styles.note}>No scores yet today. Set the first one.</p>;
  }

  const youOutsideTop = you && !entries.some((entry) => entry.isYou);
  return (
    <ol className={styles.rows}>
      {entries.map((entry) => (
        <Row key={entry.rank} entry={entry} />
      ))}
      {youOutsideTop && <Row entry={you} separated />}
    </ol>
  );
}

function Row({ entry, separated = false }: { entry: LeaderboardEntry; separated?: boolean }) {
  return (
    <li className={styles.row} data-you={entry.isYou} data-separated={separated}>
      <span className={styles.rank}>{entry.rank}</span>
      <span className={styles.tag}>
        {entry.tag}
        {entry.isYou && <span className={styles.you}>You</span>}
      </span>
      <span className={styles.score}>{numberFormat.format(entry.score)}</span>
    </li>
  );
}
