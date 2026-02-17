import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/mercadopago'
import { supabase } from '@/lib/supabase'
import { sendEmail, generatePaymentConfirmationEmail } from '@/lib/email'
import crypto from 'crypto'

// ============================================
// Webhook de MercadoPago
// Recibe notificaciones IPN de pagos
// Configurar en: https://www.mercadopago.com.pe/developers/panel/app
// URL: https://tu-dominio.com/api/webhooks/mercadopago
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[Webhook MP] Received:', JSON.stringify(body, null, 2))

    // Validar que sea una notificación de pago
    if (body.type !== 'payment' && body.action !== 'payment.updated' && body.action !== 'payment.created') {
      console.log('[Webhook MP] Ignoring non-payment notification:', body.type || body.action)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Obtener el ID del pago
    const paymentId = body.data?.id?.toString()
    if (!paymentId) {
      console.error('[Webhook MP] No payment ID in notification')
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
    }

    // Verificar la firma del webhook (si está configurada)
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    
    if (xSignature && process.env.MERCADOPAGO_WEBHOOK_SECRET) {
      const isValid = validateWebhookSignature(
        xSignature,
        xRequestId || '',
        paymentId,
        process.env.MERCADOPAGO_WEBHOOK_SECRET
      )
      
      if (!isValid) {
        console.error('[Webhook MP] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    // Consultar estado del pago en MP
    const paymentResult = await getPaymentStatus(paymentId)

    console.log('[Webhook MP] Payment status:', {
      paymentId,
      status: paymentResult.status,
      statusDetail: paymentResult.statusDetail,
    })

    if (paymentResult.status === 'approved') {
      // Buscar el attendee por payment_order_id que contenga este paymentId
      const { data: attendees } = await supabase
        .from('attendees')
        .select()
        .or(`payment_order_id.like.%${paymentId}%`)

      if (attendees && attendees.length > 0) {
        const attendee = attendees[0]

        // Solo actualizar si aún no está pagado
        if (attendee.status !== 'paid') {
          const { error: updateError } = await supabase
            .from('attendees')
            .update({ status: 'paid' })
            .eq('id', attendee.id)

          if (updateError) {
            console.error('[Webhook MP] DB update error:', updateError)
          } else {
            console.log('[Webhook MP] Attendee marked as paid:', attendee.id)

            // Enviar email de confirmación
            try {
              const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
              const amount = new Date() < EARLY_BIRD_DEADLINE ? 250.00 : 350.00

              const emailHtml = generatePaymentConfirmationEmail({
                fullName: attendee.full_name,
                email: attendee.email,
                dni: attendee.dni,
                phone: attendee.phone,
                role: attendee.role,
                organization: attendee.organization || undefined,
                ticketCode: attendee.ticket_code,
                amount,
              })

              await sendEmail(
                attendee.email,
                '✅ ¡Tu registro al II Simposio Veterinario está confirmado!',
                emailHtml
              )

              console.log('[Webhook MP] Confirmation email sent to:', attendee.email)
            } catch (emailError) {
              console.error('[Webhook MP] Email error:', emailError)
              // No fallar el webhook por error de email
            }
          }
        } else {
          console.log('[Webhook MP] Attendee already paid:', attendee.id)
        }
      } else {
        console.log('[Webhook MP] No attendee found for payment:', paymentId)
      }
    }

    // Siempre responder 200 para evitar reintentos
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Webhook MP] Error:', error)
    // Responder 200 incluso en error para evitar reintentos infinitos
    return NextResponse.json({ received: true, error: 'Internal error' }, { status: 200 })
  }
}

// GET para verificar que el endpoint está activo
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    service: 'MercadoPago Webhook',
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// Validar firma del webhook
// ============================================

function validateWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string,
  secret: string
): boolean {
  try {
    // Parse x-signature header
    const parts = xSignature.split(',')
    let ts = ''
    let hash = ''

    for (const part of parts) {
      const [key, value] = part.trim().split('=')
      if (key === 'ts') ts = value
      if (key === 'v1') hash = value
    }

    if (!ts || !hash) return false

    // Build the manifest string
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
    
    // Calculate HMAC
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)
    const calculatedHash = hmac.digest('hex')

    return calculatedHash === hash
  } catch (error) {
    console.error('[Webhook MP] Signature validation error:', error)
    return false
  }
}
