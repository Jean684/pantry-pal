import type { Recipe, MatchedRecipe } from "@/types/recipe";

export function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchRecipes(recipes: Recipe[], inStockNames: string[]): MatchedRecipe[] {
  const available = new Set(inStockNames.map(normalizeIngredientName));
  return recipes.map((recipe) => ({
    ...recipe,
    missingIngredients: recipe.requiredIngredients.filter((name) => !available.has(normalizeIngredientName(name))),
  })).filter((recipe) => recipe.missingIngredients.length <= 2)
    .sort((a, b) => a.missingIngredients.length - b.missingIngredients.length || a.name.localeCompare(b.name));
}
