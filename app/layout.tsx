import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteConfig } from '@/content/siteConfig'

export const metadata: Metadata = {
  metadataBase: new URL('https://hrydaylath.vercel.app'),
  title: `${siteConfig.name} — XP Portfolio`,
  description: siteConfig.metaDescription,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} — XP Portfolio`,
    description: siteConfig.metaDescription,
    url: 'https://hrydaylath.vercel.app',
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} portfolio` }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — XP Portfolio`,
    description: siteConfig.metaDescription,
    images: [siteConfig.ogImage],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
