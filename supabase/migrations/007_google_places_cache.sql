-- Cache table for Google Places API responses
CREATE TABLE google_places_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kontraio_contractor_id TEXT NOT NULL UNIQUE,
  google_place_id TEXT,
  rating NUMERIC(2,1),
  user_ratings_total INT DEFAULT 0,
  reviews JSONB DEFAULT '[]'::jsonb,
  matched_business_name TEXT,
  photo_references JSONB DEFAULT '[]'::jsonb,
  has_match BOOLEAN NOT NULL DEFAULT false,
  last_fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gpc_kontraio_id ON google_places_cache(kontraio_contractor_id);
CREATE INDEX idx_gpc_last_fetched ON google_places_cache(last_fetched_at);

ALTER TABLE google_places_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON google_places_cache FOR SELECT USING (true);
CREATE POLICY "Allow server write" ON google_places_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow server update" ON google_places_cache FOR UPDATE USING (true);
