'use server'

import { createYapePayment, createCardPayment, getPaymentStatus } from '@/lib/mercadopago'
import { supabase, type Attendee } from '@/lib/supabase'
import { sendEmail, generatePaymentConfirmationEmail, generatePaymentRejectedEmail } from '@/lib/email'

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
    // Validar precio actual vs precio enviado
    // Para Yape no hay comisión, se paga el precio base
    const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
    const basePrice = new Date() < EARLY_BIRD_DEADLINE ? 2.00 : 2.00  // TEMPORAL: Precio de prueba producción
    
    if (Math.abs(amount - basePrice) > 0.01) {
      return {
        success: false,
        error: `El precio cambió a S/ ${basePrice.toFixed(2)}. Por favor actualiza la página e intenta nuevamente.`
      }
    }
    
    const idempotencyKey = `yape_${attendeeId}_${Date.now()}`

    const result = await createYapePayment({
      token,
      transactionAmount: amount,
      description: 'II Simposio Veterinario Internacional 2026 - Entrada',
      payerEmail,
      idempotencyKey,
    })

    if (!result.success) {
      // Intento de obtener datos del attendee para enviar email de rechazo
      const { data: attendeeData } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', attendeeId)
        .single()
      
      if (attendeeData) {
        const attendee = attendeeData as Attendee
        const errorMsg = getPaymentErrorMessage(result.statusDetail || result.error || '')
        
        // Enviar email de pago rechazado con timeout de 10s
        await sendEmailWithTimeout(
          () => sendPaymentRejectionEmail(attendee, amount, errorMsg),
          10000
        )
      }
      
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

    // Enviar email de confirmación con timeout de 10s
    await sendEmailWithTimeout(
      () => sendConfirmationEmail(attendee, amount, 'yape'),
      10000
    )

    console.log('[Payment] Yape payment successful - Ticket:', attendee.ticket_code)

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
  paymentMethodId: string,
  issuerId: string
): Promise<PaymentResult> {
  try {
    // Validar precio actual vs precio enviado
    // Para tarjeta se cobra el precio base + 5% de comisión
    const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
    const basePrice = new Date() < EARLY_BIRD_DEADLINE ? 2.00 : 2.00  // TEMPORAL: Precio de prueba producción
    const expectedAmount = basePrice * 1.05  // Precio base + 5% comisión
    
    if (Math.abs(amount - expectedAmount) > 0.01) {
      return {
        success: false,
        error: `El precio cambió a S/ ${basePrice.toFixed(2)} (+ 5% comisión = S/ ${expectedAmount.toFixed(2)}). Por favor actualiza la página e intenta nuevamente.`
      }
    }
    
    const idempotencyKey = `card_${attendeeId}_${Date.now()}`

    const result = await createCardPayment({
      token,
      transactionAmount: amount,
      description: 'II Simposio Veterinario Internacional 2026 - Entrada',
      payerEmail,
      installments,
      paymentMethodId,
      issuerId,
      idempotencyKey,
    })

    if (!result.success) {
      // Intento de obtener datos del attendee para enviar email de rechazo
      const { data: attendeeData } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', attendeeId)
        .single()
      
      if (attendeeData) {
        const attendee = attendeeData as Attendee
        const errorMsg = getPaymentErrorMessage(result.statusDetail || result.error || '')
        
        // Enviar email de pago rechazado con timeout de 10s
        await sendEmailWithTimeout(
          () => sendPaymentRejectionEmail(attendee, amount, errorMsg),
          10000
        )
      }
      
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

    // Enviar email de confirmación con timeout de 10s
    await sendEmailWithTimeout(
      () => sendConfirmationEmail(attendee, amount, 'tarjeta'),
      10000
    )

    console.log('[Payment] Card payment successful - Ticket:', attendee.ticket_code)

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
// Funciones auxiliares de email
// ============================================

// Helper para esperar email con timeout
async function sendEmailWithTimeout<T>(
  emailFn: () => Promise<T>,
  timeoutMs: number = 10000
): Promise<T | null> {
  try {
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.log('[Email] Timeout reached, continuing without waiting')
        resolve(null)
      }, timeoutMs)
    })

    return await Promise.race([emailFn(), timeoutPromise])
  } catch (error) {
    console.error('[Email] sendEmailWithTimeout error:', error)
    return null
  }
}

async function sendConfirmationEmail(attendee: Attendee, amount: number, paymentMethod: string) {
  try {
    console.log('[Payment] Preparing confirmation email for:', attendee.email)
    
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

    const result = await sendEmail(
      attendee.email,
      '✓ Tu registro al II Simposio Veterinario está confirmado',
      emailHtml
    )

    if (result.success) {
      console.log('[Payment] ✓ Confirmation email sent successfully:', attendee.email)
    } else {
      console.error('[Payment] ✗ Email send failed:', {
        email: attendee.email,
        error: result.error,
        ticket: attendee.ticket_code,
      })
    }
  } catch (error) {
    // NO lanzar error - el pago ya está confirmado, el email es secundario
    console.error('[Payment] sendConfirmationEmail exception:', {
      email: attendee.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}

async function sendPaymentRejectionEmail(attendee: Attendee, amount: number, reason: string) {
  try {
    console.log('[Payment] Preparing rejection email for:', attendee.email)
    
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

    const result = await sendEmail(
      attendee.email,
      'Problema con tu pago - II Simposio Veterinario',
      emailHtml
    )

    if (result.success) {
      console.log('[Payment] ✓ Rejection email sent successfully:', attendee.email)
    } else {
      console.error('[Payment] ✗ Rejection email send failed:', {
        email: attendee.email,
        error: result.error,
        reason,
      })
    }
  } catch (error) {
    // NO lanzar error - no queremos bloquear el flujo por un email fallido
    console.error('[Payment] sendPaymentRejectionEmail exception:', {
      email: attendee.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
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
