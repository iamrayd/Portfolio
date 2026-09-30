import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";
import { experiences } from "@/data/portfolio";

import styles from "./Experiences.module.css";
import { Timeline } from "./Timeline";

export function Experiences() {
  return (
    <Section id="experiences" labelledBy="experiences-title" tone="raised">
      <SectionHeader
        index={sectionNumber("experiences")}
        eyebrow="Experiences"
        title="The road"
        accent="so far."
        caption="Every chapter builds the next."
        titleId="experiences-title"
      />

      <Timeline>
        {experiences.map((job, index) => (
          <Reveal as="li" key={`${job.company}-${job.period}`} className={styles.item}>
            <span className={styles.node} aria-hidden="true" />
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <p className={styles.period}>{job.period}</p>
            <div className={styles.body}>
              <p className={styles.company}>{job.company}</p>
              <h3>{job.role}</h3>
              <ul className={styles.highlights}>
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className={styles.tags} aria-label="Technologies used">
                {job.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <ArrowUpRight className={styles.arrow} size={20} aria-hidden="true" />
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
