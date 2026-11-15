-- =====================================================================
-- Estimate requests ("Recevoir cette estimation par courriel")
-- Run once in Supabase → SQL Editor. Safe to re-run.
--
-- The booking page's estimator lets a visitor leave their email to receive
-- their estimate. Each submission is stored here, with the visitor's explicit
-- consent, and picked up by the EcoNet leads CRM as a new lead.
--
-- Security model:
--   * anon (the public site) can INSERT, and only when consent = true.
--   * nobody can SELECT through the public API. Admins can read when the
--     is_admin() function from secure-admin-access.sql exists.
--   * the CRM reads this table over its own read-only Postgres connection.
--     The default CRM user (postgres.<project-ref>) bypasses RLS. A dedicated
--     read-only user does NOT: row level security applies to it and, with no
--     matching policy, it reads zero rows without any error. Give it either
--     BYPASSRLS (ALTER ROLE <reader> BYPASSRLS) or the policy at the end of
--     this file (uncomment it and replace <reader_role>).
-- =====================================================================

CREATE TABLE IF NOT EXISTS estimate_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  email         TEXT NOT NULL CHECK (char_length(email) BETWEEN 5 AND 255),
  first_name    TEXT CHECK (first_name IS NULL OR char_length(first_name) <= 100),
  phone         TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  service       TEXT,
  area          TEXT,
  property_type TEXT,
  add_ons       TEXT[] NOT NULL DEFAULT '{}',
  frequency     TEXT,
  total         NUMERIC(10, 2),
  language      TEXT CHECK (language IS NULL OR language IN ('fr', 'en')),
  consent       BOOLEAN NOT NULL CHECK (consent),
  user_agent    TEXT CHECK (user_agent IS NULL OR char_length(user_agent) <= 200)
);

CREATE INDEX IF NOT EXISTS estimate_requests_created_at_idx ON estimate_requests (created_at DESC);

ALTER TABLE estimate_requests ENABLE ROW LEVEL SECURITY;

-- Public insert only, and only with consent.
DROP POLICY IF EXISTS "Anyone can request an estimate" ON estimate_requests;
CREATE POLICY "Anyone can request an estimate" ON estimate_requests
  FOR INSERT TO anon, authenticated WITH CHECK (consent = true);

-- The public roles get INSERT and nothing else (no SELECT, so no read-back of rows).
REVOKE ALL ON estimate_requests FROM anon, authenticated;
GRANT INSERT ON estimate_requests TO anon, authenticated;

-- Admins may read when secure-admin-access.sql has been run.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'is_admin') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can read" ON estimate_requests';
    EXECUTE 'CREATE POLICY "Admins can read" ON estimate_requests FOR SELECT TO authenticated USING (public.is_admin())';
    EXECUTE 'GRANT SELECT ON estimate_requests TO authenticated';
  END IF;
END
$$;

-- Dedicated read-only CRM user (optional). Uncomment and replace <reader_role>.
-- GRANT SELECT ON estimate_requests TO <reader_role>;
-- DROP POLICY IF EXISTS "CRM reader can read" ON estimate_requests;
-- CREATE POLICY "CRM reader can read" ON estimate_requests FOR SELECT TO <reader_role> USING (true);
