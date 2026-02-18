'use server'

import {
  sendEmail,
  generatePaymentConfirmationEmail,
  generatePendingPaymentEmail,
  generateEventReminderEmail,
  type RegistrationEmailData,
} from '@/lib/email'

// Precios dinámicos
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')

// Calcular precio actual
const getCurrentPrice = () => {
  return new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

/**
 * Enviar email de confirmación de pago
 */
export async function sendPaymentConfirmationEmail(
  data: Omit<RegistrationEmailData, 'amount'>
): Promise<{ success: boolean; error?: string }> {
  const emailData: RegistrationEmailData = {
    ...data,
    amount: getCurrentPrice(),
  }
  
  const htmlContent = generatePaymentConfirmationEmail(emailData)
  
  return sendEmail(
    data.email,
    '✅ Tu registro está confirmado - II Simposio Veterinario 2026',
    htmlContent
  )
}

/**
 * Enviar email de pago pendiente (Yape/Plin)
 */
export async function sendPendingPaymentEmail(
  data: Omit<RegistrationEmailData, 'amount'>,
  paymentMethod: 'yape' | 'plin'
): Promise<{ success: boolean; error?: string }> {
  const emailData: RegistrationEmailData = {
    ...data,
    amount: getCurrentPrice(),
  }
  
  const htmlContent = generatePendingPaymentEmail(emailData, paymentMethod)
  
  return sendEmail(
    data.email,
    '⏳ Tu inscripción está en proceso - II Simposio Veterinario 2026',
    htmlContent
  )
}

/**
 * Enviar email de recordatorio
 */
export async function sendEventReminderEmail(
  data: Omit<RegistrationEmailData, 'amount'>,
  daysUntilEvent: number
): Promise<{ success: boolean; error?: string }> {
  const emailData: RegistrationEmailData = {
    ...data,
    amount: getCurrentPrice(),
  }
  
  const htmlContent = generateEventReminderEmail(emailData, daysUntilEvent)
  
  const subject = daysUntilEvent === 1
    ? '🎉 ¡Mañana es el Simposio Veterinario!'
    : `📅 ¡Faltan ${daysUntilEvent} días! - II Simposio Veterinario 2026`
  
  return sendEmail(data.email, subject, htmlContent)
}

/**
 * Enviar emails de recordatorio masivo (para cron job)
 */
export async function sendBulkReminderEmails(
  attendees: Array<Omit<RegistrationEmailData, 'amount'>>,
  daysUntilEvent: number
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  }
  
  for (const attendee of attendees) {
    const result = await sendEventReminderEmail(attendee, daysUntilEvent)
    
    if (result.success) {
      results.sent++
    } else {
      results.failed++
      if (result.error) {
        results.errors.push(`${attendee.email}: ${result.error}`)
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return results
}
