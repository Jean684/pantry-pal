import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Container maxW="4xl" py={{ base: "16", md: "24" }}>
      <Stack gap="6" align="flex-start">
        <Text fontWeight="semibold">PantryPal</Text>

        <Heading as="h1" size="4xl">
          Cook with what you already have.
        </Heading>

        <Text fontSize="lg" maxW="2xl">
          Save the ingredients in your pantry, fridge, and freezer, then find
          recipes requiring little or nothing extra to buy.
        </Text>

        <Stack direction={{ base: "column", sm: "row" }} gap="3">
          <Button>Get started</Button>
          <Button variant="outline">Log in</Button>
        </Stack>
      </Stack>
    </Container>
  );
}