import styles from "./GameCard.module.css";

interface GameCardProps {
  publisher: string;
  label: string;
  title: string;
  /** Halo color behind the card; can change live (e.g. with the current tier). */
  accent: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Borderless hobby card: content floating on a dark orb with a soft colored halo. */
export function GameCard({ publisher, label, title, accent, children, footer }: GameCardProps) {
  return (
    <article className={styles.card} style={{ "--game-accent": accent } as React.CSSProperties}>
      <span className={styles.orb} aria-hidden="true" />
      <p className={styles.meta}>
        {publisher} <span aria-hidden="true">·</span> {label}
      </p>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
      {footer && <p className={styles.footer}>{footer}</p>}
    </article>
  );
}
