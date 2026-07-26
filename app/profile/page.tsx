import type { Metadata } from 'next'
import ProfileDocument from '@/components/seo/ProfileDocument'
import { getProfile, SITE_URL } from '@/lib/profile'

const p = getProfile()

export const metadata: Metadata = {
  title: `${p.name} — Résumé & Profile`,
  description: p.metaDescription,
  alternates: { canonical: `${SITE_URL}/profile` },
  openGraph: {
    title: `${p.name} — Résumé & Profile`,
    description: p.metaDescription,
    url: `${SITE_URL}/profile`,
    type: 'profile',
  },
}

// Text-first view of the same /content data the OS renders. Exists so crawlers,
// screen readers and anyone who'd rather just read get the full picture.
export default function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileDocument />
      <footer className="profile-doc-footer">
        <a href="/">← Back to the desktop</a>
      </footer>
    </div>
  )
}
