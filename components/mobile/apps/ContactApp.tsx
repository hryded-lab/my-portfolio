'use client'

import { useState } from 'react'
import MobileAppShell, { BrutalistTag, BrutalistSection } from '../MobileAppShell'
import { siteConfig } from '@/content/siteConfig'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'
import { sendContactEmail } from '@/lib/emailjs'

const COLOR = '#ff8080'

type FormState = { name: string; email: string; message: string }
type Status    = 'idle' | 'loading' | 'success' | 'error'

export default function ContactApp() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  const submit = async (e: React.FormEvent) => {
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
    <MobileAppShell title="Contact" color={COLOR} subtitle="Reach out · 24h">
      <p
        style={{
          fontSize: 13.5, color: b.textDim, lineHeight: 1.7,
          margin: '0 0 20px',
          padding: '0 12px',
          borderLeft: `3px solid ${COLOR}`,
          fontFamily: t.fontUi,
        }}
      >
        Open to PM, finance, and startup internships. Remote, Mumbai, or abroad. The fastest reply lands by email or LinkedIn.
      </p>

      <BrutalistSection title="Channels" color={COLOR}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ContactRow label="Email"    value={siteConfig.email} href={`mailto:${siteConfig.email}`} color={COLOR}    primary />
          <ContactRow label="LinkedIn" value="hryday-lath"      href={siteConfig.linkedin}          color="#4ab8ff" />
          <ContactRow label="GitHub"   value="@Hryday-7765"     href={siteConfig.github}            color={b.text} />
        </div>
      </BrutalistSection>

      <BrutalistSection title="Send a message" color="#fff">
        <form
          onSubmit={submit}
          style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            background: b.surface,
            border: `1.5px solid ${b.border}`,
            borderRadius: b.radius,
            boxShadow: b.shadow(COLOR),
            padding: 14,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
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
          <Field label="Message" error={errors.message}>
            <BrutalTextarea
              rows={4}
              value={form.message}
              onChange={v => { setForm({ ...form, message: v }); setErrors({ ...errors, message: undefined }) }}
              invalid={!!errors.message}
            />
          </Field>

          {status === 'success' && (
            <StatusBox color="#4ed670">✓ Message sent — I&apos;ll get back to you soon.</StatusBox>
          )}
          {status === 'error' && (
            <StatusBox color="#ff5e4e">
              ✕ Send failed{errorMsg ? ` — ${errorMsg}` : ''}. Email {siteConfig.email}.
            </StatusBox>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={() => setForm({ name: '', email: '', message: '' })}
              style={{
                padding: '9px 14px',
                background: b.surfaceRaised, color: b.text,
                border: `1.5px solid ${b.borderStrong}`,
                borderRadius: b.radiusSm,
                cursor: 'pointer',
                fontFamily: t.fontMono,
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1.4, textTransform: 'uppercase',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '9px 18px',
                background: COLOR, color: b.bgDeep,
                border: `1.5px solid ${COLOR}`,
                borderRadius: b.radiusSm,
                boxShadow: b.shadow(),
                cursor: status === 'loading' ? 'default' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                fontFamily: t.fontMono,
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1.4, textTransform: 'uppercase',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {status === 'loading' ? '… Sending' : 'Send →'}
            </button>
          </div>
        </form>
      </BrutalistSection>

      <div
        style={{
          marginTop: 22,
          display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
        }}
      >
        <span style={{ width: 7, height: 7, background: '#4ed670', borderRadius: 999, boxShadow: '0 0 8px rgba(78,214,112,0.7)' }} />
        <BrutalistTag color="#4ed670">Available · Replying within 24h</BrutalistTag>
      </div>
    </MobileAppShell>
  )
}

function ContactRow({
  label, value, href, color, primary,
}: {
  label: string; value: string; href: string; color: string; primary?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12,
        padding: '14px 16px',
        background: primary ? color : b.surface,
        border: `1.5px solid ${primary ? color : b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: primary ? b.shadow() : b.shadow(color),
        color: primary ? b.bgDeep : b.text,
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span
          style={{
            fontSize: 9.5, fontWeight: 700,
            fontFamily: t.fontMono,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: primary ? b.bgDeep : color,
            marginBottom: 4,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: t.fontDisplay, letterSpacing: -0.3 }}>
          {value}
        </span>
      </div>
      <span style={{ fontFamily: t.fontMono, fontSize: 18, fontWeight: 700, color: primary ? b.bgDeep : color }}>
        →
      </span>
    </a>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 10, fontFamily: t.fontMono, fontWeight: 700,
          letterSpacing: 1.6, textTransform: 'uppercase',
          color: b.textDim,
        }}
      >
        ▸ {label}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 10.5, fontFamily: t.fontMono, color: '#ff5e4e', letterSpacing: 0.6, textTransform: 'uppercase' }}>
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
        fontFamily: t.fontMono,
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
        fontFamily: t.fontMono,
        fontSize: 13,
        boxSizing: 'border-box',
        resize: 'vertical',
      }}
    />
  )
}

function StatusBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '9px 12px',
        background: b.surface,
        border: `1.5px solid ${color}`,
        borderRadius: b.radiusSm,
        boxShadow: b.shadow(color),
        color,
        fontFamily: t.fontMono,
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}
