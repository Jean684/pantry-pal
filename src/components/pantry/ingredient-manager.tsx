"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/auth/app-shell";
import { Badge, Box, Button, Field, Heading, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import styles from "@/components/auth/app-style.module.css";
import { LuLeaf, LuArchive, LuRefrigerator, LuSnowflake, LuPencil, LuTrash2, LuCheck, LuX } from "react-icons/lu";
import { createClient } from "@/lib/supabase/client";
import { createIngredient } from "@/lib/ingredients/create";
import { ingredientLocations, type Ingredient, type IngredientLocation } from "@/types/ingredient";

const columns = "id, user_id, name, location, in_stock, created_at";

function displayIngredientName(name: string) {
  return name.charAt(0).toLocaleUpperCase() + name.slice(1);
}

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
  const addIngredientFocused = useRef(false);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

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
      let saved: Ingredient;
      if (editingId) {
        const { data, error: saveError } = await supabase.from("ingredients")
          .update(values).eq("id", editingId).eq("user_id", userId).select(columns).single();
        if (saveError) throw saveError;
        saved = data as Ingredient;
      } else {
        saved = await createIngredient(userId, values);
      }
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

  useEffect(() => {
    function focusAddIngredient() {
      if (formDisabled || addIngredientFocused.current || window.location.hash !== "#ingredient-name") return;
      const input = document.getElementById("ingredient-name");
      input?.scrollIntoView({ block: "center" });
      input?.focus({ preventScroll: true });
      if (input) addIngredientFocused.current = true;
    }
    function handleHashChange() {
      addIngredientFocused.current = false;
      focusAddIngredient();
    }
    focusAddIngredient();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [formDisabled]);

  return (
    <AppShell activePath="/ingredients">
        <Stack gap="6">
          <Box className={styles.hero}>
            <Text color="#A44200" fontSize="xs" fontWeight="bold" letterSpacing="0.12em">PANTRYPAL</Text>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold" mt="2">My pantry</Heading>
            <Text color="#795D56" mt="2">Keep track of what you have in your pantry, fridge, and freezer.</Text>
          </Box>
          {error && <Box role="alert" bg="red.50" color="red.700" p="3" borderRadius="lg">{error}</Box>}
          {message && <Box role="status" bg="green.50" color="green.700" p="3" borderRadius="lg">{message}</Box>}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "minmax(0, 0.8fr) minmax(0, 1.2fr)" }} gap={{ base: "5", lg: "6" }} alignItems="start">
          <Box className={styles.card} border="1px solid" bg="white" borderColor="#EEE5DA" borderRadius="2xl" p="5" boxShadow="0 4px 18px rgba(60, 21, 24, 0.04)">
            <Stack direction="row" gap="3" align="center" mb="5"><Box className={styles.icon}><LuLeaf aria-hidden="true" size={23} /></Box><Box><Heading as="h2" size="xl">{editingId ? "Edit ingredient" : "Add ingredient"}</Heading><Text fontSize="sm" color="#795D56" mt="1">Keep track of what you have on hand.</Text></Box></Stack>
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
                <Stack direction="row" gap="3" flexWrap="wrap">
                  <Button type="submit" loading={busy} disabled={loading || loadFailed} bg="#D58936" color="#3C1518" _hover={{ bg: "#A44200", color: "white" }}>{editingId ? "Save changes" : "Add ingredient"}</Button>
                  {editingId && <Button type="button" variant="outline" onClick={resetForm} disabled={busy}>Cancel edit</Button>}
                </Stack>
              </Stack>
            </form>
          </Box>
          <Box minW="0">
            <Heading as="h2" size="lg" mb="4" px="5">Your ingredients</Heading>
            {loading ? <Text role="status">Loading your ingredients…</Text> : loadFailed ? (
              <Button variant="outline" onClick={() => setReload((current) => current + 1)}>Try again</Button>
            ) : (
              <Stack gap="4">
                {ingredientLocations.map((groupLocation) => {
                  const LocationIcon = { Pantry: LuArchive, Fridge: LuRefrigerator, Freezer: LuSnowflake }[groupLocation];
                  const locationDescription = { Pantry: "Ingredients stored at room temperature.", Fridge: "Ingredients kept in your fridge.", Freezer: "Ingredients kept in your freezer." }[groupLocation];
                  const groupIngredients = ingredients.filter((ingredient) => ingredient.location === groupLocation);
                  return (
                    <Box className={styles.card} as="section" key={groupLocation} bg="white" border="1px solid" borderColor="#EEE5DA" borderRadius="2xl" px="5" py="4" boxShadow="0 4px 18px rgba(60, 21, 24, 0.04)">
                      <Stack direction="row" gap="3" align="center" mb="3"><Box className={styles.icon} bg={groupLocation === "Fridge" ? "#EAF3E3" : groupLocation === "Freezer" ? "#E5F0FA" : "#FCEBD5"} color={groupLocation === "Fridge" ? "#36543A" : groupLocation === "Freezer" ? "#32668C" : "#A44200"}><LocationIcon aria-hidden="true" size={24} /></Box><Box flex="1"><Heading as="h3" size="lg">{groupLocation}</Heading><Text fontSize="sm" color="#795D56" mt="1">{locationDescription}</Text></Box><Badge borderRadius="full" bg="#FFF3E2" color="#A44200" px="3" py="1">{groupIngredients.length} {groupIngredients.length === 1 ? "ingredient" : "ingredients"}</Badge></Stack>
                      {groupIngredients.length === 0 ? (
                        <Text fontSize="sm" color="#857168">No ingredients in your {groupLocation.toLowerCase()} yet.</Text>
                      ) : groupIngredients.map((ingredient) => (
                  <Box key={ingredient.id} py="3" borderTop="1px solid #F0E9E0" display="flex" flexDirection={{ base: "column", sm: "row" }} justifyContent="space-between" gap="3">
                    <Stack direction="row" align="center" gap="2" flexWrap="wrap" minW="0">
                      <Text fontWeight="medium" overflowWrap="anywhere">{displayIngredientName(ingredient.name)}</Text>
                      <Badge bg={ingredient.in_stock ? "#E5EDE1" : "#F3E3DC"} color={ingredient.in_stock ? "#36543A" : "#7D382B"} borderRadius="full" px="2">{ingredient.in_stock ? <LuCheck aria-hidden="true" /> : <LuX aria-hidden="true" />}{ingredient.in_stock ? "In stock" : "Out of stock"}</Badge>
                    </Stack>
                    <Stack direction="row" gap="2" align="center">
                      <Button size="sm" variant="outline" disabled={busy} aria-label={`Edit ${ingredient.name}`} onClick={() => {
                        setEditingId(ingredient.id);
                        setName(ingredient.name);
                        setLocation(ingredient.location);
                        setInStock(ingredient.in_stock);
                        setError("");
                        setMessage("");
                        document.getElementById("ingredient-name")?.focus();
                      }}><LuPencil aria-hidden="true" /> Edit</Button>
                      <Button size="sm" variant="outline" color="red.700" disabled={busy} aria-label={`Delete ${ingredient.name}`} onClick={() => void deleteIngredient(ingredient)}><LuTrash2 aria-hidden="true" /> Delete</Button>
                    </Stack>
                  </Box>
                      ))}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
          </Box>
        </Stack>
    </AppShell>
  );
}
