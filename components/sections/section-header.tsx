import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  className?: string
}

// Encabezado común de las secciones públicas: antetítulo, título y bajada
export default function SectionHeader({ eyebrow, title, lead, className = '' }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{lead}</p>}
    </div>
  )
}
