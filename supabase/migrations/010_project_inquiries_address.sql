-- ============================================================
-- Add street address, city, state, and ZIP code to project inquiries
-- so contractors know where the project lives.
-- ============================================================

ALTER TABLE project_inquiries
  ADD COLUMN IF NOT EXISTS street_address TEXT,
  ADD COLUMN IF NOT EXISTS city           TEXT,
  ADD COLUMN IF NOT EXISTS state          TEXT,
  ADD COLUMN IF NOT EXISTS zip_code       TEXT;

CREATE INDEX IF NOT EXISTS project_inquiries_zip_code_idx ON project_inquiries (zip_code);
