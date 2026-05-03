'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { mobileTheme as t } from './mobileTheme'

type Msg = { role: 'user' | 'assistant'; content: string }

type Props = { onClose: () => void }

const STARTERS = [
  'What is Hryday building right now?',
  'Tell me about his projects',
  'What internships is he open to?',
  'What are his strongest skills?',
]

export default function MobileAssistantSheet({ onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hi, I'm the portfolio assistant. Ask me anything about Hryday." },
  ])
  const [input, setInput]       = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streaming])

  async function send(question?: string) {
    const text = (question ?? input).trim()
    if (!text || streaming) return
    setInput('')

    const next: Msg[] = [...messages, { role: 'user', content: text }, { role: 'assistant', content: '' }]
    setMessages(next)
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(0, -1) }),
      })
      if (!res.ok || !res.body) {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: 'Service is unavailable right now. Try again in a minute.' }
          return copy
        })
        return
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: buf }
          return copy
        })
      }
    } catch {
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: 'Network hiccup. Try again.' }
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,8,28,0.55)',
          zIndex: 200,
        }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        style={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          height: '85dvh',
          background: t.bg,
          borderTopLeftRadius: t.radiusSheet,
          borderTopRightRadius: t.radiusSheet,
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          fontFamily: t.fontUi,
          color: t.text,
          boxShadow: '0 -10px 40px rgba(0,5,25,0.55)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 18px 10px',
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>Ask about Hryday</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Powered by Groq · llama-3.3-70b</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${t.border}`,
              borderRadius: 999,
              padding: 6,
              color: '#fff', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}
        >
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>{m.content || (streaming && i === messages.length - 1 ? <Typing /> : '')}</Bubble>
          ))}

          {messages.length === 1 && !streaming && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: t.bgElevated,
                    border: `1px solid ${t.border}`,
                    borderRadius: 10,
                    color: t.textSec,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            padding: '10px 14px calc(env(safe-area-inset-bottom, 0px) + 12px)',
            borderTop: `1px solid ${t.border}`,
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: t.bg,
          }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Ask anything…"
            rows={1}
            style={{
              flex: 1,
              maxHeight: 100,
              resize: 'none',
              padding: '10px 14px',
              borderRadius: 18,
              border: `1px solid ${t.borderStrong}`,
              background: t.bgElevated,
              color: t.text,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            onClick={() => send()}
            disabled={streaming || !input.trim()}
            style={{
              padding: '10px 14px',
              borderRadius: 18,
              border: 'none',
              background: input.trim() && !streaming ? t.accent : 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 14, fontWeight: 600,
              cursor: input.trim() && !streaming ? 'pointer' : 'default',
              fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Send
          </button>
        </div>
      </motion.div>
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '82%',
          padding: '9px 13px',
          borderRadius: 14,
          background: isUser ? t.accent : t.bgElevated,
          border: isUser ? 'none' : `1px solid ${t.border}`,
          color: isUser ? '#fff' : t.text,
          fontSize: 13,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div style={{ display: 'inline-flex', gap: 3, padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ width: 5, height: 5, borderRadius: 3, background: t.textSec }}
        />
      ))}
    </div>
  )
}
