"use client";

import { Box, Dialog, IconButton, Portal, Stack, Text } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import type { MatchedRecipe } from "@/types/recipe";
import { RecipeImage } from "@/components/recipes/recipe-image";
import styles from "@/components/auth/app-style.module.css";

export function RecipeDetails({ recipe }: { recipe: MatchedRecipe }) {
  const missing = recipe.missingIngredients.length;

  return (
    <Dialog.Root placement="center" scrollBehavior="inside" closeOnEscape closeOnInteractOutside>
      <Dialog.Trigger asChild>
        <Box asChild position="absolute" inset="0" borderRadius="2xl" cursor="pointer" bg="transparent" _focusVisible={{ outline: "3px solid #A44200", outlineOffset: "3px" }}>
          <button type="button" aria-label={`View details for ${recipe.name}`} />
        </Box>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop bg="rgba(60, 21, 24, 0.28)" />
        <Dialog.Positioner p="4">
          <Dialog.Content bg="#FFFDFC" color="#3C1518" borderRadius="2xl" maxW="600px" maxH="85dvh">
            <Dialog.Header pr="14">
              <Dialog.Title fontFamily="Georgia, serif" fontSize="2xl">{recipe.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <IconButton position="absolute" top="3" right="3" aria-label="Close recipe details" variant="ghost" color="#3C1518"><LuX /></IconButton>
            </Dialog.CloseTrigger>
            <Dialog.Body>
              <Stack gap="4">
                <RecipeImage key={recipe.image ?? recipe.id} src={recipe.image} name={recipe.name} />
                <Dialog.Description color="#795D56">{recipe.description}</Dialog.Description>
                <Box as="dl" display="grid" gridTemplateColumns="1fr 1fr" gap="2" fontSize="sm">
                  <dt>Meal type</dt><dd>{recipe.mealType ?? "Not specified"}</dd>
                  <dt>Prep time</dt><dd>{recipe.prepMinutes !== undefined ? `${recipe.prepMinutes} minutes` : "Not specified"}</dd>
                  <dt>Cook time</dt><dd>{recipe.cookMinutes !== undefined ? `${recipe.cookMinutes} minutes` : "Not specified"}</dd>
                </Box>
                <Text fontWeight="semibold" color={missing === 0 ? "#36543A" : "#7D382B"}>
                  {missing === 0 ? "You can make this now" : `Missing ${missing} ${missing === 1 ? "ingredient" : "ingredients"}`}
                </Text>
                <Box>
                  <Text as="h3" fontWeight="semibold">Required ingredients</Text>
                  <Box className={styles.chips}>{recipe.requiredIngredients.map((name) => <span className={styles.chip} key={name}>{name}</span>)}</Box>
                </Box>
                <Box>
                  <Text as="h3" fontWeight="semibold">Missing ingredients</Text>
                  {missing === 0 ? <Text fontSize="sm" color="#36543A" mt="1">None — you have everything listed.</Text> : <Box className={styles.chips}>{recipe.missingIngredients.map((name) => <span className={`${styles.chip} ${styles.missingChip}`} key={name}>{name}</span>)}</Box>}
                </Box>
                <Text fontSize="sm" color="#795D56">Cooking instructions aren’t available yet.</Text>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
