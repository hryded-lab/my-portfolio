# Hryday Nitin Lath — Portfolio

Personal portfolio website built as a Windows desktop environment. Runs entirely in the browser.

## Features

- Windows-themed OS interface — draggable windows, taskbar, start menu, desktop icons
- AI assistant powered by [Groq](https://groq.com) (llama-3.3-70b) — answers questions about my background
- Light / dark mode across all applications
- Functional Minesweeper with 10 difficulty levels
- MS Paint via [jspaint.app](https://jspaint.app)
- Bliss-inspired wallpaper, XP boot sequence, lock screen

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS v4
- Groq SDK (streaming chat)

## Local Development

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Add your Groq API key to `.env.local`:

```
GROQ_API_KEY=your_key_here
```

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Credits

- Wallpaper © [grafismasakini.com](https://grafismasakini.com/article/frutiger-aero-and-the-nostalgia-for-early-2000s-digital-aesthetics/en)
- Desktop icons © [Pinterest / XP icon set](https://www.pinterest.com/pin/897342294504788059/)
- Paint powered by [jspaint.app](https://jspaint.app)
- Minesweeper inspired by the original © 1990 Microsoft Corporation
