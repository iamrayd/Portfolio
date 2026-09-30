import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";

import { GameCarousel } from "./GameCarousel";
import styles from "./Hobbies.module.css";

export function Hobbies() {
  return (
    <Section id="hobbies" labelledBy="hobbies-title" tone="raised" className={styles.section}>
      <SectionHeader
        index={sectionNumber("hobbies")}
        eyebrow="Hobbies"
        title="Off the clock,"
        accent="still competing."
        caption="Peak ranks from ranked play."
        titleId="hobbies-title"
      />
      <GameCarousel />
    </Section>
  );
}
