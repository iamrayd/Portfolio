import type { Metadata, Viewport } from "next";
import { Cinzel, DM_Sans, Michroma } from "next/font/google";

import { profile } from "@/data/portfolio";
import { siteDescription, siteUrl } from "@/lib/site";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: siteDescription,
  authors: [{ name: profile.name, url: `https://github.com/${profile.githubUsername}` }],
  openGraph: {
    type: "website",
    title,
    description: siteDescription,
    url: "/",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${michroma.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
