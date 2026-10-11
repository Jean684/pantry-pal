"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Container, Field, Heading, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { createClient } from "@/lib/supabase/client";
import { ingredientLocations, type Ingredient, type IngredientLocation } from "@/types/ingredient";

const columns = "id, user_id, name, location, in_stock, created_at";

export function IngredientManager({ userId }: { userId: string }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState<IngredientLocation>("Pantry");
  const [inStock, setInStock] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadIngredients() {
      setLoading(true);
      setLoadFailed(false);
      setError("");
      try {
        const { data, error: queryError } = await createClient().from("ingredients")
          .select(columns).eq("user_id", userId).order("created_at", { ascending: false });
        if (queryError) throw queryError;
        if (active) setIngredients((data ?? []) as Ingredient[]);
      } catch {
        if (active) {
          setError("Could not load your ingredients. Please try again.");
          setLoadFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadIngredients();
    return () => { active = false; };
  }, [userId, reload]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setLocation("Pantry");
    setInStock(true);
  }

  async function saveIngredient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");
    if (!name.trim()) {
      setError("Please enter an ingredient name.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const values = { name: name.trim(), location, in_stock: inStock };
      const query = editingId
        ? supabase.from("ingredients").update(values).eq("id", editingId).eq("user_id", userId)
        : supabase.from("ingredients").insert({ ...values, user_id: userId });
      const { data, error: saveError } = await query.select(columns).single();
      if (saveError) throw saveError;
      const saved = data as Ingredient;
      setIngredients((current) => editingId
        ? current.map((ingredient) => ingredient.id === editingId ? saved : ingredient)
        : [saved, ...current]);
      setMessage(editingId ? "Ingredient updated." : "Ingredient added.");
      resetForm();
    } catch {
      setError("Could not save the ingredient. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteIngredient(ingredient: Ingredient) {
    if (busy || !window.confirm(`Delete ${ingredient.name} from your pantry?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error: deleteError } = await createClient().from("ingredients")
        .delete().eq("id", ingredient.id).eq("user_id", userId).select("id").single();
      if (deleteError) throw deleteError;
      setIngredients((current) => current.filter((item) => item.id !== ingredient.id));
      if (editingId === ingredient.id) resetForm();
      setMessage("Ingredient deleted.");
    } catch {
      setError("Could not delete the ingredient. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const formDisabled = busy || loading || loadFailed;

  return (
    <Box minH="100vh" bg="#FFFDFC" color="#3C1518">
      <Container maxW="4xl" py={{ base: "8", md: "12" }}>
        <Stack gap="6">
          <Link href="/dashboard">← Back to dashboard</Link>
          <Box>
            <Text color="#A44200" fontSize="sm" fontWeight="bold" letterSpacing="0.12em">PANTRYPAL</Text>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} color="#D58936" mt="2">My pantry</Heading>
            <Text color="gray.600" mt="2">Keep track of what you have in your pantry, fridge, and freezer.</Text>
          </Box>
          {error && <Box role="alert" bg="red.50" color="red.700" p="3" borderRadius="lg">{error}</Box>}
          {message && <Box role="status" bg="green.50" color="green.700" p="3" borderRadius="lg">{message}</Box>}
          <Box border="1px solid" borderColor="gray.200" borderRadius="2xl" p={{ base: "4", md: "6" }} boxShadow="sm">
            <Heading as="h2" size="lg" mb="4">{editingId ? "Edit ingredient" : "Add ingredient"}</Heading>
            <form onSubmit={saveIngredient}>
              <Stack gap="4">
                <Field.Root required>
                  <Field.Label htmlFor="ingredient-name">Ingredient name</Field.Label>
                  <Input id="ingredient-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Eggs" required disabled={formDisabled} borderColor="gray.300" borderRadius="lg" />
                </Field.Root>
                <Field.Root required>
                  <Field.Label htmlFor="ingredient-location">Location</Field.Label>
                  <NativeSelect.Root disabled={formDisabled}>
                    <NativeSelect.Field id="ingredient-location" value={location} onChange={(event) => setLocation(event.target.value as IngredientLocation)}>
                      {ingredientLocations.map((item) => <option key={item} value={item}>{item}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                <Box as="label" display="flex" alignItems="center" gap="2">
                  <input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} disabled={formDisabled} />
                  <Text>In stock</Text>
                </Box>
                <Stack direction="row" gap="3">
                  <Button type="submit" loading={busy} disabled={loading || loadFailed} bg="#D58936" color="#3C1518" _hover={{ bg: "#A44200", color: "white" }}>{editingId ? "Save changes" : "Add ingredient"}</Button>
                  {editingId && <Button type="button" variant="outline" onClick={resetForm} disabled={busy}>Cancel edit</Button>}
                </Stack>
              </Stack>
            </form>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb="4">Your ingredients</Heading>
            {loading ? <Text role="status">Loading your ingredients…</Text> : loadFailed ? (
              <Button variant="outline" onClick={() => setReload((current) => current + 1)}>Try again</Button>
            ) : ingredients.length === 0 ? (
              <Text color="gray.600">Your pantry is empty. Add your first ingredient above.</Text>
            ) : (
              <Stack gap="3">
                {ingredients.map((ingredient) => (
                  <Box key={ingredient.id} border="1px solid" borderColor="gray.200" borderRadius="xl" p="4" display="flex" flexDirection={{ base: "column", sm: "row" }} justifyContent="space-between" gap="3">
                    <Box>
                      <Heading as="h3" size="md">{ingredient.name}</Heading>
                      <Text color="gray.600" mt="1">{ingredient.location} · {ingredient.in_stock ? "In stock" : "Out of stock"}</Text>
                    </Box>
                    <Stack direction="row" gap="2" align="center">
                      <Button size="sm" variant="outline" disabled={busy} aria-label={`Edit ${ingredient.name}`} onClick={() => {
                        setEditingId(ingredient.id);
                        setName(ingredient.name);
                        setLocation(ingredient.location);
                        setInStock(ingredient.in_stock);
                        setError("");
                        setMessage("");
                        document.getElementById("ingredient-name")?.focus();
                      }}>Edit</Button>
                      <Button size="sm" variant="outline" color="red.700" disabled={busy} aria-label={`Delete ${ingredient.name}`} onClick={() => void deleteIngredient(ingredient)}>Delete</Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
