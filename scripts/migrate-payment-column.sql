-- ============================================
-- Migración: Unificar columnas de pago a payment_order_id
-- y agregar columna payment_method
-- ============================================
-- Ejecutar en Supabase SQL Editor
-- NOTA: Hacer backup antes de ejecutar en producción

-- 1. Renombrar columna si existe (culqi_order_id, openpay_order_id, etc.)
DO $$ 
BEGIN
  -- Intentar renombrar culqi_order_id si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendees' 
    AND column_name = 'culqi_order_id'
  ) THEN
    ALTER TABLE attendees RENAME COLUMN culqi_order_id TO payment_order_id;
    RAISE NOTICE 'Renombrada columna culqi_order_id → payment_order_id';
  END IF;

  -- Intentar renombrar openpay_order_id si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendees' 
    AND column_name = 'openpay_order_id'
  ) THEN
    ALTER TABLE attendees RENAME COLUMN openpay_order_id TO payment_order_id;
    RAISE NOTICE 'Renombrada columna openpay_order_id → payment_order_id';
  END IF;

  -- Intentar renombrar paypal_order_id si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendees' 
    AND column_name = 'paypal_order_id'
  ) THEN
    ALTER TABLE attendees RENAME COLUMN paypal_order_id TO payment_order_id;
    RAISE NOTICE 'Renombrada columna paypal_order_id → payment_order_id';
  END IF;
END $$;

-- 2. Agregar columna para método de pago si no existe
ALTER TABLE attendees 
  ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- 2b. Remover constraint existente si existe, para recrearlo
ALTER TABLE attendees 
  DROP CONSTRAINT IF EXISTS attendees_payment_method_check;

-- 2c. Agregar nuevo constraint
ALTER TABLE attendees 
  ADD CONSTRAINT attendees_payment_method_check 
  CHECK (payment_method IN ('yape', 'card', 'manual'));

-- 3. Actualizar payment_method para registros existentes basándose en el ID
UPDATE attendees 
SET payment_method = 
  CASE 
    -- MercadoPago (nuevos)
    WHEN payment_order_id LIKE 'mp_yape_%' THEN 'yape'
    WHEN payment_order_id LIKE 'mp_card_%' THEN 'card'
    -- Yape manual o directo
    WHEN payment_order_id LIKE 'yape_%' THEN 'yape'
    WHEN payment_order_id LIKE 'plin_%' THEN 'yape'
    -- Pasarelas de tarjetas
    WHEN payment_order_id LIKE 'openpay_%' THEN 'card'
    WHEN payment_order_id LIKE 'culqi_%' THEN 'card'
    WHEN payment_order_id LIKE 'paypal_%' THEN 'card'
    -- Manual
    WHEN payment_order_id LIKE 'manual_%' THEN 'manual'
    -- Cualquier otro con ID asume manual
    WHEN payment_order_id IS NOT NULL THEN 'manual'
    -- Sin ID, sin método
    ELSE NULL
  END
WHERE payment_order_id IS NOT NULL AND payment_method IS NULL;

-- 4. Verificar la migración
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE payment_order_id IS NOT NULL) as con_pago,
  COUNT(*) FILTER (WHERE payment_method IS NOT NULL) as con_metodo
FROM attendees;

-- Ver los cambios
SELECT id, full_name, status, payment_order_id, payment_method 
FROM attendees 
ORDER BY created_at DESC;
