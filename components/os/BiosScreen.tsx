'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type Props = { onDone: () => void }

// Timings are authored at full length below and scaled by SPEED so the whole
// sequence can be tuned from one number.
const SPEED = 0.6

const LINES = [
  { text: 'Award Modular BIOS v6.00PG, An Energy Star Ally', t: 0 },
  { text: 'Copyright (C) 1984-2004, Award Software, Inc.', t: 80 },
  { text: '', t: 160 },
  { text: 'ASUS P4P800-E Deluxe ACPI BIOS Revision 1014    ', t: 240 },
  { text: '', t: 320 },
  { text: 'Main Processor : Intel(R) Pentium(R) 4 CPU 2.80GHz (200x14.0)', t: 400 },
  { text: 'Memory Testing :', t: 520, isMemory: true },
  { text: '', t: 1800 },
  { text: 'Primary   IDE Master : None', t: 1900 },
  { text: 'Primary   IDE Slave  : None', t: 2020 },
  { text: 'Secondary IDE Master : HL-DT-ST CD-RW GCE-8481B', t: 2140 },
  { text: 'Secondary IDE Slave  : None', t: 2260 },
  { text: '', t: 2380 },
  { text: 'Auto-detecting USB Mass Storage Devices ...', t: 2440 },
  { text: '  USB Mass Storage Device(s) found', t: 2600 },
  { text: '', t: 2680 },
  { text: 'Press DEL to enter SETUP / F2 to run Diagnostic Program', t: 2760 },
  { text: 'Press F8 for BBS POPUP / F12 for Network Boot', t: 2860 },
  { text: '', t: 2960 },
  { text: 'Verifying DMI Pool Data ........', t: 3040 },
  { text: '', t: 3180 },
  { text: 'Boot from CD :', t: 3240 },
  { text: 'Starting Windows...', t: 3340, isStarting: true },
]

const TOTAL_MS = 3800 * SPEED
const MEM_TOTAL_MS = 1180 * SPEED
const MEM_TICKS = 40

export default function BiosScreen({ onDone }: Props) {
  const [visibleLines, setVisibleLines] = useState<typeof LINES>([])
  const [memCount, setMemCount] = useState(0)
  const [showSkipHint, setShowSkipHint] = useState(false)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }, [onDone])

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    LINES.forEach((line) => {
      timeouts.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
      }, line.t * SPEED))
    })

    const target = 524288
    let count = 0
    const memTimer = setInterval(() => {
      count = Math.min(count + Math.floor(target / MEM_TICKS), target)
      setMemCount(count)
      if (count >= target) clearInterval(memTimer)
    }, MEM_TOTAL_MS / MEM_TICKS)

    timeouts.push(setTimeout(() => setShowSkipHint(true), 700))
    timeouts.push(setTimeout(finish, TOTAL_MS))

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(memTimer)
    }
  }, [finish])

  // Any key, click or tap bails out of the sequence.
  useEffect(() => {
    window.addEventListener('keydown', finish)
    window.addEventListener('pointerdown', finish)
    return () => {
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [finish])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Boot sequence, press any key to skip"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999999,
        background: '#000',
        fontFamily: "'VT323', 'Courier New', monospace",
        fontSize: 16,
        padding: '18px 24px',
        color: '#aaa',
        lineHeight: 1.55,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {visibleLines.map((line, i) => (
        <div key={i}>
          {line.isMemory ? (
            <span>
              {line.text}{' '}
              <span style={{ color: '#fff' }}>{memCount.toLocaleString()}K OK</span>
            </span>
          ) : line.isStarting ? (
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{line.text}</span>
          ) : (
            <span style={{ color: i < 4 ? '#ccc' : '#999' }}>{line.text}</span>
          )}
        </div>
      ))}
      {/* Blinking cursor */}
      <span style={{ animation: 'biosCursor 0.8s step-end infinite', color: '#aaa' }}>█</span>

      {showSkipHint && (
        <div style={{
          position: 'absolute', bottom: 18, right: 24,
          color: '#666', fontSize: 15, animation: 'biosHintIn 0.4s ease-out both',
        }}>
          Press any key to skip
        </div>
      )}

      <style>{`
        @keyframes biosCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes biosHintIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
