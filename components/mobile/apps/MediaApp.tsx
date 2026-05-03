'use client'

import { useState } from 'react'
import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#4674c7'

type Track = {
  videoId: string
  title: string
  artist: string
  year: string
}

// Curated rotation of tracks — picks tracks Hryday actually plays.
// Add more here to grow the playlist.
const PLAYLIST: Track[] = [
  { videoId: '7GO1OZB0UMY', title: 'Disco',                 artist: 'Surf Curse',  year: '2019' },
  { videoId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', year: '1987' },
  { videoId: '60ItHLz5WEA', title: 'Faded',                 artist: 'Alan Walker', year: '2015' },
]

export default function MediaApp() {
  const [idx, setIdx] = useState(0)
  const track = PLAYLIST[idx]

  return (
    <MobileAppShell title="Media" color={COLOR} subtitle={`Track ${idx + 1} / ${PLAYLIST.length}`}>
      {/* Now playing card */}
      <div
        style={{
          background: b.surface,
          border: `1.5px solid ${b.border}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          padding: 14,
          marginBottom: 18,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        {/* Album art / video frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            background: '#000',
            border: `1.5px solid ${b.borderStrong}`,
            borderRadius: b.radiusSm,
            overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <iframe
            key={track.videoId}
            src={`https://www.youtube-nocookie.com/embed/${track.videoId}?autoplay=0&modestbranding=1&rel=0&playsinline=1`}
            title={track.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <BrutalistTag color={COLOR}>Now Playing</BrutalistTag>
          <span
            style={{
              fontFamily: t.fontMono,
              fontSize: 10, fontWeight: 700,
              letterSpacing: 1.2,
              color: b.textMute,
              textTransform: 'uppercase',
            }}
          >
            {track.year}
          </span>
        </div>
        <div
          style={{
            fontFamily: t.fontDisplay,
            fontSize: 22, fontWeight: 800,
            color: b.text, letterSpacing: -0.6,
            lineHeight: 1.1,
          }}
        >
          {track.title}
        </div>
        <div
          style={{
            fontFamily: t.fontMono,
            fontSize: 11, fontWeight: 700,
            color: COLOR, letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          {track.artist}
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <NavBtn
            label="◄ Prev"
            disabled={idx === 0}
            onClick={() => setIdx(i => Math.max(0, i - 1))}
          />
          <NavBtn
            label="Next ►"
            disabled={idx === PLAYLIST.length - 1}
            onClick={() => setIdx(i => Math.min(PLAYLIST.length - 1, i + 1))}
            primary
          />
        </div>
      </div>

      {/* Up next list */}
      <div
        style={{
          fontFamily: t.fontMono,
          fontSize: 10, fontWeight: 700,
          letterSpacing: 1.6, textTransform: 'uppercase',
          color: b.textDim,
          marginBottom: 10,
          paddingLeft: 4,
        }}
      >
        ▸ Playlist
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PLAYLIST.map((tr, i) => {
          const active = i === idx
          return (
            <button
              key={tr.videoId}
              onClick={() => setIdx(i)}
              style={{
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                background: active ? b.surfaceRaised : b.surface,
                border: `1.5px solid ${active ? COLOR : b.border}`,
                borderRadius: b.radiusSm,
                boxShadow: active ? b.shadow(COLOR) : 'none',
                cursor: 'pointer',
                color: 'inherit',
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <span
                style={{
                  width: 22, textAlign: 'center',
                  fontFamily: t.fontMono, fontSize: 11, fontWeight: 700,
                  color: active ? COLOR : b.textMute, letterSpacing: 0.4,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: t.fontDisplay, fontSize: 13.5, fontWeight: 700,
                    color: b.text, letterSpacing: -0.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {tr.title}
                </div>
                <div
                  style={{
                    fontFamily: t.fontMono, fontSize: 10.5,
                    color: b.textDim, letterSpacing: 0.4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {tr.artist} · {tr.year}
                </div>
              </div>
              {active && (
                <span style={{ color: COLOR, fontFamily: t.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>
                  ▶
                </span>
              )}
            </button>
          )
        })}
      </div>
    </MobileAppShell>
  )
}

function NavBtn({
  label, onClick, disabled, primary,
}: { label: string; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '10px 12px',
        background: primary ? COLOR : b.surfaceRaised,
        color: primary ? b.bgDeep : b.text,
        border: `1.5px solid ${primary ? COLOR : b.borderStrong}`,
        borderRadius: b.radiusSm,
        boxShadow: primary && !disabled ? b.shadow() : 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: t.fontMono,
        fontSize: 11, fontWeight: 700,
        letterSpacing: 1.4, textTransform: 'uppercase',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
}
