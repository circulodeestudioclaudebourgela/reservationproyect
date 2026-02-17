'use server'

import { createYapePayment, createCardPayment, getPaymentStatus } from '@/lib/mercadopago'
import { supabase, type Attendee } from '@/lib/supabase'
import { sendEmail, generatePaymentConfirmationEmail } from '@/lib/email'

// ============================================
// Tipos
// ============================================

export type PaymentResult =
  | { success: true; data: Attendee; paymentId: string }
  | { success: false; error: string; statusDetail?: string }

// ============================================
// Procesar pago con Yape via MercadoPago
// ============================================

export async function processYapePayment(
  attendeeId: string,
  token: string,
  amount: number,
  payerEmail: string
): Promise<PaymentResult> {
  try {
    const idempotencyKey = `yape_${attendeeId}_${Date.now()}`

    const result = await createYapePayment({
      token,
      transactionAmount: amount,
      description: 'II Simposio Veterinario Internacional 2026 - Entrada',
      payerEmail,
      idempotencyKey,
    })

    if (!result.success) {
      return {
        success: false,
        error: getPaymentErrorMessage(result.statusDetail || result.error || ''),
        statusDetail: result.statusDetail,
      }
    }

    // Actualizar BD con pago aprobado
    const { data, error } = await supabase
      .from('attendees')
      .update({
        status: 'paid',
        payment_order_id: `mp_yape_${result.paymentId}`,
        payment_method: 'yape',
      })
      .eq('id', attendeeId)
      .select()
      .single()

    if (error) {
      console.error('[Payment] DB update error:', error)
      return { success: false, error: 'Pago exitoso pero error al actualizar registro. Contacta al organizador.' }
    }

    const attendee = data as Attendee

    // Enviar email de confirmación (no bloquear el flujo)
    sendConfirmationEmail(attendee, amount).catch(err => {
      console.error('[Payment] Email send error:', err)
    })

    return {
      success: true,
      data: attendee,
      paymentId: result.paymentId!,
    }
  } catch (error) {
    console.error('[Payment] Yape processing error:', error)
    return { success: false, error: 'Error interno al procesar el pago' }
  }
}

// ============================================
// Procesar pago con Tarjeta via MercadoPago
// ============================================

export async function processCardPayment(
  attendeeId: string,
  token: string,
  amount: number,
  payerEmail: string,
  installments: number,
  paymentMethodId: string
): Promise<PaymentResult> {
  try {
    const idempotencyKey = `card_${attendeeId}_${Date.now()}`

    const result = await createCardPayment({
      token,
      transactionAmount: amount,
      description: 'II Simposio Veterinario Internacional 2026 - Entrada',
      payerEmail,
      installments,
      paymentMethodId,
      idempotencyKey,
    })

    if (!result.success) {
      return {
        success: false,
        error: getPaymentErrorMessage(result.statusDetail || result.error || ''),
        statusDetail: result.statusDetail,
      }
    }

    // Actualizar BD con pago aprobado
    const { data, error } = await supabase
      .from('attendees')
      .update({
        status: 'paid',
        payment_order_id: `mp_card_${result.paymentId}`,
        payment_method: 'card',
      })
      .eq('id', attendeeId)
      .select()
      .single()

    if (error) {
      console.error('[Payment] DB update error:', error)
      return { success: false, error: 'Pago exitoso pero error al actualizar registro. Contacta al organizador.' }
    }

    const attendee = data as Attendee

    // Enviar email de confirmación (no bloquear el flujo)
    sendConfirmationEmail(attendee, amount).catch(err => {
      console.error('[Payment] Email send error:', err)
    })

    return {
      success: true,
      data: attendee,
      paymentId: result.paymentId!,
    }
  } catch (error) {
    console.error('[Payment] Card processing error:', error)
    return { success: false, error: 'Error interno al procesar el pago' }
  }
}

// ============================================
// Verificar estado de pago
// ============================================

export async function verifyPaymentStatus(paymentId: string): Promise<{
  success: boolean
  status?: string
  statusDetail?: string
  error?: string
}> {
  try {
    const result = await getPaymentStatus(paymentId)
    return {
      success: result.success,
      status: result.status,
      statusDetail: result.statusDetail,
      error: result.error,
    }
  } catch (error) {
    console.error('[Payment] Verify error:', error)
    return { success: false, error: 'Error al verificar el estado del pago' }
  }
}

// ============================================
// Helpers
// ============================================

async function sendConfirmationEmail(attendee: Attendee, amount: number) {
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

  console.log('[Payment] Confirmation email sent to:', attendee.email)
}

function getPaymentErrorMessage(statusDetail: string): string {
  const errorMessages: Record<string, string> = {
    cc_rejected_call_for_authorize: 'Debes autorizar el pago con tu banco.',
    cc_rejected_insufficient_amount: 'Fondos insuficientes. Intenta con otro método de pago.',
    cc_rejected_other_reason: 'Tu pago fue rechazado. Intenta con otro método.',
    cc_rejected_card_type_not_allowed: 'Tipo de tarjeta no permitido para este pago.',
    cc_rejected_max_attempts: 'Llegaste al límite de intentos. Usa otra tarjeta.',
    cc_rejected_bad_filled_security_code: 'Código de seguridad incorrecto.',
    cc_rejected_form_error: 'Error en los datos de la tarjeta. Verifica e intenta de nuevo.',
    cc_rejected_bad_filled_date: 'Fecha de vencimiento incorrecta.',
    cc_rejected_bad_filled_other: 'Error en los datos de la tarjeta.',
    cc_rejected_blacklist: 'No se pudo procesar con esta tarjeta. Usa otra.',
    cc_rejected_duplicated_payment: 'Ya realizaste un pago por este monto. Si necesitas volver a pagar, usa otra tarjeta u otro método.',
    pending_contingency: 'Estamos procesando el pago. En menos de 2 días te informaremos por e-mail si se acreditó.',
  }

  return errorMessages[statusDetail] || 'No se pudo procesar el pago. Por favor intenta nuevamente.'
}
