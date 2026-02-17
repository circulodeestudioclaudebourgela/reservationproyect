'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'

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

export default function HeroSection() {
  const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
  const EVENT_DATE = new Date('2026-06-05T08:00:00')
  const countdown = useCountdown(EVENT_DATE)
  const earlyBird = useCountdown(EARLY_BIRD_DEADLINE)
  const isEarlyBird = earlyBird.total > 0
  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAgenda = () => {
    const agendaElement = document.getElementById('agenda')
    agendaElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground flex items-center overflow-hidden">
      {/* Background image - conference/event */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
      </div>

      {/* Abstract background pattern */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Organization badge */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Círculo de Estudios Claude Bourgelat
            </span>
          </div>

          {/* Main title */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
            <span className="block">II Simposio</span>
            <span className="block text-secondary">Veterinario</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl font-medium mt-2">Internacional 2026</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl mb-6 text-primary-foreground/80 font-light max-w-2xl mx-auto">
            El evento veterinario del año
          </p>

          {/* Early Bird Countdown */}
          {isEarlyBird && (
            <div className="mb-8 inline-block">
              <div className="bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <p className="text-sm font-medium text-amber-200">Precio Early Bird termina en:</p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: earlyBird.days, label: 'Días' },
                    { value: earlyBird.hours, label: 'Horas' },
                    { value: earlyBird.minutes, label: 'Min' },
                    { value: earlyBird.seconds, label: 'Seg' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="bg-white/10 rounded-lg px-2 py-1 min-w-[48px]">
                        <div className="text-xl md:text-2xl font-bold text-white font-mono tabular-nums">
                          {String(value).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="text-[10px] text-white/60 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Event details pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>05 y 06 de Junio, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>Hotel Costa del Sol - El Golf, Trujillo</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-secondary/25 transition-all hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5"
            >
              Registrarse Ahora
            </Button>
            <Button
              onClick={scrollToAgenda}
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg font-medium backdrop-blur-sm"
            >
              Ver Agenda
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">20+</div>
              <p className="text-sm md:text-base text-primary-foreground/70">Ponentes Expertos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">2</div>
              <p className="text-sm md:text-base text-primary-foreground/70">Días de Conferencias</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">10+</div>
              <p className="text-sm md:text-base text-primary-foreground/70">Talleres Prácticos</p>
            </div>
          </div>

          {/* Event countdown */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-white/60 mb-3">El evento comienza en:</p>
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {[
                { value: countdown.days, label: 'Días' },
                { value: countdown.hours, label: 'Horas' },
                { value: countdown.minutes, label: 'Minutos' },
                { value: countdown.seconds, label: 'Segundos' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] md:text-xs text-white/60">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade - optimized for Overlapping Content pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background/40 via-background/20 to-transparent pointer-events-none" />
    </section>
  )
}
