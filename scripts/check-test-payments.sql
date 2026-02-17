-- Script para verificar pagos de prueba en la base de datos
-- Ejecutar en: https://supabase.com/dashboard/project/iizphxxgwtcojdlbycvg/editor

-- Ver todos los pagos recientes (últimos 7 días)
SELECT 
  id,
  full_name,
  email,
  status,
  payment_method,
  payment_order_id,
  ticket_code,
  created_at
FROM attendees
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Ver solo pagos con tarjeta aprobados
SELECT 
  ticket_code,
  full_name,
  email,
  payment_order_id,
  status,
  created_at
FROM attendees
WHERE payment_method = 'card' 
  AND status = 'paid'
ORDER BY created_at DESC
LIMIT 10;

-- Contar pagos por método
SELECT 
  payment_method,
  status,
  COUNT(*) as cantidad,
  SUM(CASE WHEN payment_method = 'yape' THEN 250 ELSE 250 * 1.05 END) as total
FROM attendees
WHERE status = 'paid'
GROUP BY payment_method, status;
