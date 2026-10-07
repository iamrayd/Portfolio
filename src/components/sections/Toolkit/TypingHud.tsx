import styles from "./TypingHud.module.css";

interface TypingHudProps {
  buffer: string;
  lastLit: string | null;
  litCount: number;
  total: number;
}

/** Floating status bar that echoes what the visitor is typing. */
export function TypingHud({ buffer, lastLit, litCount, total }: TypingHudProps) {
  const isVisible = Boolean(buffer || lastLit);
  const label = lastLit ? (litCount === total ? "All lit" : "Lit") : "Typing";

  return (
    <div
      className={styles.hud}
      data-visible={isVisible}
      data-lit={Boolean(lastLit)}
      role="status"
      aria-live="polite"
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {lastLit ?? buffer}
        <span className={styles.caret} aria-hidden="true">
          _
        </span>
      </span>
      <span className={styles.count}>
        {litCount}/{total}
      </span>
    </div>
  );
}
