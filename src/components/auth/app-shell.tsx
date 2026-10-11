"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Box, Drawer, IconButton, Portal, Stack } from "@chakra-ui/react";
import { LuMenu, LuX } from "react-icons/lu";
import styles from "@/components/auth/app-style.module.css";
import { LogoutButton } from "@/components/auth/logout-button";
import { PantryPalBrand } from "@/components/auth/pantry-pal-brand";

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Pantry", href: "/ingredients" },
  { label: "Recipes", href: "/recipes" },
  { label: "Saved Recipes", href: "/saved-recipes" },
];

export function AppShell({ activePath, children }: { activePath: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={(details) => setOpen(details.open)} placement="start" closeOnEscape closeOnInteractOutside>
      <Box className={activePath === "/saved-recipes" ? undefined : styles.workspace} minH="100vh" bg="#FAF7F2" color="#3C1518">
        <Box as="header" bg="#FFFDFC" borderBottom="1px solid #EEE5DA">
          <Box px={{ base: "5", md: "6", xl: "8" }} py="4" display="flex" alignItems="center" justifyContent="space-between" gap="4">
            <Stack direction="row" align="center" gap="3">
              <Drawer.Trigger asChild>
                <IconButton aria-label="Open navigation menu" variant="ghost" color="#3C1518" borderRadius="lg" _hover={{ bg: "#F5E5CF" }}><LuMenu /></IconButton>
              </Drawer.Trigger>
              <Link href="/dashboard" aria-label="PantryPal dashboard">
                <PantryPalBrand />
              </Link>
            </Stack>
            <LogoutButton />
          </Box>
        </Box>
        <Box as="main" minW="0" px={{ base: "5", md: "6", lg: "7", xl: "8" }} py={{ base: "3", md: "6" }}>
          <Box width="full" maxW="1200px" mx="auto">{children}</Box>
        </Box>
      </Box>
      <Portal>
        <Drawer.Backdrop bg="rgba(60, 21, 24, 0.28)" />
        <Drawer.Positioner>
          <Drawer.Content bg="#FFFDFC" color="#3C1518" width="280px" maxW="85vw" boxShadow="0 12px 40px rgba(60, 21, 24, 0.16)">
            <Drawer.Header display="flex" alignItems="center" justifyContent="space-between" px="5" py="4" borderBottom="1px solid #EEE5DA">
              <Drawer.Title><PantryPalBrand /></Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton aria-label="Close navigation menu" variant="ghost" borderRadius="lg" color="#3C1518" _hover={{ bg: "#F5E5CF" }}><LuX /></IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body px="5" py="6">
              <Box as="nav" aria-label="Main navigation">
                <Stack gap="1">
                  {navigation.map((item) => {
                    const active = item.href === activePath;
                    return (
                      <Box key={item.href} asChild px="5" py="2.5" textAlign="left" borderRadius="xl" fontSize="md" fontWeight={active ? "bold" : "medium"} bg={active ? "#F5E5CF" : "transparent"} color={active ? "#69140E" : "#795D56"} _hover={{ bg: "#F5E5CF", color: "#69140E" }}>
                        <Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
