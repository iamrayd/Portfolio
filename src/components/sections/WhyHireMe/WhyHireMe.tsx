import { ArrowUpRight, CodeXml, Layers3, Sparkles, Zap, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { strengths, type StrengthIcon } from "@/data/portfolio";

import { SpotlightCard } from "./SpotlightCard";
import styles from "./WhyHireMe.module.css";

const icons: Record<StrengthIcon, LucideIcon> = {
  layers: Layers3,
  code: CodeXml,
  zap: Zap,
  sparkles: Sparkles,
};

export function WhyHireMe() {
  return (
    <Section id="why-hire-me" labelledBy="why-title" tone="raised">
      <SectionHeader
        index={1}
        eyebrow="Why hire me"
        title="More than"
        accent="just code."
        caption="The right person for the whole picture."
        titleId="why-title"
      />

      <ul className={styles.grid}>
        {strengths.map((strength, index) => {
          const Icon = icons[strength.icon];
          return (
            <Reveal as="li" key={strength.title} delay={index * 0.1} className={styles.item}>
              <SpotlightCard className={styles.card}>
                <span className={styles.number}>/ {String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className={styles.arrow} size={20} aria-hidden="true" />
                <span className={styles.icon}>
                  <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3>{strength.title}</h3>
                <p>{strength.description}</p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
