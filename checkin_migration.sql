-- ============================================================
--  Control de ingreso al evento (check-in)
--  Ejecutar UNA sola vez en el SQL Editor de Supabase.
--  No crea otra tabla: solo agrega 2 columnas a "attendees".
-- ============================================================

ALTER TABLE public.attendees
  ADD COLUMN IF NOT EXISTS checked_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;

-- checked_in     -> true cuando la persona ingresó al evento
-- checked_in_at  -> a qué hora se le marcó el ingreso (null si aún no entra)
