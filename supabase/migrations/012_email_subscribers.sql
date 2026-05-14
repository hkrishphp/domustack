-- ============================================================
-- Email subscribers (renovation cheatsheet / drip course)
--
-- Captured from the exit-intent popup. Service-role inserts via the
-- subscribeToCheatsheetAction server action — no public RLS policy.
-- ============================================================

CREATE TABLE IF NOT EXISTS email_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  source      TEXT,                                   -- e.g. 'exit_intent_popup'
  variant     TEXT,                                   -- A | B | C
  city        TEXT,
  zip_code    TEXT,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  drip_step   SMALLINT NOT NULL DEFAULT 1,            -- 1 = welcome sent, 2..5 = drip steps sent
  drip_next_at TIMESTAMPTZ,                           -- when the next drip email is due
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS email_subscribers_email_idx     ON email_subscribers (email);
CREATE INDEX IF NOT EXISTS email_subscribers_status_idx    ON email_subscribers (status);
CREATE INDEX IF NOT EXISTS email_subscribers_drip_due_idx  ON email_subscribers (drip_next_at) WHERE status = 'active';

CREATE TRIGGER email_subscribers_set_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- (No SELECT/INSERT/UPDATE/DELETE policies = default-deny.
--  All writes happen through server actions using the service role.)
