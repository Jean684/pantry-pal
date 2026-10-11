export type Recipe = {
  id: string;
  name: string;
  description: string;
  requiredIngredients: string[];
  mealType?: string;
  prepMinutes?: number;
  cookMinutes?: number;
  image?: string;
};

export type MatchedRecipe = Recipe & { missingIngredients: string[] };
