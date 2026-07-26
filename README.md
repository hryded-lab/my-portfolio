# hrydaylath.vercel.app

My portfolio, built as a desktop operating system that boots in the browser.

I study manufacturing engineering at BITS Pilani and spend most of my time on
startups, finance, and anything that lets me build something end to end. A single
scrolling page felt like the wrong container for that, so this one has a BIOS post,
a boot sequence, a lock screen, draggable windows, and an assistant that will talk
about my work but not much else.

It is a portfolio pretending to be an OS, which meant the interesting problems were
never the ones I expected.

## Things worth reading the source for

### One source of truth, four consumers

Everything about me lives in `/content` as typed TypeScript. `lib/profile.ts`
projects it once on the server, and that single projection feeds the UI, the
assistant's system prompt, the JSON-LD graph, `/llms.txt`, and the plain-text
profile at `/profile`.

Editing `content/projects.ts` updates what a recruiter reads, what Google indexes,
and what the assistant knows, in one commit. Nothing drifts, because nothing is
written twice.

### An OS is invisible to crawlers

The desktop is entirely client rendered, so for a long time a crawler fetching `/`
got a `<title>` and one block cursor. No bio, no projects, nothing.

The fix was not to abandon the OS. It was to render a real semantic profile on the
server underneath it, plus a `<noscript>` fallback and structured data. The desktop
is the presentation layer now, not the only layer.

### No audio files

Every sound, including window open, minimise, error, and the startup chime, is
synthesised at runtime through the Web Audio API in `lib/sounds.ts`. Oscillators
and gain envelopes. A few hundred bytes of code, zero network cost.

### Dragging without re-rendering

Windows move by writing `transform` straight to the DOM node during the drag and
committing a single `setPosition` on mouseup. React's style reconciler never sees
the in-flight frames, so a drag costs no renders at all. Resize works the same way.

### The lock screen is doing real work

The desktop mounts behind it the moment the lock screen appears, so by the time you
click through, everything is warm and the unlock is instant.

The lock screen also carries the actual content, including bio, CGPA, and current
roles, because a visitor who never clicks further should still leave knowing who I
am.

### The assistant is adversarially tested

It runs on Groq behind a system prompt that refuses identity overrides, fabricated
credentials, and requests to disclose its own instructions.

Prompt rules alone were not enough. Probing found it would spell the prompt out as
an acrostic and confirm its contents with a yes or no, so there is now a
deterministic guard over the response stream that checks what is actually being
emitted rather than trusting the model to refuse.

## Stack

Next.js with the App Router, TypeScript, Tailwind v4, Framer Motion, Groq, Vercel.

Tailwind v4 means there is no `tailwind.config.ts`. Theme tokens live in
`app/globals.css` under `@theme`.

## Running it

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY for the assistant
npm run dev
```

The site runs without a Groq key. The assistant just reports itself as
unconfigured.

## Credits

| Asset | Source |
| --- | --- |
| Wallpaper | [grafismasakini.com](https://grafismasakini.com/article/frutiger-aero-and-the-nostalgia-for-early-2000s-digital-aesthetics/en) |
| Desktop icons | [XP icon set](https://www.pinterest.com/pin/897342294504788059/) |
| Paint | [jspaint.app](https://jspaint.app) |
| Minesweeper | After the 1990 Microsoft original |
| Cursor | [Wii cursor set by Stefano Tinaglia](https://www.rw-designer.com/cursor-set/wii-cursor-by-stefano-tinaglia) |
