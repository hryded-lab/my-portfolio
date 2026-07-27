import type { Metadata } from 'next'
import Link from 'next/link'
import ProfileDocument from '@/components/seo/ProfileDocument'
import { getProfile, SITE_URL, buildPersonJsonLd, buildBreadcrumbJsonLd } from '@/lib/profile'

const p = getProfile()

export const metadata: Metadata = {
  title: 'Résumé & Profile',
  description: p.metaDescription,
  alternates: { canonical: `${SITE_URL}/profile` },
  openGraph: {
    title: 'Résumé & Profile',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildPersonJsonLd(),
            buildBreadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Profile', path: '/profile' },
            ]),
          ]),
        }}
      />
      <ProfileDocument />
      <footer className="profile-doc-footer">
        <Link href="/">Back to the desktop</Link>
      </footer>
    </div>
  )
}
