import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  /** "raised" adds a translucent panel so alternating sections read as distinct bands. */
  tone?: "plain" | "raised";
  className?: string;
  /** Content rendered full-bleed after the contained content (e.g. marquees). */
  fullBleed?: React.ReactNode;
}

export function Section({
  id,
  labelledBy,
  children,
  tone = "plain",
  className,
  fullBleed,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${styles.section} ${className ?? ""}`}
      data-tone={tone}
    >
      <div className="container">{children}</div>
      {fullBleed}
    </section>
  );
}
