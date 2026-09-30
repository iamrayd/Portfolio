import type { ProjectArt as ProjectArtVariant } from "@/data/portfolio";

import styles from "./ProjectArt.module.css";

/** Decorative CSS illustrations standing in for project screenshots. */
export function ProjectArt({ variant }: { variant: ProjectArtVariant }) {
  return (
    <div className={`${styles.art} ${styles[variant]}`} aria-hidden="true">
      <div className={styles.grid} />
      {variant === "flood" && <FloodArt />}
      {variant === "sheet" && <SheetArt />}
      {variant === "scale" && <ScaleArt />}
      {variant === "cms" && <CmsArt />}
    </div>
  );
}

function FloodArt() {
  return (
    <>
      <div className={styles.contours}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className={styles.pin} />
      <div className={styles.alert}>
        <b>●</b> Flood alert · Level 2
      </div>
      <strong className={styles.floodTitle}>
        BAHA
        <br />
        BUSTER
      </strong>
    </>
  );
}

function SheetArt() {
  return (
    <div className={styles.sheets}>
      {["From", "To"].map((label) => (
        <div key={label} className={styles.sheetCard}>
          <small>{label}.xlsx</small>
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className={styles.sheetRow}>
              <i />
              <i />
              <i />
            </div>
          ))}
        </div>
      ))}
      <span className={styles.sheetArrow}>→</span>
    </div>
  );
}

function ScaleArt() {
  return (
    <div className={styles.device}>
      <small>ESP32 · LIVE</small>
      <strong>
        24.80<span>kg</span>
      </strong>
      <div className={styles.bars}>
        {Array.from({ length: 14 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}

function CmsArt() {
  return (
    <div className={styles.browser}>
      <div className={styles.browserBar}>
        <i />
        <i />
        <i />
      </div>
      <div className={styles.browserBody}>
        <strong>IBC AUTO</strong>
        <div className={styles.blocks}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
