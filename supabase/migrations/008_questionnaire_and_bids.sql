-- ============================================================
-- Expand projects table for HireRight intake form
-- ============================================================

-- Service types (JSONB array, e.g. ["plumbing","roofing"])
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_types JSONB DEFAULT '[]'::jsonb;

-- Property type (residential, commercial, multi-family)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS property_type TEXT;

-- Budget range (chip selection)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_range TEXT;

-- Timeline / urgency
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT;

-- Photos (JSONB arrays of URLs)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS expected_photos JSONB DEFAULT '[]'::jsonb;

-- Location fields (address privacy: only city+zip shown to contractors)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS street_address TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Contact info
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contact_first_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contact_last_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS preferred_contact TEXT;

-- Expand status to include 'open' (accepting bids)
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check
  CHECK (status IN ('open', 'planning', 'in_progress', 'completed'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_zip ON projects(zip_code);

-- ============================================================
-- Add user_id to contractors (links auth user to contractor)
-- ============================================================
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_contractors_user ON contractors(user_id);

-- ============================================================
-- Bids table
-- ============================================================
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  price_estimate TEXT NOT NULL,
  timeline TEXT NOT NULL,
  description TEXT NOT NULL,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, contractor_id)
);

CREATE INDEX idx_bids_project ON bids(project_id);
CREATE INDEX idx_bids_contractor ON bids(contractor_id);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON bids FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON bids FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE bids;
