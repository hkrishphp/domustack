-- ============================================================
-- Project Inquiries (homepage lead-gen form)
--
-- Captures submissions from the public "Tell us about your project"
-- form on the homepage. Anonymous (no FK to users), so anyone can
-- submit, but only Domustack staff (service_role / dashboard) can
-- read and triage them.
-- ============================================================

CREATE TABLE project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  inspiration_images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'converted', 'closed', 'spam')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX project_inquiries_created_at_idx ON project_inquiries (created_at DESC);
CREATE INDEX project_inquiries_status_idx     ON project_inquiries (status);
CREATE INDEX project_inquiries_email_idx      ON project_inquiries (email);

-- Auto-bump updated_at
CREATE OR REPLACE FUNCTION set_updated_at_timestamp() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_inquiries_set_updated_at
  BEFORE UPDATE ON project_inquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- Row-level security
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public form submissions
CREATE POLICY "Anyone can submit a project inquiry"
  ON project_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- (No SELECT/UPDATE/DELETE policy = default-deny; staff use service_role
--  via the Supabase dashboard or a future authenticated admin role.)

-- ============================================================
-- Storage bucket for inspiration image uploads
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-inquiries', 'project-inquiries', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public uploads to project-inquiries"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'project-inquiries');

CREATE POLICY "Public reads from project-inquiries"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-inquiries');
