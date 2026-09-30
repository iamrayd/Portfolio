import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";
import { allTechnologies, profile, techStack } from "@/data/portfolio";

import styles from "./About.module.css";

interface AboutProps {
  publicRepos: number | null;
}

export function About({ publicRepos }: AboutProps) {
  const stats = [
    { value: new Date().getFullYear() - profile.startYear, suffix: "+", label: "Years shipping" },
    { value: allTechnologies.length, suffix: "", label: "Technologies" },
    ...(publicRepos ? [{ value: publicRepos, suffix: "", label: "Public repos" }] : []),
  ];

  return (
    <Section
      id="about-me"
      labelledBy="about-title"
      className={styles.section}
      fullBleed={<StackMarquee />}
    >
      <SectionHeader
        index={sectionNumber("about-me")}
        eyebrow="About me"
        title="Hi, I'm"
        accent={`${profile.nickname}.`}
        titleId="about-title"
      />

      <div className={styles.intro}>
        <Reveal className={styles.lead}>
          Developer by trade.
          <br />
          <span>Builder by nature.</span>
        </Reveal>
        <Reveal className={styles.bio} delay={0.1}>
          <p>{profile.bio}</p>
          <p className={styles.signature}>
            {profile.name}
            <span aria-hidden="true">↗</span>
          </p>
        </Reveal>
      </div>

      <Reveal>
        <dl className={styles.stats} data-count={stats.length}>
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

      <div className={styles.stackHeader}>
        <span className={styles.microLabel}>The toolkit</span>
        <span>An ever-evolving stack</span>
      </div>

      <div className={styles.groups}>
        {Object.entries(techStack).map(([group, items], index) => (
          <Reveal key={group} delay={index * 0.1} className={styles.group}>
            <h3 className={styles.groupHeading}>
              <span>
                {String(index + 1).padStart(2, "0")} / {group}
              </span>
              <span>({items.length})</span>
            </h3>
            <ul className={styles.chips}>
              {items.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function StackMarquee() {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.marqueeGroup}>
            {allTechnologies.map((tech) => (
              <span key={tech}>
                {tech}
                <b>✳</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
