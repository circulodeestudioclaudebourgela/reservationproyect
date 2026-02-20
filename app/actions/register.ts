'use server'

import { supabase, type Attendee, type AttendeeInsert } from '@/lib/supabase'
import { registrationSchema } from '@/lib/validations'
import { sendEmail, generatePendingPaymentEmail } from '@/lib/email'
import { z } from 'zod'

export type RegisterResult = 
  | { success: true; data: Attendee }
  | { success: false; error: string }

/**
 * Register a new attendee
 */
export async function registerAttendee(
  formData: z.infer<typeof registrationSchema>
): Promise<RegisterResult> {
  try {
    // Validate input
    const validatedData = registrationSchema.parse(formData)
    
    // Check if DNI already exists
    const { data: existingByDni } = await supabase
      .from('attendees')
      .select('*')
      .eq('dni', validatedData.dni)
      .single()

    if (existingByDni) {
      const attendee = existingByDni as Attendee
      
      // Si ya pagó, mostrar mensaje específico
      if (attendee.status === 'paid') {
        return { 
          success: false, 
          error: `¡Ya estás registrado! Tu código de ticket es ${attendee.ticket_code}. Revisa tu correo o contáctanos si necesitas ayuda.` 
        }
      }
      
      // Si está pendiente, permitir continuar con el pago
      return {
        success: true,
        data: attendee
      }
    }

    // Check if email already exists
    const { data: existingByEmail } = await supabase
      .from('attendees')
      .select('*')
      .eq('email', validatedData.email)
      .single()

    if (existingByEmail) {
      const attendee = existingByEmail as Attendee
      
      // Si ya pagó, mostrar mensaje específico
      if (attendee.status === 'paid') {
        return { 
          success: false, 
          error: `¡Ya estás registrado! Tu código de ticket es ${attendee.ticket_code}. Revisa tu correo o contáctanos si necesitas ayuda.` 
        }
      }
      
      // Si está pendiente, permitir continuar con el pago
      return {
        success: true,
        data: attendee
      }
    }

    // Create attendee record with pending status
    const newAttendee: AttendeeInsert = {
      full_name: validatedData.full_name,
      dni: validatedData.dni,
      email: validatedData.email,
      phone: validatedData.phone,
      role: validatedData.role,
      organization: validatedData.organization || null,
      status: 'pending',
      ticket_code: crypto.randomUUID(),
    }

    const { data, error } = await supabase
      .from('attendees')
      .insert(newAttendee)
      .select()
      .single()

    if (error) {
      console.error('[Simposio] Supabase insert error:', error)
      return { 
        success: false, 
        error: 'Error al registrar. Por favor intenta nuevamente.' 
      }
    }

    return { success: true, data: data as Attendee }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Datos de formulario inválidos' 
      }
    }
    console.error('[Simposio] Registration error:', error)
    return { 
      success: false, 
      error: 'Error interno del servidor' 
    }
  }
}

/**
 * Process payment and update attendee status
 */
export async function processPayment(
  attendeeId: string,
  paymentOrderId: string,
  paymentMethod: 'yape' | 'card' | 'manual' = 'manual'
): Promise<RegisterResult> {
  try {
    const { data, error } = await supabase
      .from('attendees')
      .update({ 
        status: 'paid',
        payment_order_id: paymentOrderId,
        payment_method: paymentMethod,
      })
      .eq('id', attendeeId)
      .select()
      .single()

    if (error) {
      console.error('[Simposio] Payment update error:', error)
      return { 
        success: false, 
        error: 'Error al actualizar el estado del pago' 
      }
    }

    return { success: true, data: data as Attendee }
  } catch (error) {
    console.error('[Simposio] Payment processing error:', error)
    return { 
      success: false, 
      error: 'Error interno del servidor' 
    }
  }
}

/**
 * Get attendee by ticket code (for QR verification)
 */
export async function getAttendeeByTicketCode(
  ticketCode: string
): Promise<RegisterResult> {
  try {
    const { data, error } = await supabase
      .from('attendees')
      .select()
      .eq('ticket_code', ticketCode)
      .single()

    if (error || !data) {
      return { 
        success: false, 
        error: 'Ticket no encontrado' 
      }
    }

    return { success: true, data: data as Attendee }
  } catch (error) {
    console.error('[Simposio] Ticket lookup error:', error)
    return { 
      success: false, 
      error: 'Error al buscar el ticket' 
    }
  }
}

/**
 * Get all attendees (for admin dashboard)
 */
export async function getAllAttendees(): Promise<{
  success: boolean
  data?: Attendee[]
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('attendees')
      .select()
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Simposio] Fetch attendees error:', error)
      return { 
        success: false, 
        error: 'Error al obtener los registros' 
      }
    }

    return { success: true, data: data as Attendee[] }
  } catch (error) {
    console.error('[Simposio] Get attendees error:', error)
    return { 
      success: false, 
      error: 'Error interno del servidor' 
    }
  }
}

/**
 * Mark attendee as paid (admin action)
 */
export async function markAsPaid(attendeeId: string): Promise<RegisterResult> {
  try {
    const { data, error } = await supabase
      .from('attendees')
      .update({ 
        status: 'paid',
        payment_method: 'manual',
        payment_order_id: `manual_${Date.now()}`,
      })
      .eq('id', attendeeId)
      .select()
      .single()

    if (error) {
      console.error('[Simposio] Mark as paid error:', error)
      return { 
        success: false, 
        error: 'Error al marcar como pagado' 
      }
    }

    const attendee = data as Attendee

    // Enviar email de confirmación al marcar como pagado
    try {
      const EARLY_BIRD_DEADLINE = new Date('2026-04-20T23:59:59')
      const amount = new Date() < EARLY_BIRD_DEADLINE ? 250.00 : 350.00

      const { generatePaymentConfirmationEmail } = await import('@/lib/email')
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
      console.log('[Simposio] Confirmation email sent to:', attendee.email)
    } catch (emailError) {
      console.error('[Simposio] Email send error:', emailError)
    }

    return { success: true, data: attendee }
  } catch (error) {
    console.error('[Simposio] Mark as paid error:', error)
    return { 
      success: false, 
      error: 'Error interno del servidor' 
    }
  }
}

/**
 * Delete attendee (admin action)
 */
export async function deleteAttendee(attendeeId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase
      .from('attendees')
      .delete()
      .eq('id', attendeeId)

    if (error) {
      console.error('[Simposio] Delete attendee error:', error)
      return { 
        success: false, 
        error: 'Error al eliminar el registro' 
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[Simposio] Delete attendee error:', error)
    return { 
      success: false, 
      error: 'Error interno del servidor' 
    }
  }
}
