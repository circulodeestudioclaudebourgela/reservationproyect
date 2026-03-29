-- Migration: Add scholarship and custom price columns to attendees table
-- Run this in your Supabase SQL Editor

ALTER TABLE attendees
  ADD COLUMN IF NOT EXISTS is_scholarship BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS custom_price NUMERIC(10, 2) NULL;

-- Optional: add an index for filtering becados
CREATE INDEX IF NOT EXISTS idx_attendees_is_scholarship ON attendees (is_scholarship);
