'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, MapPin, Clock, CheckCircle2, Microscope } from 'lucide-react'
import { EVENT_START } from '@/lib/event'

// Hook para countdown
function useCountdown(targetDate: Date) {
  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime()
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

const primaryCta =
  'inline-flex h-12 items-center justify-center rounded-lg bg-secondary px-7 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
const secondaryCta =
  'inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-7 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'

const facts = [
  { icon: CalendarDays, label: 'Conferencias', value: '5 y 6 de junio de 2026' },
  { icon: Microscope, label: 'Talleres', value: '4 y 7 de junio' },
  { icon: MapPin, label: 'Sede', value: 'Hotel Costa del Sol, Trujillo' },
]

// Hero con inscripciones abiertas: preventa, CTA de registro y cuenta regresiva
function OpenHeroContent() {
  const EARLY_BIRD_DEADLINE = new Date('2026-04-20T23:59:59')
  const countdown = useCountdown(EVENT_START)
  const earlyBird = useCountdown(EARLY_BIRD_DEADLINE)
  const isEarlyBird = earlyBird.total > 0

  return (
    <>
      <p className="mt-8 text-lg text-white/80 sm:text-xl">Trujillo, La Libertad · 2026</p>

      {isEarlyBird && (
        <div className="mx-auto mt-8 inline-block rounded-xl border border-amber-400/30 bg-amber-500/20 px-6 py-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <p className="text-sm font-medium text-amber-200">Preventa hasta el 20 de abril:</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: earlyBird.days, label: 'Días' },
              { value: earlyBird.hours, label: 'Horas' },
              { value: earlyBird.minutes, label: 'Min' },
              { value: earlyBird.seconds, label: 'Seg' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="min-w-[48px] rounded-lg bg-white/10 px-2 py-1">
                  <div className="font-mono text-xl font-bold tabular-nums text-white md:text-2xl" suppressHydrationWarning>
                    {String(value).padStart(2, '0')}
                  </div>
                </div>
                <div className="mt-1 text-[11px] text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <a href="#registration-form" className={primaryCta}>
          Inscríbete ahora
        </a>
        <a href="#agenda" className={secondaryCta}>
          Ver programa
        </a>
      </div>

      <div className="mx-auto mt-14 max-w-sm border-t border-white/10 pt-8">
        <p className="mb-3 text-sm text-white/70">El evento comienza en:</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: countdown.days, label: 'Días' },
            { value: countdown.hours, label: 'Horas' },
            { value: countdown.minutes, label: 'Minutos' },
            { value: countdown.seconds, label: 'Segundos' },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="font-mono text-2xl font-bold tabular-nums text-white md:text-3xl" suppressHydrationWarning>
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-[11px] text-white/70 md:text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// Hero de edición realizada: agradecimiento y registro de lo que fue
function ClosedHeroContent() {
  return (
    <>
      <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Edición 2026 realizada
      </p>
      <p className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
        Gracias por ser parte del II Simposio
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
        El II Simposio Veterinario Internacional se realizó el 5 y 6 de junio de 2026 en el
        Hotel Costa del Sol de Trujillo. Gracias a los asistentes y a los ponentes que lo hicieron
        posible, y a las marcas e instituciones que nos respaldaron.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <a href="#agenda" className={primaryCta}>
          Ver el programa
        </a>
        <a href="#inscripciones" className={secondaryCta}>
          Próximas ediciones
        </a>
      </div>
    </>
  )
}

export default function HeroSection({ registrationOpen }: { registrationOpen: boolean }) {
  return (
    <section data-fab-hide="mobile" className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Fondo: foto de auditorio + degradado de marca */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=70&w=1600"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174_66%_32%/0.28),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        {/* Logo oficial */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="II Simposio Veterinario Internacional 2026"
            width={1106}
            height={373}
            className="h-20 w-auto sm:h-24 md:h-28"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* H1 para SEO (oculto visualmente, el logo lo cubre) */}
        <h1 className="sr-only">II Simposio Veterinario Internacional 2026</h1>

        {registrationOpen ? <OpenHeroContent /> : <ClosedHeroContent />}

        {/* Datos del evento */}
        <dl className="mx-auto mt-14 grid max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-start gap-3 px-5 py-4 ${i > 0 ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-white sm:text-[15px]">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
