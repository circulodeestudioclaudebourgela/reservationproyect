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
  Award
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
  { time: '08:00 - 09:00', title: 'Registro y Acreditación', type: 'registro' },
  { time: '09:00 - 09:30', title: 'Ceremonia de Inauguración', type: 'ceremonia' },
  { time: '09:30 - 11:00', title: 'Ponencia Magistral: Avances en Medicina Interna', type: 'ponencia' },
  { time: '11:00 - 11:30', title: 'Coffee Break', type: 'break' },
  { time: '11:30 - 13:00', title: 'Panel: Nuevas Tecnologías en Diagnóstico', type: 'panel' },
  { time: '13:00 - 14:30', title: 'Almuerzo', type: 'break' },
  { time: '14:30 - 16:00', title: 'Talleres Paralelos: Cirugía / Imagenología', type: 'taller' },
  { time: '16:00 - 16:30', title: 'Coffee Break', type: 'break' },
  { time: '16:30 - 18:00', title: 'Conferencia: Bienestar Animal en la Práctica', type: 'ponencia' },
]

const agendaDay2 = [
  { time: '09:00 - 10:30', title: 'Ponencia Magistral: Medicina Preventiva', type: 'ponencia' },
  { time: '10:30 - 11:00', title: 'Coffee Break', type: 'break' },
  { time: '11:00 - 12:30', title: 'Panel: Casos Clínicos Complejos', type: 'panel' },
  { time: '12:30 - 14:00', title: 'Almuerzo', type: 'break' },
  { time: '14:00 - 15:30', title: 'Talleres Paralelos: Dermatología / Oncología', type: 'taller' },
  { time: '15:30 - 16:00', title: 'Coffee Break', type: 'break' },
  { time: '16:00 - 17:00', title: 'Conferencia de Clausura', type: 'ponencia' },
  { time: '17:00 - 17:30', title: 'Ceremonia de Clausura y Entrega de Certificados', type: 'ceremonia' },
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

export default function InfoSections() {
  return (
    <div className="space-y-0">
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
                del sector para compartir conocimientos, experiencias y las últimas innovaciones.
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
                Dos días intensivos de aprendizaje, práctica y networking profesional.
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
                    <p className="text-muted-foreground text-sm">Jueves, 12 de Junio</p>
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
                    <p className="text-muted-foreground text-sm">Viernes, 13 de Junio</p>
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
                    El Golf - Wyndham
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
                            Av. El Golf 500, Urb. El Golf<br />
                            Trujillo, La Libertad 13009
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Teléfono</p>
                          <p className="text-muted-foreground">+51 44 484848</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Email</p>
                          <p className="text-muted-foreground">eventos.trujillo@costadelsolperu.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      Estacionamiento gratuito
                    </span>
                    <span className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      WiFi de alta velocidad
                    </span>
                    <span className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      Aire acondicionado
                    </span>
                    <span className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      Cafetería
                    </span>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-muted min-h-[400px] lg:min-h-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  <div className="relative text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-secondary" />
                    </div>
                    <p className="text-muted-foreground font-medium mb-2">Mapa de ubicación</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Hotel Costa del Sol - El Golf
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/yVmbGd3ihoRLxUHeA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
