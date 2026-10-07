/** Page sections in order. Set `enabled: false` to hide a section from the page and navbar. */
const allSections = [
  { id: "about-me", label: "About Me", enabled: true },
  { id: "why-hire-me", label: "Why Hire Me", enabled: true },
  { id: "experiences", label: "Experiences", enabled: true },
  { id: "projects", label: "Projects", enabled: true },
  // Hidden until real testimonials are added in portfolio.ts.
  { id: "testimonies", label: "Testimonies", enabled: false },
  { id: "hobbies", label: "Hobbies", enabled: true },
  { id: "contact-me", label: "Contact Me", enabled: true },
] as const;

export type SectionId = (typeof allSections)[number]["id"];

export const sections = allSections.filter((section) => section.enabled);

export function isSectionEnabled(id: SectionId): boolean {
  return sections.some((section) => section.id === id);
}

/** 1-based position among visible sections, used for the "01 — …" eyebrows. */
export function sectionNumber(id: SectionId): number {
  return sections.findIndex((section) => section.id === id) + 1;
}
