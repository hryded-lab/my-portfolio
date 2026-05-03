import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteConfig } from '@/content/siteConfig'

export const metadata: Metadata = {
  metadataBase: new URL('https://hrydaylath.vercel.app'),
  title: `${siteConfig.name} — XP Portfolio`,
  description: siteConfig.metaDescription,
  authors: [{ name: siteConfig.name }],
  manifest: '/manifest.webmanifest',
  // app/icon.png + app/favicon.ico provide the canonical icons via Next's
  // file conventions; only apple-touch-icon needs an explicit entry here.
  icons: { apple: '/favicon_io/apple-touch-icon.png' },
  appleWebApp: {
    capable: true,
    title: 'Hryday',
    statusBarStyle: 'black-translucent',
  },
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
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0d14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
