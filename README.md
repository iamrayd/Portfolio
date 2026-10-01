# Portfolio

Personal portfolio of **Immanuel Ray Dingal**, full-stack developer. It's a dark, animated single-page site built with Next.js.

**Highlights**

- **Falling words.** Tech names drift down the background on a canvas. Type one anywhere on the page and its letters turn red as you go. Finish the word and it shatters. Touch devices get a floating keyboard button.
- **Motion.** Lenis smooth scrolling and masked word reveals on headings. There's hero parallax, a scroll-driven text band, 3D tilt cards and magnetic buttons. A timeline rail fills as you scroll.
- **Full stack.** The contact form uses a Server Action with Zod validation, a honeypot field and rate limiting, and delivers mail through Resend. Live GitHub stats and recent repos are cached with ISR (hourly).
- **Accessible.** It uses semantic landmarks, visible focus states and a skip link, and respects `prefers-reduced-motion`.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · Motion · Lenis · Zod

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values, see below
npm run dev
```

Open http://localhost:3000.

| Script              | Purpose                     |
| ------------------- | --------------------------- |
| `npm run dev`       | Start the dev server        |
| `npm run build`     | Production build            |
| `npm run lint`      | ESLint                      |
| `npm run typecheck` | TypeScript without emitting |
| `npm run format`    | Prettier                    |

## Environment variables

| Name                   | Required        | Description                                                       |
| ---------------------- | --------------- | ----------------------------------------------------------------- |
| `RESEND_API_KEY`       | For form        | API key from [resend.com](https://resend.com)                     |
| `CONTACT_TO_EMAIL`     | For form        | Inbox that receives contact messages                              |
| `CONTACT_FROM_EMAIL`   | No              | Sender on a verified domain (defaults to `onboarding@resend.dev`) |
| `KV_REST_API_URL`      | For leaderboard | Upstash Redis REST URL (set by Vercel's Upstash integration)      |
| `KV_REST_API_TOKEN`    | For leaderboard | Upstash Redis REST token                                          |
| `GITHUB_TOKEN`         | No              | Raises the GitHub API rate limit                                  |
| `NEXT_PUBLIC_SITE_URL` | No              | Canonical URL; Vercel's production URL is used when unset         |

Without the Resend variables the site still works, but the form shows a friendly error instead of sending. The leaderboard resets daily at midnight Philippine time: each day's scores live under their own key and expire after two days. Likewise, without the Upstash variables the aim trainer still plays but the leaderboard shows as offline (local development uses an in-memory store).

## Editing content

All copy lives in [`src/data/portfolio.ts`](src/data/portfolio.ts): profile, tech stack, strengths, experiences, projects and testimonials. Components only render that data.

## Project structure

```
src/
  app/            routes, metadata files, server actions
  components/
    effects/      falling words, cursor glow, scroll progress
    layout/       header, footer
    motion/       reusable animation primitives
    sections/     one folder per page section
    ui/           shared building blocks
  data/           portfolio content
  hooks/          client hooks
  lib/            GitHub client, contact logic, falling-words engine
```
