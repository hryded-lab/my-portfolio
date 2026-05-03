'use client'

import { useEffect, useRef, useState } from 'react'
import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#6cd1ff'

type Tab = 'clock' | 'world' | 'stopwatch' | 'weather'

export default function ClockApp() {
  const [tab, setTab] = useState<Tab>('clock')

  // Tab state — persists while app is mounted
  const [cities, setCities] = useState<WorldCity[]>([])
  const [weatherList, setWeatherList] = useState<WeatherEntry[]>([])
  const [stopwatch, setStopwatch] = useState<StopwatchState>({ elapsed: 0, running: false, laps: [] })

  return (
    <MobileAppShell
      title={titleFor(tab)}
      color={COLOR}
      subtitle={subtitleFor(tab)}
    >
      <TabBar value={tab} onChange={setTab} />

      {tab === 'clock'     && <ClockTab />}
      {tab === 'world'     && <WorldTab cities={cities} setCities={setCities} />}
      {tab === 'stopwatch' && <StopwatchTab state={stopwatch} setState={setStopwatch} />}
      {tab === 'weather'   && <WeatherTab list={weatherList} setList={setWeatherList} />}
    </MobileAppShell>
  )
}

function titleFor(tab: Tab): string {
  return tab === 'clock' ? 'Clock'
       : tab === 'world' ? 'World'
       : tab === 'stopwatch' ? 'Stopwatch'
       : 'Weather'
}
function subtitleFor(tab: Tab): string {
  return tab === 'clock' ? 'Local · Live'
       : tab === 'world' ? 'Cities'
       : tab === 'stopwatch' ? 'Precision · 10ms'
       : 'Open-Meteo'
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const tabs: Tab[] = ['clock', 'world', 'stopwatch', 'weather']
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
        marginBottom: 22,
      }}
    >
      {tabs.map(name => {
        const active = value === name
        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            style={{
              padding: '9px 4px',
              border: `1.5px solid ${active ? COLOR : b.border}`,
              borderRadius: b.radiusSm,
              background: active ? COLOR : b.surface,
              color: active ? b.bgDeep : b.text,
              fontFamily: t.fontMono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: active ? b.shadow() : 'none',
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 0.12s ease',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}

// ── Clock tab ─────────────────────────────────────────────────────────────────

function ClockTab() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone

  const sec = now.getSeconds() + now.getMilliseconds() / 1000
  const min = now.getMinutes() + sec / 60
  const hr  = (now.getHours() % 12) + min / 60

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
      <AnalogFace hrAngle={hr * 30} minAngle={min * 6} secAngle={sec * 6} />

      <div
        style={{
          marginTop: 28,
          padding: '12px 18px',
          background: b.surface,
          border: `1.5px solid ${b.border}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <div
          style={{
            fontSize: 42, fontWeight: 700, letterSpacing: -1,
            color: b.text, fontFamily: t.fontMono,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {time}
        </div>
      </div>
      <div
        style={{
          marginTop: 14, fontSize: 12, color: b.textDim,
          fontFamily: t.fontMono, letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {date}
      </div>
      <div style={{ marginTop: 8 }}>
        <BrutalistTag color={COLOR}>{tzName}</BrutalistTag>
      </div>
    </div>
  )
}

function AnalogFace({ hrAngle, minAngle, secAngle }: { hrAngle: number; minAngle: number; secAngle: number }) {
  const SIZE = 200
  const C = SIZE / 2
  return (
    <div
      style={{
        width: SIZE, height: SIZE,
        background: '#fff',
        border: `1.5px solid ${b.borderStrong}`,
        borderRadius: '50%',
        boxShadow: b.shadow(COLOR),
        position: 'relative',
      }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30
          const isMajor = i % 3 === 0
          const r1 = SIZE / 2 - 6
          const r2 = SIZE / 2 - (isMajor ? 18 : 12)
          const rad = ((angle - 90) * Math.PI) / 180
          return (
            <line
              key={i}
              x1={C + Math.cos(rad) * r1} y1={C + Math.sin(rad) * r1}
              x2={C + Math.cos(rad) * r2} y2={C + Math.sin(rad) * r2}
              stroke="#000"
              strokeWidth={isMajor ? 4 : 2}
              strokeLinecap="butt"
            />
          )
        })}
        {/* Numerals at 12, 3, 6, 9 — kept inside the tick ring */}
        {[
          { n: '12', x: C,        y: 32 },
          { n: '3',  x: SIZE - 22, y: C  },
          { n: '6',  x: C,        y: SIZE - 26 },
          { n: '9',  x: 22,       y: C  },
        ].map((p) => (
          <text
            key={p.n}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Space Mono, ui-monospace, monospace"
            fontWeight={700} fontSize={15} fill="#000"
          >
            {p.n}
          </text>
        ))}
        <Hand cx={C} cy={C} angle={hrAngle}  length={C - 50} width={6}   color="#000" />
        <Hand cx={C} cy={C} angle={minAngle} length={C - 28} width={4}   color="#000" />
        <Hand cx={C} cy={C} angle={secAngle} length={C - 22} width={2}   color={COLOR} />
        <circle cx={C} cy={C} r={6} fill="#000" />
        <circle cx={C} cy={C} r={2.5} fill={COLOR} />
      </svg>
    </div>
  )
}

function Hand({
  cx, cy, angle, length, width, color,
}: { cx: number; cy: number; angle: number; length: number; width: number; color: string }) {
  const rad = ((angle - 90) * Math.PI) / 180
  const x2 = cx + Math.cos(rad) * length
  const y2 = cy + Math.sin(rad) * length
  return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="butt" />
}

// ── World tab ─────────────────────────────────────────────────────────────────

type WorldCity = { id: string; name: string; country: string; timezone: string }

function WorldTab({ cities, setCities }: { cities: WorldCity[]; setCities: (c: WorldCity[]) => void }) {
  const [query, setQuery]   = useState('')
  const [busy, setBusy]     = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function add() {
    const q = query.trim()
    if (!q || busy) return
    setBusy(true); setError(null)
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
      )
      const data = await res.json()
      const r = data?.results?.[0]
      if (!r) { setError('No match found'); return }
      const id = `${r.latitude},${r.longitude}`
      if (cities.find(c => c.id === id)) { setError('Already added'); return }
      setCities([...cities, { id, name: r.name, country: r.country_code ?? r.country ?? '', timezone: r.timezone }])
      setQuery('')
    } catch {
      setError('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} placeholder="Add a city" onSubmit={add} loading={busy} />
      {error && (
        <div style={{ fontSize: 11, color: '#ff5e4e', marginTop: 8, marginLeft: 4, fontFamily: t.fontMono, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          ✕ {error}
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cities.length === 0 ? (
          <EmptyHint text="No cities yet — search above." />
        ) : (
          cities.map((c, i) => (
            <WorldCityRow
              key={c.id}
              city={c} idx={i}
              onRemove={() => setCities(cities.filter(x => x.id !== c.id))}
            />
          ))
        )}
      </div>
    </div>
  )
}

function WorldCityRow({ city, idx, onRemove }: { city: WorldCity; idx: number; onRemove: () => void }) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      try {
        setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: city.timezone }))
        setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: city.timezone }))
      } catch {
        setTime('--:--')
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [city.timezone])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radius,
        boxShadow: b.shadow(idx % 2 === 0 ? COLOR : undefined),
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 17, fontWeight: 800, color: b.text,
            fontFamily: t.fontDisplay, letterSpacing: -0.3,
          }}
        >
          {city.name}
        </div>
        <div
          style={{
            fontSize: 10, color: COLOR, marginTop: 4,
            fontFamily: t.fontMono, letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {city.country ? `${city.country} · ` : ''}{date}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            fontSize: 22, fontWeight: 700, letterSpacing: 0,
            color: b.text, fontVariantNumeric: 'tabular-nums',
            fontFamily: t.fontMono,
          }}
        >
          {time}
        </div>
        <button
          onClick={onRemove}
          aria-label={`Remove ${city.name}`}
          style={{
            background: b.surfaceRaised, border: `1.5px solid ${b.borderStrong}`,
            borderRadius: 4, color: b.text,
            cursor: 'pointer',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fontMono, fontSize: 11, fontWeight: 700,
            padding: 0, lineHeight: 1,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ── Stopwatch tab ─────────────────────────────────────────────────────────────

type StopwatchState = { elapsed: number; running: boolean; laps: number[] }

function StopwatchTab({
  state, setState,
}: {
  state: StopwatchState
  setState: React.Dispatch<React.SetStateAction<StopwatchState>>
}) {
  const lastTickRef = useRef<number | null>(null)

  useEffect(() => {
    if (!state.running) { lastTickRef.current = null; return }
    let raf = 0
    const tick = () => {
      const now = performance.now()
      if (lastTickRef.current === null) lastTickRef.current = now
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      setState(s => ({ ...s, elapsed: s.elapsed + delta }))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state.running, setState])

  const onToggle = () => setState(s => ({ ...s, running: !s.running }))
  const onLap    = () => setState(s => ({ ...s, laps: [s.elapsed, ...s.laps] }))
  const onReset  = () => setState({ elapsed: 0, running: false, laps: [] })

  return (
    <div>
      <div
        style={{
          padding: '20px 16px',
          textAlign: 'center',
          background: b.surface,
          border: `1.5px solid ${b.border}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          marginBottom: 22,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <div
          style={{
            fontSize: 11, fontFamily: t.fontMono, letterSpacing: 2,
            color: state.running ? COLOR : b.textMute,
            textTransform: 'uppercase', fontWeight: 700,
            marginBottom: 8,
          }}
        >
          ▸ {state.running ? 'Running' : 'Paused'}
        </div>
        <div
          style={{
            fontSize: 48, fontWeight: 700, letterSpacing: -1.5,
            color: b.text, fontFamily: t.fontMono,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {fmtMs(state.elapsed)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <BrutBtn onClick={onReset} disabled={state.elapsed === 0 && !state.running}>Reset</BrutBtn>
        <BrutBtn onClick={onLap} disabled={!state.running}>Lap</BrutBtn>
        <BrutBtn onClick={onToggle} primary wide>{state.running ? 'Stop' : 'Start'}</BrutBtn>
      </div>

      {state.laps.length > 0 && (
        <div
          style={{
            background: b.surface,
            border: `1.5px solid ${b.border}`,
            borderRadius: b.radius,
            boxShadow: b.shadow(COLOR),
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {state.laps.map((lap, i) => (
            <div
              key={state.laps.length - i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                borderBottom: i < state.laps.length - 1 ? `1px solid ${b.border}` : 'none',
              }}
            >
              <span style={{ color: COLOR, fontWeight: 700, fontFamily: t.fontMono, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                Lap {String(state.laps.length - i).padStart(2, '0')}
              </span>
              <span style={{ color: b.text, fontVariantNumeric: 'tabular-nums', fontFamily: t.fontMono, fontWeight: 700, fontSize: 14 }}>
                {fmtMs(lap)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function fmtMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const hh = Math.floor(totalSec / 3600)
  const mm = Math.floor((totalSec % 3600) / 60)
  const ss = totalSec % 60
  const cs = Math.floor((ms % 1000) / 10)
  return hh > 0
    ? `${pad(hh)}:${pad(mm)}:${pad(ss)}.${pad(cs)}`
    : `${pad(mm)}:${pad(ss)}.${pad(cs)}`
}
function pad(n: number) { return n.toString().padStart(2, '0') }

// ── Weather tab ───────────────────────────────────────────────────────────────

type WeatherEntry = {
  id: string
  name: string
  country: string
  temperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
  fetchedAt: number
}

function WeatherTab({ list, setList }: { list: WeatherEntry[]; setList: (l: WeatherEntry[]) => void }) {
  const [query, setQuery] = useState('')
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function add() {
    const q = query.trim()
    if (!q || busy) return
    setBusy(true); setError(null)
    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
      ).then(r => r.json())
      const r = geo?.results?.[0]
      if (!r) { setError('No match found'); return }

      const wx = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current=temperature_2m,weathercode,wind_speed_10m,relative_humidity_2m`
      ).then(r2 => r2.json())
      const cur = wx?.current
      if (!cur) { setError('No data'); return }

      const id = `${r.latitude},${r.longitude}`
      const entry: WeatherEntry = {
        id,
        name: r.name,
        country: r.country_code ?? r.country ?? '',
        temperature: cur.temperature_2m,
        weatherCode: cur.weathercode,
        windSpeed: cur.wind_speed_10m,
        humidity: cur.relative_humidity_2m,
        fetchedAt: Date.now(),
      }
      const next = list.filter(x => x.id !== id).concat(entry)
      setList(next)
      setQuery('')
    } catch {
      setError('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search any city" onSubmit={add} loading={busy} />
      {error && (
        <div style={{ fontSize: 11, color: '#ff5e4e', marginTop: 8, marginLeft: 4, fontFamily: t.fontMono, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          ✕ {error}
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.length === 0 ? (
          <EmptyHint text="Add a city to see its current conditions." />
        ) : (
          list.slice().reverse().map(w => <WeatherCard key={w.id} entry={w} />)
        )}
      </div>
    </div>
  )
}

function WeatherCard({ entry }: { entry: WeatherEntry }) {
  const desc = wmoDescription(entry.weatherCode)
  return (
    <div
      style={{
        padding: '18px 18px',
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radius,
        boxShadow: b.shadow(COLOR),
        position: 'relative',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 9.5, color: COLOR,
              fontFamily: t.fontMono, fontWeight: 700, letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            {entry.country || 'Now'}
          </div>
          <div
            style={{
              fontSize: 22, fontWeight: 800, color: b.text, marginTop: 4,
              fontFamily: t.fontDisplay, letterSpacing: -0.5,
            }}
          >
            {entry.name}
          </div>
        </div>
        <WeatherGlyph code={entry.weatherCode} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 14 }}>
        <div
          style={{
            fontSize: 56, fontWeight: 800, letterSpacing: -2.5,
            color: b.text, fontFamily: t.fontDisplay,
            lineHeight: 0.9,
          }}
        >
          {Math.round(entry.temperature)}°
        </div>
        <div
          style={{
            paddingBottom: 8,
            fontSize: 12, color: b.textDim, fontWeight: 700,
            fontFamily: t.fontMono, letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          {desc}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <BrutalistTag color={b.text}>Wind {Math.round(entry.windSpeed)} km/h</BrutalistTag>
        <BrutalistTag color={b.text}>Hum {entry.humidity}%</BrutalistTag>
      </div>
    </div>
  )
}

function WeatherGlyph({ code }: { code: number }) {
  const isClear = code === 0
  const isCloudy = code >= 1 && code <= 3
  const isFog = code === 45 || code === 48
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82)
  const isSnow = (code >= 71 && code <= 77) || code === 85 || code === 86
  const isStorm = code >= 95

  const FRAME_PROPS = {
    width: 56, height: 56,
    style: {
      background: '#fff',
      border: `1.5px solid ${b.borderStrong}`,
      borderRadius: b.radiusSm,
      boxShadow: b.shadow(),
      flexShrink: 0,
    } as const,
  }

  if (isClear)
    return (
      <div style={FRAME_PROPS.style}>
        <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="9" fill="#000" />
          <g stroke="#000" strokeWidth="3" strokeLinecap="butt">
            <line x1="22" y1="3"  x2="22" y2="9" />
            <line x1="22" y1="35" x2="22" y2="41" />
            <line x1="3"  y1="22" x2="9"  y2="22" />
            <line x1="35" y1="22" x2="41" y2="22" />
            <line x1="8"  y1="8"  x2="13" y2="13" />
            <line x1="31" y1="31" x2="36" y2="36" />
            <line x1="36" y1="8"  x2="31" y2="13" />
            <line x1="8"  y1="36" x2="13" y2="31" />
          </g>
        </svg>
      </div>
    )
  if (isStorm)
    return (
      <div style={FRAME_PROPS.style}>
        <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="20" rx="14" ry="8" fill="#000" />
          <path d="M22 22l-4 8h4l-2 6 6-9h-4l2-5z" fill="#000" stroke="#fff" strokeWidth="0.8" />
        </svg>
      </div>
    )
  if (isSnow)
    return (
      <div style={FRAME_PROPS.style}>
        <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="18" rx="12" ry="7" fill="#000" />
          <g fill="#000">
            <circle cx="14" cy="32" r="2" />
            <circle cx="22" cy="34" r="2" />
            <circle cx="30" cy="32" r="2" />
          </g>
        </svg>
      </div>
    )
  if (isRain)
    return (
      <div style={FRAME_PROPS.style}>
        <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="18" rx="12" ry="7" fill="#000" />
          <g stroke="#000" strokeWidth="3" strokeLinecap="butt">
            <line x1="14" y1="28" x2="12" y2="36" />
            <line x1="22" y1="28" x2="20" y2="36" />
            <line x1="30" y1="28" x2="28" y2="36" />
          </g>
        </svg>
      </div>
    )
  if (isFog)
    return (
      <div style={FRAME_PROPS.style}>
        <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
          <rect x="6"  y="14" width="32" height="4" fill="#000" />
          <rect x="10" y="22" width="28" height="4" fill="#000" />
          <rect x="6"  y="30" width="32" height="4" fill="#000" />
        </svg>
      </div>
    )
  // cloudy default
  void isCloudy
  return (
    <div style={FRAME_PROPS.style}>
      <svg width={FRAME_PROPS.width} height={FRAME_PROPS.height} viewBox="0 0 44 44" fill="none">
        <ellipse cx="18" cy="22" rx="11" ry="7" fill="#000" />
        <ellipse cx="28" cy="20" rx="9"  ry="6" fill="#000" />
      </svg>
    </div>
  )
}

function wmoDescription(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3)  return 'Cloudy'
  if (code === 45 || code === 48) return 'Fog'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow Showers'
  if (code >= 95) return 'Storm'
  return 'Unknown'
}

// ── Shared bits ───────────────────────────────────────────────────────────────

function SearchBar({
  value, onChange, placeholder, onSubmit, loading,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'stretch',
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: b.shadow(COLOR),
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflow: 'hidden',
      }}
    >
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSubmit() }}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: b.text,
          fontSize: 13,
          fontFamily: t.fontMono,
          fontWeight: 500,
          letterSpacing: 0.4,
          padding: '12px 14px',
        }}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        style={{
          padding: '0 16px',
          border: 'none',
          borderLeft: `1.5px solid ${b.border}`,
          background: value.trim() && !loading ? COLOR : 'transparent',
          color: value.trim() && !loading ? b.bgDeep : b.textMute,
          fontFamily: t.fontMono,
          fontSize: 12, fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          cursor: value.trim() && !loading ? 'pointer' : 'default',
        }}
      >
        {loading ? '…' : 'ADD'}
      </button>
    </div>
  )
}

function BrutBtn({
  children, onClick, disabled, primary, wide,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  wide?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: wide ? 2 : 1,
        padding: '12px 14px',
        border: `1.5px solid ${primary ? COLOR : b.border}`,
        borderRadius: b.radiusSm,
        background: primary ? COLOR : b.surface,
        color: primary ? b.bgDeep : b.text,
        fontFamily: 'Space Mono, ui-monospace, monospace',
        fontSize: 13, fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        boxShadow: primary ? b.shadow() : 'none',
        WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {children}
    </button>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '28px 18px',
        textAlign: 'center',
        color: b.textMute,
        fontSize: 11,
        background: b.surface,
        border: `1px dashed ${b.borderStrong}`,
        borderRadius: b.radiusSm,
        fontFamily: 'Space Mono, ui-monospace, monospace',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </div>
  )
}
