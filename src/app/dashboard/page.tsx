import styles from "@/components/auth/app-style.module.css";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { AppShell } from "@/components/auth/app-shell";
import { ingredientLocations } from "@/types/ingredient";
import { RecipeFeature } from "@/components/dashboard/recipe-feature";
import { LuArchive, LuRefrigerator, LuSnowflake, LuUtensils, LuArrowRight } from "react-icons/lu";
import { AddIngredientForm } from "@/components/pantry/add-ingredient-form";

const cardStyle = {
  bg: "white",
  borderRadius: "3xl",
  border: "1px solid",
  borderColor: "#EEE5DA",
  boxShadow: "0 8px 30px rgba(60, 21, 24, 0.045)",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch five names and an exact in-stock count for each location in parallel.
  const snapshots = await Promise.all(ingredientLocations.map((location) =>
    supabase.from("ingredients").select("id, name", { count: "exact" })
      .eq("user_id", user.id).eq("in_stock", true).eq("location", location)
      .order("created_at", { ascending: false }).order("id").limit(5)
  ));

  return (
    <AppShell activePath="/dashboard">
          <Stack gap="6" width="full" maxW="1600px">
            <Box py="20px" overflow="hidden" borderRadius="3xl" px={{ base: "1", md: "2" }}>
              <Box position="relative">
              <Text color="#A44200" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb="2">YOUR KITCHEN, AT A GLANCE</Text>
              <Heading as="h1" fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }} letterSpacing="-0.045em" lineHeight="1.1" fontWeight="semibold">Welcome back!</Heading>
              <Text color="#795D56" mt="2" maxW="xl">Manage your ingredients and discover meals with what you already have.</Text>
              </Box>
            </Box>
            <AddIngredientForm userId={user.id} />
            <Box>
              <Heading as="h2" size="lg" mb="3">Quick actions</Heading>
              <Stack direction={{ base: "column", sm: "row" }} gap="3" flexWrap="wrap">
                <Button asChild size="lg" borderRadius="xl" bg="#D58936" color="#3C1518" _hover={{ bg: "#A44200", color: "white" }}><Link className={styles.primary} href="/ingredients"><LuArchive aria-hidden="true" /> Open Pantry <LuArrowRight aria-hidden="true" /></Link></Button>
                <Button asChild size="lg" borderRadius="xl" variant="outline" bg="white" borderColor="#D8C4AF" color="#69140E" _hover={{ bg: "#F5E5CF" }}><Link href="/recipes"><LuUtensils aria-hidden="true" /> Discover Recipes <LuArrowRight aria-hidden="true" /></Link></Button>
              </Stack>
            </Box>
            <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }} gap="5">
              <Box className={styles.card} {...cardStyle} p={{ base: "6", md: "7" }} minH={{ lg: "300px" }}>
                <Stack direction="row" align="center" gap="3"><Box className={styles.icon}><LuArchive aria-hidden="true" size={23} /></Box><Box><Heading as="h2" size="xl">Pantry snapshot</Heading>
                <Text color="#795D56" fontSize="sm" mt="2">Your in-stock ingredients, organised by location.</Text></Box></Stack>
                <Stack gap="0" mt="5">
                  {ingredientLocations.map((location, index) => {
                    const LocationIcon = [LuArchive, LuRefrigerator, LuSnowflake][index];
                    const snapshot = snapshots[index];
                    const unavailable = Boolean(snapshot.error) || snapshot.count === null;
                    const count = snapshot.count ?? 0;
                    const items = snapshot.data ?? [];
                    const remaining = Math.max(0, count - items.length);
                    return (
                      <Box key={location} py="3.5" borderBottom={index < 2 ? "1px solid #F0E9E0" : undefined}>
                        <Stack direction="row" align="center" gap="3"><Box bg="#F8EFE2" color="#A44200" borderRadius="lg" p="2"><LocationIcon aria-hidden="true" size={18} /></Box><Text fontWeight="semibold"><Text as="span" color="#A44200">{unavailable ? "—" : count}</Text> {location}</Text></Stack>
                        {unavailable ? (
                          <Text fontSize="sm" color="#857168" mt="1">Items unavailable. Please try reloading.</Text>
                        ) : items.length === 0 ? (
                          <Text fontSize="sm" color="#857168" mt="1">No items yet</Text>
                        ) : (
                          <>
                            <Text fontSize="sm" color="#795D56" mt="1" overflowWrap="anywhere">{items.map((item) => item.name.charAt(0).toLocaleUpperCase() + item.name.slice(1)).join(", ")}</Text>
                            {remaining > 0 && <Text fontSize="xs" color="#857168" mt="1">+ {remaining} more</Text>}
                          </>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
              <Box className={styles.card} {...cardStyle} bg="#FFF8E8" overflow="hidden" minH={{ lg: "340px" }} display="grid" gridTemplateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}>
                <Stack gap="4" p={{ base: "6", md: "7" }} align="flex-start">
                  <Text fontSize="xs" fontWeight="bold" letterSpacing="0.12em" color="#A44200">FROM PANTRY TO PLATE</Text>
                  <Heading as="h2" fontSize="3xl" letterSpacing="-0.03em" lineHeight="1.15">Ready to cook?</Heading>
                  <Text color="#795D56" fontSize="sm">Explore recipes and find inspiration for your next meal.</Text>
                  <Button asChild bg="#D58936" color="#3C1518" borderRadius="xl" mt="auto" _hover={{ bg: "#A44200", color: "white" }}><Link href="/recipes">Explore recipes <LuArrowRight aria-hidden="true" /></Link></Button>
                </Stack>
                <RecipeFeature />
              </Box>
            </Box>
          </Stack>
    </AppShell>
  );
}
