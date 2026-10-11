import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { ingredientLocations } from "@/types/ingredient";

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Pantry", href: "/ingredients" },
  { label: "Recipes", href: "/recipes" },
  { label: "Saved Recipes", href: "/saved-recipes" },
];

const cardStyle = {
  bg: "white",
  borderRadius: "2xl",
  border: "1px solid",
  borderColor: "#EEE5DA",
  boxShadow: "0 4px 18px rgba(60, 21, 24, 0.04)",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Exact counts avoid the row limit on a normal ingredient-list query.
  const countQuery = () => supabase.from("ingredients")
    .select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const counts = await Promise.all([
    countQuery(),
    countQuery().eq("in_stock", true),
    countQuery().eq("in_stock", false),
    ...ingredientLocations.map((location) => countQuery().eq("location", location)),
  ]);
  const countsUnavailable = counts.some((result) => result.error || result.count === null);
  const displayCount = (index: number) => countsUnavailable ? "—" : counts[index].count;
  const summaries = ["Total ingredients", "In stock", "Out of stock"];

  return (
    <Box minH="100vh" bg="#FAF7F2" color="#3C1518">
      <Box as="header" bg="#FFFDFC" borderBottom="1px solid #EEE5DA" px={{ base: "5", md: "8" }} py="5" display="flex" alignItems="center" justifyContent="space-between" gap="4">
        <Link href="/dashboard" aria-label="PantryPal dashboard">
          <Text fontSize="xl" fontWeight="bold" letterSpacing="-0.03em">Pantry<Text as="span" color="#A44200">Pal</Text><Text as="span" color="#D58936">.</Text></Text>
        </Link>
        <LogoutButton />
      </Box>
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "220px minmax(0, 1fr)" }} maxW="1440px" mx="auto">
        <Box as="aside" p={{ base: "5", md: "6" }} borderRight={{ md: "1px solid #EEE5DA" }}>
          <Box as="nav" aria-label="Main navigation">
            <Stack gap="2" direction={{ base: "row", md: "column" }} flexWrap="wrap">
              {navigation.map((item) => {
                const active = item.href === "/dashboard";
                return (
                  <Box key={item.href} asChild px="4" py="3" borderRadius="xl" fontSize="sm" fontWeight={active ? "bold" : "medium"} bg={active ? "#F5E5CF" : "transparent"} color={active ? "#69140E" : "#795D56"} _hover={{ bg: "#F5E5CF", color: "#69140E" }}>
                    <Link href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>
        <Box as="main" px={{ base: "5", md: "8", lg: "12" }} py={{ base: "4", md: "10" }}>
          <Stack gap="8" maxW="1000px" mx="auto">
            <Box>
              <Text color="#A44200" fontSize="xs" fontWeight="bold" letterSpacing="0.12em" mb="3">YOUR KITCHEN, AT A GLANCE</Text>
              <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">Welcome back</Heading>
              <Text color="#795D56" mt="3" maxW="xl">Manage your ingredients and discover meals with what you already have.</Text>
            </Box>
            {countsUnavailable && <Text role="status" color="#A44200" fontSize="sm">Ingredient counts are unavailable right now. Open your pantry to try loading them again.</Text>}
            <Box display="grid" gridTemplateColumns={{ base: "1fr", sm: "repeat(3, minmax(0, 1fr))" }} gap="4">
              {summaries.map((label, index) => (
                <Box key={label} {...cardStyle} p="6">
                  <Text color="#795D56" fontSize="sm">{label}</Text>
                  <Text fontSize="4xl" fontWeight="semibold" color={index === 1 ? "#A44200" : "#3C1518"} mt="3" lineHeight="1">{displayCount(index)}</Text>
                </Box>
              ))}
            </Box>
            <Box>
              <Heading as="h2" size="lg" mb="4">Quick actions</Heading>
              <Stack direction={{ base: "column", sm: "row" }} gap="3" flexWrap="wrap">
                <Button asChild borderRadius="lg" bg="#D58936" color="#3C1518" _hover={{ bg: "#A44200", color: "white" }}><Link href="/ingredients">Open Pantry</Link></Button>
                <Button asChild borderRadius="lg" variant="outline" borderColor="#D8C4AF" color="#69140E" _hover={{ bg: "#F5E5CF" }}><Link href="/recipes">Discover Recipes</Link></Button>
                <Button asChild borderRadius="lg" variant="outline" borderColor="#D8C4AF" color="#69140E" _hover={{ bg: "#F5E5CF" }}><Link href="/ingredients#ingredient-name">Add Ingredient</Link></Button>
              </Stack>
            </Box>
            <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1.4fr 1fr" }} gap="5">
              <Box {...cardStyle} p="6">
                <Heading as="h2" size="lg">Pantry snapshot</Heading>
                <Text color="#795D56" fontSize="sm" mt="2">Your ingredients, organised by location.</Text>
                <Stack gap="0" mt="5">
                  {ingredientLocations.map((location, index) => (
                    <Box key={location} display="flex" justifyContent="space-between" alignItems="center" py="3" borderBottom={index < 2 ? "1px solid #F0E9E0" : undefined}>
                      <Text>{location}</Text>
                      <Text fontWeight="semibold" color="#A44200">{displayCount(index + 3)}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box {...cardStyle} bg="#FFF8E8" p="6" display="flex" flexDirection="column" alignItems="flex-start">
                <Box w="8" h="1" bg="#FFFB46" borderRadius="full" mb="5" />
                <Heading as="h2" size="lg">Ready to cook?</Heading>
                <Text color="#795D56" fontSize="sm" mt="3" mb="6">Explore recipes and find inspiration for your next meal.</Text>
                <Button asChild variant="plain" color="#A44200" mt="auto" _hover={{ color: "#69140E" }}><Link href="/recipes">Explore recipes →</Link></Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
