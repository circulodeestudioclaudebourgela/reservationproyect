import { Download, ExternalLink, MapPin, CalendarDays, Quote } from 'lucide-react'
import SectionHeader from '@/components/sections/section-header'
import {
  conferenceDays,
  workshopDays,
  speakers,
  programStats,
  splitTitle,
  type ProgramDay,
  type ProgramItem,
} from '@/lib/program'

const testimonials = [
  {
    name: 'M.V. Javier Mouly',
    role: 'Especialista en medicina crítica y cuidados intensivos de pequeños animales',
    image: '/OPINION%20DE%20PROFESIONALES/MV%20JAVIER%20MOULY/mouly.jpg',
    quote: 'Una excelente experiencia, con un feedback increíble. Se ve el esfuerzo y las ganas de aprender.',
  },
  {
    name: 'M.V. José Villena',
    role: 'Especialista en diagnóstico por imágenes',
    image: '/OPINION%20DE%20PROFESIONALES/MV%20JOSE%20VILLENA/villena.jpg',
    quote: 'Evento que propone actualización; que nunca antes fue realizado por estudiantes de medicina veterinaria de la ciudad de Trujillo, y no por la Universidad, con resultados muy favorables, con algoritmos claros y precisos en cada especialista y cada charla.',
  },
]

const sponsors = [
  { name: 'AHD', logo: '/LOGOS%20MARCAS/AHD.png' },
  { name: 'IVSA Perú', logo: '/LOGOS%20MARCAS/IVSA%20PERU.png' },
  { name: 'Alta Tec Medic', logo: '/LOGOS%20MARCAS/alta%20tec%20medic.png' },
  { name: 'Epic Farm', logo: '/LOGOS%20MARCAS/epic%20farm.png' },
  { name: 'Guau', logo: '/LOGOS%20MARCAS/guau.png' },
  { name: 'Innovality', logo: '/LOGOS%20MARCAS/innovality.png' },
  { name: 'Instrupet', logo: '/LOGOS%20MARCAS/instrupet.png' },
  { name: 'Invetsa', logo: '/LOGOS%20MARCAS/invetsa.png' },
  { name: 'Labeca', logo: '/LOGOS%20MARCAS/labeca-removebg-preview.png' },
  { name: 'Labyes', logo: '/LOGOS%20MARCAS/labyes.jpg' },
  { name: 'Monge', logo: '/LOGOS%20MARCAS/monge.png' },
  { name: 'Norvet', logo: '/LOGOS%20MARCAS/norvet-removebg-preview.png' },
  { name: 'Sagrop', logo: '/LOGOS%20MARCAS/sagrop-removebg-preview.png' },
]

