'use client'

import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users } from 'lucide-react'

export default function HeroSection() {
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
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
