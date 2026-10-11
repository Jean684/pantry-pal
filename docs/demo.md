# Interview demo rehearsal

## One dedicated demo account

Use a new, confirmed Supabase Auth account with an empty pantry for predictable results.
In Authentication > Users, copy its UUID and confirm its email.
Open `supabase/demo-ingredients.sql`, replace `REPLACE_WITH_DEMO_USER_UUID`, and
run the two commented read-only preview queries with that UUID first.
Only then run the seed in the SQL Editor. It inserts missing ingredient names for
that account only, never updates/deletes existing data, and is not called by the app.
Existing rows with the same normalized name are preserved, so check their stock
status/location manually if reusing an account. Avoid concurrent seed runs.

Expected in-stock snapshot: **4 Pantry / 2 Fridge / 1 Freezer**.
Milk remains out of stock. Expected recipe filters: **All 7 / 0 missing 2 /
1 missing 2 / 2 missing 3**. Extra ingredients in a reused pantry may change results.

## Recipe source and images

Recipes are local mock data in `src/lib/recipes/data.ts`; no AI or external recipe API.
Matching is in `src/lib/recipes/matching.ts`. Comparison ignores case and extra
spaces; it does not infer synonyms, singular/plural forms, quantities, or substitutions.
Frozen peas are explicitly named in the fried-rice recipe to match the demo seed.

Optional photos go in `public/images/recipes/`:
`scrambled-eggs.jpg`, `tomato-toast.jpg`, `grilled-cheese.jpg`, `pasta-pomodoro.jpg`, `veggie-fried-rice.jpg`, and `veggie-omelette.jpg`.
Absent photos show a generic warm icon placeholder. No external images are used.

## Run and rehearse

Run `node scripts/check-demo.mjs`, `npm run lint`, and
`npx tsc --noEmit --incremental false`. Build with `npm run build`, then use
`npm run start` for the interview rather than the development server.
Do not rebuild while the demo server is running. Visit the complete flow beforehand.

1. Log in with the confirmed demo account. Confirm dashboard loads and shows 4/2/1.
2. Add a disposable ingredient such as `Demo carrot` from the dashboard; ensure
   the snapshot updates. Open Pantry and confirm it appears in the correct group.
3. Edit that test ingredient's name, location, and stock status. Verify the update
   survives a reload. Check in-stock/out-of-stock badges and all three groups.
4. Delete only the test ingredient using confirmation; verify it remains deleted
   after reload. Restore any demo-stock toggles you changed through the normal UI.
5. Open Recipes: verify All = 7, 0 missing = 2, 1 missing = 2, 2 missing = 3.
   Check each filter and missing-name list. Tomato toast and scrambled eggs are ready.
6. Open the drawer, navigate to each route, and check active highlighting and closure.
   Check outside click, Escape, and the close button. Saved Recipes is a placeholder.
7. Log out. Visit `/dashboard`, `/ingredients`, and `/recipes` while logged out;
   each must redirect to login. Log in again before the interview.

## Known limits

SQL seeding and live auth/CRUD/RLS checks require your actual Supabase account;
local mocked checks cannot certify them. Recipe cards contain ideas/ingredients,
not full cooking instructions. Saved Recipes is not implemented. Session refresh
has no dedicated proxy; rehearse with a fresh login and avoid an auth refactor tonight.
