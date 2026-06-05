'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
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
  Copy,
  DoorOpen
} from 'lucide-react'
import type { Attendee } from '@/lib/supabase'

// Precios dinámicos
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-04-20T23:59:59')

// Calcular precio actual
const getCurrentPrice = () => {
  return new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

// Escapa texto para insertarlo seguro en el HTML del comprobante
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

// Genera el HTML autocontenido del comprobante (para imprimir / guardar como PDF)
function buildReceiptHtml(a: Attendee, amount: number, qrDataUrl: string): string {
  const roleLabel = a.role === 'professional' ? 'Profesional Veterinario' : 'Estudiante'
  const statusLabel = a.status === 'paid' ? 'PAGADO' : 'PENDIENTE'
  const statusColor = a.status === 'paid' ? '#16a34a' : '#d97706'
  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">${label}</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${value}</td></tr>`

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Comprobante - ${esc(a.full_name)}</title>
<style>
  @media print { @page { margin: 16mm; } }
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;margin:0;padding:24px;background:#fff;}
  .card{max-width:640px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;}
  .head{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:28px 24px;}
  .head h1{margin:0;font-size:20px;}
  .head p{margin:4px 0 0;font-size:13px;color:rgba(255,255,255,.9);}
  .body{padding:24px;}
  table{width:100%;border-collapse:collapse;}
  .badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:${statusColor};}
  .code{margin-top:20px;border:2px dashed #cbd5e1;border-radius:8px;padding:16px;text-align:center;}
  .code small{display:block;color:#64748b;font-size:11px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;}
  .code b{font-family:'Courier New',monospace;font-size:15px;color:#1e40af;word-break:break-all;letter-spacing:1px;}
  .amount{margin-top:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;}
  .amount span{color:#166534;font-size:13px;}
  .amount b{color:#15803d;font-size:24px;}
  .foot{padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;text-align:center;}
</style></head>
<body>
  <div class="card">
    <div class="head">
      <h1>Comprobante de Registro</h1>
      <p>II Simposio Veterinario Internacional 2026 · Círculo de Estudios Claude Bourgelat</p>
    </div>
    <div class="body">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:12px;">
        <h2 style="margin:0;font-size:18px;">${esc(a.full_name)}</h2>
        <span class="badge">${statusLabel}</span>
      </div>
      <table>
        ${row('DNI', esc(a.dni))}
        ${row('Correo', esc(a.email))}
        ${row('Teléfono', esc(a.phone))}
        ${row('Categoría', roleLabel)}
        ${a.organization ? row('Institución', esc(a.organization)) : ''}
        ${a.is_scholarship ? row('Beca', 'Sí') : ''}
        ${row('Fecha de registro', fmt(a.created_at))}
        ${a.checked_in ? row('Ingreso al evento', fmt(a.checked_in_at)) : ''}
      </table>
      <div class="amount">
        <span>${a.status === 'paid' ? 'Monto pagado' : 'Monto a pagar'}</span>
        <b>S/ ${amount.toFixed(2)}</b>
      </div>
      <div class="code">
        <small>Código de Ticket</small>
        <b>${esc(a.ticket_code)}</b>
        ${qrDataUrl ? `<div style="margin-top:14px;"><img src="${qrDataUrl}" alt="Código QR" width="150" height="150" style="display:block;margin:0 auto;"/></div>` : ''}
      </div>
      <p style="margin-top:20px;font-size:13px;color:#475569;">
        Presenta este comprobante junto con tu DNI el día del evento (05 y 06 de Junio, 2026).
        Hotel Costa del Sol — Av. Los Cocoteros 505, El Golf, Trujillo.
      </p>
    </div>
    <div class="foot">© ${new Date().getFullYear()} Círculo de Estudios Claude Bourgelat · circulodeestudiosclaudebourgela@gmail.com</div>
  </div>
</body></html>`
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
  const [qrDataUrl, setQrDataUrl] = useState('')

  // Genera un QR escaneable real con el código de ticket
  useEffect(() => {
    let active = true
    QRCode.toDataURL(attendee.ticket_code, { width: 240, margin: 1 })
      .then((url) => { if (active) setQrDataUrl(url) })
      .catch(() => { if (active) setQrDataUrl('') })
    return () => { active = false }
  }, [attendee.ticket_code])

  if (!isOpen) return null

  const ticketPrice = getCurrentPrice()
  // Monto real que pagó/debe esta persona (respeta precio personalizado / beca)
  const paidAmount = attendee.custom_price ?? ticketPrice

  const handleDownloadReceipt = () => {
    const html = buildReceiptHtml(attendee, paidAmount, qrDataUrl)
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)
    const doc = iframe.contentWindow?.document
    if (!doc) {
      document.body.removeChild(iframe)
      return
    }
    doc.open()
    doc.write(html)
    doc.close()
    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }
    const win = iframe.contentWindow
    if (win) win.onafterprint = cleanup
    // Pequeña espera para que el iframe renderice antes de imprimir
    setTimeout(() => {
      win?.focus()
      win?.print()
      // Respaldo por si onafterprint no dispara
      setTimeout(cleanup, 60000)
    }, 250)
  }

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
                {attendee.checked_in && (
                  <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <DoorOpen className="w-3 h-3 mr-1" />
                    Ingresó{attendee.checked_in_at ? ` · ${formatDate(attendee.checked_in_at)}` : ''}
                  </span>
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
                      S/ {paidAmount.toFixed(2)}
                    </p>
                    {attendee.is_scholarship && (
                      <p className="text-xs text-green-700/70 mt-1">
                        Beca · precio base S/ {ticketPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {attendee.payment_order_id && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-green-700/70 mb-1">ID de Transacción</p>
                      <p className="font-mono text-sm font-semibold text-green-700 break-all">
                        {attendee.payment_order_id}
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
                
                {/* QR Code real (codifica el ticket_code) */}
                <div className="mt-4 bg-white p-4 rounded-lg flex items-center justify-center border">
                  <div className="text-center">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="Código QR del ticket"
                        className="w-40 h-40 mx-auto mb-2"
                      />
                    ) : (
                      <div className="w-40 h-40 mx-auto mb-2 flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-muted-foreground/40 animate-pulse" />
                      </div>
                    )}
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
                onClick={handleDownloadReceipt}
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
