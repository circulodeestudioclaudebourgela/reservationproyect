'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Download, 
  QrCode, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Building2,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  Copy
} from 'lucide-react'
import type { Attendee } from '@/lib/supabase'

// Precios dinámicos
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')

// Calcular precio actual
const getCurrentPrice = () => {
  return new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

interface AttendeeDetailsModalProps {
  attendee: Attendee
  isOpen: boolean
  onClose: () => void
}

export default function AttendeeDetailsModal({
  attendee,
  isOpen,
  onClose,
}: AttendeeDetailsModalProps) {
  if (!isOpen) return null

  const ticketPrice = getCurrentPrice()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRoleLabel = (role: string) => {
    return role === 'professional' ? 'Profesional Veterinario' : 'Estudiante'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="rounded-2xl bg-card border border-border shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Detalles del Participante
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                  attendee.status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {attendee.status === 'paid' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmado</>
                  ) : (
                    <><Clock className="w-3 h-3 mr-1" /> Pendiente</>
                  )}
                </span>
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                Información Personal
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Nombre Completo
                  </p>
                  <p className="font-medium text-foreground">{attendee.full_name}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> DNI
                  </p>
                  <p className="font-medium text-foreground font-mono">{attendee.dni}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Correo Electrónico
                  </p>
                  <p className="font-medium text-foreground break-all text-sm">{attendee.email}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Teléfono
                  </p>
                  <p className="font-medium text-foreground font-mono">{attendee.phone}</p>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                Información de Registro
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Participante</p>
                  <p className="font-medium text-foreground">{getRoleLabel(attendee.role)}</p>
                </div>
                {attendee.organization && (
                  <div className="bg-muted/50 p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Institución
                    </p>
                    <p className="font-medium text-foreground">{attendee.organization}</p>
                  </div>
                )}
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha de Registro
                  </p>
                  <p className="font-medium text-foreground text-sm">{formatDate(attendee.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Payment Info - Only for paid attendees */}
            {attendee.status === 'paid' && (
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Información de Pago
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-700/70 mb-1">Monto Pagado</p>
                    <p className="font-serif text-2xl font-bold text-green-700">
                      S/ {ticketPrice.toFixed(2)}
                    </p>
                  </div>
                  {attendee.culqi_order_id && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-green-700/70 mb-1">ID de Orden</p>
                      <p className="font-mono text-sm font-semibold text-green-700 break-all">
                        {attendee.culqi_order_id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ticket Code / QR Section */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-secondary" />
                Código de Ticket
              </h3>
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-muted-foreground">TICKET CODE (UUID)</p>
                  <button
                    onClick={() => copyToClipboard(attendee.ticket_code)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Copiar código"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-sm font-medium text-primary break-all bg-white p-3 rounded-lg border">
                  {attendee.ticket_code}
                </p>
                
                {/* QR Code placeholder */}
                <div className="mt-4 bg-white p-4 rounded-lg flex items-center justify-center border">
                  <div className="text-center">
                    <QrCode className="w-24 h-24 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Código QR para check-in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {/* Download receipt logic */}}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Recibo
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
