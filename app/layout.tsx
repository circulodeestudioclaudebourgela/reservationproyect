import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'

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
  description: 'Únete al evento veterinario del año. 05 y 06 de Junio 2026 en Hotel Costa del Sol - El Golf, Trujillo. Ponencias magistrales, talleres especializados y networking.',
  keywords: ['simposio veterinario', 'veterinaria', 'Trujillo', 'Claude Bourgelat', 'medicina veterinaria', 'congreso veterinario'],
  authors: [{ name: 'Círculo de Estudios Claude Bourgelat' }],
  openGraph: {
    title: 'II Simposio Veterinario Internacional 2026',
    description: 'El evento veterinario del año. 05 y 06 de Junio en Trujillo.',
    type: 'website',
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
      <body>{children}</body>
    </html>
  )
}
