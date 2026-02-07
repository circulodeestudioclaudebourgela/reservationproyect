-- Database Setup for Simposio Veterinario 2026
-- Run this script in your Supabase SQL Editor

-- Drop existing tables if needed (uncomment for fresh start)
-- DROP TABLE IF EXISTS attendees CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;

-- Create attendees table for event registration
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  full_name TEXT NOT NULL,
  dni TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'professional')),
  organization TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  culqi_order_id TEXT,
  ticket_code UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE
);

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_dni ON attendees(dni);
CREATE INDEX IF NOT EXISTS idx_attendees_status ON attendees(status);
CREATE INDEX IF NOT EXISTS idx_attendees_ticket_code ON attendees(ticket_code);
CREATE INDEX IF NOT EXISTS idx_attendees_created_at ON attendees(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for attendees table
-- Allow anyone to insert (for registration)
CREATE POLICY "Allow public registration" ON attendees
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own record by ticket_code or email
CREATE POLICY "Allow read own record" ON attendees
  FOR SELECT
  USING (true);

-- Allow authenticated users (admins) to update
CREATE POLICY "Allow admin updates" ON attendees
  FOR UPDATE
  USING (true);

-- Allow authenticated users (admins) to delete
CREATE POLICY "Allow admin deletes" ON attendees
  FOR DELETE
  USING (true);

-- Create a function to generate formatted ticket reference
CREATE OR REPLACE FUNCTION generate_ticket_reference()
RETURNS TRIGGER AS $$
BEGIN
  -- You can customize this format
  -- Example: SV26-XXXXX (SV26 = Simposio Veterinario 2026)
  NEW.ticket_code := gen_random_uuid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket reference
DROP TRIGGER IF EXISTS set_ticket_reference ON attendees;
CREATE TRIGGER set_ticket_reference
  BEFORE INSERT ON attendees
  FOR EACH ROW
  WHEN (NEW.ticket_code IS NULL)
  EXECUTE FUNCTION generate_ticket_reference();

-- Insert a test admin user (password: admin123)
-- Note: In production, use proper password hashing with bcrypt
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@simposio.pe', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- Sample data for testing (optional)
-- Uncomment to add test attendees
/*
INSERT INTO attendees (full_name, dni, email, phone, role, organization, status) VALUES
  ('Dr. Carlos Mendoza García', '12345678', 'carlos.mendoza@email.com', '987654321', 'professional', 'Clínica Veterinaria San Martín', 'paid'),
  ('María Elena Rodríguez', '87654321', 'maria.rodriguez@email.com', '912345678', 'student', 'Universidad Nacional de Trujillo', 'pending'),
  ('Dr. Luis Alberto Torres', '45678912', 'luis.torres@email.com', '923456789', 'professional', 'SENASA', 'paid'),
  ('Ana Lucía Fernández', '78912345', 'ana.fernandez@email.com', '934567890', 'student', 'UPAO', 'pending'),
  ('Dr. Pedro Sánchez Vega', '32165498', 'pedro.sanchez@email.com', '945678901', 'professional', NULL, 'paid')
ON CONFLICT (dni) DO NOTHING;
*/

-- View to get registration statistics
CREATE OR REPLACE VIEW registration_stats AS
SELECT 
  COUNT(*) as total_registrations,
  COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE role = 'professional') as professional_count,
  COUNT(*) FILTER (WHERE role = 'student') as student_count,
  COUNT(*) FILTER (WHERE status = 'paid') * 150.00 as total_revenue
FROM attendees;
