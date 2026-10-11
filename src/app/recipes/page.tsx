import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecipeDiscovery } from "@/components/recipes/recipe-discovery";
import { recipes } from "@/lib/recipes/data";
import { matchRecipes } from "@/lib/recipes/matching";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch every page so a large pantry is not silently truncated by the API.
  const inStockNames: string[] = [];
  const pageSize = 1000;
  let loadFailed = false;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.from("ingredients").select("name")
      .eq("user_id", user.id).eq("in_stock", true).order("id")
      .range(offset, offset + pageSize - 1);
    if (error || !data) {
      loadFailed = true;
      break;
    }
    inStockNames.push(...data.map((ingredient) => ingredient.name));
    if (data.length < pageSize) break;
  }

  return <RecipeDiscovery matches={loadFailed ? [] : matchRecipes(recipes, inStockNames)} loadFailed={loadFailed} hasStock={inStockNames.length > 0} />;
}
