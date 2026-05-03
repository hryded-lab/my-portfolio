'use client'

import { useState } from 'react'
import { siteConfig } from '@/content/siteConfig'
import { BrutalCard, BrutalTag, BrutalSection, BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b } from '@/components/brutal'
import { sendContactEmail } from '@/lib/emailjs'

const COLOR = '#ff8080'

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      await sendContactEmail(form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <BrutalBody>
      <BrutalHeader title="Contact" subtitle="Reach out · 24h" color={COLOR} />

      <p
        style={{
          fontSize: 14, color: b.textDim, lineHeight: 1.7,
          margin: '0 0 22px',
          padding: '0 14px',
          borderLeft: `3px solid ${COLOR}`,
        }}
      >
        Open to PM, finance, and startup internships. Remote, Mumbai, or abroad. The fastest reply lands by email or LinkedIn.
      </p>

      <BrutalSection title="Channels" color={COLOR}>
        <div className="contact-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <ChannelLink label="Email" value={siteConfig.email} href={`mailto:${siteConfig.email}`} primary />
          <ChannelLink label="LinkedIn" value="hryday-lath" href={siteConfig.linkedin} accent="#4ab8ff" />
        </div>
      </BrutalSection>

      <BrutalSection title="Send a message" color="#fff">
        <BrutalCard>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Name" error={errors.name}>
                <BrutalInput
                  value={form.name}
                  onChange={v => { setForm({ ...form, name: v }); setErrors({ ...errors, name: undefined }) }}
                  invalid={!!errors.name}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <BrutalInput
                  type="email"
                  value={form.email}
                  onChange={v => { setForm({ ...form, email: v }); setErrors({ ...errors, email: undefined }) }}
                  invalid={!!errors.email}
                />
              </Field>
            </div>
            <Field label="Message" error={errors.message}>
              <BrutalTextarea
                rows={5}
                value={form.message}
                onChange={v => { setForm({ ...form, message: v }); setErrors({ ...errors, message: undefined }) }}
                invalid={!!errors.message}
              />
            </Field>

            {status === 'success' && (
              <div style={{ padding: '10px 14px', background: b.surface, border: `1.5px solid #4ed670`, borderRadius: b.radiusSm, boxShadow: b.shadow('#4ed670'), color: '#4ed670', fontFamily: bf.mono, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                ✓ Message sent — I&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div style={{ padding: '10px 14px', background: b.surface, border: `1.5px solid #ff5e4e`, borderRadius: b.radiusSm, boxShadow: b.shadow('#ff5e4e'), color: '#ff5e4e', fontFamily: bf.mono, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', wordBreak: 'break-word' }}>
                ✕ Send failed{errorMsg ? ` — ${errorMsg}` : ''}. Email {siteConfig.email} directly.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                onClick={() => setForm({ name: '', email: '', message: '' })}
                style={{
                  padding: '10px 18px',
                  background: b.surface, color: b.text,
                  border: `1.5px solid ${b.borderStrong}`,
                  borderRadius: b.radiusSm,
                  cursor: 'pointer',
                  fontFamily: bf.mono,
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: 1.4, textTransform: 'uppercase',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '10px 22px',
                  background: COLOR, color: b.bgDeep,
                  border: `1.5px solid ${COLOR}`,
                  borderRadius: b.radiusSm,
                  boxShadow: b.shadow(),
                  cursor: status === 'loading' ? 'default' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  fontFamily: bf.mono,
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: 1.4, textTransform: 'uppercase',
                }}
              >
                {status === 'loading' ? '… Sending' : 'Send →'}
              </button>
            </div>
          </form>
        </BrutalCard>
      </BrutalSection>

      <div
        style={{
          marginTop: 26,
          display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
        }}
      >
        <span style={{ width: 7, height: 7, background: '#4ed670', borderRadius: 999, boxShadow: '0 0 8px rgba(78,214,112,0.7)' }} />
        <BrutalTag color="#4ed670">Available · Replying within 24h</BrutalTag>
      </div>
    </BrutalBody>
  )
}

function ChannelLink({
  label, value, href, primary, accent,
}: {
  label: string; value: string; href: string; primary?: boolean; accent?: string
}) {
  const c = primary ? COLOR : (accent ?? b.text)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        background: primary ? COLOR : b.surface,
        border: `1.5px solid ${primary ? COLOR : b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: primary ? b.shadow() : b.shadow(c),
        color: primary ? b.bgDeep : b.text,
        textDecoration: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 9.5, fontWeight: 700,
            fontFamily: bf.mono,
            letterSpacing: 1.6, textTransform: 'uppercase',
            color: primary ? b.bgDeep : c,
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: bf.display, letterSpacing: -0.3 }}>
          {value}
        </div>
      </div>
      <span style={{ fontFamily: bf.mono, fontSize: 18, fontWeight: 700, color: primary ? b.bgDeep : c }}>
        →
      </span>
    </a>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 10, fontFamily: bf.mono, fontWeight: 700,
          letterSpacing: 1.6, textTransform: 'uppercase',
          color: b.textDim,
        }}
      >
        ▸ {label}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 10.5, fontFamily: bf.mono, color: '#ff5e4e', letterSpacing: 0.6, textTransform: 'uppercase' }}>
          ✕ {error}
        </div>
      )}
    </div>
  )
}

function BrutalInput({
  value, onChange, type = 'text', invalid,
}: { value: string; onChange: (v: string) => void; type?: string; invalid?: boolean }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: b.surfaceRaised,
        color: b.text,
        border: `1.5px solid ${invalid ? '#ff5e4e' : b.borderStrong}`,
        borderRadius: b.radiusSm,
        outline: 'none',
        fontFamily: bf.mono,
        fontSize: 13,
        boxSizing: 'border-box',
      }}
    />
  )
}

function BrutalTextarea({
  value, onChange, rows = 4, invalid,
}: { value: string; onChange: (v: string) => void; rows?: number; invalid?: boolean }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: b.surfaceRaised,
        color: b.text,
        border: `1.5px solid ${invalid ? '#ff5e4e' : b.borderStrong}`,
        borderRadius: b.radiusSm,
        outline: 'none',
        fontFamily: bf.mono,
        fontSize: 13,
        boxSizing: 'border-box',
        resize: 'vertical',
      }}
    />
  )
}
