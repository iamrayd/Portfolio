/**
 * Single source of truth for all portfolio content.
 * Edit copy, links and entries here; components only render this data.
 */

export type StrengthIcon = "layers" | "code" | "zap" | "sparkles";

export interface Strength {
  icon: StrengthIcon;
  title: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  tags: string[];
}

export type ProjectArt = "flood" | "sheet" | "scale" | "cms";

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  art: ProjectArt;
  repo: string;
  liveUrl?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: string;
  focus: string[];
  tagline: string;
  bio: string;
  /** Year you started shipping real projects; drives the "years" stat. */
  startYear: number;
  githubUsername: string;
  /** Optional public contact links; empty values are hidden on the site. */
  email: string;
  linkedin: string;
}

export const profile: Profile = {
  name: "Immanuel Ray Dingal",
  firstName: "Immanuel",
  lastName: "Ray Dingal",
  nickname: "Ray",
  role: "Full-Stack Developer",
  focus: ["JavaScript", "TypeScript", "Node.js"],
  tagline:
    "I turn ambitious ideas into fast, thoughtful web products — from the first pixel to the last API call.",
  bio: "I'm Ray, a full-stack developer who builds across the entire product — interfaces people enjoy, APIs that hold up, and the databases underneath. My home turf is JavaScript, TypeScript and Node.js, but I pick the right tool for the job, from C# backends to ESP32 firmware.",
  startYear: 2022,
  githubUsername: "iamrayd",
  email: "",
  linkedin: "",
};

export const techStack = {
  "Languages & Frameworks": [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Express.js",
    "React",
    "Node.js",
    "Next.js",
    "Python",
    "C++",
    "C#",
    "PHP",
    "Laravel",
    "React Native",
    "WordPress",
  ],
  Databases: ["MariaDB", "MongoDB", "MySQL", "PostgreSQL"],
  Tools: ["Lovable", "VS Code", "Claude", "Antigravity", "Supabase", "Vercel", "Railway"],
} as const satisfies Record<string, readonly string[]>;

export const allTechnologies: string[] = Object.values(techStack).flat();

export const strengths: Strength[] = [
  {
    icon: "layers",
    title: "Idea to production.",
    description:
      "One developer, the whole picture. I connect polished interfaces with dependable backends and ship work that actually works.",
  },
  {
    icon: "code",
    title: "Built to last.",
    description:
      "Type-safe architecture and clean, readable code, so the next feature is easier to build, not harder.",
  },
  {
    icon: "zap",
    title: "Fast by default.",
    description:
      "Performance is a feature. Lean bundles, smart caching and responsive layouts that respect people's time.",
  },
  {
    icon: "sparkles",
    title: "AI-augmented workflow.",
    description:
      "Modern tools like Claude and Lovable let me spend less time on boilerplate and more time on the problem.",
  },
];

// TODO: Replace with your verified work history before deploying.
export const experiences: Experience[] = [
  {
    role: "Full-Stack Developer",
    company: "Company Name",
    period: "2024 — Present",
    highlights: [
      "Built and shipped full-stack features end to end with TypeScript, React and Node.js.",
      "Designed REST APIs and relational schemas that power internal dashboards.",
    ],
    tags: ["TypeScript", "Next.js", "PostgreSQL"],
  },
  {
    role: "Web Developer",
    company: "Company Name",
    period: "2023 — 2024",
    highlights: [
      "Developed a content management system with a C# backend and a custom frontend.",
      "Improved page performance and accessibility across client websites.",
    ],
    tags: ["C#", "SCSS", "MySQL"],
  },
  {
    role: "Freelance Developer",
    company: "Independent",
    period: "2022 — 2023",
    highlights: [
      "Delivered management systems for clinics, events and libraries.",
      "Owned projects from requirements gathering to deployment.",
    ],
    tags: ["JavaScript", "Express.js", "MongoDB"],
  },
];

export const projects: Project[] = [
  {
    title: "Baha Buster",
    category: "Disaster response",
    description:
      "Flood monitoring dashboard with barangay-level flood maps, real-time alerts, incident reports and evacuation center lookup.",
    tags: ["Next.js", "TypeScript", "Leaflet", "Recharts"],
    art: "flood",
    repo: "https://github.com/iamrayd/Baha-buster",
  },
  {
    title: "Sheetshift",
    category: "Productivity tool",
    description:
      "Excel column-mapping and transfer utility with header auto-matching, deduplication and an AI-powered quality audit.",
    tags: ["JavaScript", "Python", "Vercel"],
    art: "sheet",
    repo: "https://github.com/iamrayd/Excel-Automation",
    liveUrl: "https://excel-automation-two.vercel.app",
  },
  {
    title: "Scale",
    category: "IoT platform",
    description:
      "ESP32 firmware streams weight readings to an Express API, surfaced in a React dashboard with history and audit logs.",
    tags: ["React", "Express.js", "C++", "Docker"],
    art: "scale",
    repo: "https://github.com/iamrayd/scale",
  },
  {
    title: "IBC Auto CMS",
    category: "Content platform",
    description:
      "Content management system and public website for IBC Auto, backed by a C# API and a custom-built frontend.",
    tags: ["C#", ".NET", "SCSS"],
    art: "cms",
    repo: "https://github.com/iamrayd/cms-website",
  },
];

/** Repos already featured above, excluded from the live GitHub list. */
export const featuredRepoNames = [
  "Baha-buster",
  "Excel-Automation",
  "scale",
  "cms-website",
  "Portfolio",
];

// TODO: Replace with real testimonials (with permission) before deploying.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Ray sees both the technical challenge and the human experience behind it. Rare combination.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Reliable, fast, and always pushing the work a little further than we asked for.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "The details are never an afterthought. That care shows up in everything Ray ships.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Ray took a messy spreadsheet workflow and turned it into a tool the whole team uses.",
    name: "Client Name",
    role: "Role, Company",
  },
];
