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
  const [loading, setLoading] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState("");


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

    //console.log("Signup form submitted with:", { email, password, confirmPassword });
    try {
      const supabase = await createClient();

      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      setSuccessMessage("Account created! Check your email to confirm your account before logging in.");

      setEmail("");
      setPassword("");
      setConfirmPassword("");


  } catch (error) {
    setError("An unexpected error occurred.");
  } finally { 
    setLoading(false);
  }
}

  return (
    <Box
      minH="100vh"
      bg="rgb(60, 21, 24)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "4", md: "6" }}
      py={{ base: "8", md: "12" }}
    >
      <Box
        width="full"
        maxW="6xl"
        bg="rgb(255, 253, 252)"
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        minH={{ base: "auto", md: "700px" }}
      >
        {/* Left side: signup form */}
        <Box
          px={{ base: "6", md: "12" }}
          py={{ base: "8", md: "12" }}
          display="flex"
          alignItems="center"
        >
          <Stack gap="6" width="full" maxW="md">
            <Stack gap="3">
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="rgb(213, 137, 54)"
                letterSpacing="wide"
              >
                PANTRYPAL
              </Text>

              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                lineHeight="1.1"
              >
                Welcome to PantryPal!
              </Heading>

              <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                Create your account and discover recipes based on the ingredients
                already in your kitchen.
              </Text>
            </Stack>

          <form onSubmit={handleSignup}>
            <Stack gap="4">
              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  size="lg"
                  borderRadius="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  size="lg"
                  borderRadius="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Confirm password</Field.Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  size="lg"
                  borderRadius="lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field.Root>

              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              {successMessage && (
                <Text color="green.500" fontSize="sm">
                  {successMessage}
                </Text>
              )}

              <Button
                type="submit"
                loading={loading}

              >
                Create account
              </Button>
            </Stack>
          </form>
            

            <Text fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Link href="/login">Log in</Link>
            </Text>
          </Stack>
        </Box>

        {/* Right side: image */}
        <Box
          bg="#f4e8dc"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: "6", md: "8" }}
        >
          <Box
            width="full"
            height="full"
            borderRadius="2xl"
            overflow="hidden"
            bg="whiteAlpha.700"
          >
            <Image
              src="/images/signup-bg3.jpg"
              alt="Anime-style cooking scene"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}