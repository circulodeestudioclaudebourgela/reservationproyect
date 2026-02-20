'use client'

import { Card } from '@/components/ui/card'
import { 
  BookOpen, 
  Microscope, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  GraduationCap,
  Lightbulb,
  Award,
  Star,
  Quote,
  Car,
  Wifi,
  Wind,
  Coffee
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Ponencias Magistrales',
    description: 'Conferencias impartidas por expertos nacionales e internacionales en diversas especialidades veterinarias.'
  },
  {
    icon: Microscope,
    title: 'Talleres Especializados',
    description: 'Sesiones prácticas con equipos de última generación para un aprendizaje aplicado y directo.'
  },
  {
    icon: Users,
    title: 'Networking Profesional',
    description: 'Conecta con colegas, investigadores y profesionales del sector veterinario de todo el país.'
  },
  {
    icon: Award,
    title: 'Certificación',
    description: 'Obtén certificados de participación avalados por instituciones académicas reconocidas.'
  }
]

const agendaDay1 = [
  { time: '08:30 - 09:00', title: 'Apertura del evento', type: 'ceremonia' },
  { time: '09:00 - 09:45', title: 'Dr. Mykel Povea', type: 'ponencia' },
  { time: '09:45 - 10:30', title: 'Actualización en el manejo anestésico: Transición integral del modelo convencional al sistema balanceado y monitoreado — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '10:30 - 10:50', title: 'Receso', type: 'break' },
  { time: '10:50 - 11:35', title: 'Monitorización gasométrica en el paciente crítico — Dr. Sebastian Velez', type: 'ponencia' },
  { time: '11:35 - 12:20', title: 'Dra. Giselle Tomassoni', type: 'ponencia' },
  { time: '12:20 - 14:30', title: 'Almuerzo', type: 'break' },
  { time: '14:30 - 15:15', title: 'Biomarcadores y mecanismos fisiopatológicos del daño renal agudo en felinos domésticos — Dra. Camila Sánchez-Carrión', type: 'ponencia' },
  { time: '15:15 - 16:00', title: 'Hipotermia perioperatoria: mecanismos, prevención y consecuencias — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '16:00 - 16:20', title: 'Receso', type: 'break' },
  { time: '16:20 - 17:05', title: 'FLUTD complejo y casos refractarios — Dra. Camila Sánchez-Carrión', type: 'ponencia' },
  { time: '17:05 - 17:50', title: 'Charla comercial', type: 'panel' },
  { time: '17:50 - 18:10', title: 'Receso', type: 'break' },
  { time: '18:10 - 18:55', title: 'Dr. Mykel Povea', type: 'ponencia' },
]

const agendaDay2 = [
  { time: '09:00 - 09:45', title: 'Valoración de la vía aérea previo a la inducción — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '09:45 - 10:30', title: 'Dr. Mykel Povea', type: 'ponencia' },
  { time: '10:30 - 10:50', title: 'Receso', type: 'break' },
  { time: '10:50 - 11:35', title: 'Dra. Giselle Tomassoni', type: 'ponencia' },
  { time: '11:35 - 12:20', title: 'Criterios terapéuticos para la selección de derivados sanguíneos — Dr. Sebastian Velez', type: 'ponencia' },
  { time: '12:20 - 14:30', title: 'Almuerzo', type: 'break' },
  { time: '14:30 - 15:15', title: 'Estrategias multimodales frente al paradigma de los opioides: Análisis crítico de la anestesia libre de opioides (OFA) en veterinaria — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '15:15 - 16:00', title: 'Introducción a la interpretación de electrolitos y desórdenes ácido-base — Dr. Sebastian Velez', type: 'ponencia' },
  { time: '16:00 - 16:20', title: 'Receso', type: 'break' },
  { time: '16:20 - 17:05', title: 'Dr. Mykel Povea', type: 'ponencia' },
  { time: '17:05 - 17:50', title: 'Charla comercial', type: 'panel' },
  { time: '17:50 - 18:10', title: 'Receso', type: 'break' },
  { time: '18:10 - 18:55', title: 'Clausura', type: 'ceremonia' },
]

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'ponencia':
      return 'bg-primary/10 text-primary border-l-primary'
    case 'taller':
      return 'bg-secondary/10 text-secondary border-l-secondary'
    case 'panel':
      return 'bg-purple-100 text-purple-700 border-l-purple-500'
    case 'ceremonia':
      return 'bg-amber-100 text-amber-700 border-l-amber-500'
    case 'break':
      return 'bg-muted text-muted-foreground border-l-muted-foreground/30'
    default:
      return 'bg-muted text-muted-foreground border-l-muted-foreground/30'
  }
}

const testimonials = [
  {
    name: 'Dr. Carlos Mendoza',
    role: 'Clínica Veterinaria San Martín',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    quote: 'Excelentes ponencias, especialmente la de dermatología veterinaria avanzada. Los talleres prácticos fueron muy valiosos para mi práctica diaria.',
    rating: 5,
  },
  {
    name: 'Dra. María Torres',
    role: 'Hospital Veterinario Central',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    quote: 'Networking invaluable. Conocí colegas de todo el país y establecí contactos importantes para colaboraciones futuras. Altamente recomendado.',
    rating: 5,
  },
  {
    name: 'Dr. Luis Ramírez',
    role: 'SENASA - La Libertad',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'Organización impecable y contenido de primera calidad. Las instalaciones del hotel fueron perfectas. Ya estoy esperando la edición 2026.',
    rating: 5,
  },
]

const sponsors = [
  { name: 'Royal Canin', tier: 'gold' },
  { name: 'Hill\'s Pet Nutrition', tier: 'gold' },
  { name: 'Bayer Animal Health', tier: 'gold' },
  { name: 'MSD Animal Health', tier: 'silver' },
  { name: 'Purina Pro Plan', tier: 'silver' },
  { name: 'Zoetis', tier: 'silver' },
  { name: 'Agrovet Market', tier: 'bronze' },
  { name: 'Vetoquinol', tier: 'bronze' },
  { name: 'Dechra', tier: 'bronze' },
  { name: 'IDEXX', tier: 'gold' },
]

export default function InfoSections() {
  return (
    <div className="space-y-0">
      {/* Sponsors Marquee - Full Width Mist Transition */}
      <section className="w-full bg-background pt-10 pb-12 border-b border-border/40">
        <div className="container mx-auto px-4 mb-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
            Con el respaldo de
          </p>
        </div>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="animate-marquee flex items-center gap-12 md:gap-16 whitespace-nowrap w-max">
            {/* Duplicate array for seamless loop */}
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <div
                key={`${sponsor.name}-${i}`}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-colors ${
                  sponsor.tier === 'gold'
                    ? 'border-amber-200/60 bg-amber-50/50 text-amber-800'
                    : sponsor.tier === 'silver'
                    ? 'border-gray-200/60 bg-gray-50/50 text-gray-700'
                    : 'border-gray-200/40 bg-gray-50/30 text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                  sponsor.tier === 'gold'
                    ? 'bg-amber-100 text-amber-700'
                    : sponsor.tier === 'silver'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {sponsor.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                Sobre el Evento
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                ¿Por qué asistir?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                El II Simposio Veterinario Internacional reúne a los mejores profesionales 
                del sector para compartir conocimientos en cirugía abdominal, ultrasonografía diagnóstica, 
                técnicas mínimamente invasivas y las últimas evidencias en investigación clínica para animales de compañía.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 border border-border bg-card hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="agenda" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Programa Académico
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Agenda del Evento
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dos días de conferencias (05 y 06 de Junio) con talleres pre y post congreso el 4 y 7 de Junio.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Day 1 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">1</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">Día 1</h3>
                    <p className="text-muted-foreground text-sm">Viernes, 05 de Junio</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {agendaDay1.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${getTypeStyles(item.type)}`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-80">{item.time}</p>
                      <p className="font-medium">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day 2 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">Día 2</h3>
                    <p className="text-muted-foreground text-sm">Sábado, 06 de Junio</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {agendaDay2.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${getTypeStyles(item.type)}`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-80">{item.time}</p>
                      <p className="font-medium">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Ponencias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary" />
                <span className="text-muted-foreground">Talleres</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-muted-foreground">Paneles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-muted-foreground">Ceremonias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Trust Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                Primera Edición 2025
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Lo que dijeron nuestros asistentes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Más de 200 profesionales veterinarios participaron en nuestra primera edición
              </p>
            </div>

            {/* Testimonials grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {testimonials.map((t, idx) => (
                <Card key={idx} className="p-6 border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
                  <Quote className="w-8 h-8 text-secondary/20 absolute top-4 right-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-secondary/30 to-primary/30 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </Card>
              ))}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '98%', label: 'Satisfacción General' },
                { value: '200+', label: 'Asistentes 2025' },
                { value: '15', label: 'Especialidades Cubiertas' },
                { value: '4.9/5', label: 'Calificación Promedio' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{value}</div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flyer Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Programa Oficial
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                El evento que no puedes perderte
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Flyer image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10" style={{ transform: 'rotate(-1deg)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/flyer.jpeg"
                      alt="Flyer oficial II Simposio Veterinario Internacional 2026"
                      className="w-full max-w-[320px] md:max-w-[380px] block"
                    />
                  </div>
                </div>
              </div>

              {/* Info lateral */}
              <div className="md:w-1/2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-foreground">Fechas del evento</p>
                      <p className="text-muted-foreground text-sm">4 de Junio: Taller Pre-Congreso</p>
                      <p className="text-muted-foreground text-sm">5 y 6 de Junio: Conferencias</p>
                      <p className="text-muted-foreground text-sm">7 de Junio: Talleres Post-Congreso</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-semibold text-foreground">Sede</p>
                      <p className="text-muted-foreground text-sm">Hotel Costa del Sol</p>
                      <p className="text-muted-foreground text-sm">Av. Los Cocoteros 505, Urb. El Golf</p>
                      <p className="text-muted-foreground text-sm">Trujillo, Perú</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold text-foreground">Informes e inscripciones</p>
                      <p className="text-muted-foreground text-sm">+51 920 211 630</p>
                      <p className="text-muted-foreground text-sm">+51 940 668 619</p>
                    </div>
                  </div>
                </div>
                <a
                  href="/flyer.jpeg"
                  download="flyer-simposio-veterinario-2026.jpg"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Descargar flyer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                Sede del Evento
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Ubicación
              </h2>
            </div>

            <Card className="overflow-hidden border border-border bg-card">
              <div className="grid lg:grid-cols-2">
                {/* Info */}
                <div className="p-8 md:p-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-6">
                    <MapPin className="w-4 h-4" />
                    Trujillo, Perú
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
                    Hotel Costa del Sol
                  </h3>
                  <p className="text-xl text-secondary font-medium mb-6">
                    Urb. El Golf — Trujillo, Perú
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      Ubicado en el corazón de Trujillo, el Hotel Costa del Sol ofrece 
                      instalaciones de primer nivel para eventos académicos y profesionales.
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Dirección</p>
                          <p className="text-muted-foreground">
                            Av. Los Cocoteros 505, Urb. El Golf<br />
                            Trujillo, La Libertad
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Informes e Inscripciones</p>
                          <p className="text-muted-foreground">+51 920 211 630</p>
                          <p className="text-muted-foreground">+51 940 668 619</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Email</p>
                          <p className="text-muted-foreground">circulodeestudiosclaudebourgela@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      <Car className="w-3 h-3" />
                      Estacionamiento gratuito
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      <Wifi className="w-3 h-3" />
                      WiFi de alta velocidad
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      <Wind className="w-3 h-3" />
                      Aire acondicionado
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      <Coffee className="w-3 h-3" />
                      Cafetería
                    </span>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="bg-muted min-h-[400px] lg:min-h-full relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d987.3984199101368!2d-79.0402410738877!3d-8.14278009887682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d8186ba493f%3A0x6c360c4d677a2f8!2sHotel%20%7C%20Wyndham%20Costa%20del%20Sol%20Trujillo!5e0!3m2!1ses!2spe!4v1771388722252!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Ubicación Hotel Costa del Sol - El Golf, Trujillo"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
