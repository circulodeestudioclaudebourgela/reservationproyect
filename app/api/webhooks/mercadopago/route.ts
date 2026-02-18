import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/mercadopago'
import { supabase } from '@/lib/supabase'
import { sendEmail, generatePaymentConfirmationEmail, generatePaymentRejectedEmail } from '@/lib/email'
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

    // Buscar el attendee por payment_order_id que contenga este paymentId
    const { data: attendees } = await supabase
      .from('attendees')
      .select()
      .or(`payment_order_id.like.%${paymentId}%`)

    if (!attendees || attendees.length === 0) {
      console.log('[Webhook MP] No attendee found for payment:', paymentId)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const attendee = attendees[0]
    const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
    const amount = new Date() < EARLY_BIRD_DEADLINE ? 2.00 : 2.00  // TEMPORAL: Precio de prueba producción

    // Manejar pago aprobado
    if (paymentResult.status === 'approved') {
      // Solo actualizar si aún no está pagado
      if (attendee.status !== 'paid') {
        const { error: updateError } = await supabase
          .from('attendees')
          .update({ status: 'paid' })
          .eq('id', attendee.id)

        if (updateError) {
          console.error('[Webhook MP] DB update error:', updateError)
        } else {
          console.log('[Webhook MP] ✓ Attendee marked as paid:', attendee.id)

          // Enviar email de confirmación
          try {
            console.log('[Webhook MP] Preparing confirmation email for:', attendee.email)
            
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

            const emailResult = await sendEmail(
              attendee.email,
              '✓ Tu registro al II Simposio Veterinario está confirmado',
              emailHtml
            )

            if (emailResult.success) {
              console.log('[Webhook MP] ✓ Confirmation email sent successfully:', {
                email: attendee.email,
                ticket: attendee.ticket_code,
              })
            } else {
              console.error('[Webhook MP] ✗ Email send failed:', {
                email: attendee.email,
                error: emailResult.error,
                ticket: attendee.ticket_code,
              })
            }
          } catch (emailError) {
            console.error('[Webhook MP] Email exception:', {
              email: attendee.email,
              error: emailError instanceof Error ? emailError.message : String(emailError),
              stack: emailError instanceof Error ? emailError.stack : undefined,
            })
            // No fallar el webhook por error de email
          }
        }
      } else {
        console.log('[Webhook MP] → Attendee already paid, skipping:', attendee.id)
      }
    }
    
    // Manejar pago rechazado
    else if (paymentResult.status === 'rejected' || paymentResult.status === 'cancelled') {
      console.log('[Webhook MP] ✗ Payment rejected/cancelled:', {
        paymentId,
        status: paymentResult.status,
        statusDetail: paymentResult.statusDetail,
      })

      // Enviar email de pago rechazado (solo si no está pagado)
      if (attendee.status !== 'paid') {
        try {
          console.log('[Webhook MP] Preparing rejection email for:', attendee.email)
          
          const errorReasons: Record<string, string> = {
            cc_rejected_insufficient_amount: 'Fondos insuficientes en tu tarjeta',
            cc_rejected_call_for_authorize: 'Tu banco requiere autorización del pago',
            cc_rejected_bad_filled_security_code: 'Código de seguridad incorrecto',
            cc_rejected_other_reason: 'Tu pago fue rechazado por el banco',
            cc_rejected_duplicated_payment: 'Ya existe un pago duplicado',
          }

          const reason = errorReasons[paymentResult.statusDetail || ''] || 
                        'No se pudo procesar tu pago. Intenta con otro método.'

          const emailHtml = generatePaymentRejectedEmail(
            {
              fullName: attendee.full_name,
              email: attendee.email,
              dni: attendee.dni,
              phone: attendee.phone,
              role: attendee.role,
              organization: attendee.organization || undefined,
              ticketCode: attendee.ticket_code,
              amount,
            },
            reason
          )

          const emailResult = await sendEmail(
            attendee.email,
            'Problema con tu pago - II Simposio Veterinario',
            emailHtml
          )

          if (emailResult.success) {
            console.log('[Webhook MP] ✓ Rejection email sent successfully:', {
              email: attendee.email,
              reason,
              statusDetail: paymentResult.statusDetail,
            })
          } else {
            console.error('[Webhook MP] ✗ Rejection email failed:', {
              email: attendee.email,
              error: emailResult.error,
              reason,
            })
          }
        } catch (emailError) {
          console.error('[Webhook MP] Rejection email exception:', {
            email: attendee.email,
            error: emailError instanceof Error ? emailError.message : String(emailError),
            stack: emailError instanceof Error ? emailError.stack : undefined,
          })
        }
      }
    }
    
    // Manejar pago pendiente
    else if (paymentResult.status === 'pending' || paymentResult.status === 'in_process') {
      console.log('[Webhook MP] ⏳ Payment pending:', {
        paymentId,
        statusDetail: paymentResult.statusDetail,
      })
      // No enviar email para pagos pendientes por webhook
      // Ya se envió desde el frontend si corresponde
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
