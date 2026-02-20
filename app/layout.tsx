import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'

import './globals.css'

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
  title: 'II Simposio Veterinario Internacional 2026 | Círculo de Estudios Claude Bourgelat',
  description: 'Cirugía abdominal, ultrasonografía diagnóstica, técnicas mínimamente invasivas e investigación clínica para animales de compañía. 05 y 06 de Junio 2026 en Hotel Costa del Sol - Urb. El Golf, Trujillo.',
  keywords: ['simposio veterinario', 'veterinaria', 'Trujillo', 'Claude Bourgelat', 'medicina veterinaria', 'congreso veterinario'],
  authors: [{ name: 'Círculo de Estudios Claude Bourgelat' }],
  openGraph: {
    title: 'II Simposio Veterinario Internacional 2026',
    description: 'Trujillo, 5 y 6 de Junio 2026 — Hotel Costa del Sol, Urb. El Golf.',
    type: 'website',
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
        <Script 
          src="https://sdk.mercadopago.com/js/v2" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
