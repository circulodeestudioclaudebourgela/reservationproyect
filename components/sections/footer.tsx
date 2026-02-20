'use client'

import { Calendar, MapPin, Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="II Simposio Veterinario Internacional 2026"
              className="h-14 w-auto mb-5"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-primary-foreground/70 mb-6 leading-relaxed max-w-md">
              Organizado por el Círculo de Estudios Claude Bourgelat, reunimos a los 
              mejores profesionales del sector veterinario para compartir conocimientos, 
              experiencias e innovaciones.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Evento</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground">05 y 06 de Junio, 2026</p>
                  <p className="text-sm">Conferencias · 4 y 7 Jun: Talleres</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground">Hotel Costa del Sol</p>
                  <p className="text-sm">Av. Los Cocoteros 505, Urb. El Golf</p>
                  <p className="text-sm">Trujillo, Perú</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a 
                  href="mailto:circulodeestudiosclaudebourgela@gmail.com" 
                  className="hover:text-secondary transition-colors text-sm"
                >
                  circulodeestudios<br/>claudebourgela@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+51920211630" className="hover:text-secondary transition-colors">+51 920 211 630</a>
                  <a href="tel:+51940668619" className="hover:text-secondary transition-colors">+51 940 668 619</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} Círculo de Estudios Claude Bourgelat. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-secondary transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
