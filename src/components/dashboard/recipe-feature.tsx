"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Text } from "@chakra-ui/react";
import { LuUtensils } from "react-icons/lu";

export function RecipeFeature() {
  const [failed, setFailed] = useState(false);
  return (
    <Box position="relative" minH={{ base: "220px", sm: "280px", lg: "340px" }} overflow="hidden" bg="linear-gradient(145deg, #F4E3C8, #E7C596)" display="flex" alignItems="center" justifyContent="center">
      <Box aria-hidden="true" w="150px" h="150px" borderRadius="full" bg="#FFF9ED" border="12px solid #F9EEDB" boxShadow="0 8px 30px rgba(105, 20, 14, 0.08)" display="flex" alignItems="center" justifyContent="center" color="#A44200"><LuUtensils size={40} /></Box>
      {!failed && <Image src="/images/recipe-feature.png" alt="A freshly prepared meal" fill sizes="(min-width: 1264px) 294px, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 90vw" style={{ objectFit: "cover", objectPosition: "center" }} onError={() => setFailed(true)} />}
      {failed && <Text position="absolute" bottom="5" fontSize="xs" color="#795D56">A little inspiration for your next meal</Text>}
    </Box>
  );
}
