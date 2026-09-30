import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionNumber } from "@/data/navigation";
import { testimonials, type Testimonial } from "@/data/portfolio";

import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <Section
      id="testimonies"
      labelledBy="testimonies-title"
      tone="raised"
      fullBleed={<TestimonialMarquee items={testimonials} />}
    >
      <SectionHeader
        index={sectionNumber("testimonies")}
        eyebrow="Testimonies"
        title="Words that"
        accent="matter."
        caption="The best work is built together."
        titleId="testimonies-title"
      />
    </Section>
  );
}

function TestimonialMarquee({ items }: { items: Testimonial[] }) {
  return (
    <div className={styles.window}>
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          // The second copy only exists to make the loop seamless.
          <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
            {items.map((item, index) => (
              <li key={index}>
                <figure className={styles.card}>
                  <span className={styles.quoteMark} aria-hidden="true">
                    “
                  </span>
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>
                    <span className={styles.avatar} aria-hidden="true">
                      {item.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.role}</small>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
