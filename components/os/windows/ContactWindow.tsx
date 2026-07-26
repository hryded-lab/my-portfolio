'use client'

import { useState } from 'react'
import { siteConfig } from '@/content/siteConfig'
import { sendContactEmail } from '@/lib/emailjs'
import {
  AppFrame, CommandBar, GroupHeading, Panel, PropRow, BluePanel, BlueHeading, BlueSub, ui, FONT,
} from '@/components/aeroApp'

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
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
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>Contact</span>
      </CommandBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 22px' }}>
        <BluePanel style={{ padding: '14px 18px' }}>
          <BlueHeading>Get in touch</BlueHeading>
          <BlueSub>
            Open to PM, finance and startup internships, remote, Mumbai or abroad.
            The fastest reply lands by email or LinkedIn.
          </BlueSub>
        </BluePanel>

        <GroupHeading label="Channels" />
        <Panel>
          <PropRow label="Email">
            <Ext href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Ext>
          </PropRow>
          <PropRow label="LinkedIn" last>
            <Ext href={siteConfig.linkedin}>hryday-lath</Ext>
          </PropRow>
        </Panel>

        <GroupHeading label="Send a message" />
        <Panel style={{ padding: '14px 14px 16px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              className="contact-form-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
            >
              <Field label="Name" error={errors.name}>
                <TextField
                  value={form.name}
                  invalid={!!errors.name}
                  onChange={v => { setForm({ ...form, name: v }); setErrors({ ...errors, name: undefined }) }}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <TextField
                  type="email"
                  value={form.email}
                  invalid={!!errors.email}
                  onChange={v => { setForm({ ...form, email: v }); setErrors({ ...errors, email: undefined }) }}
                />
              </Field>
            </div>

            <Field label="Message" error={errors.message}>
              <TextField
                multiline
                rows={5}
                value={form.message}
                invalid={!!errors.message}
                onChange={v => { setForm({ ...form, message: v }); setErrors({ ...errors, message: undefined }) }}
              />
            </Field>

            {status === 'success' && <Notice tone="ok">Message sent. I will get back to you soon.</Notice>}
            {status === 'error' && (
              <Notice tone="bad">
                Could not send{errorMsg ? `: ${errorMsg}` : ''}. Email {siteConfig.email} directly.
              </Notice>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2 }}>
              <AeroButton type="button" onClick={() => setForm({ name: '', email: '', message: '' })}>
                Clear
              </AeroButton>
              <AeroButton type="submit" primary disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending' : 'Send'}
              </AeroButton>
            </div>
          </form>
        </Panel>
      </div>
    </AppFrame>
  )
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: ui.heading, textDecoration: 'none', fontFamily: FONT, fontSize: 12.5 }}
    >
      {children}
    </a>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: FONT, fontSize: 12, color: ui.textDim }}>{label}</label>
      {children}
      {error && (
        <span style={{ fontFamily: FONT, fontSize: 11.5, color: '#e05a4a' }}>{error}</span>
      )}
    </div>
  )
}

// Vista fields are sunken: a thin border with an inner shadow, not a raised card.
function TextField({
  value, onChange, type = 'text', invalid, multiline, rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  type?: string
  invalid?: boolean
  multiline?: boolean
  rows?: number
}) {
  const style: React.CSSProperties = {
    width: '100%',
    padding: '7px 9px',
    background: ui.field,
    color: ui.text,
    border: `1px solid ${invalid ? '#e05a4a' : ui.border}`,
    borderRadius: ui.radius,
    boxShadow: ui.inset,
    outline: 'none',
    fontFamily: FONT,
    fontSize: 12.5,
    boxSizing: 'border-box',
  }

  return multiline ? (
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
      style={{ ...style, resize: 'vertical' }} />
  ) : (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />
  )
}

function Notice({ tone, children }: { tone: 'ok' | 'bad'; children: React.ReactNode }) {
  const c = tone === 'ok' ? '#3fae63' : '#e05a4a'
  return (
    <div
      style={{
        padding: '8px 11px',
        borderRadius: ui.radius,
        border: `1px solid ${c}`,
        background: tone === 'ok' ? 'rgba(63,174,99,0.10)' : 'rgba(224,90,74,0.10)',
        color: c,
        fontFamily: FONT,
        fontSize: 12.5,
        overflowWrap: 'break-word',
      }}
    >
      {children}
    </div>
  )
}

// Aero buttons are gently domed: a light top half, a soft break at the middle.
function AeroButton({
  children, primary, disabled, type = 'button', onClick,
}: {
  children: React.ReactNode
  primary?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 18px',
        minWidth: 84,
        borderRadius: ui.radius,
        border: `1px solid ${primary ? '#3d7fb5' : ui.border}`,
        background: primary
          ? 'linear-gradient(180deg, #a7d8f5 0%, #74b6e4 48%, #5aa2d6 52%, #8ecaf0 100%)'
          : ui.bar,
        color: primary ? '#0d3355' : ui.text,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(20,70,110,0.18)`,
        fontFamily: FONT,
        fontSize: 12.5,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {children}
    </button>
  )
}
