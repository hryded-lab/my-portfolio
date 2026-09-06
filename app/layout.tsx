import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteConfig } from '@/content/siteConfig'

export const metadata: Metadata = {
  metadataBase: new URL('https://hrydaylath.vercel.app'),
  // Child routes set only their own title; this frames every one of them.
  title: {
    default: `${siteConfig.name}, Entrepreneur & Builder at BITS Pilani`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: 'https://hrydaylath.vercel.app' }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: 'https://hrydaylath.vercel.app/' },
  category: 'technology',
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
    title: `${siteConfig.name}, Entrepreneur & Builder at BITS Pilani`,
    description: siteConfig.metaDescription,
    url: 'https://hrydaylath.vercel.app',
    locale: 'en_IN',
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} portfolio` }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name}, Entrepreneur & Builder at BITS Pilani`,
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

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Silkscreen:wght@400;700' +
  '&family=VT323' +
  '&family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900' +
  '&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400' +
  '&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900' +
  '&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Archivo+Black' +
  '&display=swap'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Warm the font connections before the stylesheet resolves — saves a DNS +
            TLS round trip on the critical path. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Profile as plain text" />
        {/* rel=me ties these profiles to this domain for identity resolution */}
        <link rel="me" href={siteConfig.github} />
        <link rel="me" href={siteConfig.linkedin} />
        <link rel="me" href={`mailto:${siteConfig.email}`} />
      </head>
      <body>
        <a className="skip-link" href="/profile">Skip to text version of this portfolio</a>
        {children}
      </body>
    </html>
  )
}
