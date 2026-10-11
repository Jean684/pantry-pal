-- ONE-TIME DEMO ACCOUNT SEED. Run manually in the Supabase SQL Editor.
-- Create/confirm the demo account first. Copy its UUID from Authentication > Users.
-- Replace REPLACE_WITH_DEMO_USER_UUID below. Never run this automatically at login.
-- Preview the account and existing pantry first:
-- SELECT id, email FROM auth.users WHERE id = 'YOUR_DEMO_USER_UUID'::uuid;
-- SELECT name, location, in_stock FROM public.ingredients
-- WHERE user_id = 'YOUR_DEMO_USER_UUID'::uuid ORDER BY location, name;
-- This script inserts missing names only; it never changes existing rows.
-- For predictable demo results, prefer a new dedicated demo account.
BEGIN;

DO $$
DECLARE
  demo_user_id uuid := 'REPLACE_WITH_DEMO_USER_UUID'::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_id) THEN
    RAISE EXCEPTION 'Demo account does not exist. Check its UUID.';
  END IF;

  INSERT INTO public.ingredients (user_id, name, location, in_stock)
  SELECT demo_user_id, demo.name, demo.location, demo.in_stock
  FROM (VALUES
    ('Tomato', 'Pantry', true),
    ('Rice', 'Pantry', true),
    ('Olive oil', 'Pantry', true),
    ('Bread', 'Pantry', true),
    ('Eggs', 'Fridge', true),
    ('Butter', 'Fridge', true),
    ('Milk', 'Fridge', false),
    ('Frozen peas', 'Freezer', true)
  ) AS demo(name, location, in_stock)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.ingredients existing
    WHERE existing.user_id = demo_user_id
      AND lower(regexp_replace(btrim(existing.name), '\s+', ' ', 'g')) = lower(demo.name)
  );
END $$;

COMMIT;
