// Slice the 4×4 mobile_icons.png master image into 16 individual app icons.
//
// Strategy: instead of assuming a perfect 4×4 pixel grid (which the
// ChatGPT-generated master doesn't honour — adjacent icons drift and the
// bottom row is clipped at the image edge), we DETECT the actual icon
// positions from horizontal and vertical alpha-density profiles.
//
//   1. Find the 4 brightest density peaks per axis → 4 column centers, 4 row centers.
//   2. For each (col, row) pair, crop a fixed-size window centered on that point.
//   3. Within that window, alpha-bbox the dominant glyph and re-center on a
//      transparent 512×512 canvas at uniform scale.

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SOURCE   = path.join(__dirname, 'mobile_icons.png')
const OUT_DIR  = path.join(ROOT, 'public', 'icons')
const OUT_SIZE = 512
// Fill the PNG canvas almost to the edge — drop-shadow is applied in CSS,
// so we don't need PNG padding for shadow room.
const INNER_PCT = 0.98

const IDS = [
  'about',       'experience', 'projects',    'skills',
  'resume',      'blog',       'contact',     'restart',
  'notes',       'terminal',   'paint',       'browser',
  'media',       'minesweeper','minecraft',   'clock',
]

async function main() {
  const meta = await sharp(SOURCE).metadata()
  const W = meta.width
  const H = meta.height
  if (!W || !H) throw new Error('source has no dimensions')

  // Read raw RGBA once.
  const { data } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  // Build alpha-density profiles.
  const colDensity = new Float32Array(W)
  const rowDensity = new Float32Array(H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = data[(y * W + x) * 4 + 3]
      if (a > 24) {
        colDensity[x] += 1
        rowDensity[y] += 1
      }
    }
  }

  // Detect 4 evenly-distributed peaks per axis.
  const colCenters = topPeaks(colDensity, 4, W)
  const rowCenters = topPeaks(rowDensity, 4, H)
  console.log(`source ${W}×${H}`)
  console.log(`  col centers: ${colCenters.join(', ')}`)
  console.log(`  row centers: ${rowCenters.join(', ')}`)

  // Window size: nearly the full inter-peak distance, so we capture the
  // entire icon body even at the edges of the master. We rely on
  // connected-component bbox detection to reject any bleed from neighbours
  // (small clusters that aren't the central icon).
  const colSpan = (colCenters[3] - colCenters[0]) / 3
  const rowSpan = (rowCenters[3] - rowCenters[0]) / 3
  const winSpan = Math.round(Math.min(colSpan, rowSpan) * 0.96)

  await mkdir(OUT_DIR, { recursive: true })

  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4)
    const col = i % 4
    const id  = IDS[i]
    const out = path.join(OUT_DIR, `${id}.png`)

    const cx = colCenters[col]
    const cy = rowCenters[row]
    const half = Math.floor(winSpan / 2)
    const left   = Math.max(0, cx - half)
    const top    = Math.max(0, cy - half)
    const width  = Math.min(W - left, winSpan)
    const height = Math.min(H - top,  winSpan)

    const cell = await sharp(SOURCE)
      .extract({ left, top, width, height })
      .ensureAlpha()
      .png()
      .toBuffer()

    const rawBbox = await alphaBBox(cell, width, height)

    // Enforce a SQUARE bbox centered on the rawBbox center, sized to the
    // SMALLER of the two dimensions. This drops elongated bleed (a tall
    // bbox grabbing a narrow strip from a neighbouring icon) without
    // distorting the icon body.
    const dim = Math.min(rawBbox.width, rawBbox.height)
    const bcx = rawBbox.left + rawBbox.width  / 2
    const bcy = rawBbox.top  + rawBbox.height / 2
    const bbox = {
      left:   Math.max(0, Math.round(bcx - dim / 2)),
      top:    Math.max(0, Math.round(bcy - dim / 2)),
      width:  dim,
      height: dim,
    }
    bbox.width  = Math.min(bbox.width,  width  - bbox.left)
    bbox.height = Math.min(bbox.height, height - bbox.top)

    const trimmed = await sharp(cell).extract(bbox).png().toBuffer()

    const target = Math.round(OUT_SIZE * INNER_PCT)
    const scale  = target / Math.max(bbox.width, bbox.height)
    const fitW   = Math.round(bbox.width  * scale)
    const fitH   = Math.round(bbox.height * scale)

    const resized = await sharp(trimmed)
      .resize(fitW, fitH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    await sharp({
      create: {
        width: OUT_SIZE,
        height: OUT_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{
        input: resized,
        left: Math.round((OUT_SIZE - fitW) / 2),
        top:  Math.round((OUT_SIZE - fitH) / 2),
      }])
      .png({ compressionLevel: 9 })
      .toFile(out)

    console.log(`  ✓ ${id}.png  win@(${cx},${cy}) ${width}×${height}  bbox ${bbox.width}×${bbox.height} → ${fitW}×${fitH}`)
  }
}