const container = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// Bloque de fecha (día + mes) para encabezar cada jornada
function DateBadge({ day, month, tone = 'primary' }: { day: string; month: string; tone?: 'primary' | 'secondary' }) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl leading-none text-white ${
        tone === 'primary' ? 'bg-primary' : 'bg-secondary'
      }`}
      aria-hidden="true"
    >
      <span className="text-xl font-bold tabular-nums">{day}</span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider">{month}</span>
    </div>
  )
}

function ProgramRow({ item }: { item: ProgramItem }) {
  const time = item.time?.replace(' - ', '–')

  if (item.type === 'break' || item.type === 'panel') {
    return (
      <li className="grid gap-1 border-t border-dashed border-border py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
        <span className="text-sm tabular-nums text-muted-foreground">{time}</span>
        <span className="text-sm text-muted-foreground">{item.title}</span>
      </li>
    )
  }

  const { title, speaker } = splitTitle(item.title)
  return (
    <li className={`grid gap-1 border-t border-border py-4 ${time ? 'sm:grid-cols-[7rem_1fr] sm:gap-4' : ''}`}>
      {time && <span className="text-sm font-medium tabular-nums text-muted-foreground">{time}</span>}
      <div>
        <p className={`leading-snug text-foreground ${item.type === 'ceremonia' ? 'font-semibold' : 'font-medium'}`}>{title}</p>
        {speaker && <p className="mt-1 text-sm font-medium text-secondary">{speaker}</p>}
      </div>
    </li>
  )
}

function DayCard({ day, title, subtitle, tone }: { day: ProgramDay; title: string; subtitle: string; tone?: 'primary' | 'secondary' }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <header className="mb-2 flex items-center gap-4">
        <DateBadge day={day.day} month={day.month} tone={tone} />
        <div>
          <h3 className="font-serif text-2xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <ol>
        {day.items.map((item, idx) => (
          <ProgramRow key={idx} item={item} />
        ))}
      </ol>
    </article>
  )
}

export default function InfoSections({ registrationOpen }: { registrationOpen: boolean }) {
  const past = !registrationOpen

  const highlights = [
    {
      title: 'Ponencias magistrales',
      text: `${programStats.talks} ponencias de especialistas nacionales e internacionales en dos días de conferencias.`,
    },
    {
      title: 'Talleres prácticos',
      text: past
        ? 'Sesiones prácticas pre y post congreso, el 4 y el 7 de junio.'
        : 'Sesiones prácticas pre y post congreso, el 4 y el 7 de junio, con inscripción aparte.',
    },
    {
      title: 'Encuentro profesional',
      text: past
        ? 'Un espacio para conectar con colegas, investigadores y profesionales del sector veterinario de todo el país.'
        : 'Conecta con colegas, investigadores y profesionales del sector veterinario de todo el país.',
    },
    {
      title: 'Certificación',
      text: past
        ? 'Los asistentes recibieron certificado de participación.'
        : 'La inscripción incluye certificado de participación.',
    },
  ]

  return (
    <div>
      {/* Auspiciadores */}
      <section className="border-b border-border/60 bg-background py-10 sm:py-12">
        <div className={`${container} mb-8`}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Con el respaldo de
          </p>
        </div>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-40" />
          <div className="absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-40" />

          <ul className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap md:gap-16">
            {/* Duplicate array for seamless loop */}
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <li
                key={`${sponsor.name}-${i}`}
                className="flex h-16 w-28 shrink-0 items-center justify-center md:h-20 md:w-36"
                aria-hidden={i >= sponsors.length || undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  loading="lazy"
                  className="h-full w-full object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sobre el simposio */}
      <section className="bg-background py-20 md:py-28">
        <div className={`${container} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <SectionHeader
            className="lg:col-span-5"
            eyebrow="Sobre el simposio"
            title={past ? 'Dos días de actualización clínica en Trujillo' : '¿Por qué asistir?'}
            lead={
              past
                ? 'El II Simposio Veterinario Internacional reunió a especialistas nacionales e internacionales en cirugía, anestesia, cuidados críticos, ultrasonografía, endoscopia y medicina felina para animales de compañía.'
                : 'El II Simposio Veterinario Internacional reúne a especialistas nacionales e internacionales en cirugía, anestesia, cuidados críticos, ultrasonografía, endoscopia y medicina felina para animales de compañía.'
            }
          />
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:pt-8">
            {highlights.map((h, i) => (
              <div key={h.title} className="border-t-2 border-secondary/30 pt-5">
                <dt className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold tabular-nums text-secondary">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-xl font-semibold text-foreground">{h.title}</span>
                </dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{h.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Programa */}
      <section id="agenda" className="scroll-mt-4 bg-muted/50 py-20 md:py-28">
        <div className={container}>
          <SectionHeader
            className="mb-12 md:mb-14"
            eyebrow="Programa académico"
            title={past ? 'Así fue el programa' : 'Agenda del evento'}
            lead={`Dos días de conferencias, el 5 y 6 de junio de 2026, con ${programStats.talks} ponencias, y talleres pre y post congreso el 4 y 7 de junio.`}
          />

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {conferenceDays.map((day, i) => (
              <DayCard
                key={day.id}
                day={day}
                title={day.label}
                subtitle={`${day.weekday} ${Number(day.day)} de junio`}
                tone={i === 0 ? 'primary' : 'secondary'}
              />
            ))}
          </div>

          <h3 className="mb-6 mt-16 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            Talleres pre y post congreso
          </h3>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {workshopDays.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                title={day.label}
                subtitle={`${day.weekday} ${Number(day.day)} de junio`}
                tone="secondary"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ponentes + afiche */}
      <section id="ponentes" className="scroll-mt-4 bg-background py-20 md:py-28">
        <div className={`${container} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5 lg:self-start lg:[@media(min-height:800px)]:sticky lg:[@media(min-height:800px)]:top-8">
            <SectionHeader
              eyebrow="Ponentes"
              title={past ? 'Quienes compartieron su experiencia' : 'Quiénes nos acompañan'}
              lead="Especialistas a cargo de las ponencias y talleres del programa."
            />
            <figure className="mx-auto mt-10 max-w-sm lg:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/flyer.jpeg"
                alt="Afiche oficial del II Simposio Veterinario Internacional 2026 con los ponentes"
                width={1455}
                height={1600}
                loading="lazy"
                className="w-full rounded-2xl shadow-xl ring-1 ring-black/5"
              />
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>Afiche oficial de la edición 2026</span>
                <a
                  href="/flyer.jpeg"
                  download="flyer-simposio-veterinario-2026.jpg"
                  className="inline-flex items-center gap-1.5 rounded-md font-semibold text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Descargar afiche
                </a>
              </figcaption>
            </figure>
          </div>

          <ul className="divide-y divide-border border-y border-border lg:col-span-7 lg:self-start">
            {speakers.map((s) => (
              <li key={s.name} className="py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {[
                      s.talks.length ? plural(s.talks.length, 'ponencia', 'ponencias') : null,
                      s.workshops.length ? plural(s.workshops.length, 'taller', 'talleres') : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 text-[15px] leading-snug text-muted-foreground">
                  {s.talks.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                  {s.workshops.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                      <span>
                        Taller: {w}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonios (primera edición) */}
      <section className="bg-muted/50 py-20 md:py-28">
        <div className={container}>
          <SectionHeader
            className="mb-12 md:mb-14"
            eyebrow="Primera edición · 2025"
            title="Lo que dijeron de la primera edición"
            lead="Más de 200 profesionales veterinarios participaron en nuestra primera edición."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <Quote className="h-8 w-8 text-secondary/40" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Sede */}
      <section id="sede" className="scroll-mt-4 bg-background py-20 md:py-28">
        <div className={container}>
          <SectionHeader className="mb-12 md:mb-14" eyebrow="Sede" title="Hotel Costa del Sol, Trujillo" />

          <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-5">
            <div className="space-y-8 p-6 sm:p-10 lg:col-span-2">
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">Dirección</p>
                  <p className="mt-1 text-muted-foreground">
                    Av. Los Cocoteros 505, Urb. El Golf
                    <br />
                    Trujillo, La Libertad
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">Fechas</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>4 de junio · Talleres pre-congreso</li>
                    <li>5 y 6 de junio · Conferencias</li>
                    <li>7 de junio · Talleres post-congreso</li>
                  </ul>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hotel+Costa+del+Sol+Trujillo+Los+Cocoteros+505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Abrir en Google Maps
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="relative min-h-[320px] bg-muted sm:min-h-[400px] lg:col-span-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d987.3984199101368!2d-79.0402410738877!3d-8.14278009887682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d8186ba493f%3A0x6c360c4d677a2f8!2sHotel%20%7C%20Wyndham%20Costa%20del%20Sol%20Trujillo!5e0!3m2!1ses!2spe!4v1771388722252!5m2!1ses!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                title="Ubicación Hotel Costa del Sol - El Golf, Trujillo"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
