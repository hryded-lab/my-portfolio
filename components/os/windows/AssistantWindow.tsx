'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAssistant } from '@/lib/assistantContext'
import { useTheme } from '@/lib/themeContext'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function renderContent(text: string) {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <span key={li}>
        {li > 0 && <br />}
        {parts.map((part, pi) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={pi}>{part.slice(2, -2)}</strong>
            : part
        )}
      </span>
    )
  })
}

const SUGGESTIONS = [
  'What projects has Hryday built?',
  'What is his tech stack?',
  'Tell me about his experience',
  'Is he open to internships?',
]

export default function AssistantWindow() {
  const { t } = useTheme()
  const { pendingQuestion, setPendingQuestion } = useAssistant()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Hryday's portfolio assistant. Ask me anything about his skills, projects, experience, or background.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async function send(text: string) {
    const question = text.trim()
    if (!question || loadingRef.current) return

    const userMsg: Message = { role: 'user', content: question }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    loadingRef.current = true
    setLoading(true)

    // Add empty assistant message that we'll stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (res.status === 429) throw new Error('rate_limited')
      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const final = accumulated
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: final }
          return updated
        })
      }
    } catch (err) {
      const isRateLimited = err instanceof Error && err.message === 'rate_limited'
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: isRateLimited
            ? "Woah! Really sorry but we are getting a lot of requests currently, please wait a moment and try again later. Thanks again!"
            : "Sorry, something went wrong. Please try again in a moment.",
        }
        return updated
      })
    } finally {
      loadingRef.current = false
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [messages])

  // Auto-send question typed into the desktop search bar
  useEffect(() => {
    if (pendingQuestion) {
      setPendingQuestion('')
      send(pendingQuestion)
    }
  }, [pendingQuestion, setPendingQuestion, send])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 11,
      background: t.bg,
      color: t.text,
    }}>
      {/* Header */}
      <div style={{
        background: t.headerBg,
        borderBottom: '1px solid #9cb8e8',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
      }}>
        {/* Bot avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1a6ed8, #0a40a0)',
          border: '2px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,60,180,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="6" width="12" height="9" rx="2" fill="white" opacity="0.9"/>
            <rect x="6" y="3" width="6" height="4" rx="1" fill="white" opacity="0.9"/>
            <circle cx="6.5" cy="10.5" r="1.2" fill="#1a6ed8"/>
            <circle cx="11.5" cy="10.5" r="1.2" fill="#1a6ed8"/>
            <path d="M6.5 13h5" stroke="#1a6ed8" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="9" y1="3" x2="9" y2="2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.9"/>
            <circle cx="9" cy="1.5" r="1" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 12, color: t.accent }}>Portfolio Assistant</div>
          <div style={{ fontSize: 10, color: t.textSecondary }}>Ask about Hryday — skills, projects, experience</div>
        </div>
        {/* Online indicator */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: t.success }}>
          <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="#00bb00"/></svg>
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 10,
        background: t.bgSecondary,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 8, alignItems: 'flex-end',
          }}>
            {/* Bot avatar for assistant messages */}
            {msg.role === 'assistant' && (
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #1a6ed8, #0a40a0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,60,180,0.25)',
              }}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="6" width="12" height="9" rx="2" fill="white" opacity="0.9"/>
                  <rect x="6" y="3" width="6" height="4" rx="1" fill="white" opacity="0.9"/>
                  <circle cx="6.5" cy="10.5" r="1.2" fill="#1a6ed8"/>
                  <circle cx="11.5" cy="10.5" r="1.2" fill="#1a6ed8"/>
                  <path d="M6.5 13h5" stroke="#1a6ed8" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
            )}

            <div style={{
              maxWidth: '75%',
              padding: '7px 11px',
              borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #316ac5, #1a50a0)'
                : t.bgCard,
              color: msg.role === 'user' ? '#fff' : t.text,
              border: msg.role === 'user' ? 'none' : `1px solid ${t.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              lineHeight: 1.55,
              fontSize: 11,
              wordBreak: 'break-word',
            }}>
              {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
              {/* Blinking cursor while streaming */}
              {msg.role === 'assistant' && loading && i === messages.length - 1 && (
                <span style={{ display: 'inline-block', width: 2, height: 12, background: '#316ac5', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 0.8s step-end infinite' }} />
              )}
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #f0a020, #d07010)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 'bold', color: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>
                ?
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions — only shown before any user message */}
      {messages.filter(m => m.role === 'user').length === 0 && (
        <div style={{
          padding: '6px 14px',
          background: t.bgSecondary,
          borderTop: `1px solid ${t.border}`,
          display: 'flex', flexWrap: 'wrap', gap: 5,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, color: t.textMuted, width: '100%', marginBottom: 2 }}>Suggested questions:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: '3px 10px',
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: 3,
                fontSize: 10, fontFamily: "'Silkscreen', 'Courier New', monospace",
                cursor: 'pointer', color: t.accent,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = t.accentBg)}
              onMouseLeave={e => (e.currentTarget.style.background = t.bgCard)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 10px',
        background: t.bgSecondary,
        borderTop: `1px solid ${t.border}`,
        flexShrink: 0,
        alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a question and press Enter…"
          disabled={loading}
          style={{
            flex: 1,
            border: `1px solid ${t.border}`,
            background: loading ? t.bgSecondary : t.bgInput,
            fontFamily: "'Silkscreen', 'Courier New', monospace",
            fontSize: 11,
            padding: '4px 8px',
            outline: 'none',
            color: t.text,
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="xp-btn"
          style={{
            minWidth: 52,
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? 'default' : 'pointer',
          }}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
