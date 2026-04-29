'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'

// ── Difficulties ──────────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { name: 'Baby',         rows:  5, cols:  5, mines:  3  },
  { name: 'Easy',         rows:  7, cols:  7, mines:  7  },
  { name: 'Beginner',     rows:  9, cols:  9, mines: 10  },
  { name: 'Casual',       rows: 10, cols: 10, mines: 15  },
  { name: 'Normal',       rows: 12, cols: 12, mines: 22  },
  { name: 'Intermediate', rows: 14, cols: 14, mines: 35  },
  { name: 'Hard',         rows: 14, cols: 16, mines: 48  },
  { name: 'Expert',       rows: 16, cols: 16, mines: 60  },
  { name: 'Master',       rows: 20, cols: 16, mines: 90  },
  { name: 'Nightmare',    rows: 22, cols: 20, mines: 130 },
] as const

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

function revealCells(r: number, c: number, b: Cell[][], rows: number, cols: number) {
  if (b[r][c].isRevealed || b[r][c].isFlagged) return
  b[r][c].isRevealed = true
  if (b[r][c].adjacentMines === 0 && !b[r][c].isMine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr; const nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !b[nr][nc].isRevealed)
        revealCells(nr, nc, b, rows, cols)
    }
  }
}

function emptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0,
    }))
  )
}

function placeMines(board: Cell[][], safeR: number, safeC: number, mines: number): Cell[][] {
  const rows = board.length
  const cols = board[0].length
  const nb = board.map(row => row.map(cell => ({ ...cell })))
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!nb[r][c].isMine && !(Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) {
      nb[r][c].isMine = true
      placed++
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (nb[r][c].isMine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr; const nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && nb[nr][nc].isMine) count++
      }
      nb[r][c].adjacentMines = count
    }
  }
  return nb
}

const NUM_COLORS = ['', '#0000ff', '#007b00', '#ff0000', '#00007b', '#7b0000', '#007b7b', '#000', '#808080']

// ── Victory sound (Web Audio API — no file needed) ────────────────────────────
function playVictory() {
  try {
    const ctx = new AudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = i === notes.length - 1 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.13
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  } catch { /* AudioContext blocked in some browsers */ }
}

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#ff4444', '#ffcc00', '#44cc44', '#4488ff', '#ff44cc', '#44ddff', '#ff8800', '#cc44ff']

function generateConfettiPieces() {
  return Array.from({ length: 110 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 5 + Math.random() * 7,
    aspect: 0.45 + Math.random() * 0.7,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    duration: 2.6 + Math.random() * 2.2,
    delay: Math.random() * 1.8,
    startRotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 60,
    circular: Math.random() > 0.5,
  }))
}

