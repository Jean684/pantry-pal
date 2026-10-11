"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Field, Heading, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { LuPlus, LuLeaf } from "react-icons/lu";
import styles from "@/components/auth/app-style.module.css";
import { createIngredient } from "@/lib/ingredients/create";
import { ingredientLocations, type IngredientLocation } from "@/types/ingredient";

export function AddIngredientForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState<IngredientLocation>("Pantry");
  const [inStock, setInStock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const submitting = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || refreshing) return;
    setError("");
    setMessage("");
    if (!name.trim()) {
      setError("Please enter an ingredient name.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      await createIngredient(userId, { name, location, in_stock: inStock });
      setName("");
      setLocation("Pantry");
      setInStock(true);
      setMessage("Ingredient added.");
      startTransition(() => router.refresh());
    } catch {
      setError("Could not add the ingredient. Please try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  const disabled = busy || refreshing;
  return (
    <Box className={styles.card} bg="white" border="1px solid #EEE5DA" borderRadius="3xl" p={{ base: "5", md: "7" }} boxShadow="0 8px 30px rgba(60, 21, 24, 0.045)">
      <Stack direction="row" align="center" gap="3" mb="5"><Box className={styles.icon}><LuLeaf aria-hidden="true" size={23} /></Box><Box><Heading as="h2" size="xl">Add ingredient</Heading><Text color="#795D56" fontSize="sm" mt="1">Keep track of what you have on hand.</Text></Box></Stack>
      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="4">
          <Field.Root required>
            <Field.Label htmlFor="dashboard-ingredient-name">Ingredient name</Field.Label>
            <Input id="dashboard-ingredient-name" placeholder="e.g. Eggs" value={name} onChange={(event) => setName(event.target.value)} required disabled={disabled} bg="#FFFDFA" borderColor="#E5DACD" borderRadius="xl" size="lg" />
          </Field.Root>
          <Field.Root required>
            <Field.Label htmlFor="dashboard-ingredient-location">Location</Field.Label>
            <NativeSelect.Root disabled={disabled} size="lg">
              <NativeSelect.Field bg="#FFFDFA" borderColor="#E5DACD" borderRadius="xl" id="dashboard-ingredient-location" value={location} onChange={(event) => setLocation(event.target.value as IngredientLocation)}>
                {ingredientLocations.map((item) => <option key={item} value={item}>{item}</option>)}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          </Box>
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} gap="3">
          <Box as="label" display="flex" gap="2" alignItems="center">
            <input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} disabled={disabled} />
            <Text>In stock</Text>
          </Box>
          <Button type="submit" alignSelf={{ base: "stretch", sm: "flex-end" }} size="lg" loading={disabled} loadingText={refreshing ? "Updating counts" : "Adding"} bg="#D58936" color="#3C1518" borderRadius="xl" _hover={{ bg: "#A44200", color: "white" }}><LuPlus aria-hidden="true" /> Add Ingredient</Button>
          </Stack>
          {error && <Box role="alert" bg="red.50" color="red.700" p="3" borderRadius="lg">{error}</Box>}
          {message && <Box role="status" bg="green.50" color="green.700" p="3" borderRadius="lg">{message}</Box>}

        </Stack>
      </form>
    </Box>
  );
}
