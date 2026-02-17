-- Seed Data for Simposio Veterinario 2026
-- Ejecutar en Supabase SQL Editor después de setup-database.sql
-- NOTA: Primero asegúrate de que la tabla 'attendees' existe

-- Limpiar datos existentes (CUIDADO en producción)
-- DELETE FROM attendees;

-- Insertar datos de prueba
INSERT INTO attendees (full_name, dni, email, phone, role, organization, status, payment_order_id, payment_method, ticket_code)
VALUES 
  -- Profesionales con pago confirmado
  ('Dr. Carlos Mendoza García', '12345678', 'carlos.mendoza@email.com', '987654321', 'professional', 'Clínica Veterinaria San Martín', 'paid', 'mp_card_74581527001', 'card', gen_random_uuid()),
  ('Dr. Luis Alberto Torres', '45678912', 'luis.torres@email.com', '923456789', 'professional', 'SENASA', 'paid', 'mp_card_74581527002', 'card', gen_random_uuid()),
  ('Dr. Pedro Sánchez Vega', '32165498', 'pedro.sanchez@email.com', '945678901', 'professional', NULL, 'paid', 'mp_yape_74581527003', 'yape', gen_random_uuid()),
  ('Dra. Carmen Romero Díaz', '65432178', 'carmen.romero@email.com', '956789012', 'professional', 'Universidad Privada del Norte', 'paid', 'mp_yape_74581527004', 'yape', gen_random_uuid()),
  ('Dr. Roberto Chávez López', '78945612', 'roberto.chavez@email.com', '967890123', 'professional', 'Veterinaria El Amigo Fiel', 'paid', 'manual_verificado', 'manual', gen_random_uuid()),
  
  -- Profesionales con pago pendiente
  ('Dra. Patricia Valencia Ruiz', '98765432', 'patricia.valencia@email.com', '978901234', 'professional', 'CMVP La Libertad', 'pending', NULL, NULL, gen_random_uuid()),
  ('Dr. Andrés Gutiérrez Mora', '85274196', 'andres.gutierrez@email.com', '989012345', 'professional', 'Agropecuaria del Norte', 'pending', NULL, NULL, gen_random_uuid()),
  
  -- Estudiantes con pago confirmado
  ('María Elena Rodríguez', '87654321', 'maria.rodriguez@email.com', '912345678', 'student', 'Universidad Nacional de Trujillo', 'paid', 'mp_card_74581527005', 'card', gen_random_uuid()),
  ('Juan Diego Paredes', '25836974', 'juan.paredes@email.com', '923456780', 'student', 'UPAO', 'paid', 'mp_yape_74581527006', 'yape', gen_random_uuid()),
  ('Lucía Fernández Castro', '36925814', 'lucia.fernandez@email.com', '934567891', 'student', 'Universidad César Vallejo', 'paid', 'mp_yape_74581527007', 'yape', gen_random_uuid()),
  
  -- Estudiantes con pago pendiente
  ('Ana Lucía Fernández', '78912345', 'ana.lucia@email.com', '934567890', 'student', 'UPAO', 'pending', NULL, NULL, gen_random_uuid()),
  ('Diego Armando Quispe', '14725836', 'diego.quispe@email.com', '945678902', 'student', 'Universidad Nacional de Trujillo', 'pending', NULL, NULL, gen_random_uuid()),
  ('Sofía Valentina Ramos', '96385274', 'sofia.ramos@email.com', '956789013', 'student', 'Universidad Privada Antenor Orrego', 'pending', NULL, NULL, gen_random_uuid()),
  ('Alejandro Torres Silva', '74185296', 'alejandro.torres@email.com', '967890124', 'student', 'UCV', 'pending', NULL, NULL, gen_random_uuid()),
  ('Camila Rojas Mendoza', '85296374', 'camila.rojas@email.com', '978901235', 'student', 'UNT', 'pending', NULL, NULL, gen_random_uuid());

-- Verificar datos insertados
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'paid') as pagados,
  COUNT(*) FILTER (WHERE status = 'pending') as pendientes,
  COUNT(*) FILTER (WHERE role = 'professional') as profesionales,
  COUNT(*) FILTER (WHERE role = 'student') as estudiantes
FROM attendees;

-- Ver todos los registros
SELECT id, full_name, dni, email, role, status, created_at 
FROM attendees 
ORDER BY created_at DESC;
