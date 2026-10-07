import { Heart, Orbit, type LucideIcon } from "lucide-react";
import {
  siClaude,
  siCplusplus,
  siCss,
  siExpress,
  siHtml5,
  siJavascript,
  siLaravel,
  siMariadb,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siRailway,
  siReact,
  siSupabase,
  siTypescript,
  siVercel,
  siWordpress,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

export type ToolIcon =
  | { kind: "path"; viewBox: string; path: string; color: string; evenOdd?: boolean }
  | { kind: "lucide"; Icon: LucideIcon; color: string };

/** Brand colors too dark to see on the page background fall back to the text color. */
const MIN_LUMINANCE = 0.08;

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function fromSimpleIcon(icon: SimpleIcon): ToolIcon {
  const color = luminance(icon.hex) < MIN_LUMINANCE ? "var(--fg)" : `#${icon.hex}`;
  return { kind: "path", viewBox: "0 0 24 24", path: icon.path, color };
}

/*
 * Logos come from Simple Icons (CC0). C# and VS Code aren't in that set, so their
 * marks are from Devicon (MIT). Lovable and Antigravity have no open-licensed logo
 * yet and use stand-in icons.
 */
const csharp: ToolIcon = {
  kind: "path",
  viewBox: "0 0 128 128",
  color: "#9b4f96",
  path: "M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.3.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6zm-53.5 70c-21.8 0-39.5-17.7-39.5-39.5S42.2 24.5 64 24.5c14.7 0 27.5 8.1 34.3 20l-13 7.5C81.1 44.5 73.1 39.5 64 39.5c-13.5 0-24.5 11-24.5 24.5s11 24.5 24.5 24.5c9.1 0 17.1-5 21.3-12.4l12.9 7.6c-6.8 11.8-19.6 19.8-34.2 19.8zM115 62h-3.2l-.9 4h4.1v5h-5l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6H94v-5h3.5l.9-4H94v-5h5.3l1.2-6h4.9l-1.2 6h3.8l1.2-6h4.8l-1.2 6h2.2v5zm-12.7 4h3.8l.9-4h-3.8z",
};

const vscode: ToolIcon = {
  kind: "path",
  viewBox: "0 0 128 128",
  color: "#23a9f2",
  evenOdd: true,
  path: "M90.767 127.126a7.968 7.968 0 0 0 6.35-.244l26.353-12.681a8 8 0 0 0 4.53-7.209V21.009a8 8 0 0 0-4.53-7.21L97.117 1.12a7.97 7.97 0 0 0-9.093 1.548l-50.45 46.026L15.6 32.013a5.328 5.328 0 0 0-6.807.302l-7.048 6.411a5.335 5.335 0 0 0-.006 7.888L20.796 64 1.74 81.387a5.336 5.336 0 0 0 .006 7.887l7.048 6.411a5.327 5.327 0 0 0 6.807.303l21.974-16.68 50.45 46.025a7.96 7.96 0 0 0 2.743 1.793Zm5.252-92.183L57.74 64l38.28 29.058V34.943Z",
};

/** Icon for each name in `techStack`. Names without an entry render text only. */
export const toolIcons: Record<string, ToolIcon> = {
  HTML: fromSimpleIcon(siHtml5),
  CSS: fromSimpleIcon(siCss),
  JavaScript: fromSimpleIcon(siJavascript),
  TypeScript: fromSimpleIcon(siTypescript),
  "Express.js": fromSimpleIcon(siExpress),
  React: fromSimpleIcon(siReact),
  "Node.js": fromSimpleIcon(siNodedotjs),
  "Next.js": fromSimpleIcon(siNextdotjs),
  Python: fromSimpleIcon(siPython),
  "C++": fromSimpleIcon(siCplusplus),
  "C#": csharp,
  PHP: fromSimpleIcon(siPhp),
  Laravel: fromSimpleIcon(siLaravel),
  "React Native": fromSimpleIcon(siReact),
  WordPress: fromSimpleIcon(siWordpress),
  MariaDB: fromSimpleIcon(siMariadb),
  MongoDB: fromSimpleIcon(siMongodb),
  MySQL: fromSimpleIcon(siMysql),
  PostgreSQL: fromSimpleIcon(siPostgresql),
  Lovable: { kind: "lucide", Icon: Heart, color: "#ff5c8a" },
  "VS Code": vscode,
  Claude: fromSimpleIcon(siClaude),
  Antigravity: { kind: "lucide", Icon: Orbit, color: "#4f8df5" },
  Supabase: fromSimpleIcon(siSupabase),
  Vercel: fromSimpleIcon(siVercel),
  Railway: fromSimpleIcon(siRailway),
};
