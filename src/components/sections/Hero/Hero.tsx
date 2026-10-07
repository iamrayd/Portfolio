"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Keyboard } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Magnetic } from "@/components/motion/Magnetic";
import buttonStyles from "@/components/ui/Button.module.css";
import { profile } from "@/data/portfolio";

import styles from "./Hero.module.css";

const LETTER_STAGGER = 0.045;
const INTRO_DELAY = 0.25;

function AnimatedLine({ text, offset }: { text: string; offset: number }) {
  return (
    <span className={styles.line} aria-hidden="true">
      {Array.from(text).map((letter, index) => (
        <motion.span
          key={index}
          className={styles.letter}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1, delay: INTRO_DELAY + (offset + index) * LETTER_STAGGER }}
        >
          {letter === " " ? " " : letter}
        </motion.span>
      ))}
    </span>
  );
}

function FadeIn({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
    >
      {children}
    </motion.div>
  );
}

interface HeroProps {
  /** Passed from the server so the static HTML and hydration always agree. */
  year: number;
}

export function Hero({ year }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const firstName = profile.firstName.toUpperCase();
  const lastName = profile.lastName.toUpperCase();
  const lettersDone = INTRO_DELAY + (firstName.length + lastName.length) * LETTER_STAGGER;

  return (
    <section ref={ref} id="top" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.orbit} style={{ rotate: orbitRotate }} aria-hidden="true">
        <span className={styles.ringOuter} />
        <span className={styles.ringInner} />
        <span className={styles.star}>✳</span>
      </motion.div>

      <motion.div className={styles.content} style={{ opacity: contentOpacity }}>
        <FadeIn className={styles.kicker} delay={0.1}>
          <span className={styles.kickerLine} aria-hidden="true" />
          {profile.role} · Portfolio {year}
        </FadeIn>

        <motion.h1
          id="hero-title"
          className={styles.title}
          aria-label={profile.name}
          style={{ y: titleY, scale: titleScale }}
        >
          <AnimatedLine text={firstName} offset={0} />
          <span className={styles.lineWithDot}>
            <AnimatedLine text={lastName} offset={firstName.length} />
            <motion.span
              className={styles.dot}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 12, delay: lettersDone }}
            >
              .
            </motion.span>
          </span>
        </motion.h1>

        <div className={styles.below}>
          <FadeIn className={styles.intro} delay={lettersDone}>
            <p className={styles.role}>
              {profile.role} <span className={styles.dash}>—</span> {profile.focus.join(" · ")}
            </p>
            <p className={styles.tagline}>{profile.tagline}</p>
            <div className={styles.actions}>
              <Magnetic>
                <a href="#projects" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
                  View projects <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact-me" className={`${buttonStyles.button} ${buttonStyles.outline}`}>
                  Contact me <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Magnetic>
            </div>
          </FadeIn>

          <FadeIn className={styles.aside} delay={lettersDone + 0.15}>
            <span className={styles.plus} aria-hidden="true">
              +
            </span>
            <span>
              Design minded.
              <br />
              Engineering driven.
            </span>
          </FadeIn>
        </div>
      </motion.div>

      <FadeIn className={styles.bottom} delay={lettersDone + 0.3}>
        <a href="#experiences" className={styles.scrollCue}>
          <span className={styles.scrollIcon}>
            <ArrowDown size={15} aria-hidden="true" />
          </span>
          Scroll to explore
        </a>
        <a href="#toolkit" className={styles.typeCue}>
          <Keyboard size={18} aria-hidden="true" />
          <span className={styles.pointerCue}>
            Type any tool&apos;s name to light up my <em>toolkit</em>
          </span>
          <span className={styles.touchCue}>
            Light up my <em>toolkit</em>
          </span>
        </a>
        <p className={styles.year}>Open to work — {year}</p>
      </FadeIn>
    </section>
  );
}
