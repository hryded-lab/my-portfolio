'use client'

import { useState, useEffect, useRef } from 'react'

type Props = { onDone: () => void }

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

export default function BiosScreen({ onDone }: Props) {
  const [visibleLines, setVisibleLines] = useState<typeof LINES>([])
  const [memCount, setMemCount] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    // Always replay boot on fresh load
    sessionStorage.removeItem('xp-booted')

    const timers: ReturnType<typeof setTimeout>[] = []

    LINES.forEach((line) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
      }, line.t))
    })

    // Memory count animation (runs from t=520 to t=1700)
    let count = 0
    const target = 524288
    const memTimer = setInterval(() => {
      count = Math.min(count + Math.floor(target / 40), target)
      setMemCount(count)
      if (count >= target) clearInterval(memTimer)
    }, 30)
    timers.push(memTimer as unknown as ReturnType<typeof setTimeout>)

    // Call onDone after full sequence
    timers.push(setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone() }
    }, 3800))

    return () => timers.forEach(t => clearTimeout(t))
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999999,
      background: '#000',
      fontFamily: "'VT323', 'Courier New', monospace",
      fontSize: 16,
      padding: '18px 24px',
      color: '#aaa',
      lineHeight: 1.55,
      overflow: 'hidden',
    }}>
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

      <style>{`
        @keyframes biosCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
