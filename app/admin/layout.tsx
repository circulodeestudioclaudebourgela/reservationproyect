import React from "react"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Simposio Veterinario 2026',
  description: 'Panel de administración del evento',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
