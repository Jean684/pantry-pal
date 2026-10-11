import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import ts from "typescript";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(relativePath, requireStub) {
  const exports = {};
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function("exports", "require", js)(exports, requireStub);
  return exports;
}

async function main() {
  const { recipes } = load("src/lib/recipes/data.ts");
  const { matchRecipes, normalizeIngredientName } = load("src/lib/recipes/matching.ts");
  const seed = fs.readFileSync(path.join(root, "supabase/demo-ingredients.sql"), "utf8");
  const pantry = [...seed.matchAll(/\('([^']+)', '(Pantry|Fridge|Freezer)', (true|false)\)/g)]
    .map((match) => ({ name: match[1], location: match[2], inStock: match[3] === "true" }));
  assert.equal(pantry.length, 8);
  assert.deepEqual(["Pantry", "Fridge", "Freezer"].map((location) => pantry.filter((item) => item.location === location && item.inStock).length), [4, 2, 1]);
  const stockedNames = pantry.filter((item) => item.inStock).map((item) => item.name);
  assert(!stockedNames.includes("Milk"));
  assert.equal(normalizeIngredientName("  OLIVE   Oil  "), "olive oil");
  assert(recipes.length >= 8 && recipes.length <= 12);
  const matches = matchRecipes(recipes, stockedNames);
  const counts = [0, 1, 2].map((missing) => matches.filter((recipe) => recipe.missingIngredients.length === missing).length);
  counts.forEach((count) => assert(count >= 2));
  assert.deepEqual(matches.map((recipe) => recipe.missingIngredients.length), [...matches.map((recipe) => recipe.missingIngredients.length)].sort());
  assert.deepEqual(matchRecipes(recipes, []).map((recipe) => [recipe.id, recipe.missingIngredients.length]), [["scrambled-eggs", 2]]);
  assert.deepEqual(matchRecipes(recipes, [...stockedNames, " EGGS "]), matches);
  assert(!matches.some((recipe) => recipe.id === "banana-porridge"));
  assert(matches.find((recipe) => recipe.id === "egg-rice").missingIngredients.includes("Soy sauce"));
  assert.equal(matches.find((recipe) => recipe.id === "egg-rice").missingIngredients.length, 1);
  // A stock toggle must change matching; out-of-stock names are not passed to the matcher.
  assert(matchRecipes(recipes, stockedNames.filter((name) => name !== "Eggs"))
    .find((recipe) => recipe.id === "scrambled-eggs").missingIngredients.includes("Eggs"));
  recipes.forEach((recipe) => {
    assert.equal(new Set(recipe.requiredIngredients.map(normalizeIngredientName)).size, recipe.requiredIngredients.length);
    if (recipe.image) assert(recipe.image.startsWith("/images/recipes/") && !recipe.image.includes(".."));
  });

  let inserted;
  let response = { data: { id: "test-row" }, error: null };
  const query = {
    insert(values) { inserted = values; return this; },
    select() { return this; },
    async single() { return response; },
  };
  const { createIngredient } = load("src/lib/ingredients/create.ts", () => ({
    createClient: () => ({ from(table) { assert.equal(table, "ingredients"); return query; } }),
  }));
  await createIngredient("demo-user", { name: " Tomato ", location: "Pantry", in_stock: false });
  assert.deepEqual(inserted, { name: "Tomato", location: "Pantry", in_stock: false, user_id: "demo-user" });
  await assert.rejects(() => createIngredient("demo-user", { name: " ", location: "Pantry", in_stock: true }));
  response = { data: null, error: new Error("RLS denied") };
  await assert.rejects(() => createIngredient("demo-user", { name: "Rice", location: "Pantry", in_stock: true }), /RLS denied/);
  console.log(`Demo checks passed: ${recipes.length} recipes, ${matches.length} matches; filters 0/1/2 missing = ${counts.join("/")}.`);
  matches.forEach((recipe) => console.log(`${recipe.missingIngredients.length} missing: ${recipe.name}${recipe.missingIngredients.length ? " — " + recipe.missingIngredients.join(", ") : ""}`));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
