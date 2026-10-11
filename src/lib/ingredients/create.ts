import { createClient } from "@/lib/supabase/client";
import type { Ingredient, IngredientLocation } from "@/types/ingredient";

export async function createIngredient(userId: string, values: { name: string; location: IngredientLocation; in_stock: boolean }): Promise<Ingredient> {
  const name = values.name.trim();
  if (!name) throw new Error("Please enter an ingredient name.");
  const { data, error } = await createClient().from("ingredients")
    .insert({ ...values, name, user_id: userId })
    .select("id, user_id, name, location, in_stock, created_at").single();
  if (error) throw error;
  return data as Ingredient;
}
