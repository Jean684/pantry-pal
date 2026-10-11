"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { AppShell } from "@/components/auth/app-shell";
import styles from "@/components/auth/app-style.module.css";
import { LuCheck, LuShoppingCart, LuClock, LuUtensils } from "react-icons/lu";
import type { MatchedRecipe } from "@/types/recipe";

const filters = [
  { label: "All", value: "all" },
  { label: "0 missing", value: "0" },
  { label: "1 missing", value: "1" },
  { label: "2 missing", value: "2" },
] as const;

export function RecipeDiscovery({ matches, loadFailed, hasStock }: { matches: MatchedRecipe[]; loadFailed: boolean; hasStock: boolean }) {
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const visible = matches.filter((recipe) => filter === "all" || recipe.missingIngredients.length === Number(filter));

  return (
    <AppShell activePath="/recipes">
      <Stack gap="6">
        <Box className={styles.hero}>
          <Text color="#A44200" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb="2">COOK WITH WHAT YOU HAVE</Text>
          <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">Discover recipes</Heading>
          <Text color="#795D56" mt="2">Simple meal ideas using your in-stock ingredients, with at most two extras to buy.</Text>
          <Text color="#795D56" fontSize="sm" mt="2">Matches use ingredient names, ignoring capitals and extra spaces. Quantities are not checked.</Text>
        </Box>
        {loadFailed ? (
          <Box bg="red.50" color="red.700" p="5" borderRadius="xl">
            <Text role="alert">Could not load your pantry. Please try again to find recipe matches.</Text>
            <Button variant="outline" mt="3" onClick={() => router.refresh()}>Try again</Button>
          </Box>
        ) : (
          <>
            {!hasStock && <Box bg="#FFF8E8" p="4" borderRadius="xl"><Text>No in-stock ingredients yet. Add ingredients or update their stock status in your pantry to find meals.</Text><Button asChild variant="plain" color="#A44200" mt="2"><Link href="/ingredients">Open Pantry →</Link></Button></Box>}
            <Stack direction="row" gap="2" flexWrap="wrap" role="group" aria-label="Filter by missing ingredients">
              {filters.map((item) => <Button key={item.value} size="md" borderRadius="full" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} variant={filter === item.value ? "solid" : "outline"} bg={filter === item.value ? "#BD5B12" : "#FFFBF5"} color={filter === item.value ? "white" : "#69140E"} borderColor="#D8C4AF" _hover={{ bg: filter === item.value ? "#A44200" : "#F5E5CF" }}>{item.label} ({item.value === "all" ? matches.length : matches.filter((recipe) => recipe.missingIngredients.length === Number(item.value)).length})</Button>)}
            </Stack>
            <Text role="status" fontSize="sm" color="#795D56">{visible.length} {visible.length === 1 ? "recipe" : "recipes"} found</Text>
            {visible.length === 0 ? (
              <Box bg="white" border="1px solid #EEE5DA" borderRadius="2xl" p="5">
                <Text>{matches.length === 0 ? "No recipes match within two missing ingredients yet. Update your pantry to discover more meals." : "No recipes match this filter. Try another missing-ingredient filter."}</Text>
                <Button asChild variant="plain" color="#A44200" mt="2"><Link href="/ingredients">Manage ingredients →</Link></Button>
              </Box>
            ) : (
              <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }} gap="4">
                {visible.map((recipe) => {
                  const missing = recipe.missingIngredients.length;
                  return (
                    <Box className={styles.card} as="article" key={recipe.id} bg="white" border="1px solid #EEE5DA" borderRadius="2xl" p="5" boxShadow="0 4px 18px rgba(60, 21, 24, 0.04)">
                      <Stack gap="3">
                        <Stack direction="row" align="start" gap="3"><Box className={styles.icon} w="38px" h="38px"><LuUtensils aria-hidden="true" size={19} /></Box><Heading as="h2" size="xl">{recipe.name}</Heading></Stack>
                        <Text fontSize="sm" color="#795D56">{recipe.description}</Text>
                        <Text display="flex" alignItems="center" gap="2" fontSize="xs" color="#A44200"><LuClock aria-hidden="true" />{[recipe.mealType, recipe.prepMinutes !== undefined ? `${recipe.prepMinutes} min prep` : null, recipe.cookMinutes !== undefined ? `${recipe.cookMinutes} min cook` : null].filter(Boolean).join(" · ")}</Text>
                        <Badge alignSelf="flex-start" borderRadius="full" px="3" py="2" bg={missing === 0 ? "#EAF3E3" : missing === 1 ? "#FFF2D9" : "#FAE9E3"} color={missing === 0 ? "#36543A" : "#69140E"}>{missing === 0 ? <LuCheck aria-hidden="true" /> : <LuShoppingCart aria-hidden="true" />}{missing === 0 ? "You can make this now" : `Missing ${missing} ${missing === 1 ? "ingredient" : "ingredients"}`}</Badge>
                        <Box borderTop="1px solid #F0E9E0" pt="3">
                          <Text fontSize="sm" fontWeight="semibold">Required ingredients</Text>
                          <Box className={styles.chips}>{recipe.requiredIngredients.map((name) => <span className={styles.chip} key={name}>{name}</span>)}</Box>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">Missing ingredients</Text>
                          {missing === 0 ? <Text fontSize="sm" color="#36543A" mt="1">None — you have everything listed.</Text> : <Box className={styles.chips}>{recipe.missingIngredients.map((name) => <span className={`${styles.chip} ${styles.missingChip}`} key={name}>{name}</span>)}</Box>}
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}
          </>
        )}
      </Stack>
    </AppShell>
  );
}
