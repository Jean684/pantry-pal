-- Run in the Supabase Dashboard SQL Editor after checking that
-- public.ingredients does not already exist. This script intentionally
-- fails on an existing table rather than altering or replacing it.
BEGIN;

CREATE TABLE public.ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  location text NOT NULL DEFAULT 'Pantry'
    CHECK (location IN ('Pantry', 'Fridge', 'Freezer')),
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ingredients_user_id_idx ON public.ingredients (user_id);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.ingredients FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ingredients TO authenticated;

CREATE POLICY ingredients_select_own
ON public.ingredients FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY ingredients_insert_own
ON public.ingredients FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY ingredients_update_own
ON public.ingredients FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY ingredients_delete_own
ON public.ingredients FOR DELETE TO authenticated
USING (user_id = (SELECT auth.uid()));

COMMIT;
