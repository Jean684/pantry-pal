"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      onClick={handleLogout}
      bg="#D58936"
      color="#3C1518"
      _hover={{ bg: "#A44200", color: "white" }}
    >
      Log out
    </Button>
  );
}