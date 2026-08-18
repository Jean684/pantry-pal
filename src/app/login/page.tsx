"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      minH="100vh"
      bgImage="url('/Gallery/1.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "4", md: "6" }}
      py={{ base: "6", md: "10" }}
    >
      {/* Dark overlay over the background image */}
      <Box
        position="absolute"
        inset="0"
        bg="rgba(0, 0, 0, 0.35)"
      />

      {/* Login card */}
      <Box
        position="relative"
        zIndex="1"
        width="full"
        maxW="5xl"
        bg="#FFFDFC"
        borderRadius={{ base: "2xl", md: "3xl" }}
        overflow="hidden"
        boxShadow="0 24px 70px rgba(0, 0, 0, 0.35)"
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "1.15fr 0.85fr",
        }}
        minH={{ base: "auto", md: "560px" }}
      >
        {/* Left side: Login form */}
        <Box
          px={{ base: "6", sm: "8", md: "12" }}
          py={{ base: "8", md: "10" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Stack gap="6" width="full" maxW="md">
            {/* Branding */}
            <Stack gap="3">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="#a75c34"
                letterSpacing="0.12em"
              >
                PANTRYPAL
              </Text>

              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                lineHeight="1.1"
                color="#D58936"
              >
                Welcome back!
              </Heading>

              <Text
                color="gray.600"
                fontSize={{ base: "md", md: "lg" }}
              >
                Your kitchen is waiting. Log in to find something delicious
                to cook with what you already have.
              </Text>
            </Stack>

            {/* Login form */}
            <form onSubmit={handleLogin}>
              <Stack gap="4">
                <Field.Root required>
                  <Field.Label color="#3C1518">
                    Email
                  </Field.Label>

                  <Input
                    type="email"
                    placeholder="you@example.com"
                    size="lg"
                    borderRadius="lg"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#D58936",
                      boxShadow: "0 0 0 1px #D58936",
                    }}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label color="#3C1518">
                    Password
                  </Field.Label>

                  <Input
                    type="password"
                    placeholder="Enter your password"
                    size="lg"
                    borderRadius="lg"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#D58936",
                      boxShadow: "0 0 0 1px #D58936",
                    }}
                  />
                </Field.Root>

                {error && (
                  <Box
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    borderRadius="lg"
                    px="3"
                    py="2"
                  >
                    <Text
                      color="red.600"
                      fontSize="sm"
                    >
                      {error}
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  borderRadius="lg"
                  bg="#D58936"
                  color="#3C1518"
                  fontWeight="bold"
                  _hover={{
                    bg: "#A44200",
                    color: "white",
                  }}
                  loading={loading}
                  mt="1"
                >
                  Log in
                </Button>
              </Stack>
            </form>

            {/* Signup link */}
            <Text
              fontSize="sm"
              color="gray.600"
              textAlign={{ base: "center", md: "left" }}
            >
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <Text
                  as="span"
                  color="#A44200"
                  fontWeight="semibold"
                  _hover={{
                    color: "#69140E",
                    textDecoration: "underline",
                  }}
                >
                  Create one
                </Text>
              </Link>
            </Text>
          </Stack>
        </Box>

        {/* Right side: Anime image with slight warm overlay */}
        <Box
          display={{ base: "none", md: "block" }}
          height="100%"
          position="relative"
        >
          <Image
            src="/Gallery/signup-bg3.jpg"
            alt="Anime-style cooking scene"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
          />

          {/* Slight warm overlay so it blends with PantryPal */}
          {/* <Box
            position="absolute"
            inset="0"
            bg="rgba(0, 0, 0, 0.35)"
            pointerEvents="none"
          /> */}
        </Box>
      </Box>
    </Box>
  );
}