// Detect K icon centers along an axis by finding the K-1 GAPS between icon
// rows/cols and taking the geometric midpoint of each region between gaps.
//
// This is robust against unequal row spacing (e.g., the master may clip the
// last row at the canvas edge, making "first-to-last evenly divided" wrong).
// We just look for stripes of low alpha density — those are the gaps —
// and split the axis there.
function topPeaks(density, k, len) {
  // Smooth the profile slightly so we don't trip on a single noisy row.
  const smooth = new Float32Array(len)
  const R = 3
  for (let i = 0; i < len; i++) {
    let sum = 0, n = 0
    for (let j = -R; j <= R; j++) {
      const x = i + j
      if (x >= 0 && x < len) { sum += density[x]; n++ }
    }
    smooth[i] = sum / n
  }

  let peak = 0
  for (let i = 0; i < len; i++) if (smooth[i] > peak) peak = smooth[i]
  const contentCutoff = peak * 0.12   // anything above this is "icon"
  const gapCutoff     = peak * 0.06   // anything below this is "gap"

  // Find content bounds.
  let first = -1, last = -1
  for (let i = 0; i < len; i++) {
    if (smooth[i] > contentCutoff) {
      if (first < 0) first = i
      last = i
    }
  }
  if (first < 0) {
    const out = []
    const span = len / k
    for (let i = 0; i < k; i++) out.push(Math.round(span * (i + 0.5)))
    return out
  }

  // Find all "gap regions": runs of positions with density <= gapCutoff,
  // strictly inside [first, last]. For each gap region, record its midpoint
  // and width. The K-1 widest gaps separate the K rows.
  const gaps = []
  let i = first + 1
  while (i < last) {
    if (smooth[i] <= gapCutoff) {
      const gapStart = i
      while (i < last && smooth[i] <= gapCutoff) i++
      const gapEnd = i - 1
      gaps.push({ mid: (gapStart + gapEnd) / 2, width: gapEnd - gapStart + 1 })
    } else {
      i++
    }
  }

  // Pick the K-1 widest gaps as separators. If we found fewer, fall back to
  // evenly dividing the [first,last] range.
  if (gaps.length < k - 1) {
    const span = (last - first + 1) / k
    const out = []
    for (let j = 0; j < k; j++) out.push(Math.round(first + span * (j + 0.5)))
    return out
  }

  const seps = gaps
    .slice()
    .sort((a, b) => b.width - a.width)
    .slice(0, k - 1)
    .map(g => g.mid)
    .sort((a, b) => a - b)

  // Compute each row's center: midpoint of opaque content between adjacent
  // separators (with first/last as outer bounds).
  const bounds = [first - 0.5, ...seps, last + 0.5]
  const out = []
  for (let j = 0; j < k; j++) {
    const lo = Math.ceil(bounds[j])
    const hi = Math.floor(bounds[j + 1])
    let f = -1, l = -1
    for (let x = lo; x <= hi; x++) {
      if (smooth[x] > contentCutoff) {
        if (f < 0) f = x
        l = x
      }
    }
    out.push(Math.round(f < 0 ? (lo + hi) / 2 : (f + l) / 2))
  }
  return out
}

// Connected-component bbox: find the LARGEST/most-central connected cluster
// of non-transparent pixels in the cell, return its bounding box. This
// rejects bleed from neighbouring icons (which appear as smaller, off-center
// clusters at the edges of an over-sized extraction window).
//
// O(w*h) — each pixel is visited exactly once.
async function alphaBBox(buf, w, h) {
  const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  const ALPHA_MIN = 24
  const visited = new Uint8Array(w * h)
  const cx = (w - 1) / 2, cy = (h - 1) / 2
  const cornerDist = Math.hypot(cx, cy)
  let best = { score: -Infinity, bbox: { left: 0, top: 0, width: w, height: h } }

  for (let y0 = 0; y0 < h; y0++) {
    for (let x0 = 0; x0 < w; x0++) {
      const idx0 = y0 * w + x0
      if (visited[idx0]) continue
      visited[idx0] = 1
      if (data[idx0 * 4 + 3] <= ALPHA_MIN) continue

      // BFS this connected cluster (4-connectivity).
      const stack = [x0, y0]
      let area = 0
      let minX = x0, minY = y0, maxX = x0, maxY = y0

      while (stack.length > 0) {
        const py = stack.pop()
        const px = stack.pop()
        area++
        if (px < minX) minX = px
        if (px > maxX) maxX = px
        if (py < minY) minY = py
        if (py > maxY) maxY = py

        // 4 neighbours
        if (px + 1 < w) {
          const ni = py * w + (px + 1)
          if (!visited[ni]) {
            visited[ni] = 1
            if (data[ni * 4 + 3] > ALPHA_MIN) stack.push(px + 1, py)
          }
        }
        if (px - 1 >= 0) {
          const ni = py * w + (px - 1)
          if (!visited[ni]) {
            visited[ni] = 1
            if (data[ni * 4 + 3] > ALPHA_MIN) stack.push(px - 1, py)
          }
        }
        if (py + 1 < h) {
          const ni = (py + 1) * w + px
          if (!visited[ni]) {
            visited[ni] = 1
            if (data[ni * 4 + 3] > ALPHA_MIN) stack.push(px, py + 1)
          }
        }
        if (py - 1 >= 0) {
          const ni = (py - 1) * w + px
          if (!visited[ni]) {
            visited[ni] = 1
            if (data[ni * 4 + 3] > ALPHA_MIN) stack.push(px, py - 1)
          }
        }
      }

      // Score = area, mildly weighted by closeness to centre. Bleed clusters
      // are smaller AND off-centre, so they score much lower than the icon.
      const ccx = (minX + maxX) / 2, ccy = (minY + maxY) / 2
      const dist = Math.hypot(ccx - cx, ccy - cy)
      const score = area * (1 - Math.min(1, dist / cornerDist) * 0.5)
      if (score > best.score) {
        best = {
          score,
          bbox: { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
        }
      }
    }
  }
  return best.bbox
}

main().catch(e => { console.error(e); process.exit(1) })
