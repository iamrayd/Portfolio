import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  index: number;
  eyebrow: string;
  title: string;
  accent: string;
  caption?: string;
  titleId: string;
}

/** Small numbered label that sits above a section title, e.g. "01 — WHY HIRE ME". */
export function SectionEyebrow({ index, label }: { index: number; label: string }) {
  return (
    <Reveal className={styles.eyebrow} distance={16}>
      <span>{String(index).padStart(2, "0")}</span>
      <span className={styles.line} aria-hidden="true" />
      <span>{label}</span>
    </Reveal>
  );
}

/** Numbered eyebrow, masked word-reveal heading and an optional side caption. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  accent,
  caption,
  titleId,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <SectionEyebrow index={index} label={eyebrow} />
      <div className={styles.row}>
        <RevealText id={titleId} className={styles.title} text={title} accent={accent} />
        {caption && (
          <Reveal className={styles.caption} delay={0.2} distance={16}>
            {caption}
          </Reveal>
        )}
      </div>
    </div>
  );
}
