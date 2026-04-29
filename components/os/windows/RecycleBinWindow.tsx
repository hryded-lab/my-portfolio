'use client'

import { useEffect, useState } from 'react'

// Random integer between min and max inclusive
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function RecycleBinWindow() {
  const [cycle, setCycle] = useState(0)
  const [size, setSize] = useState(() => randInt(26, 52))

  useEffect(() => {
    const id = setInterval(() => {
      setCycle(c => c + 1)
      setSize(randInt(26, 52))
    }, 4800)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'VT323', 'Courier New', monospace",
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Empty bin icon */}
      <div style={{ marginBottom: 10, opacity: 0.25 }}>
        <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
          <rect x="4" y="14" width="48" height="46" rx="4" stroke="#888" strokeWidth="2.5" fill="#f0f0f0"/>
          <rect x="0" y="10" width="56" height="8" rx="3" fill="#d4d0c8" stroke="#888" strokeWidth="1.5"/>
          <rect x="20" y="4" width="16" height="8" rx="2" fill="#c8c4bc" stroke="#888" strokeWidth="1.5"/>
          <line x1="18" y1="26" x2="18" y2="52" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
          <line x1="28" y1="26" x2="28" y2="52" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
          <line x1="38" y1="26" x2="38" y2="52" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ fontSize: 18, color: '#888', fontWeight: 600, marginBottom: 4 }}>
        There&apos;s nothing here
      </div>
      <div style={{ fontSize: 14, color: '#bbb' }}>
        Recycle Bin is empty
      </div>

      {/* Ground + tumbleweed stage */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 72,
        overflow: 'hidden',
      }}>
        {/* Ground fill */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 24, background: '#f5f3ee',
          borderTop: '1px solid #dedad2',
        }} />

        {/* Tumbleweed — outer div translates, inner div spins (physically decoupled) */}
        <div
          key={cycle}
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            width: '100%',
            height: 52,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* Translation layer — slight ease so it gently drifts in and out of view */}
          <div style={{ animation: 'tumbleTranslate 4.6s cubic-bezier(0.25, 0, 0.75, 1) forwards' }}>
            {/* Rotation layer — linear so rolling looks physically correct */}
            <div style={{ animation: 'tumbleSpin 4.6s linear forwards' }}>
              <Tumbleweed size={size} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tumbleTranslate {
          0%   { transform: translateX(520px); opacity: 0; }
          7%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateX(-90px); opacity: 0; }
        }
        @keyframes tumbleSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-${Math.round(610 * 360 / (Math.PI * size))}deg); }
        }
      `}</style>
    </div>
  )
}

function Tumbleweed({ size = 52 }: { size?: number }) {
  const r = size / 2
  const c = r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer wispy branches — 12 at 30° intervals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = c + Math.cos(rad) * (r * 0.38)
        const y1 = c + Math.sin(rad) * (r * 0.38)
        const x2 = c + Math.cos(rad) * (r * 0.93)
        const y2 = c + Math.sin(rad) * (r * 0.93)
        const mx = c + Math.cos(rad + 0.38) * (r * 0.68)
        const my = c + Math.sin(rad + 0.38) * (r * 0.68)
        const colors = ['#a07840', '#b89060', '#c8a870']
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            stroke={colors[i % 3]}
            strokeWidth={i % 2 === 0 ? '1.5' : '1.1'}
            fill="none"
            strokeLinecap="round"
            opacity={0.88}
          />
        )
      })}
      {/* Mid-ring branches — 8 at 45° offsets */}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = c + Math.cos(rad) * (r * 0.22)
        const y1 = c + Math.sin(rad) * (r * 0.22)
        const x2 = c + Math.cos(rad) * (r * 0.72)
        const y2 = c + Math.sin(rad) * (r * 0.72)
        const mx = c + Math.cos(rad - 0.3) * (r * 0.5)
        const my = c + Math.sin(rad - 0.3) * (r * 0.5)
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            stroke="#9a6e30"
            strokeWidth="1.0"
            fill="none"
            strokeLinecap="round"
            opacity={0.55}
          />
        )
      })}
      {/* Inner spokes */}
      {[15, 75, 135, 195, 255, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = c + Math.cos(rad) * (r * 0.1)
        const y1 = c + Math.sin(rad) * (r * 0.1)
        const x2 = c + Math.cos(rad) * (r * 0.52)
        const y2 = c + Math.sin(rad) * (r * 0.52)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#906830" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
        )
      })}
      {/* Faint outer rim */}
      <circle cx={c} cy={c} r={r * 0.9} fill="none" stroke="#b89040" strokeWidth="0.7" opacity="0.25"
        strokeDasharray="3 4"/>
      {/* Centre knot */}
      <circle cx={c} cy={c} r={r * 0.1} fill="#a07840" opacity="0.75"/>
    </svg>
  )
}
