import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Heading, Text } from "@chakra-ui/react";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Box p="8">
      <Heading>Dashboard</Heading>
      <Text mt="4">
        Welcome, {user.email}
      </Text>

      <Box mt="6">
        <LogoutButton />
      </Box>
    </Box>
  );
}