import { Mail, Phone } from 'lucide-react'
import SectionHeader from '@/components/sections/section-header'
import { CONTACT, whatsappLink } from '@/lib/event'

// Reemplaza al formulario cuando las inscripciones están cerradas (ver lib/event.ts)
export default function RegistrationClosed() {
  return (
    <section id="inscripciones" data-fab-hide className="scroll-mt-4 bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
          <SectionHeader
            className="lg:col-span-7"
            eyebrow="Inscripciones"
            title="Inscripciones cerradas"
            lead="Las inscripciones para la edición 2026 ya cerraron. Si quieres información sobre próximas ediciones del simposio, escríbenos o llámanos y te responderemos."
          />

          <div className="flex flex-col justify-center gap-4 lg:col-span-5">
            <a
              href={whatsappLink('Hola, quisiera información sobre próximas ediciones del Simposio Veterinario')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary px-6 font-semibold text-white shadow-sm transition hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Escríbenos por WhatsApp
            </a>

            <ul className="space-y-3 rounded-xl border border-border p-5 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="rounded-sm text-foreground underline-offset-4 [overflow-wrap:anywhere] hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CONTACT.email.split('@')[0]}
                  <wbr />@{CONTACT.email.split('@')[1]}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  {CONTACT.phones.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="rounded-sm text-foreground underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {p.label}
                    </a>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
