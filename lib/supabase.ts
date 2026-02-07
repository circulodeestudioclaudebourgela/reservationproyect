import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types based on schema
export type AttendeeRole = 'student' | 'professional'
export type AttendeeStatus = 'pending' | 'paid'

export interface Attendee {
  id: string
  created_at: string
  full_name: string
  dni: string
  email: string
  phone: string
  role: AttendeeRole
  organization?: string | null
  status: AttendeeStatus
  culqi_order_id?: string | null
  ticket_code: string // UUID for QR
}

// For insert operations (without generated fields)
export type AttendeeInsert = Omit<Attendee, 'id' | 'created_at' | 'ticket_code'> & {
  ticket_code?: string
}

// For update operations
export type AttendeeUpdate = Partial<Omit<Attendee, 'id' | 'created_at'>>
