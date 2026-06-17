import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'

import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://v0-veterinary-symposium-registratio.vercel.app'
const siteName = 'II Simposio Veterinario Internacional 2026'
const fullTitle = `${siteName} | Círculo de Estudios Claude Bourgelat`

const eventStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: siteName,
  description:
    'Cirugía abdominal, ultrasonografía diagnóstica, técnicas mínimamente invasivas e investigación clínica para animales de compañía.',
  startDate: '2026-06-05T08:00:00-05:00',
  endDate: '2026-06-06T18:00:00-05:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  image: [`${siteUrl}/flyer.jpeg`],
  location: {
    '@type': 'Place',
    name: 'Hotel Costa del Sol - Urb. El Golf',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Trujillo',
      addressCountry: 'PE',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Círculo de Estudios Claude Bourgelat',
    url: siteUrl,
  },
  creator: {
    '@type': 'Organization',
    name: 'Árkos',
    url: 'https://xn--rkos-4na.com',
  },
}

const playfair = Playfair_Display({
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: fullTitle,
  description: 'Cirugía abdominal, ultrasonografía diagnóstica, técnicas mínimamente invasivas e investigación clínica para animales de compañía. 05 y 06 de Junio 2026 en Hotel Costa del Sol - Urb. El Golf, Trujillo.',
  keywords: ['simposio veterinario', 'veterinaria', 'Trujillo', 'Claude Bourgelat', 'medicina veterinaria', 'congreso veterinario'],
  authors: [{ name: 'Círculo de Estudios Claude Bourgelat' }],
  alternates: {
    canonical: '/',
  },
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
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: fullTitle,
    description: 'Trujillo, 5 y 6 de Junio 2026 — Hotel Costa del Sol, Urb. El Golf.',
    images: ['/flyer.jpeg'],
  },
  openGraph: {
    title: fullTitle,
    description: 'Trujillo, 5 y 6 de Junio 2026 — Hotel Costa del Sol, Urb. El Golf.',
    type: 'website',
    url: '/',
    siteName,
    locale: 'es_PE',
    images: [{ url: '/flyer.jpeg', width: 800, height: 1000, alt: 'Flyer II Simposio Veterinario Internacional 2026' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
        />
        <Script 
          src="https://sdk.mercadopago.com/js/v2" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
