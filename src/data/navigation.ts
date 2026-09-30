export const sections = [
  { id: "why-hire-me", label: "Why Hire Me" },
  { id: "about-me", label: "About Me" },
  { id: "experiences", label: "Experiences" },
  { id: "projects", label: "Projects" },
  { id: "testimonies", label: "Testimonies" },
  { id: "contact-me", label: "Contact Me" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
