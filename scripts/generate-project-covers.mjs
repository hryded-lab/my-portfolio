// Generate branded placeholder covers for /public/projects/*.jpg until real
// screenshots arrive. Each cover is a 1200×800 gradient with the project
// title in big display type and a small category caption underneath.

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'projects')

const W = 1200
const H = 800

const COVERS = [
  {
    file: 'kapital-grants.jpg',
    title: 'Kapital Grants',
    caption: 'Web App · 2026',
    a: '#10b981', b: '#0f5042',
  },
  {
    file: 'smallsteps.jpg',
    title: 'SmallSteps',
    caption: 'AI · Healthcare · 2026',
    a: '#3b82f6', b: '#1e3a8a',
  },
  {
    file: 'swasthseva.jpg',
    title: 'SwasthSeva',
    caption: 'Community · 2025',
    a: '#ef4444', b: '#7a1a1a',
  },
  {
    file: 'portfolio.jpg',
    title: 'This Portfolio',
    caption: 'Next.js · TypeScript · 2026',
    a: '#a855f7', b: '#3b1568',
  },
]

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])
}

function svgFor({ title, caption, a, b }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${a}" />
      <stop offset="100%" stop-color="${b}" />
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="rgba(0,0,0,0)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.45)" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <rect width="${W}" height="${H}" fill="url(#fade)" />

  <!-- soft hard-offset accent stripe to match the brutalism vibe -->
  <rect x="64" y="${H - 200}" width="120" height="6" fill="rgba(255,255,255,0.85)" />

  <text
    x="64" y="${H - 130}"
    fill="#ffffff"
    font-family="'Archivo Black','DM Sans','Inter',system-ui,sans-serif"
    font-size="84" font-weight="800" letter-spacing="-2"
  >${escapeXml(title)}</text>

  <text
    x="64" y="${H - 80}"
    fill="rgba(255,255,255,0.78)"
    font-family="'Space Mono','JetBrains Mono',ui-monospace,monospace"
    font-size="22" font-weight="700" letter-spacing="3"
  >${escapeXml(caption.toUpperCase())}</text>

  <!-- corner sticker -->
  <g transform="translate(${W - 220}, 80)">
    <rect width="156" height="44" rx="4"
          fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
    <text x="78" y="29" text-anchor="middle"
          fill="rgba(255,255,255,0.92)"
          font-family="'Space Mono',ui-monospace,monospace"
          font-size="14" font-weight="700" letter-spacing="2.4">PLACEHOLDER</text>
  </g>
</svg>`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  for (const cov of COVERS) {
    const out = path.join(OUT_DIR, cov.file)
    const svg = svgFor(cov)
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 88, progressive: true })
      .toFile(out)
    console.log(`  ✓ ${cov.file}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
