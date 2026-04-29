# CLAUDE.md — Portfolio Project Ground Truth

This file is the authoritative source for facts about this project and its owner.
It overrides memory files when there is a conflict.

## Who This Portfolio Belongs To

- **Name:** Hryday Nitin Lath
- **Degree:** B.E. Manufacturing Engineering, BITS Pilani (2025–2029) — NOT a CS student
- **Year:** 1st year (transitions to 2nd year June 2026)
- **CGPA:** 7.90
- **Email:** hryday7765@gmail.com (personal) / f20251395@pilani.bits-pilani.ac.in (college)
- **Location:** India

## Source of Truth Hierarchy

When files conflict, trust in this order:
1. This file (CLAUDE.md)
2. `/content/siteConfig.ts` — canonical identity, bio, links
3. `/content/experience.ts` — canonical job titles and dates
4. `/content/projects.ts` — canonical project descriptions
5. Memory files — helpful context, but may be stale
6. Blog posts — personal voice, not facts

## Known Discrepancies to Watch

- **"Growth Intern" vs "intern":** `experience.ts` officially lists the Dihadi role as "Growth Intern". In blog posts and casual writing, refer to it as just "intern" or "internship" — the user explicitly prefers this.
- **Blog post length:** `building-my-resume.mdx` is intentionally very short (~2 paragraphs, 1 min read). Do not pad it.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS v4 — NO `tailwind.config.ts`. All theme config in `app/globals.css` via `@theme`.
- **Animation:** Framer Motion — use string easing presets (`'easeOut'`) not cubic bezier arrays.
- **Images:** `next.config.ts` uses `remotePatterns` (not deprecated `domains`).

## UI Architecture

Windows XP-style desktop OS. Key files:
- `components/os/StartMenu.tsx` — start menu items
- `components/os/windows/BrowserWindow.tsx` — "My Tools" app (windowId: `browser`)
- `lib/windowManager.tsx` — window open/close/minimize state
- `components/os/Window.tsx` — window chrome, drag, resize

## Content Files

Edit these to update the portfolio:
- `/content/siteConfig.ts` — name, bio, links, stats, currently section
- `/content/projects.ts` — project cards
- `/content/experience.ts` — timeline entries
- `/content/skills.ts` — tech stack display
- `/content/blog/*.mdx` — blog posts

## Writing Style for Blog Posts

Hryday is a real college student, not a CS influencer. Blog posts should:
- Sound human and direct — no AI buzzwords, no padding
- Be concise (short posts are intentional, do not expand without being asked)
- Use first person, casual but clear
- Avoid phrases like "I learned so much", "it was an incredible journey", "game-changer"

## Placeholder Assets Still Needed

- `/public/me.jpg` — profile photo
- `/public/resume.pdf` — resume
- `/public/projects/*.jpg` — project screenshots
- `/public/og-image.png` — OG social image

## Contact Form

- API route: `/app/api/contact/route.ts`
- Currently logs to console; Resend integration commented out pending `RESEND_API_KEY` in `.env.local`
