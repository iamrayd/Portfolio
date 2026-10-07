import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { allTechnologies, profile, techStack } from "@/data/portfolio";

import { ToolGrid } from "./ToolGrid";
import styles from "./Toolkit.module.css";

interface ToolkitProps {
  publicRepos: number | null;
}

export function Toolkit({ publicRepos }: ToolkitProps) {
  const stats = [
    {
      value: Math.max(1, new Date().getFullYear() - profile.startYear),
      suffix: "+",
      label: "Years shipping",
    },
    { value: allTechnologies.length, suffix: "", label: "Technologies" },
    ...(publicRepos ? [{ value: publicRepos, suffix: "", label: "Public repos" }] : []),
  ];

  return (
    <Section id="toolkit" labelledBy="toolkit-title" tone="raised">
      <SectionHeader
        eyebrow="Toolkit"
        title="Tools of"
        accent="the trade."
        caption="Type any tool's name to light it up."
        titleId="toolkit-title"
      />

      <Reveal>
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt>{stat.label}</dt>
              <dd>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <ToolGrid groups={techStack} />
    </Section>
  );
}
