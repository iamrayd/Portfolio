import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";

import { AimTrainer } from "./aim/AimTrainer";
import { GameCarousel } from "./GameCarousel";
import styles from "./Hobbies.module.css";

export function Hobbies() {
  return (
    <Section id="hobbies" labelledBy="hobbies-title" tone="raised" className={styles.section}>
      {/* Content marked data-aim-solid is kept clear of aim targets. */}
      <div data-aim-solid>
        <SectionHeader
          index={sectionNumber("hobbies")}
          eyebrow="Hobbies"
          title="Off the clock,"
          accent="still competing."
          caption="Peak ranks from ranked play."
          titleId="hobbies-title"
        />
      </div>
      <GameCarousel />
      <AimTrainer />
    </Section>
  );
}