function Confetti() {
  const [pieces] = useState(generateConfettiPieces)

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -12,
            width: p.size,
            height: p.size * p.aspect,
            background: p.color,
            borderRadius: p.circular ? '50%' : 1,
            ['--rot-s' as string]: `${p.startRotate}deg`,
            ['--rot-e' as string]: `${p.startRotate + 540}deg`,
            ['--drift' as string]: `${p.drift}px`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

// ── LED Display ───────────────────────────────────────────────────────────────
function LEDDisplay({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, -99), 999)
  const str = clamped < 0
    ? '-' + String(Math.abs(clamped)).padStart(2, '0')
    : String(clamped).padStart(3, '0')
  return (
    <div style={{
      background: '#1a0000', border: '2px inset #808080',
      color: '#ff2200', fontFamily: '"Courier New", Courier, monospace',
      fontSize: 20, fontWeight: 'bold', letterSpacing: 3,
      padding: '1px 5px 0', minWidth: 46, textAlign: 'center',
      lineHeight: '24px', height: 28,
    }}>
      {str}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function MineIcon({ red = false }: { red?: boolean }) {
  const c = red ? '#cc0000' : '#1a1a1a'
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      {[0, 45, 90, 135].map(deg => {
        const rad = deg * Math.PI / 180
        return <line key={deg}
          x1={7 + Math.cos(rad) * 2} y1={7 + Math.sin(rad) * 2}
          x2={7 + Math.cos(rad) * 6.5} y2={7 + Math.sin(rad) * 6.5}
          stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      })}
      {[0, 45, 90, 135].map(deg => {
        const rad = (deg + 22.5) * Math.PI / 180
        return <line key={deg + 200}
          x1={7 + Math.cos(rad) * 2.5} y1={7 + Math.sin(rad) * 2.5}
          x2={7 + Math.cos(rad) * 5.5} y2={7 + Math.sin(rad) * 5.5}
          stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      })}
      <circle cx="7" cy="7" r="3.6" fill={c}/>
      <circle cx="5.8" cy="5.8" r="1.1" fill="white" opacity="0.55"/>
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14">
      <polygon points="5,2 11,5 5,8" fill="#ee1111"/>
      <line x1="5" y1="2" x2="5" y2="12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="8" y2="12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function WrongFlagIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14">
      <polygon points="5,2 11,5 5,8" fill="#ee1111"/>
      <line x1="5" y1="2" x2="5" y2="12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="8" y2="12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2" y1="2" x2="12" y2="12" stroke="#ff0000" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="2" x2="2" y2="12" stroke="#ff0000" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Smiley ────────────────────────────────────────────────────────────────────
function SmileyButton({ status, onClick }: { status: 'playing' | 'won' | 'lost'; onClick: () => void }) {
  const [down, setDown] = useState(false)
  const face = status === 'won' ? 'cool' : status === 'lost' ? 'dead' : 'smile'
  return (
    <button
      onMouseDown={() => setDown(true)}
      onMouseUp={() => { setDown(false); onClick() }}
      onMouseLeave={() => setDown(false)}
      style={{
        width: 26, height: 26,
        border: down ? '2px inset #808080' : '2px outset #ffffff',
        background: '#c0c0c0', cursor: 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="8" fill="#ffdd00" stroke="#a08000" strokeWidth="0.8"/>
        {face === 'dead' ? (
          <>
            <line x1="5.5" y1="6.5" x2="7.5" y2="8.5" stroke="#333" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="7.5" y1="6.5" x2="5.5" y2="8.5" stroke="#333" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="10.5" y1="6.5" x2="12.5" y2="8.5" stroke="#333" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="12.5" y1="6.5" x2="10.5" y2="8.5" stroke="#333" strokeWidth="1.4" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <ellipse cx="6.5" cy="7" rx="1.1" ry={face === 'cool' ? 0.6 : 1.1} fill="#333"/>
            <ellipse cx="11.5" cy="7" rx="1.1" ry={face === 'cool' ? 0.6 : 1.1} fill="#333"/>
          </>
        )}
        {face === 'cool' && (
          <>
            <rect x="4.5" y="5.8" width="4" height="2.5" rx="0.7" fill="#333" opacity="0.85"/>
            <rect x="9.5" y="5.8" width="4" height="2.5" rx="0.7" fill="#333" opacity="0.85"/>
            <line x1="8.5" y1="7" x2="9.5" y2="7" stroke="#333" strokeWidth="0.8"/>
          </>
        )}
        {face === 'dead'
          ? <path d="M 6 13 Q 9 11 12 13" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          : <path d="M 6 11.5 Q 9 14 12 11.5" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        }
      </svg>
    </button>
  )
}

// ── Memoized Cell ─────────────────────────────────────────────────────────────
const Cell = memo(function Cell({ r, c, isRevealed, isMine, isFlagged, adjacentMines, isHitMine, isWrongFlag, cellSize, gameOver, onLeft, onRight }: {
  r: number; c: number
  isRevealed: boolean; isMine: boolean; isFlagged: boolean; adjacentMines: number
  isHitMine: boolean; isWrongFlag: boolean
  cellSize: number; gameOver: boolean
  onLeft: (r: number, c: number) => void
  onRight: (e: React.MouseEvent, r: number, c: number) => void
}) {
  const bg = isHitMine ? '#ff4444' : isRevealed ? '#d0ccc4' : '#c0c0c0'
  return (
    <button
      onClick={() => onLeft(r, c)}
      onContextMenu={e => onRight(e, r, c)}
      style={{
        width: cellSize, height: cellSize,
        border: isRevealed ? '1px solid #808080' : '2px outset #ffffff',
        background: bg,
        cursor: gameOver ? 'default' : 'pointer',
        padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Tahoma, Arial', fontWeight: 'bold',
        fontSize: Math.max(cellSize - 10, 9),
        lineHeight: 1, flexShrink: 0,
      }}
    >
      {isRevealed && isMine ? <MineIcon red={isHitMine} />
        : isWrongFlag ? <WrongFlagIcon />
        : isFlagged ? <FlagIcon />
        : isRevealed && adjacentMines > 0 ? <span style={{ color: NUM_COLORS[adjacentMines] }}>{adjacentMines}</span>
        : null}
    </button>
  )
})

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MinesweeperWindow() {
  const [diffIdx, setDiffIdx] = useState(0)
  const diff = DIFFICULTIES[diffIdx]

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard(diff.rows, diff.cols))
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
  const [flags, setFlags] = useState(diff.mines)
  const [time, setTime] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Stable refs so memoized callbacks don't go stale
  const boardRef = useRef(board)
  const statusRef = useRef(status)
  const diffRef = useRef(diff)
  useEffect(() => { boardRef.current = board }, [board])
  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { diffRef.current = diff }, [diff])

  const reset = useCallback((nextDiff = diffIdx) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const d = DIFFICULTIES[nextDiff]
    setBoard(emptyBoard(d.rows, d.cols))
    setStatus('idle')
    setFlags(d.mines)
    setTime(0)
    setShowConfetti(false)
  }, [diffIdx])

  // Switch difficulty
  const changeDiff = (idx: number) => {
    setDiffIdx(idx)
    reset(idx)
  }

  // Timer
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])


  const handleClick = useCallback((r: number, c: number) => {
    const s = statusRef.current
    const b = boardRef.current
    const d = diffRef.current
    if (s === 'won' || s === 'lost') return
    if (b[r][c].isFlagged || b[r][c].isRevealed) return

    let nb: Cell[][]
    if (s === 'idle') {
      nb = placeMines(b, r, c, d.mines)
      setStatus('playing')
    } else {
      nb = b.map(row => row.map(cell => ({ ...cell })))
    }

    if (nb[r][c].isMine) {
      nb.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true }))
      setBoard(nb)
      setStatus('lost')
      return
    }

    revealCells(r, c, nb, d.rows, d.cols)
    const won = nb.every(row => row.every(cell => cell.isMine || cell.isRevealed))
    setBoard(nb)
    if (won) {
      setStatus('won')
      setShowConfetti(true)
      playVictory()
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault()
    const s = statusRef.current
    const b = boardRef.current
    if (s === 'won' || s === 'lost' || b[r][c].isRevealed) return
    const nb = b.map(row => row.map(cell => ({ ...cell })))
    nb[r][c].isFlagged = !nb[r][c].isFlagged
    setFlags(f => (nb[r][c].isFlagged ? f - 1 : f + 1) as typeof f)
    setBoard(nb)
    if (s === 'idle') setStatus('playing')
  }, [])

  // Cell size — scales down for larger boards
  const cellSize = Math.min(24,
    Math.floor(390 / diff.cols),
    Math.floor(340 / diff.rows)
  )

  const gameStatus = (status === 'won' || status === 'lost') ? status : 'playing'

  return (
    <div style={{
      background: '#c0c0c0',
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 11,
      userSelect: 'none', padding: '8px 6px',
      overflowY: 'auto', position: 'relative',
    }}>
      {showConfetti && <Confetti />}

      {/* ── Difficulty selector ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center',
        marginBottom: 6, maxWidth: 420,
      }}>
        {DIFFICULTIES.map((d, i) => (
          <button
            key={d.name}
            onClick={() => changeDiff(i)}
            style={{
              padding: '2px 8px',
              fontSize: 10,
              fontFamily: 'Tahoma, Arial',
              background: diffIdx === i ? '#000080' : '#c0c0c0',
              color: diffIdx === i ? '#fff' : '#000',
              border: diffIdx === i ? '2px inset #808080' : '2px outset #ffffff',
              cursor: 'pointer',
              borderRadius: 0,
              fontWeight: diffIdx === i ? 'bold' : 'normal',
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* ── Game panel ── */}
      <div style={{
        border: '3px outset #ffffff',
        background: '#c0c0c0',
        padding: 6,
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        {/* Header */}
        <div style={{
          border: '2px inset #808080', background: '#c0c0c0',
          padding: '4px 8px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <LEDDisplay value={flags} />
          <SmileyButton status={gameStatus} onClick={() => reset(diffIdx)} />
          <LEDDisplay value={time} />
        </div>

        {/* Board */}
        <div style={{ border: '3px inset #808080', background: '#c0c0c0', display: 'inline-block' }}>
          {board.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((cell, c) => (
                <Cell
                  key={c}
                  r={r} c={c}
                  isRevealed={cell.isRevealed}
                  isMine={cell.isMine}
                  isFlagged={cell.isFlagged}
                  adjacentMines={cell.adjacentMines}
                  isHitMine={status === 'lost' && cell.isMine && cell.isRevealed}
                  isWrongFlag={status === 'lost' && cell.isFlagged && !cell.isMine}
                  cellSize={cellSize}
                  gameOver={status === 'won' || status === 'lost'}
                  onLeft={handleClick}
                  onRight={handleRightClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      {status === 'won' && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 'bold', color: '#007700' }}>
          {diff.name} cleared! Time: {time}s
        </div>
      )}
      {status === 'lost' && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 'bold', color: '#cc0000' }}>
          Game over — click the smiley to try again.
        </div>
      )}

      {/* Copyright */}
      <div style={{ fontSize: 9, color: '#666', marginTop: 8, textAlign: 'center', lineHeight: 1.6 }}>
        Minesweeper — inspired by the original © 1990 Microsoft Corporation<br />
        Recreated for this portfolio. All original rights reserved by Microsoft.
      </div>
    </div>
  )
}
