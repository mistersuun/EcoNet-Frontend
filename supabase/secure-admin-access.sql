-- =====================================================================
-- Lock customer data down to admins only
-- Run once in Supabase → SQL Editor. Safe to re-run.
--
-- Fixes two problems with the original setup in SUPABASE_SETUP.md:
--  1. The "authenticated" policies let ANY signed-in user read/update every
--     contact and booking. With sign-ups enabled (Supabase's default), anyone
--     can create an account with the public anon key and dump the tables.
--  2. The recent_contacts / recent_bookings / urgent_requests views run with
--     the view owner's rights, which bypasses RLS entirely. Supabase grants
--     anon + authenticated access to new objects in `public`, so the views
--     may be readable with no login at all.
--
-- ALSO DO THIS IN THE DASHBOARD:
--   Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".
--   Create admin accounts yourself (Authentication → Users → Add user).
-- =====================================================================

-- 1. Who counts as an admin ------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON admin_users FROM anon, authenticated;

-- SECURITY DEFINER so policies can check membership without exposing the table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Replace the "any logged-in user" policies ------------------------------
DROP POLICY IF EXISTS "Allow authenticated read"   ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can read"            ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update"          ON contact_submissions;

CREATE POLICY "Admins can read" ON contact_submissions
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update" ON contact_submissions
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated read"   ON booking_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON booking_requests;
DROP POLICY IF EXISTS "Admins can read"            ON booking_requests;
DROP POLICY IF EXISTS "Admins can update"          ON booking_requests;

CREATE POLICY "Admins can read" ON booking_requests
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update" ON booking_requests
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- The public forms only ever insert. Make sure anon can't read anything back.
REVOKE SELECT, UPDATE, DELETE ON contact_submissions FROM anon;
REVOKE SELECT, UPDATE, DELETE ON booking_requests    FROM anon;

-- 3. Make the dashboard views respect RLS (Postgres 15+) -------------------
DO $$
DECLARE v TEXT;
BEGIN
  FOREACH v IN ARRAY ARRAY['recent_contacts', 'recent_bookings', 'urgent_requests'] LOOP
    IF to_regclass('public.' || v) IS NOT NULL THEN
      EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true)', v);
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', v);
    END IF;
  END LOOP;
END $$;

-- 4. Make yourself an admin -------------------------------------------------
-- Replace the email with the account you log into /admin with:
-- INSERT INTO admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'econetentretienmenager@gmail.com'
--   ON CONFLICT DO NOTHING;
