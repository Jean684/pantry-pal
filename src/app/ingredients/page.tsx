import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IngredientManager } from "@/components/pantry/ingredient-manager";

export default async function IngredientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <IngredientManager userId={user.id} />;
}
