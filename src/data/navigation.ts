/**
 * Page sections in order. Set `enabled: false` to hide a section from the page and navbar.
 * Proof first: experience and projects, then skills, then the pitch and a personal touch.
 */
const allSections = [
  { id: "experiences", label: "Experiences", enabled: true },
  { id: "projects", label: "Projects", enabled: true },
  { id: "toolkit", label: "Toolkit", enabled: true },
  // Hidden until real testimonials are added in portfolio.ts.
  { id: "testimonies", label: "Testimonies", enabled: false },
  { id: "why-hire-me", label: "Why Hire Me", enabled: true },
  { id: "hobbies", label: "Hobbies", enabled: true },
  { id: "contact-me", label: "Contact Me", enabled: true },
] as const;

export type SectionId = (typeof allSections)[number]["id"];

export const sections = allSections.filter((section) => section.enabled);

export function isSectionEnabled(id: SectionId): boolean {
  return sections.some((section) => section.id === id);
}
