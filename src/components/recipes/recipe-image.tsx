"use client";

import { useState } from "react";
import Image from "next/image";
import { Box } from "@chakra-ui/react";
import { LuUtensils } from "react-icons/lu";

export function RecipeImage({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const localImage = src?.startsWith("/images/recipes/") && !src.includes("..");
  return (
    <Box position="relative" h="150px" borderRadius="xl" overflow="hidden" bg="linear-gradient(135deg, #FFF3E2, #F0E3D0)" display="flex" alignItems="center" justifyContent="center">
      <Box aria-hidden="true" color="#A44200" bg="#FFFBF5" p="5" borderRadius="full"><LuUtensils size={30} /></Box>
      {localImage && !failed && <Image src={src!} alt={name} fill sizes="(min-width: 1280px) 360px, (min-width: 768px) 46vw, 90vw" style={{ objectFit: "cover" }} onError={() => setFailed(true)} />}
    </Box>
  );
}
