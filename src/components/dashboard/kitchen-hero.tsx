import { Box } from "@chakra-ui/react";

export function KitchenHero() {
  return (
    <Box aria-hidden="true" position="relative" w="full" maxW="280px" h="170px" justifySelf="end" display={{ base: "none", md: "block" }} pointerEvents="none">
      <Box position="absolute" right="-15px" top="-15px" w="240px" h="155px" borderRadius="60% 40% 55% 45%" bg="rgba(230, 211, 184, 0.18)" transform="rotate(-12deg)" />
      <Box position="absolute" right="90px" bottom="0" w="145px" h="100px" borderRadius="45% 55% 65% 35%" bg="rgba(239, 225, 203, 0.3)" transform="rotate(18deg)" />
      <Box position="absolute" right="15px" bottom="10px" w="80px" h="80px" borderRadius="full" bg="rgba(213, 137, 54, 0.035)" />
    </Box>
  );
}
