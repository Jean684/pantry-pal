export type Recipe = {
  id: string;
  name: string;
  description: string;
  requiredIngredients: string[];
  mealType?: string;
  prepMinutes?: number;
  cookMinutes?: number;
};

export type MatchedRecipe = Recipe & { missingIngredients: string[] };
