'use client'

import { Calendar, MapPin, Mail, Phone } from 'lucide-react'
import { ArkosCredit } from '@/components/ui/arkos-credit'
import { CONTACT } from '@/lib/event'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer data-fab-hide className="bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Brand & Description */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="II Simposio Veterinario Internacional 2026"
              width={1106}
              height={373}
              className="mb-5 h-14 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="max-w-md leading-relaxed text-primary-foreground/75">
              Organizado por el Círculo de Estudios Claude Bourgelat, reunimos a los
              mejores profesionales del sector veterinario para compartir conocimientos,
              experiencias e innovaciones.
            </p>
          </div>

          {/* Event Details */}
          <div>
            <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">Evento</h2>
            <ul className="space-y-4 text-primary-foreground/75">
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
                <div>
                  <p className="font-medium text-primary-foreground">5 y 6 de junio de 2026</p>
                  <p className="text-sm">Conferencias · Talleres: 4 y 7 de junio</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
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
            <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">Contacto</h2>
            <ul className="space-y-4 text-primary-foreground/75">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="rounded-sm text-sm transition-colors [overflow-wrap:anywhere] hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  {CONTACT.email.split('@')[0]}
                  <wbr />@{CONTACT.email.split('@')[1]}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  {CONTACT.phones.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="rounded-sm transition-colors hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                    >
                      {p.label}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-sm text-primary-foreground/70">
            © {currentYear} Círculo de Estudios Claude Bourgelat. Todos los derechos reservados.
          </p>
          <ArkosCredit />
        </div>
      </div>
    </footer>
  )
}
