-- Migration to create payment_events table for webhook idempotency
-- This table stores processed webhook events to prevent duplicate processing

CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payment_orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups by payment_id
CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON payment_events(payment_id);

-- Index for idempotency key lookups
CREATE INDEX IF NOT EXISTS idx_payment_events_idempotency_key ON payment_events(idempotency_key);