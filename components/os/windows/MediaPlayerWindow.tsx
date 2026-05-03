'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Minimal YouTube IFrame API types ────────────────────────────────────────
type YTState = -1 | 0 | 1 | 2 | 3 | 5

interface YTInstance {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(v: number): void
  getCurrentTime(): number
  getDuration(): number
  getPlayerState(): YTState
  destroy(): void
}

declare global {
  interface Window {
    YT: { Player: new (el: HTMLElement, cfg: YTConfig) => YTInstance }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTConfig {
  videoId: string
  width: string
  height: string
  playerVars: Record<string, number>
  events: {
    onReady: (e: { target: YTInstance }) => void
    onStateChange: (e: { target: YTInstance; data: YTState }) => void
  }
}

const START_OFFSET = 53
const END_OFFSET   = 206

// ── Playlist ────────────────────────────────────────────────────────────────
const PLAYLIST = [
  { videoId: '7GO1OZB0UMY', title: 'Disco', artist: 'Surf Curse', year: '2019' },
]

function loadYTApi(): Promise<void> {
  return new Promise(resolve => {
    if (window.YT?.Player) { resolve(); return }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
  })
}

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

// ── WMP Button ───────────────────────────────────────────────────────────────
function WmpBtn({ label, onClick, active = false, title }: {
  label: string; onClick: () => void; active?: boolean; title: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30, height: 26,
        background: active
          ? 'linear-gradient(to bottom, #2a4a2a, #1a3a1a)'
          : 'linear-gradient(to bottom, #3a3a3a, #272727)',
        border: `1px solid ${active ? '#00a050' : '#555'}`,
        borderRadius: 3,
        color: active ? '#00d070' : '#ccc',
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, flexShrink: 0,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, #4a4a4a, #373737)' }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'linear-gradient(to bottom, #2a4a2a, #1a3a1a)' : 'linear-gradient(to bottom, #3a3a3a, #272727)' }}
    >
      {label}
    </button>
  )
}

// ── Slider ───────────────────────────────────────────────────────────────────
function Slider({ value, max, min = 0, onChange, color, width }: {
  value: number; max: number; min?: number; onChange: (v: number) => void
  color: string; width?: number
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div style={{ position: 'relative', width: width ?? '100%', height: 14, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: '5px 0', background: '#222', borderRadius: 2, border: '1px solid #444' }} />
      <div style={{ position: 'absolute', top: 5, left: 0, bottom: 5, width: `${pct}%`, background: color, borderRadius: 2, pointerEvents: 'none', transition: 'width 0.1s' }} />
      <input
        type="range" min={min} max={max} step={max > 100 ? 0.5 : 1} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', margin: 0 }}
      />
    </div>
  )
}

// ── Synced lyrics (source: lrclib.net) ───────────────────────────────────────
// `time` = seconds in the YouTube video (LRC offset + START_OFFSET of 53s)
const DISCO_LYRICS: { time: number; text: string }[] = [
  { time: 65.57,  text: "And I can't help it with you" },
  { time: 70.72,  text: "Stubborn-hearted, blue" },
  { time: 76.29,  text: "Lights come into the room" },
  { time: 81.63,  text: "When disco plays our tune" },
  { time: 86.12,  text: "'Cause there's nothing like it" },
  { time: 89.68,  text: "Not like the way you move" },
  { time: 92.80,  text: "I can try but I can't hide it from you" },
  { time: 98.40,  text: "'Cause I can't wait for you" },
  { time: 104.21, text: "I can't wait for you" },
  { time: 121.03, text: "Admire all of you" },
  { time: 125.83, text: "But fire burns me too" },
  { time: 131.20, text: "Can't stop that disco getting through" },
  { time: 136.89, text: "Can't stop that disco wanting you" },
  { time: 142.46, text: "'Cause there's nothing like it" },
  { time: 145.46, text: "Locking my eyes with you" },
  { time: 148.54, text: "I can't fight it, splitting my mind in two" },
  { time: 153.71, text: "'Cause I can't wait for you" },
  { time: 159.37, text: "I can't wait for you" },
  { time: 165.01, text: "I can't wait for you" },
  { time: 170.22, text: "I can't wait for you" },
]

function LyricsView({ track, current }: { track: typeof PLAYLIST[0]; current: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  // Last lyric line whose timestamp has passed
  const activeIdx = DISCO_LYRICS.reduce<number>((acc, line, i) => current >= line.time ? i : acc, -1)

  // Smooth-scroll to keep active line centered
  useEffect(() => {
    if (!activeLineRef.current || !containerRef.current) return
    const container = containerRef.current
    const line = activeLineRef.current
    const targetScrollTop = line.offsetTop + line.offsetHeight / 2 - container.clientHeight / 2
    container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
  }, [activeIdx])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 20%, #120a28 0%, #080810 100%)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #1a1a2a', flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#5544aa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>&#9834; Lyrics</div>
        <div style={{ fontSize: 11, color: '#c0a0ff', fontWeight: 'bold' }}>{track.title}</div>
        <div style={{ fontSize: 9, color: '#443366', marginTop: 1 }}>{track.artist} &middot; {track.year}</div>
      </div>

      {/* Scrollable lyrics — active line stays centered */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '0 18px', scrollBehavior: 'smooth' }}
      >
        <div style={{ height: 60 }} />

        {DISCO_LYRICS.map((line, i) => {
          const isActive = i === activeIdx
          const isPast   = i < activeIdx
          return (
            <div
              key={i}
              ref={isActive ? activeLineRef : null}
              style={{
                fontSize: isActive ? 14 : 12,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#ffffff' : isPast ? '#2d1f4a' : '#7755bb',
                textAlign: 'center',
                padding: '7px 0',
                transition: 'color 0.35s ease, font-size 0.25s ease',
                textShadow: isActive ? '0 0 18px rgba(180,140,255,0.7)' : 'none',
                letterSpacing: isActive ? 0.4 : 0.1,
              }}
            >
              {line.text}
            </div>
          )
        })}

        <div style={{ height: 60 }} />
      </div>

      {/* Thin progress bar */}
      <div style={{ height: 2, background: '#1a1a2a', flexShrink: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${Math.max(0, ((current - START_OFFSET) / (END_OFFSET - START_OFFSET)) * 100)}%`,
          background: 'linear-gradient(to right, #5533aa, #9966ff)',
          transition: 'width 0.5s linear',
        }} />
      </div>
    </div>
  )
}

// ── Album art view ───────────────────────────────────────────────────────────
function AlbumArt({ track, playing }: { track: typeof PLAYLIST[0]; playing: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0a0a0e 100%)',
      gap: 14,
    }}>
      {/* Art with pulsing glow when playing */}
      <div style={{
        position: 'relative',
        boxShadow: playing
          ? '0 0 28px rgba(0,180,255,0.35), 0 8px 32px rgba(0,0,0,0.85)'
          : '0 8px 32px rgba(0,0,0,0.85)',
        transition: 'box-shadow 0.4s',
        borderRadius: 2,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`}
          alt={`${track.title} — ${track.artist}`}
          style={{ width: 148, height: 111, objectFit: 'cover', display: 'block', borderRadius: 2 }}
        />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 2, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }} />
      </div>

      {/* Track label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#d0d0d0', fontWeight: 'bold', letterSpacing: 0.5 }}>
          {track.title}
        </div>
        <div style={{ fontSize: 10, color: '#555', marginTop: 3, letterSpacing: 0.3 }}>
          {track.artist} &middot; {track.year}
        </div>
      </div>

      {/* Equalizer bars when playing */}
      {playing && (
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
          {[0.6, 1.0, 0.7, 0.9, 0.5].map((h, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 1,
              background: '#00b4ff',
              height: `${h * 14}px`,
              animation: `eqBar${i} 0.6s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0.8,
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes eqBar0 { from { height: 4px } to { height: 12px } }
        @keyframes eqBar1 { from { height: 8px } to { height: 14px } }
        @keyframes eqBar2 { from { height: 5px } to { height: 10px } }
        @keyframes eqBar3 { from { height: 9px } to { height: 13px } }
        @keyframes eqBar4 { from { height: 3px } to { height: 9px }  }
      `}</style>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MediaPlayerWindow() {
  const divRef    = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTInstance | null>(null)
  const tickRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  const [playing,    setPlaying]    = useState(false)
  const [current,    setCurrent]    = useState(0)
  const [,           setDuration]   = useState(0)
  const [volume,     setVolume]     = useState(80)
  const [status,     setStatus]     = useState('Ready')
  const [showLyrics, setShowLyrics] = useState(false)

  // ── Init YouTube player ──────────────────────────────────────────────────
  useEffect(() => {
    let gone = false
    loadYTApi().then(() => {
      if (gone || !divRef.current) return
      playerRef.current = new window.YT.Player(divRef.current, {
        videoId: PLAYLIST[0].videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0, controls: 0, disablekb: 1,
          fs: 0, rel: 0, modestbranding: 1,
          iv_load_policy: 3, playsinline: 1,
          start: START_OFFSET, end: END_OFFSET,
        },
        events: {
          onReady: e => { e.target.setVolume(80); e.target.seekTo(START_OFFSET, true); setStatus('Ready') },
          onStateChange: e => {
            const s = e.data
            setPlaying(s === 1)
            setDuration(e.target.getDuration() || 0)
            if (s === 1) setStatus('Playing')
            else if (s === 2) setStatus('Paused')
            else if (s === 0) { setStatus('Stopped'); setCurrent(START_OFFSET) }
            else if (s === 3) setStatus('Buffering…')
          },
        },
      })
    })
    return () => {
      gone = true
      if (tickRef.current) clearInterval(tickRef.current)
      playerRef.current?.destroy()
    }
  }, [])

  // ── Poll current time ────────────────────────────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => {
      const p = playerRef.current
      if (!p) return
      try {
        const t = p.getCurrentTime() || 0
        if (p.getPlayerState() === 1) {
          if (t < START_OFFSET) p.seekTo(START_OFFSET, true)
          else if (t >= END_OFFSET) { p.pauseVideo(); p.seekTo(START_OFFSET, true) }
        }
        setCurrent(Math.min(t, END_OFFSET))
        setDuration(p.getDuration() || 0)
      } catch { /* player not ready */ }
    }, 500)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (playing) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [playing])

  const stop = useCallback(() => {
    playerRef.current?.stopVideo()
    setPlaying(false); setCurrent(0); setStatus('Stopped')
  }, [])

  const handleVolume = useCallback((v: number) => {
    setVolume(v); playerRef.current?.setVolume(v)
  }, [])

  const track = PLAYLIST[0]

  return (
    <div style={{
      height: '100%', background: '#181818',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Silkscreen', 'Courier New', monospace",
      userSelect: 'none',
    }}>

      {/* ── Viewport ── */}
      <div style={{ flex: 1, background: '#000', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
        {!showLyrics && <AlbumArt track={track} playing={playing} />}
        {showLyrics  && <LyricsView track={track} current={current} />}

        {/* YouTube player — kept in layout (opacity 0) so Chrome's autoplay
            policy + user-activation propagate correctly. visibility:hidden
            blocked playVideo() in some browsers. */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }} aria-hidden>
          <div ref={divRef} style={{ width: '100%', height: '100%' }} />
        </div>

        <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: 'rgba(0,180,255,0.4)', pointerEvents: 'none' }}>
          Windows Media Player
        </div>
      </div>

      {/* ── Track info ── */}
      <div style={{ background: 'linear-gradient(to bottom, #1a1a2e, #12121e)', borderTop: '1px solid #2a2a3a', padding: '5px 10px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#00b4ff', fontWeight: 'bold', letterSpacing: 0.3 }}>{track.title}</div>
          <div style={{ fontSize: 9, color: '#666', marginTop: 1 }}>{track.artist} &middot; {track.year}</div>
        </div>
        <div style={{ fontSize: 10, color: '#888', fontFamily: 'monospace', letterSpacing: 0.5 }}>
          {fmt(current)} / {fmt(END_OFFSET)}
        </div>
      </div>

      {/* ── Seek bar ── */}
      <div style={{ background: '#111', padding: '4px 10px', flexShrink: 0 }}>
        <Slider value={current} max={END_OFFSET} min={START_OFFSET} color="linear-gradient(to right, #006030, #00d070)" onChange={v => { playerRef.current?.seekTo(v, true); setCurrent(v) }} />
      </div>

      {/* ── Controls ── */}
      <div style={{ background: 'linear-gradient(to bottom, #242424, #1a1a1a)', borderTop: '1px solid #333', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <WmpBtn label="⏮" title="Previous" onClick={() => {}} />
        <WmpBtn label="⏹" title="Stop" onClick={stop} />
        <WmpBtn label={playing ? '⏸' : '▶'} title={playing ? 'Pause' : 'Play'} onClick={togglePlay} active={playing} />
        <WmpBtn label="⏭" title="Next" onClick={() => {}} />
        <div style={{ flex: 1 }} />
        <WmpBtn
          label="🎤"
          title={showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
          onClick={() => setShowLyrics(v => !v)}
          active={showLyrics}
        />
        <span style={{ fontSize: 11, color: '#666' }}>🔊</span>
        <Slider value={volume} max={100} color="linear-gradient(to right, #003080, #00b4ff)" width={72} onChange={handleVolume} />
      </div>

      {/* ── Status bar ── */}
      <div style={{ background: '#0e0e0e', borderTop: '1px solid #222', padding: '2px 10px', fontSize: 9, color: playing ? '#00d070' : '#555', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: playing ? '#00d070' : '#333', boxShadow: playing ? '0 0 5px #00d070' : 'none', flexShrink: 0 }} />
        {status} &middot; {showLyrics ? 'Lyrics' : 'Now Playing'} &middot; YouTube
      </div>
    </div>
  )
}
