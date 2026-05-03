'use client'

import { useEffect, useRef, useState } from 'react'
import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#ffe14a'
const STORAGE_KEY = 'mobile.notes.v1'

type Note = {
  id: string
  title: string
  body: string
  updatedAt: number
}

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedNotes()
    const parsed = JSON.parse(raw) as Note[]
    return Array.isArray(parsed) ? parsed : seedNotes()
  } catch {
    return seedNotes()
  }
}

function seedNotes(): Note[] {
  const now = Date.now()
  return [
    {
      id: 'welcome',
      title: 'Welcome',
      body: 'Tap a note to open it. Use + to start a new one.\n\nNotes save automatically — they live in this browser only.',
      updatedAt: now - 1000 * 60 * 60 * 6,
    },
    {
      id: 'tip',
      title: 'Tip',
      body: 'The first line is the title.\nEverything below is the body.',
      updatedAt: now - 1000 * 60 * 60 * 24,
    },
  ]
}

function deriveTitle(body: string): string {
  const first = body.split('\n').find(l => l.trim()) ?? ''
  return first.trim().slice(0, 60) || 'Untitled note'
}

function fmtDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function NotesApp() {
  // Component is dynamically imported with ssr:false, so localStorage is safe
  // to read in the initial state initializer — no hydration dance needed.
  const [notes, setNotes] = useState<Note[]>(() => loadNotes())
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)) } catch { /* quota */ }
  }, [notes])

  const open = openId ? notes.find(n => n.id === openId) ?? null : null

  const createNote = () => {
    const id = `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
    const note: Note = { id, title: '', body: '', updatedAt: Date.now() }
    setNotes(prev => [note, ...prev])
    setOpenId(id)
  }

  const updateBody = (id: string, body: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, body, title: deriveTitle(body), updatedAt: Date.now() } : n))
  }

  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    setOpenId(null)
  }

  if (open) {
    return (
      <MobileAppShell
        title={open.title || 'Untitled'}
        color={COLOR}
        subtitle={fmtDate(open.updatedAt)}
        onInternalBack={() => setOpenId(null)}
        trailing={
          <button
            onClick={() => removeNote(open.id)}
            aria-label="Delete note"
            style={{
              padding: '6px 12px',
              background: b.surface,
              color: '#ff5e4e',
              border: `1.5px solid #ff5e4e`,
              borderRadius: b.radiusSm,
              fontFamily: t.fontMono,
              fontSize: 10, fontWeight: 700,
              letterSpacing: 1.4, textTransform: 'uppercase',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Delete
          </button>
        }
      >
        <Editor body={open.body} onChange={body => updateBody(open.id, body)} />
      </MobileAppShell>
    )
  }

  return (
    <MobileAppShell
      title="Notes"
      color={COLOR}
      subtitle={`${notes.length} note${notes.length === 1 ? '' : 's'}`}
      trailing={
        <button
          onClick={createNote}
          aria-label="New note"
          style={{
            width: 36, height: 32,
            background: COLOR, color: b.bgDeep,
            border: `1.5px solid ${COLOR}`,
            borderRadius: b.radiusSm,
            boxShadow: b.shadow(),
            fontFamily: t.fontMono,
            fontSize: 18, fontWeight: 700,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1,
          }}
        >
          +
        </button>
      }
    >
      {notes.length === 0 ? (
        <div
          style={{
            padding: '36px 20px',
            textAlign: 'center',
            color: b.textMute,
            fontSize: 12,
            background: b.surface,
            border: `1px dashed ${b.borderStrong}`,
            borderRadius: b.radiusSm,
            fontFamily: t.fontMono,
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}
        >
          No notes yet — tap + to start
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...notes].sort((a, c) => c.updatedAt - a.updatedAt).map((n, i) => (
            <button
              key={n.id}
              onClick={() => setOpenId(n.id)}
              style={{
                textAlign: 'left',
                background: b.surface,
                border: `1.5px solid ${b.border}`,
                borderRadius: b.radius,
                boxShadow: b.shadow(i === 0 ? COLOR : undefined),
                padding: '12px 14px',
                cursor: 'pointer',
                color: 'inherit',
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 10 }}>
                <span
                  style={{
                    flex: 1, minWidth: 0,
                    fontFamily: t.fontDisplay,
                    fontSize: 16, fontWeight: 800,
                    color: b.text, letterSpacing: -0.3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {n.title || 'Untitled note'}
                </span>
                <span
                  style={{
                    fontFamily: t.fontMono, fontSize: 10, fontWeight: 700,
                    color: COLOR, letterSpacing: 1.2, textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  {fmtDate(n.updatedAt)}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12.5, color: b.textDim, lineHeight: 1.5,
                  fontFamily: t.fontUi,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {(n.body.split('\n').slice(1).join(' ').trim() || 'Empty note')}
              </div>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <BrutalistTag color={COLOR}>Stored locally · this browser</BrutalistTag>
      </div>
    </MobileAppShell>
  )
}

function Editor({ body, onChange }: { body: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && !body) el.focus()
  }, [body])

  return (
    <div
      style={{
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radius,
        boxShadow: b.shadow(COLOR),
        padding: 4,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <textarea
        ref={ref}
        value={body}
        onChange={e => onChange(e.target.value)}
        placeholder={'First line becomes the title…\n\nThen jot the rest.'}
        style={{
          width: '100%',
          minHeight: '60vh',
          background: 'transparent',
          color: b.text,
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '12px 14px',
          fontFamily: t.fontMono,
          fontSize: 14,
          lineHeight: 1.7,
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
