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
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      setSuccessMessage(
        "Account created successfully! You can now log in."
      );

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      minH="100vh"
      bgImage="url('/Gallery/board.jpg')"
      bgSize="cover"
      backgroundPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "4", md: "6" }}
      py={{ base: "6", md: "10" }}
    >
      {/* Dark overlay over background image */}
      <Box
        position="absolute"
        inset="0"
        bg="rgba(0, 0, 0, 0.35)"
      />

      {/* Signup card */}
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
        {/* Left side: signup form */}
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
                color="#D58936"
                letterSpacing="0.12em"
              >
                PANTRYPAL
              </Text>

              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                lineHeight="1.1"
                color="#3C1518"
              >
                Welcome to PantryPal!
              </Heading>

              <Text
                color="gray.600"
                fontSize={{ base: "md", md: "lg" }}
              >
                Create your account and discover recipes based on the
                ingredients already in your kitchen.
              </Text>
            </Stack>

            {/* Signup form */}
            <form onSubmit={handleSignup}>
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

                <Field.Root required>
                  <Field.Label color="#3C1518">
                    Confirm password
                  </Field.Label>

                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    size="lg"
                    borderRadius="lg"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
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
                    <Text color="red.600" fontSize="sm">
                      {error}
                    </Text>
                  </Box>
                )}

                {successMessage && (
                  <Box
                    bg="green.50"
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="lg"
                    px="3"
                    py="2"
                  >
                    <Text color="green.700" fontSize="sm">
                      {successMessage}
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
                  Create account
                </Button>
              </Stack>
            </form>

            {/* Login link */}
            <Text
              fontSize="sm"
              color="gray.600"
              textAlign={{ base: "center", md: "left" }}
            >
              Already have an account?{" "}
              <Link href="/login">
                <Text
                  as="span"
                  color="#A44200"
                  fontWeight="semibold"
                  _hover={{
                    color: "#69140E",
                    textDecoration: "underline",
                  }}
                >
                  Log in
                </Text>
              </Link>
            </Text>
          </Stack>
        </Box>

        {/* Right side: Anime image */}
        <Box
          display={{ base: "none", md: "block" }}
          height="100%"
        >
          <Image
            src="/Gallery/signup-bg3.jpg"
            alt="Anime-style cooking scene"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
          />
        </Box>
      </Box>
    </Box>
  );
}