// Contact-form sender. Tries EmailJS (browser) first; falls back to the
// /api/contact server route (which logs + Discord-webhooks) if EmailJS isn't
// configured or the EmailJS call fails. Used by both the desktop
// ContactWindow and the mobile ContactApp so they share one wire format.
//
// EmailJS env: NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY. Template params: from_name, from_email,
// message, reply_to.

import emailjs from '@emailjs/browser'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

async function sendViaApi(payload: ContactPayload): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // No EmailJS config → go straight to the server route.
  if (!serviceId || !templateId || !publicKey) {
    await sendViaApi(payload)
    return
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name:  payload.name,
        from_email: payload.email,
        reply_to:   payload.email,
        message:    payload.message,
      },
      { publicKey },
    )
  } catch (emailjsErr) {
    // EmailJS rejected (bad key, network, template mismatch). Fall back so
    // the message still reaches Hryday via the server route.
    try {
      await sendViaApi(payload)
    } catch {
      // Re-throw the original EmailJS error — it's the more useful one.
      throw emailjsErr
    }
  }
}
