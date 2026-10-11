import { AppShell } from "@/components/auth/app-shell";
import { Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <AppShell activePath="/saved-recipes">
      <Heading as="h1">Log in</Heading>
      <Text mt="4">Authentication will be added on Day 2.</Text>
    </AppShell>
  );
}