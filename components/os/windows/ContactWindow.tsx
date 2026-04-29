'use client'

import { useState } from 'react'
import { siteConfig } from '@/content/siteConfig'
import { useTheme } from '@/lib/themeContext'

export default function ContactWindow() {
  const { t } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
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
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 5000)
  }

  const inputStyle = (hasError?: string) => ({
    width: '100%', padding: '8px 12px', borderRadius: 6, fontFamily: 'inherit', fontSize: 13,
    background: t.bgInput, color: t.text,
    border: `1px solid ${hasError ? t.error : t.border}`,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  })

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s' }}>

      {/* Contact cards */}
      <div className="contact-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
        {[
          { label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><rect x="0.5" y="0.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M0.5 2.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.1"/></svg> },
          { label: 'LinkedIn', value: 'hryday-lath', href: siteConfig.linkedin, icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.1"/><rect x="2.5" y="5" width="1.5" height="5.5" fill="currentColor"/><circle cx="3.25" cy="3.25" r="1" fill="currentColor"/><path d="M6 5v5.5M6 7c0-1.5 4.5-2 4.5 1v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
        ].map(item => (
          <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, textDecoration: 'none', color: 'inherit', transition: 'border-color 0.15s, background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentBorder; e.currentTarget.style.background = t.bgCardHover }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bgCard }}
          >
            <div style={{ color: t.accent }}>{item.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: t.accent, fontWeight: 500 }}>{item.value}</div>
          </a>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Send a message</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Your Name" error={errors.name} t={t}>
              <input style={inputStyle(errors.name)} value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: undefined}) }} onFocus={e => (e.target.style.borderColor = t.accent)} onBlur={e => (e.target.style.borderColor = errors.name ? t.error : t.border)}/>
            </Field>
            <Field label="Your Email" error={errors.email} t={t}>
              <input type="email" style={inputStyle(errors.email)} value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: undefined}) }} onFocus={e => (e.target.style.borderColor = t.accent)} onBlur={e => (e.target.style.borderColor = errors.email ? t.error : t.border)}/>
            </Field>
          </div>
          <Field label="Message" error={errors.message} t={t}>
            <textarea rows={5} style={{ ...inputStyle(errors.message), resize: 'vertical' }} value={form.message} onChange={e => { setForm({...form, message: e.target.value}); setErrors({...errors, message: undefined}) }} onFocus={e => (e.target.style.borderColor = t.accent)} onBlur={e => (e.target.style.borderColor = errors.message ? t.error : t.border)}/>
          </Field>

          {status === 'success' && <div style={{ padding: '8px 12px', borderRadius: 6, background: t.successBg, border: `1px solid ${t.success}40`, color: t.success, fontSize: 12 }}>Message sent — I&apos;ll get back to you soon.</div>}
          {status === 'error' && <div style={{ padding: '8px 12px', borderRadius: 6, background: t.errorBg, border: `1px solid ${t.error}40`, color: t.error, fontSize: 12 }}>Something went wrong. Please email directly.</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={() => setForm({ name: '', email: '', message: '' })} style={{ padding: '7px 18px', borderRadius: 6, background: 'transparent', border: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
            <button type="submit" disabled={status === 'loading'} style={{ padding: '7px 20px', borderRadius: 6, background: t.accent, border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: status === 'loading' ? 'default' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit' }}>
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children, error, t }: { label: string; children: React.ReactNode; error?: string; t: import('@/lib/themeContext').AppTheme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: t.error }}>{error}</div>}
    </div>
  )
}
