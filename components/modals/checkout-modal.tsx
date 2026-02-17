'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Shield, 
  Calendar, 
  MapPin,
  User,
  Mail,
  Download,
  Smartphone,
  Copy,
  Clock,
  AlertCircle,
  ChevronLeft,
  Info,
  Lock,
  Phone
} from 'lucide-react'
import type { RegistrationForm } from '@/lib/validations'
import { registerAttendee } from '@/app/actions/register'
import { processYapePayment, processCardPayment } from '@/app/actions/payment'

// Declarar tipos para MP SDK global
declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: Record<string, unknown>) => MPInstance
  }
}

interface MPInstance {
  yape: (options: { otp: string; phoneNumber: string }) => {
    create: () => Promise<{ id: string }>
  }
  cardForm: (options: Record<string, unknown>) => MPCardForm
}

interface MPCardForm {
  getCardFormData: () => {
    token: string
    payment_method_id: string
    installments: number
    issuer_id: string
  }
  unmount: () => void
}

interface CheckoutModalProps {
  formData: RegistrationForm | null
  onClose: () => void
}

type PaymentMethod = 'card' | 'yape' | null
type CheckoutStep = 'summary' | 'payment-select' | 'yape-form' | 'card-form' | 'processing' | 'success' | 'error'

const CURRENCY = 'S/'
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')

// Comisiones de transacción
const FEES = {
  card: 0.05,   // Tarjeta: 5%
  yape: 0,      // Yape: sin comisión
}

