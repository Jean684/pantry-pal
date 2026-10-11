export const ingredientLocations = ["Pantry", "Fridge", "Freezer"] as const;
export type IngredientLocation = (typeof ingredientLocations)[number];
export type Ingredient = {
  id: string;
  user_id: string;
  name: string;
  location: IngredientLocation;
  in_stock: boolean;
  created_at: string;
};
