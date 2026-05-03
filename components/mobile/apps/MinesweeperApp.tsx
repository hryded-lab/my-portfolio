'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import MobileAppShell from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#ff5e4e'

// Classic-ish "beginner" sizing trimmed slightly to fit a phone width.
const ROWS  = 9
const COLS  = 9
const MINES = 10

type Cell = {
  mine: boolean
  count: number     // adjacent mine count
  open: boolean
  flagged: boolean
}

type GameState = 'playing' | 'won' | 'lost'

const NUM_COLOR = ['', '#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#ef6c00', '#0097a7', '#212121', '#616161']

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, count: 0, open: false, flagged: false }))
  )
}

function placeMines(board: Cell[][], avoidR: number, avoidC: number) {
  // Avoid placing a mine on the first-tapped cell or its neighbours.
  const avoid = new Set<string>()
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const r = avoidR + dr, c = avoidC + dc
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) avoid.add(`${r},${c}`)
    }

  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (board[r][c].mine) continue
    if (avoid.has(`${r},${c}`)) continue
    board[r][c].mine = true
    placed++
  }

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue
      let n = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue
          if (board[rr][cc].mine) n++
        }
      board[r][c].count = n
    }
}

function flood(board: Cell[][], r: number, c: number) {
  const stack: [number, number][] = [[r, c]]
  while (stack.length) {
    const [cr, cc] = stack.pop()!
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue
    const cell = board[cr][cc]
    if (cell.open || cell.flagged || cell.mine) continue
    cell.open = true
    if (cell.count === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          stack.push([cr + dr, cc + dc])
        }
    }
  }
}

function isWon(board: Cell[][]) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c]
      if (!cell.mine && !cell.open) return false
    }
  return true
}

export default function MinesweeperApp() {
  const [board, setBoard]   = useState<Cell[][]>(() => emptyBoard())
  const [seeded, setSeeded] = useState(false)
  const [state, setState]   = useState<GameState>('playing')
  const [flagMode, setFlagMode] = useState(false)
  const [seconds, setSeconds]   = useState(0)

  // timer
  useEffect(() => {
    if (state !== 'playing' || !seeded) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [state, seeded])

  const flags = useMemo(
    () => board.reduce((acc, row) => acc + row.filter(c => c.flagged).length, 0),
    [board]
  )

  const reset = () => {
    setBoard(emptyBoard())
    setSeeded(false)
    setState('playing')
    setSeconds(0)
  }

  const tap = (r: number, c: number) => {
    if (state !== 'playing') return
    const next = board.map(row => row.map(cell => ({ ...cell })))

    if (!seeded) {
      placeMines(next, r, c)
      setSeeded(true)
    }

    const cell = next[r][c]
    if (cell.open) return

    if (flagMode) {
      cell.flagged = !cell.flagged
      setBoard(next)
      return
    }

    if (cell.flagged) return

    if (cell.mine) {
      // reveal all mines
      for (let rr = 0; rr < ROWS; rr++)
        for (let cc = 0; cc < COLS; cc++)
          if (next[rr][cc].mine) next[rr][cc].open = true
      cell.open = true
      setBoard(next)
      setState('lost')
      return
    }

    flood(next, r, c)
    setBoard(next)
    if (isWon(next)) setState('won')
  }

  const longPress = useLongPress((r: number, c: number) => {
    if (state !== 'playing') return
    if (!seeded) return
    const next = board.map(row => row.map(cell => ({ ...cell })))
    if (next[r][c].open) return
    next[r][c].flagged = !next[r][c].flagged
    setBoard(next)
  })

  const statusText =
    state === 'won'  ? '✓ Cleared'
  : state === 'lost' ? '✕ Boom'
  : seeded           ? 'Live'
  :                    'Ready'

  return (
    <MobileAppShell title="Minesweeper" color={COLOR} subtitle={statusText}>
      {/* Stat bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: b.surface,
          border: `1.5px solid ${b.border}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          marginBottom: 14,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <Stat label="Mines" value={String(MINES - flags).padStart(2, '0')} accent={COLOR} />
        <Stat label="State" value={state.toUpperCase()} accent={state === 'won' ? '#4ed670' : state === 'lost' ? COLOR : b.text} />
        <Stat label="Time"  value={fmtTime(seconds)} accent={b.text} />
      </div>

      {/* Board */}
      <div
        style={{
          background: b.surface,
          border: `1.5px solid ${b.border}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          padding: 6,
          marginBottom: 14,
          touchAction: 'manipulation',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 2,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => tap(r, c)}
                {...longPress(r, c)}
                aria-label={`cell ${r},${c}`}
                style={{
                  aspectRatio: '1 / 1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: cell.open
                    ? cell.mine ? '#3a0e0e' : '#1a1f2e'
                    : '#293349',
                  border: `1px solid ${cell.open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.18)'}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, ui-monospace, monospace',
                  fontSize: 14, fontWeight: 700,
                  color: cellColor(cell),
                  padding: 0,
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                }}
              >
                {cellGlyph(cell)}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6 }}>
        <CtrlBtn
          label={flagMode ? '⚑ Flag (on)' : '⚑ Flag'}
          active={flagMode}
          onClick={() => setFlagMode(v => !v)}
        />
        <CtrlBtn label="↻ New" onClick={reset} primary />
      </div>

      <div
        style={{
          marginTop: 14,
          textAlign: 'center',
          color: b.textMute,
          fontFamily: t.fontMono,
          fontSize: 10, letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        Tap to open · long-press to flag
      </div>
    </MobileAppShell>
  )
}

function fmtTime(s: number) {
  const m  = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

function cellColor(c: Cell): string {
  if (!c.open) return c.flagged ? COLOR : 'transparent'
  if (c.mine)  return '#ff5e4e'
  return NUM_COLOR[c.count] ?? '#fff'
}

function cellGlyph(c: Cell): string {
  if (!c.open) return c.flagged ? '⚑' : ''
  if (c.mine)  return '✸'
  return c.count > 0 ? String(c.count) : ''
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'Space Mono, ui-monospace, monospace',
          fontSize: 9, fontWeight: 700,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: b.textMute, marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Space Mono, ui-monospace, monospace',
          fontSize: 16, fontWeight: 700,
          color: accent, fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function CtrlBtn({
  label, onClick, primary, active,
}: { label: string; onClick: () => void; primary?: boolean; active?: boolean }) {
  const accent = active ? COLOR : primary ? COLOR : undefined
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        background: active ? COLOR : primary ? COLOR : b.surface,
        color: active || primary ? b.bgDeep : b.text,
        border: `1.5px solid ${accent ?? b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: active || primary ? b.shadow() : 'none',
        cursor: 'pointer',
        fontFamily: 'Space Mono, ui-monospace, monospace',
        fontSize: 11, fontWeight: 700,
        letterSpacing: 1.4, textTransform: 'uppercase',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
}

// Long-press hook returning prop spreaders. Triggers a callback after 380ms,
// suppressing the subsequent click so flag-toggle and tap-to-open don't double-fire.
function useLongPress(cb: (r: number, c: number) => void, ms = 380) {
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fired  = useRef(false)

  const start = (r: number, c: number) => {
    fired.current = false
    timer.current = setTimeout(() => {
      fired.current = true
      cb(r, c)
    }, ms)
  }
  const cancel = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
  }

  return (r: number, c: number) => ({
    onPointerDown:  () => start(r, c),
    onPointerUp:    cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu:  (e: React.MouseEvent) => { e.preventDefault() },
    onClickCapture: (e: React.MouseEvent) => { if (fired.current) { e.stopPropagation(); fired.current = false } },
  })
}
