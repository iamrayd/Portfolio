import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  accent: string;
  caption?: string;
  titleId: string;
}

/** Small label that sits above a section title, e.g. "— WHY HIRE ME". */
export function SectionEyebrow({ label }: { label: string }) {
  return (
    <Reveal className={styles.eyebrow} distance={16}>
      <span className={styles.line} aria-hidden="true" />
      <span>{label}</span>
    </Reveal>
  );
}

/** Eyebrow label, masked word-reveal heading and an optional side caption. */
export function SectionHeader({ eyebrow, title, accent, caption, titleId }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <SectionEyebrow label={eyebrow} />
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
