'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  Info
} from 'lucide-react'
import type { RegistrationForm } from '@/lib/validations'

interface CheckoutModalProps {
  formData: RegistrationForm | null
  onClose: () => void
}

type PaymentMethod = 'card' | 'yape' | 'plin' | 'paypal' | null
type CheckoutStep = 'summary' | 'payment-select' | 'yape-plin' | 'processing' | 'pending' | 'success' | 'error'

const CURRENCY = 'S/'
const EARLY_BIRD_PRICE = 250.00  // Precio hasta abril 2026
const REGULAR_PRICE = 350.00    // Precio después de abril 2026
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')

// Comisiones de transacción
const FEES = {
  card: 0.05,        // POS: 5%
  paypal: 0.055,     // PayPal: 5.5%
  paypalFixed: 0.50, // PayPal: + $0.50 (en USD, ~S/2 aprox)
  yape: 0,           // Yape: sin comisión
  plin: 0,           // Plin: sin comisión
}

// Función para calcular el precio base según fecha
const getBasePrice = () => {
  const now = new Date()
  return now < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

// Función para calcular comisión según método de pago
const calculateFee = (basePrice: number, method: PaymentMethod) => {
  if (!method || method === 'yape' || method === 'plin') return 0
  if (method === 'card') return basePrice * FEES.card
  if (method === 'paypal') return (basePrice * FEES.paypal) + (FEES.paypalFixed * 3.8) // ~S/1.90
  return 0
}

// Configuración de Yape/Plin (actualizar con datos reales)
const YAPE_PLIN_CONFIG = {
  phone: '999888777', // Número para recibir pagos
  holder: 'Círculo de Estudios Claude Bourgelat',
}

export default function CheckoutModal({ formData, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('summary')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [ticketCode, setTicketCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Calcular precios dinámicamente
  const basePrice = useMemo(() => getBasePrice(), [])
  const isEarlyBird = useMemo(() => new Date() < EARLY_BIRD_DEADLINE, [])
  const fee = useMemo(() => calculateFee(basePrice, paymentMethod), [basePrice, paymentMethod])
  const totalPrice = useMemo(() => basePrice + fee, [basePrice, fee])

  // Handler para Openpay (tarjetas)
  const handleCardPayment = async () => {
    setPaymentMethod('card')
    setStep('processing')
    setErrorMessage('')
    
    try {
      // TODO: Integrar Openpay SDK real
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        const code = crypto.randomUUID()
        setTicketCode(code)
        console.log('[Simposio] Card payment successful - Ticket:', code)
        setStep('success')
      } else {
        throw new Error('El pago fue rechazado. Verifica los datos de tu tarjeta.')
      }
    } catch (error) {
      console.error('[Simposio] Card payment error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar el pago')
      setStep('error')
    }
  }

  // Handler para PayPal
  const handlePayPalPayment = async () => {
    setPaymentMethod('paypal')
    setStep('processing')
    setErrorMessage('')
    
    try {
      // TODO: Integrar PayPal SDK real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        const code = crypto.randomUUID()
        setTicketCode(code)
        console.log('[Simposio] PayPal payment successful - Ticket:', code)
        setStep('success')
      } else {
        throw new Error('El pago con PayPal fue cancelado o rechazado.')
      }
    } catch (error) {
      console.error('[Simposio] PayPal payment error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar el pago')
      setStep('error')
    }
  }

  // Handler para Yape/Plin
  const handleYapePlinSelect = (method: 'yape' | 'plin') => {
    setPaymentMethod(method)
    setStep('yape-plin')
  }

  // Confirmar que realizó el pago Yape/Plin
  const handleYapePlinConfirm = async () => {
    setStep('processing')
    
    try {
      // Registrar como pendiente de verificación
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const code = crypto.randomUUID()
      setTicketCode(code)
      console.log('[Simposio] Yape/Plin pending verification - Ticket:', code)
      setStep('pending')
    } catch (error) {
      console.error('[Simposio] Registration error:', error)
      setErrorMessage('Error al registrar. Por favor intenta nuevamente.')
      setStep('error')
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
    else if (step === 'yape-plin') setStep('payment-select')
    else setStep('summary')
  }

  if (!formData) return null

  const getRoleLabel = (role: string) => {
    return role === 'professional' ? 'Profesional Veterinario' : 'Estudiante'
  }

  const getStepTitle = () => {
    switch (step) {
      case 'success': return '¡Registro Exitoso!'
      case 'pending': return 'Pago Pendiente de Verificación'
      case 'error': return 'Error en el Pago'
      case 'processing': return 'Procesando...'
      case 'payment-select': return 'Selecciona Método de Pago'
      case 'yape-plin': return `Pagar con ${paymentMethod === 'yape' ? 'Yape' : 'Plin'}`
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
              {(step === 'payment-select' || step === 'yape-plin') && (
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
                {/* Yape - Sin comisión */}
                <button
                  onClick={() => handleYapePlinSelect('yape')}
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

                {/* Plin - Sin comisión */}
                <button
                  onClick={() => handleYapePlinSelect('plin')}
                  className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      Plin
                    </p>
                    <p className="text-sm text-muted-foreground">Sin comisión • {CURRENCY} {basePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Sin fee</span>
                  </div>
                </button>

                {/* Tarjeta/Openpay - Comisión 5% */}
                <button
                  onClick={handleCardPayment}
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

                {/* PayPal - Comisión 5.5% + $0.50 */}
                <button
                  onClick={handlePayPalPayment}
                  className="w-full p-4 border border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#003087] to-[#009cde] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PP</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      PayPal
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +5.5% + $0.50 • Total: {CURRENCY} {(basePrice * 1.055 + 1.90).toFixed(2)}
                    </p>
                  </div>
                </button>
              </div>

              {/* Fee explanation */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Las comisiones de tarjeta y PayPal corresponden a los costos de procesamiento de pagos.
                  Yape y Plin no tienen comisión adicional.
                </span>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="w-4 h-4" />
                <span>Todos los pagos son seguros y encriptados</span>
              </div>
            </div>
          )}

          {/* Yape/Plin Payment Step */}
          {step === 'yape-plin' && (
            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  Instrucciones de pago
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Abre tu app de {paymentMethod === 'yape' ? 'Yape' : 'Plin'}</li>
                  <li>Envía <span className="font-bold text-foreground">{CURRENCY} {basePrice.toFixed(2)}</span> al siguiente número</li>
                  <li>Agrega tu DNI ({formData.dni}) en el mensaje/descripción</li>
                  <li>Confirma el pago abajo</li>
                </ol>
              </div>

              {/* Payment details card */}
              <div className={`p-6 rounded-xl text-white ${paymentMethod === 'yape' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-teal-400 to-teal-500'}`}>
                {/* QR Code placeholder */}
                <div className="bg-white rounded-xl p-4 mb-4 mx-auto w-fit">
                  <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-primary" />
                  </div>
                </div>

                {/* Phone number */}
                <div className="text-center space-y-2">
                  <p className="text-white/80 text-sm">Número de celular</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold tracking-wider">{YAPE_PLIN_CONFIG.phone}</span>
                    <button
                      onClick={() => copyToClipboard(YAPE_PLIN_CONFIG.phone)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Copiar número"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-white/80">¡Copiado!</p>
                  )}
                  <p className="text-white/70 text-sm">{YAPE_PLIN_CONFIG.holder}</p>
                </div>
              </div>

              {/* Amount to pay */}
              <div className="border border-border rounded-xl p-4 flex justify-between items-center">
                <span className="text-muted-foreground">Monto exacto:</span>
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
                      Tu inscripción quedará pendiente hasta verificar el pago (máximo 24 horas).
                      Recibirás un correo de confirmación.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm button */}
              <Button
                onClick={handleYapePlinConfirm}
                className={`w-full font-semibold py-6 text-lg text-white ${paymentMethod === 'yape' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-teal-500 hover:bg-teal-600'}`}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Ya realicé el pago
              </Button>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                {paymentMethod === 'card' && <CreditCard className="w-8 h-8 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {(paymentMethod === 'yape' || paymentMethod === 'plin') && <Smartphone className="w-8 h-8 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {paymentMethod === 'paypal' && <span className="text-secondary font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">PP</span>}
              </div>
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium text-lg">
                  {(paymentMethod === 'yape' || paymentMethod === 'plin') 
                    ? 'Registrando tu inscripción...' 
                    : 'Procesando tu pago...'}
                </p>
                <p className="text-sm text-muted-foreground">Por favor no cierres esta ventana</p>
              </div>
            </div>
          )}

          {/* Pending Step (for Yape/Plin) */}
          {step === 'pending' && (
            <div className="p-6 space-y-6">
              {/* Pending icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
              </div>

              {/* Message */}
              <div className="text-center space-y-2">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  ¡Tu inscripción está en proceso!
                </h3>
                <p className="text-muted-foreground">
                  Verificaremos tu pago en las próximas 24 horas.
                </p>
              </div>

              {/* Ticket code */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Código de registro</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-foreground truncate pr-2">{ticketCode}</p>
                  <button
                    onClick={() => copyToClipboard(ticketCode)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* What to expect */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">¿Qué sigue?</p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    Verificaremos tu pago por {paymentMethod === 'yape' ? 'Yape' : 'Plin'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    Recibirás un correo de confirmación a <span className="font-medium text-foreground">{formData.email}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    Tu ticket digital será enviado por email
                  </li>
                </ul>
              </div>

              {/* Contact info */}
              <div className="bg-primary/5 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">¿Tienes dudas?</p>
                    <p className="text-muted-foreground">
                      Contáctanos a <span className="text-secondary">circulodeestudiosclaudebourgela@gmail.com</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4"
              >
                Entendido
              </Button>
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
                  onClick={() => {/* Download ticket logic */}}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
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
