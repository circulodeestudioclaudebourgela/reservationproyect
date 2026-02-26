'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema, type RegistrationForm as RegistrationFormType } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, CreditCard, Mail, Phone, Briefcase, Building2, CheckCircle2, Clock, Sparkles } from 'lucide-react'

interface RegistrationFormProps {
  onSuccess: (data: RegistrationFormType) => void
}

// Precios dinámicos
const EARLY_BIRD_PRICE = 250.00  // Precio preventa hasta 20 de abril 2026
const REGULAR_PRICE = 350.00    // Precio regular hasta 05 de junio 2026
const EARLY_BIRD_DEADLINE = new Date('2026-04-20T23:59:59')

const WORKSHOPS = [
  {
    title: "Tips and Tricks en Cirugía Veterinaria",
    speaker: "Dr. Maykel Povea",
    date: "7 de junio",
    price: 1000.00,
  },
  {
    title: "Anestesia Veterinaria",
    speaker: "Dr. Alexander Sánchez",
    date: "7 de junio",
    price: 700.00,
  },
  {
    title: "Endoscopia Veterinaria Diagnóstica",
    speaker: "Dr. Luis Lam",
    date: "4 de junio",
    price: 600.00,
  },
  {
    title: "Ecografía Veterinaria A-FAST / Ecografía Gestacional",
    speaker: "Dr(c). MSc. M.V.Z. Liev Tamariz",
    date: "4 y 7 de junio",
    price: 400.00,
  }
]

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentCategory, setPaymentCategory] = useState<'event' | 'workshops'>('event')
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null)
  
  // Calcular precio según fecha
  const { currentPrice, isEarlyBird, daysLeft } = useMemo(() => {
    const now = new Date()
    const isEarly = now < EARLY_BIRD_DEADLINE
    const diff = EARLY_BIRD_DEADLINE.getTime() - now.getTime()
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    return {
      currentPrice: isEarly ? EARLY_BIRD_PRICE : REGULAR_PRICE,
      isEarlyBird: isEarly,
      daysLeft: days
    }
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormType>({
    resolver: zodResolver(registrationSchema),
  })

  const roleValue = watch('role')

  const onSubmit = async (data: RegistrationFormType) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('[Simposio] Registration data:', data)
      onSuccess(data)
    } catch (error) {
      console.error('[Simposio] Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="registration-form" className="py-20 md:py-28 bg-primary/[0.02]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
              Inscripción Abierta
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Reserva tu Lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Completa el formulario para asegurar tu participación en el 
              II Simposio Veterinario Internacional 2026.
            </p>
          </div>

          {/* Choice Chips */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-primary/5 p-1 rounded-full border border-primary/10">
              <button
                type="button"
                onClick={() => setPaymentCategory('event')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  paymentCategory === 'event'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Pago del Evento
              </button>
              <button
                type="button"
                onClick={() => setPaymentCategory('workshops')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  paymentCategory === 'workshops'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Pago de Talleres
              </button>
            </div>
          </div>

          {/* Price cards */}
          {paymentCategory === 'event' ? (
            <Card className="p-6 mb-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 shadow-xl overflow-hidden relative">
              {isEarlyBird && (
                <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Early Bird
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium mb-1">Inversión</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">S/ {currentPrice.toFixed(2)}</span>
                    <span className="text-primary-foreground/70 text-sm">por persona</span>
                  </div>
                  {isEarlyBird && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>Preventa hasta 20 de Abril · {daysLeft} días restantes</span>
                    </div>
                  )}
                  {!isEarlyBird && (
                    <p className="text-primary-foreground/60 text-xs mt-2">Precio regular</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-primary-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>Incluye certificado</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-primary-foreground/80 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>Coffee breaks</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-primary-foreground/80 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span>Material digital</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {WORKSHOPS.map((workshop, idx) => {
                const isSelected = selectedWorkshop === idx;
                return (
                  <Card 
                    key={idx} 
                    onClick={() => setSelectedWorkshop(idx)}
                    className={`p-5 text-primary-foreground border-2 shadow-xl overflow-hidden relative group transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-primary to-primary border-secondary ring-2 ring-secondary ring-offset-2 scale-[1.02]' 
                        : 'bg-gradient-to-r from-primary to-primary/90 border-transparent hover:from-primary/90 hover:to-primary hover:scale-[1.01]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1 shadow-md z-10">
                        <CheckCircle2 className="w-3 h-3" />
                        Seleccionado
                      </div>
                    )}
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg leading-tight mb-3 text-white pr-6">{workshop.title}</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-primary-foreground/90 flex items-center gap-2">
                            <User className="w-4 h-4 text-secondary" />
                            {workshop.speaker}
                          </p>
                          <p className="text-sm text-primary-foreground/90 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            {workshop.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 pt-4 border-t border-primary-foreground/20 mt-auto">
                        <span className="text-3xl font-bold text-white">S/ {workshop.price.toFixed(2)}</span>
                        <span className="text-primary-foreground/80 text-xs">por persona</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Form */}
          <Card className="p-8 md:p-10 border border-border bg-card shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nombre Completo *
                </Label>
                <Input
                  id="full_name"
                  placeholder="Ej: Juan Carlos Pérez García"
                  {...register('full_name')}
                  className="bg-background border-border h-12"
                  disabled={isSubmitting}
                />
                {errors.full_name && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* DNI */}
                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-foreground font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    DNI *
                  </Label>
                  <Input
                    id="dni"
                    placeholder="12345678"
                    maxLength={8}
                    {...register('dni')}
                    className="bg-background border-border h-12"
                    disabled={isSubmitting}
                  />
                  {errors.dni && (
                    <p className="text-destructive text-sm">{errors.dni.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Teléfono / Celular *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="987654321"
                    maxLength={9}
                    {...register('phone')}
                    className="bg-background border-border h-12"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  {...register('email')}
                  className="bg-background border-border h-12"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enviaremos tu constancia de registro a este correo.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    Tipo de Participante *
                  </Label>
                  <Select
                    value={roleValue}
                    onValueChange={(value) => setValue('role', value as 'student' | 'professional')}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-background border-border h-12">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        <span className="flex items-center gap-2">
                          Profesional Veterinario
                        </span>
                      </SelectItem>
                      <SelectItem value="student">
                        <span className="flex items-center gap-2">
                          Estudiante de Veterinaria
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-destructive text-sm">{errors.role.message}</p>
                  )}
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-foreground font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Institución / Universidad
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Opcional"
                    {...register('organization')}
                    className="bg-background border-border h-12"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Spacer */}
              <div className="pt-4 border-t border-border">
                {/* Order Summary */}
                <div className="bg-primary/5 rounded-xl p-5 mb-6 flex items-center justify-between border border-primary/10">
                  <div className="flex flex-col">
                    <span className="text-foreground font-semibold">Total a pagar</span>
                    <span className="text-sm text-muted-foreground">
                      {paymentCategory === 'event' ? 'Pase General' : (
                        selectedWorkshop !== null ? 'Pase Taller' : 'Selecciona un taller'
                      )}
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    S/ {paymentCategory === 'event' 
                      ? currentPrice.toFixed(2) 
                      : selectedWorkshop !== null 
                        ? WORKSHOPS[selectedWorkshop].price.toFixed(2) 
                        : '0.00'}
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || (paymentCategory === 'workshops' && selectedWorkshop === null)}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-6 text-lg shadow-lg shadow-secondary/20 transition-all hover:shadow-xl hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    paymentCategory === 'workshops' && selectedWorkshop === null 
                      ? 'Seleccionar Taller para Continuar' 
                      : 'Continuar al Pago'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al continuar, aceptas nuestros términos y condiciones.
                  <br />
                  Pago seguro procesado por <span className="font-semibold">MercadoPago</span>.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
