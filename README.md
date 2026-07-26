# hrydaylath.vercel.app

My portfolio, built as a desktop operating system that boots in the browser.

I'm a manufacturing engineering undergrad at BITS Pilani who spends most of his time
on startups, finance and anything that lets me build something end to end. A single
scrolling page felt like the wrong container for that, so this one has a BIOS post,
a boot sequence, a lock screen, draggable windows and a Clippy-descended assistant
that will talk about my work but not much else.

It is a portfolio pretending to be an OS, which means the interesting problems were
never the ones I expected.

---

## Things worth reading the source for

**One source of truth, four consumers.** Everything about me lives in `/content` as
typed TypeScript. `lib/profile.ts` projects it once on the server, and that single
projection feeds the UI, the AI assistant's system prompt, the JSON-LD graph,
`/llms.txt` and the plain-text profile at `/profile`. Editing `content/projects.ts`
updates what a recruiter reads, what Google indexes and what the assistant knows, in
one commit. Nothing can drift out of sync because nothing is written twice.

**An OS is invisible to crawlers.** The whole desktop is client-rendered, so for a
long time a crawler fetching `/` got a `<title>` and one block cursor. No bio, no
projects, nothing. The fix wasn't to abandon the OS — it was to render a real
semantic profile server-side underneath it, plus a `<noscript>` fallback and
structured data. The desktop is now the presentation layer, not the only layer.

**No audio files.** Every sound — window open, minimise, error, the startup chime —
is synthesised at runtime through the Web Audio API in `lib/sounds.ts`. Oscillators
and gain envelopes, a few hundred bytes of code, zero network cost.

**Dragging without re-rendering.** Windows move by writing `transform` directly to
the DOM node during the drag and committing a single `setPosition` on mouseup.
React's style reconciler never sees the in-flight frames, so a drag costs no renders
at all. Same approach for resize.

**The lock screen is doing real work.** The desktop mounts behind it the moment the
lock screen appears, so by the time you click through, everything is already warm and
the unlock is instant. The lock screen also carries the actual content — bio, CGPA,
current roles — because a visitor who never clicks further should still leave knowing
who I am.

**The assistant is adversarially tested.** It runs on Groq with a system prompt that
refuses identity overrides, fabricated credentials and requests to disclose its own
instructions. I probe it periodically; the last round found a prompt-disclosure hole
and it got patched.

---

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · Framer Motion · Groq · Vercel

Tailwind v4 means there is no `tailwind.config.ts` — theme tokens live in
`app/globals.css` under `@theme`.

## Running it

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY for the assistant
npm run dev
```

The site works without a Groq key; the assistant just reports itself as unconfigured.

## Credits

Wallpaper © [grafismasakini.com](https://grafismasakini.com/article/frutiger-aero-and-the-nostalgia-for-early-2000s-digital-aesthetics/en) ·
Icons © [XP icon set](https://www.pinterest.com/pin/897342294504788059/) ·
Paint by [jspaint.app](https://jspaint.app) ·
Minesweeper after the 1990 Microsoft original