const getBasePrice = () => {
  return new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

const calculateFee = (basePrice: number, method: PaymentMethod) => {
  if (!method || method === 'yape') return 0
  if (method === 'card') return basePrice * FEES.card
  return 0
}

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || ''

export default function CheckoutModal({ formData, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('summary')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [ticketCode, setTicketCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [attendeeId, setAttendeeId] = useState<string>('')

  // Yape form state
  const [yapePhone, setYapePhone] = useState('')
  const [yapeOtp, setYapeOtp] = useState('')
  const [isYapeSubmitting, setIsYapeSubmitting] = useState(false)

  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpMonth, setCardExpMonth] = useState('')
  const [cardExpYear, setCardExpYear] = useState('')
  const [cardSecurityCode, setCardSecurityCode] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [cardDocNumber, setCardDocNumber] = useState('')
  const [isCardSubmitting, setIsCardSubmitting] = useState(false)

  const mpRef = useRef<MPInstance | null>(null)

  // Calcular precios dinámicamente
  const basePrice = useMemo(() => getBasePrice(), [])
  const isEarlyBird = useMemo(() => new Date() < EARLY_BIRD_DEADLINE, [])
  const fee = useMemo(() => calculateFee(basePrice, paymentMethod), [basePrice, paymentMethod])
  const totalPrice = useMemo(() => basePrice + fee, [basePrice, fee])

  // Inicializar MP SDKs
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MercadoPago && MP_PUBLIC_KEY) {
      try {
        mpRef.current = new window.MercadoPago(MP_PUBLIC_KEY)
        console.log('[Simposio] MercadoPago SDK initialized')
      } catch (error) {
        console.error('[Simposio] MP SDK init error:', error)
      }
    }
  }, [])

  // Registrar attendee en BD al avanzar al pago
  const ensureAttendeeRegistered = useCallback(async (): Promise<string | null> => {
    if (attendeeId) return attendeeId
    if (!formData) return null

    const result = await registerAttendee(formData)
    if (result.success) {
      setAttendeeId(result.data.id)
      setTicketCode(result.data.ticket_code)
      return result.data.id
    } else {
      setErrorMessage(result.error)
      setStep('error')
      return null
    }
  }, [attendeeId, formData])

  // ============================================
  // Handle Yape Payment via MercadoPago SDK
  // ============================================
  const handleYapePayment = async () => {
    setIsYapeSubmitting(true)
    setErrorMessage('')

    try {
      const aid = await ensureAttendeeRegistered()
      if (!aid) return

      setStep('processing')

      if (!mpRef.current) {
        throw new Error('MercadoPago SDK no disponible. Recarga la página.')
      }

      // Generar token de Yape usando el SDK
      const yape = mpRef.current.yape({
        otp: yapeOtp,
        phoneNumber: yapePhone,
      })
      const yapeToken = await yape.create()

      if (!yapeToken?.id) {
        throw new Error('No se pudo generar el token de Yape. Verifica tu OTP y número de celular.')
      }

      // Procesar pago en el servidor
      const result = await processYapePayment(
        aid,
        yapeToken.id,
        basePrice,
        formData!.email
      )

      if (result.success) {
        setTicketCode(result.data.ticket_code)
        console.log('[Simposio] Yape payment success - Ticket:', result.data.ticket_code)
        setStep('success')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('[Simposio] Yape payment error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar pago con Yape')
      setStep('error')
    } finally {
      setIsYapeSubmitting(false)
    }
  }

  // ============================================
  // Handle Card Payment via MercadoPago SDK
  // ============================================
  const handleCardPayment = async () => {
    setIsCardSubmitting(true)
    setErrorMessage('')

    try {
      const aid = await ensureAttendeeRegistered()
      if (!aid) return

      setStep('processing')

      if (!mpRef.current) {
        throw new Error('MercadoPago SDK no disponible. Recarga la página.')
      }

      // Crear token manualmente vía API de MP
      const tokenResponse = await fetch('https://api.mercadopago.com/v1/card_tokens?public_key=' + MP_PUBLIC_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_number: cardNumber.replace(/\s/g, ''),
          expiration_month: parseInt(cardExpMonth),
          expiration_year: parseInt(cardExpYear.length === 2 ? '20' + cardExpYear : cardExpYear),
          security_code: cardSecurityCode,
          cardholder: {
            name: cardholderName,
            identification: {
              type: 'DNI',
              number: cardDocNumber || formData!.dni,
            },
          },
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}))
        console.error('[Simposio] Token creation error:', errorData)
        throw new Error('Error al tokenizar la tarjeta. Verifica los datos e intenta de nuevo.')
      }

      const tokenData = await tokenResponse.json()

      if (!tokenData.id) {
        throw new Error('No se pudo generar el token de la tarjeta.')
      }

      // Procesar pago en el servidor
      const result = await processCardPayment(
        aid,
        tokenData.id,
        totalPrice,
        formData!.email,
        1,
        tokenData.payment_method_id || 'visa'
      )

      if (result.success) {
        setTicketCode(result.data.ticket_code)
        console.log('[Simposio] Card payment success - Ticket:', result.data.ticket_code)
        setStep('success')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('[Simposio] Card payment error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar pago con tarjeta')
      setStep('error')
    } finally {
      setIsCardSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRetry = () => {
    setStep('payment-select')
    setErrorMessage('')
    setPaymentMethod(null)
  }

  const handleBack = () => {
    if (step === 'payment-select') setStep('summary')
    else if (step === 'yape-form') setStep('payment-select')
    else if (step === 'card-form') setStep('payment-select')
    else setStep('summary')
  }

  if (!formData) return null

  const getRoleLabel = (role: string) => {
    return role === 'professional' ? 'Profesional Veterinario' : 'Estudiante'
  }

  const getStepTitle = () => {
    switch (step) {
      case 'success': return '¡Registro Exitoso!'
      case 'error': return 'Error en el Pago'
      case 'processing': return 'Procesando...'
      case 'payment-select': return 'Selecciona Método de Pago'
      case 'yape-form': return 'Pagar con Yape'
      case 'card-form': return 'Pagar con Tarjeta'
      default: return 'Confirmar Registro'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <Card className="rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center gap-3">
              {(step === 'payment-select' || step === 'yape-form' || step === 'card-form') && (
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Volver"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {getStepTitle()}
                </h2>
                {step === 'summary' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Revisa tu información antes de pagar
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Summary Step */}
          {step === 'summary' && (
            <div className="p-6 space-y-6">
              {/* Registration Data */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-secondary" />
                  Datos del Participante
                </h3>
                <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium text-foreground">{formData.full_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DNI:</span>
                    <span className="font-medium text-foreground">{formData.dni}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground truncate ml-4">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium text-foreground">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium text-foreground">{getRoleLabel(formData.role)}</span>
                  </div>
                  {formData.organization && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Institución:</span>
                      <span className="font-medium text-foreground">{formData.organization}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div className="bg-primary/5 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span className="text-foreground">05 y 06 de Junio, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="text-foreground">Hotel Costa del Sol - El Golf, Trujillo</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-border py-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Entrada II Simposio Veterinario</span>
                  <span className="text-foreground">{CURRENCY} {basePrice.toFixed(2)}</span>
                </div>
                {isEarlyBird && (
                  <div className="flex items-center gap-2 text-xs text-secondary bg-secondary/10 px-3 py-2 rounded-lg">
                    <Info className="w-4 h-4" />
                    <span>¡Precio Early Bird! Válido hasta abril 2026</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                  <span className="font-semibold text-foreground text-lg">Total a Pagar</span>
                  <span className="font-serif text-2xl font-bold text-secondary">
                    {CURRENCY} {basePrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Continue to payment button */}
              <Button
                onClick={() => setStep('payment-select')}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-6 text-lg shadow-lg shadow-secondary/25 transition-all hover:shadow-xl"
              >
                Continuar al Pago
              </Button>
            </div>
          )}

          {/* Payment Method Selection */}
          {step === 'payment-select' && (
            <div className="p-6 space-y-4">
              {/* Price reminder */}
              <div className="bg-primary/5 p-4 rounded-xl flex justify-between items-center">
                <span className="text-foreground font-medium">Precio base:</span>
                <span className="font-serif text-2xl font-bold text-secondary">
                  {CURRENCY} {basePrice.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">Elige cómo quieres pagar:</p>

              {/* Payment options */}
              <div className="space-y-3">
                {/* Yape via MercadoPago - Sin comisión */}
                <button
                  onClick={() => {
                    setPaymentMethod('yape')
                    setStep('yape-form')
                  }}
                  className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      Yape
                    </p>
                    <p className="text-sm text-muted-foreground">Sin comisión • {CURRENCY} {basePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Sin fee</span>
                  </div>
                </button>

                {/* Tarjeta via MercadoPago - Comisión 5% */}
                <button
                  onClick={() => {
                    setPaymentMethod('card')
                    setStep('card-form')
                  }}
                  className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      Tarjeta de Crédito/Débito
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +5% comisión • Total: {CURRENCY} {(basePrice * 1.05).toFixed(2)}
                    </p>
                  </div>
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Fee explanation */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Las comisiones de tarjeta corresponden a los costos de procesamiento.
                  Yape no tiene comisión adicional. Todos los pagos son procesados de forma segura por MercadoPago.
                </span>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="w-4 h-4" />
                <span>Pago seguro procesado por MercadoPago</span>
              </div>
            </div>
          )}

          {/* Yape Payment Form */}
          {step === 'yape-form' && (
            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  Instrucciones
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Abre tu app de <span className="font-semibold text-foreground">Yape</span></li>
                  <li>Genera tu código OTP (en Yape → Más opciones → Pagar en web)</li>
                  <li>Ingresa tu <span className="font-semibold text-foreground">número de celular</span> y el <span className="font-semibold text-foreground">código OTP</span> abajo</li>
                </ol>
              </div>

              {/* Yape form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="yape-phone" className="text-foreground font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Número de Celular (Yape)
                  </Label>
                  <Input
                    id="yape-phone"
                    type="tel"
                    placeholder="987654321"
                    maxLength={9}
                    value={yapePhone}
                    onChange={(e) => setYapePhone(e.target.value.replace(/\D/g, ''))}
                    className="bg-background border-border h-12 text-lg tracking-wider"
                    disabled={isYapeSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yape-otp" className="text-foreground font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Código OTP (6 dígitos)
                  </Label>
                  <Input
                    id="yape-otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={yapeOtp}
                    onChange={(e) => setYapeOtp(e.target.value.replace(/\D/g, ''))}
                    className="bg-background border-border h-12 text-lg tracking-[0.3em] text-center font-mono"
                    disabled={isYapeSubmitting}
                  />
                </div>
              </div>

              {/* Amount to pay */}
              <div className="border border-border rounded-xl p-4 flex justify-between items-center">
                <span className="text-muted-foreground">Monto a pagar:</span>
                <span className="font-serif text-2xl font-bold text-secondary">
                  {CURRENCY} {basePrice.toFixed(2)}
                </span>
              </div>

              {/* Important note */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200">Importante</p>
                    <p className="text-amber-700 dark:text-amber-300">
                      El código OTP es válido por un corto tiempo. Ingrésalo rápidamente después de generarlo en la app de Yape.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleYapePayment}
                disabled={yapePhone.length !== 9 || yapeOtp.length !== 6 || isYapeSubmitting}
                className="w-full bg-purple-500 hover:bg-purple-600 font-semibold py-6 text-lg text-white disabled:opacity-50"
              >
                {isYapeSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5 mr-2" />
                    Pagar {CURRENCY} {basePrice.toFixed(2)} con Yape
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Card Payment Form */}
          {step === 'card-form' && (
            <div className="p-6 space-y-5">
              {/* Amount */}
              <div className="bg-primary/5 p-4 rounded-xl flex justify-between items-center">
                <span className="text-foreground font-medium">Total con comisión:</span>
                <span className="font-serif text-2xl font-bold text-secondary">
                  {CURRENCY} {(basePrice * 1.05).toFixed(2)}
                </span>
              </div>

              {/* Card form fields */}
              <div className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="card-number" className="text-foreground font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    Número de Tarjeta
                  </Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="4509 9535 6623 3704"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '')
                      const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
                      setCardNumber(formatted)
                    }}
                    className="bg-background border-border h-12 tracking-wider font-mono"
                    disabled={isCardSubmitting}
                  />
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="exp-month" className="text-foreground text-sm font-semibold">Mes</Label>
                    <Input
                      id="exp-month"
                      type="text"
                      placeholder="12"
                      maxLength={2}
                      value={cardExpMonth}
                      onChange={(e) => setCardExpMonth(e.target.value.replace(/\D/g, ''))}
                      className="bg-background border-border h-12 text-center font-mono"
                      disabled={isCardSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-year" className="text-foreground text-sm font-semibold">Año</Label>
                    <Input
                      id="exp-year"
                      type="text"
                      placeholder="2030"
                      maxLength={4}
                      value={cardExpYear}
                      onChange={(e) => setCardExpYear(e.target.value.replace(/\D/g, ''))}
                      className="bg-background border-border h-12 text-center font-mono"
                      disabled={isCardSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-foreground text-sm font-semibold">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      value={cardSecurityCode}
                      onChange={(e) => setCardSecurityCode(e.target.value.replace(/\D/g, ''))}
                      className="bg-background border-border h-12 text-center font-mono"
                      disabled={isCardSubmitting}
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardholder-name" className="text-foreground text-sm font-semibold">
                    Nombre del titular
                  </Label>
                  <Input
                    id="cardholder-name"
                    type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    className="bg-background border-border h-12"
                    disabled={isCardSubmitting}
                  />
                </div>

                {/* DNI */}
                <div className="space-y-2">
                  <Label htmlFor="card-dni" className="text-foreground text-sm font-semibold">
                    DNI del titular
                  </Label>
                  <Input
                    id="card-dni"
                    type="text"
                    placeholder={formData.dni}
                    maxLength={8}
                    value={cardDocNumber}
                    onChange={(e) => setCardDocNumber(e.target.value.replace(/\D/g, ''))}
                    className="bg-background border-border h-12 font-mono"
                    disabled={isCardSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Si el titular es otro, ingresa su DNI. Si no, se usará tu DNI ({formData.dni}).
                  </p>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Tus datos son encriptados y procesados de forma segura por MercadoPago. No almacenamos información de tu tarjeta.</span>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleCardPayment}
                disabled={
                  cardNumber.replace(/\s/g, '').length < 13 ||
                  cardExpMonth.length < 1 ||
                  cardExpYear.length < 2 ||
                  cardSecurityCode.length < 3 ||
                  cardholderName.length < 3 ||
                  isCardSubmitting
                }
                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-6 text-lg text-white disabled:opacity-50"
              >
                {isCardSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando pago...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagar {CURRENCY} {(basePrice * 1.05).toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                {paymentMethod === 'card' && <CreditCard className="w-8 h-8 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {paymentMethod === 'yape' && <Smartphone className="w-8 h-8 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </div>
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium text-lg">
                  Procesando tu pago con {paymentMethod === 'yape' ? 'Yape' : 'Tarjeta'}...
                </p>
                <p className="text-sm text-muted-foreground">
                  Por favor no cierres esta ventana. Esto puede tomar unos segundos.
                </p>
              </div>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  No se pudo procesar el pago
                </h3>
                <p className="text-muted-foreground text-sm">
                  {errorMessage}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4"
                >
                  Intentar con otro método
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Success Step - Virtual Ticket */}
          {step === 'success' && (
            <div className="p-6 space-y-6">
              {/* Success icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-secondary" />
                </div>
              </div>

              {/* Success message */}
              <div className="text-center space-y-2">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  ¡Felicitaciones, {formData.full_name.split(' ')[0]}!
                </h3>
                <p className="text-muted-foreground">
                  Tu registro ha sido confirmado exitosamente
                </p>
              </div>

              {/* Virtual Ticket Card */}
              <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 text-primary-foreground">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider mb-1">
                        Círculo de Estudios Claude Bourgelat
                      </p>
                      <h4 className="font-serif text-lg font-bold">
                        II Simposio Veterinario
                      </h4>
                      <p className="text-sm text-primary-foreground/80">Internacional 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/70">ENTRADA</p>
                      <p className="text-2xl font-bold text-secondary">{CURRENCY}{basePrice.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <p className="text-primary-foreground/60 text-xs">PARTICIPANTE</p>
                      <p className="font-medium truncate">{formData.full_name}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs">DNI</p>
                      <p className="font-medium">{formData.dni}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs">FECHA</p>
                      <p className="font-medium">05-06 Junio, 2026</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs">TIPO</p>
                      <p className="font-medium">{getRoleLabel(formData.role)}</p>
                    </div>
                  </div>

                  {/* QR Section */}
                  <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">CÓDIGO DE TICKET</p>
                      <p className="font-mono text-xs text-primary break-all">
                        {ticketCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ticket footer */}
                <div className="bg-primary-foreground/10 px-6 py-3 flex items-center justify-between text-xs text-primary-foreground/70">
                  <span>Hotel Costa del Sol - El Golf, Trujillo</span>
                  <span>Presenta tu DNI y este código</span>
                </div>
              </div>

              {/* Confirmation email */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Revisa tu correo electrónico
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hemos enviado la confirmación y tu ticket digital a:
                    </p>
                    <p className="text-sm font-medium text-secondary mt-1">
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's included */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Tu registro incluye:</p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Acceso a todas las ponencias y paneles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Participación en talleres especializados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Coffee breaks y material digital
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    Certificado de participación
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyToClipboard(ticketCode)}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código
                    </>
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
