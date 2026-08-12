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

export default function SignupPage() {
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

            <Stack gap="4">
              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  size="lg"
                  borderRadius="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  size="lg"
                  borderRadius="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Confirm password</Field.Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  size="lg"
                  borderRadius="lg"
                />
              </Field.Root>

              <Button
                size="lg"
                width="full"
                borderRadius="lg"
                bg="rgb(213, 137, 54)"
                color="white"
                _hover={{ bg: "rgb(164, 66, 0)" }}
              >
                Create account
              </Button>
            </Stack>

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