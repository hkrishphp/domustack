-- ============================================================
-- Track which homepage variant (A/B/C) produced each lead.
-- Lets us see which design actually converts in real data, not
-- just in PostHog/GA — straight from the table.
-- ============================================================

ALTER TABLE project_inquiries
  ADD COLUMN IF NOT EXISTS variant TEXT;

CREATE INDEX IF NOT EXISTS project_inquiries_variant_idx ON project_inquiries (variant);
